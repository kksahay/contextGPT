import Homepage from "./components/Homepage"
import Chat from "./pages/Chat"
import Upload from "./pages/Upload"
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <Routes>
      <Route path='/' element={<Homepage />} />
      <Route path='/upload' element={<Upload />} />
      <Route path='/chat' element={<Chat />} />
    </Routes>
  )
}
export default App