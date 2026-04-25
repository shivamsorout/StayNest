import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
    return (
        <div className="d-flex">
            <Sidebar />
            <div className="main-content w-100">
                <Navbar />
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default Layout;