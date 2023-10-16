import Header from "./Header"
import Sidenav from "./Sidenav"


function Layout({children}) {
  return (
    <div>
        <div className="flex h-8v bg-gradient-to-r from-gray-900 to-gray-950 text-white items-center justify-start font-mono font-bold text-3xl">
          <Header />
        </div>
        <div className="flex flex-row h-92v">
            <Sidenav />
            <div className="w-screen min-w-screen bg-gray-950">
              <main>
                  {children}
              </main>
            </div>
        </div>
    </div>
  )
}
export default Layout