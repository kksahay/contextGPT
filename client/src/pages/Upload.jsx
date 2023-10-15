import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { useModel } from "../context/ModelContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

function Upload() {

  const [error, setError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [pdf, setPdf] = useState('');

  const fileRef = useRef(null);

  const navigate = useNavigate();

  const {model} = useModel();

  const handleSubmit = async (e) => {
    e.preventDefault()
    const file = fileRef.current.files[0];
    try {
      const form = new FormData();
      form.append('model', JSON.stringify(model));
      form.append('pdf', file);
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, form);
      if(data && data.message) {
        sessionStorage.setItem('pdfFile', pdf);
        setError(false);
        navigate('/chat');
      }
      
    } catch (error) {
      setError(true);
      setErrorMessage('Error processing the PDF File');
    }
  }
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if(file && file.size <= 1 * 1024 * 1024) {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const pdfData = e.target.result.split(',')[1];
          setPdf(pdfData);
        };
        reader.readAsDataURL(file);
        setError(false);
      } else {
        setError(true);
        setErrorMessage("Invalid file format");
      }
    } else {
      setError(true);
      setErrorMessage("File size limit: 1 MB");
    }
  }

  useEffect(() => {
    if(!model) {
      navigate('/');
    }
  }, []);

  return (
    <Layout>
      <div className="flex flex-row">
        <form
          onSubmit={handleSubmit}
        >
          <label htmlFor="upload">Select File</label>
          <input 
            type="file" 
            accept=".pdf"
            id="upload"
            onChange={handleFileChange}
            required
            ref={fileRef}
          />
          <label htmlFor="upload-btn"></label>
          <button className="" id="upload-btn">Upload</button>
        </form>
      </div>
    </Layout>
  )
}
  export default Upload