import { useEffect, useState } from "react";
import Homepage from "./pages/Homepage"
import { ModelProvider } from "./context/ModelContext";
import Chat from "./pages/Chat"
import Upload from "./pages/Upload"
import { Routes, Route } from "react-router-dom";

function App() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);

  const modelInit = (modelInfo) => {
    setModel((prevModel) => ({...prevModel, ...modelInfo}));
  }

  useEffect(() => { 
    const data = JSON.parse(sessionStorage.getItem("model"));
    if(data && Object.keys(data).length > 0) {
      setModel(data);
    }
    setLoading(false);
  }, []);

  if(loading) {
    return <div>Loading....</div>;
  }
  
  return (
    <ModelProvider value={{model, modelInit}}>
      <Routes>
        <Route path='/' element={<Homepage />} />
        <Route path='/upload' element={<Upload />} />
        <Route path='/chat' element={<Chat />} />
      </Routes>
    </ModelProvider>
  )
}
export default App