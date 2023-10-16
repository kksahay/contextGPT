import { useNavigate } from "react-router-dom"

function Header() {
    const navigate = useNavigate()
  return (
    <div className="cursor-pointer" onClick={() => navigate('/')}>ContextGPT</div>
  )
}
export default Header