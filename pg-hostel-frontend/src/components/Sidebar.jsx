import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaUserPlus, FaMoneyBillWave, FaBars, FaChevronLeft } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }) {
    return (
        <div className={`sidebar p-3 text-white ${isOpen ? "" : "sidebar-closed"} position-relative`}>
            <button 
                onClick={toggleSidebar} 
                className="btn border-0 p-0 text-white sidebar-toggle-btn"
            >
                <span className={`toggle-icon ${isOpen ? "hide" : "show"}`}>
                    <FaBars />
                </span>
                <span className={`toggle-icon ${isOpen ? "show" : "hide"}`}>
                    <FaChevronLeft />
                </span>
            </button>

            <div className={`mb-4 ${isOpen ? "" : "text-center"}`} style={{ paddingLeft: isOpen ? "12px" : "0" }}>
                <h2 className="logo m-0">{isOpen ? "StayNest" : "SN"}</h2>
            </div>

            <ul className="nav flex-column gap-2">

                <li>
                    <Link to="/" className="nav-link menu-link">
                        <FaHome size={20} /> <span className={isOpen ? "" : "d-none"}>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to="/tenants" className="nav-link menu-link">
                        <FaUsers size={20} /> <span className={isOpen ? "" : "d-none"}>Tenants</span>
                    </Link>
                </li>

                <li>
                    <Link to="/add-tenant" className="nav-link menu-link">
                        <FaUserPlus size={20} /> <span className={isOpen ? "" : "d-none"}>Add Tenant</span>
                    </Link>
                </li>

                <li>
                    <Link to="/rent" className="nav-link menu-link">
                        <FaMoneyBillWave size={20} /> <span className={isOpen ? "" : "d-none"}>Rent</span>
                    </Link>
                </li>

            </ul>
        </div>
    );
}

export default Sidebar;