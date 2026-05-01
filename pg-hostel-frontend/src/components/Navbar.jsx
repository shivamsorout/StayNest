import { useState, useEffect, useRef } from "react";
import { FaLock, FaSignOutAlt, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const user = authService.getCurrentUser();
    const displayName = user?.fullName || "Admin";

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    // Toggle Dark Mode
    useEffect(() => {
        if (isDarkMode) {
            document.body.classList.add("dark-mode");
        } else {
            document.body.classList.remove("dark-mode");
        }
    }, [isDarkMode]);

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="navbar-custom d-flex justify-content-between align-items-center px-4 py-3 position-relative">
            <h4 className="mb-0 ms-4">Dashboard</h4>

            <div className="d-flex align-items-center gap-3 position-relative" ref={dropdownRef}>
                <span className="text-muted d-none d-md-block">Welcome, {displayName}</span>
                
                <div 
                    className="avatar cursor-pointer" 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    style={{ cursor: "pointer" }}
                >
                    {displayName.charAt(0).toUpperCase()}
                </div>

                {/* Profile Dropdown */}
                {isProfileOpen && (
                    <div className="profile-dropdown shadow-lg rounded bg-white position-absolute end-0 mt-2 py-2" style={{ top: "100%", width: "240px", zIndex: 1000 }}>
                        
                        <div className="px-3 py-2 border-bottom d-flex align-items-center gap-3">
                            <FaUserCircle size={32} className="text-secondary" />
                            <div>
                                <h6 className="mb-0">{displayName}</h6>
                                <small className="text-muted">{user?.email || "admin@staynest.com"}</small>
                            </div>
                        </div>

                        <ul className="list-unstyled mb-0 mt-2">
                            <li>
                                <button 
                                    className="dropdown-item d-flex align-items-center gap-3 px-4 py-2"
                                    onClick={() => setIsDarkMode(!isDarkMode)}
                                >
                                    {isDarkMode ? <FaSun className="text-warning" size={18} /> : <FaMoon className="text-secondary" size={18} />} 
                                    {isDarkMode ? "Light Mode" : "Dark Mode"}
                                </button>
                            </li>
                            <li>
                                <button className="dropdown-item d-flex align-items-center gap-3 px-4 py-2">
                                    <FaLock className="text-secondary" size={18} /> Change Password
                                </button>
                            </li>
                            <li><hr className="dropdown-divider my-2" /></li>
                            <li>
                                <button 
                                    className="dropdown-item d-flex align-items-center gap-3 px-4 py-2 text-danger"
                                    onClick={handleLogout}
                                >
                                    <FaSignOutAlt size={18} /> Sign Out
                                </button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Navbar;
