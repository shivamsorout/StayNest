import { useState, useEffect, useRef } from "react";
import { FaLock, FaSignOutAlt, FaMoon, FaSun, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

function Navbar() {
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });
    const [passwordError, setPasswordError] = useState("");
    const [passwordSuccess, setPasswordSuccess] = useState("");
    const [savingPassword, setSavingPassword] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    const user = authService.getCurrentUser();
    const displayName = user?.fullName || "Admin";

    const handleLogout = () => {
        authService.logout();
        navigate("/login");
    };

    const openPasswordModal = () => {
        setIsProfileOpen(false);
        setPasswordError("");
        setPasswordSuccess("");
        setPasswordForm({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
        });
        setIsPasswordModalOpen(true);
    };

    const handlePasswordChange = async (event) => {
        event.preventDefault();
        setPasswordError("");
        setPasswordSuccess("");

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setPasswordError("New passwords do not match.");
            return;
        }

        try {
            setSavingPassword(true);
            await authService.changePassword({
                currentPassword: passwordForm.currentPassword,
                newPassword: passwordForm.newPassword,
            });
            setPasswordSuccess("Password changed successfully.");
            setPasswordForm({
                currentPassword: "",
                newPassword: "",
                confirmPassword: "",
            });
        } catch (err) {
            setPasswordError(err.message || "Unable to change password.");
        } finally {
            setSavingPassword(false);
        }
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
                                <button
                                    className="dropdown-item d-flex align-items-center gap-3 px-4 py-2"
                                    onClick={openPasswordModal}
                                >
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

            {isPasswordModalOpen && (
                <div className="modal-backdrop-custom" role="presentation">
                    <form className="password-modal" onSubmit={handlePasswordChange}>
                        <div className="modal-heading">
                            <div>
                                <p className="eyebrow">Account security</p>
                                <h3>Change Password</h3>
                            </div>
                            <button type="button" className="icon-close" onClick={() => setIsPasswordModalOpen(false)}>x</button>
                        </div>

                        {passwordError && <div className="alert-panel">{passwordError}</div>}
                        {passwordSuccess && <div className="success-panel">{passwordSuccess}</div>}

                        <label className="input-block">
                            <span>Current Password</span>
                            <input
                                type="password"
                                value={passwordForm.currentPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, currentPassword: event.target.value }))}
                                required
                            />
                        </label>

                        <label className="input-block">
                            <span>New Password</span>
                            <input
                                type="password"
                                value={passwordForm.newPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
                                required
                            />
                        </label>

                        <label className="input-block">
                            <span>Confirm Password</span>
                            <input
                                type="password"
                                value={passwordForm.confirmPassword}
                                onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
                                required
                            />
                        </label>

                        <button type="submit" className="primary-action wide" disabled={savingPassword}>
                            {savingPassword ? "Changing..." : "Change Password"}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default Navbar;
