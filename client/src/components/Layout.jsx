import Header from "./Header"
import Sidenav from "./Sidenav"


function Layout({children}) {
  return (
    <>
        <Header />
        <div className="flex flex-row items-stretch">
            <div className="basis-1/6">
                <Sidenav />
            </div>
            <main>
                {children}
            </main>
        </div>
    </>
  )
}
export default Layout