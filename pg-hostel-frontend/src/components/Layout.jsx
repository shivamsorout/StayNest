import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className={`app-shell ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}>
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content">
                <Navbar />
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default Layout;
