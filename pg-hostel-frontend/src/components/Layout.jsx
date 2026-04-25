import { useState } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

function Layout({ children }) {
    const [isOpen, setIsOpen] = useState(true);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <div className="d-flex">
            <Sidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
            <div className="main-content" style={{ transition: '0.3s', flex: 1, minWidth: 0 }}>
                <Navbar />
                <div className="p-4">{children}</div>
            </div>
        </div>
    );
}

export default Layout;