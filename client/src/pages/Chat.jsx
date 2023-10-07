import Layout from "../components/Layout"
import Viewer from "../components/Viewer"
import Chatbot from "../components/Chatbot"

function Chat() {
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