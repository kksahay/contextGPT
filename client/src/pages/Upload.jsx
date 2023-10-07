import Layout from "../components/Layout";

function Upload() {
  
    const handleClick = (e) => {
      e.preventDefault()
      //navigate to /chat
      //send POST to /pdf-upload
    }
    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file && file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = (e) => {
          const pdfData = e.target.result.split(',')[1];
          sessionStorage.setItem('pdfFile', pdfData);
        };
        reader.readAsDataURL(file);
      } else {
        alert('Please select a valid PDF file.');
      }
    };
    
    return (
      <Layout>
        <div className="flex flex-row">
          <form onSubmit={handleClick}>
              <input type="file" accept=".pdf" onChange={handleFileChange}/>
              <button className="">Upload</button>
          </form>
        </div>
      </Layout>
    )
  }
  export default Upload