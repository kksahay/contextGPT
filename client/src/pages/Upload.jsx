import { useEffect, useState, useRef } from "react";
import Layout from "../components/Layout";
import { useModel } from "../context/ModelContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

function Upload() {
  const [pdf, setPdf] = useState('');
  const [btnDisabled, setBtnDisabled] = useState(false);

  const fileRef = useRef(null);

  const navigate = useNavigate();

  const {model} = useModel();

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast("Processing File", { duration: 4000 });
    setBtnDisabled(true);
    const file = fileRef.current.files[0];
    try {
      const form = new FormData();
      form.append('model', JSON.stringify(model));
      form.append('pdf', file);
      const { data } = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/upload`, form);
      if(data && data.message) {
        sessionStorage.setItem('pdfFile', pdf);
        toast.success('File processed successfully!');
        setTimeout(() => navigate('/chat'), 2000);
      }
      
    } catch (error) {
      toast.error('Error processing File');
    } finally {
      setBtnDisabled(false);
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
      } else {
        toast.error("Invalid file format");
      }
    } else {
      toast.error("File size limit: 1 MB");
    }
  }

  useEffect(() => {
    if(!model) {
      navigate('/');
    }
  }, []);

  return (
    <Layout>
      <div><Toaster /></div>
      <div className="text-white mt-10v p-2 text-center font-mono font-medium text-5xl">Chat with your PDF</div>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-row items-center justify-center mt-10v">
          <div className="basis-1/4 mr-3v">
            <label htmlFor="upload" className="mb-2 text-lg font-medium text-white">Select File</label>
            <input 
              type="file" 
              accept=".pdf"
              id="upload"
              onChange={handleFileChange}
              required
              ref={fileRef}
              className="w-full text-lg border rounded-lg cursor-pointer text-gray-400 focus:outline-none bg-gray-700 border-gray-600 placeholder-gray-400"
            />
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">PDF (MAX. 1MB).</p>
          </div>
          <div className="self-center">
            <button type="submit" disabled={btnDisabled} className="text-white hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-lg px-5 py-1 mt-2v bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed">
                Upload
            </button>
          </div>
        </div>
      </form>
    </Layout>
  )
}
  export default Upload