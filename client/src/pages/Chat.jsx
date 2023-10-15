import Layout from "../components/Layout"
import Viewer from "../components/Viewer"
import Chatbot from "../components/Chatbot"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useModel } from "../context/ModelContext";

function Chat() {
  const navigate = useNavigate();
  const {model} = useModel();
  useEffect(() => {
    const PdfData = sessionStorage.getItem("pdfFile");
    if(!model) {
      navigate('/');
    } else if(!PdfData) {
      navigate('/upload');
    }
  }, []);
  return (
    <Layout>
      <div className="flex flex-row">
        <div className="basis-1/2 mt-4">
          <Viewer />
        </div>
        <div className="basis-1/2">
          <Chatbot />
        </div>
      </div>
    </Layout>
  )
}
export default Chat