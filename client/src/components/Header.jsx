import { useNavigate } from "react-router-dom"


function Header() {
    const navigate = useNavigate()
  return (
    <div className="text-center p-2 border-solid border-b-2  text-2xl font-mono" onClick={() => navigate('/')}>ContextGPT</div>
  )
}
export default Header