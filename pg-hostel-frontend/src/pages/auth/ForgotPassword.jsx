import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaCheckCircle, FaEnvelope, FaKey, FaLock, FaWhatsapp } from "react-icons/fa";
import { authService } from "../../services/auth";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [whatsappNumber, setWhatsappNumber] = useState("");
    const [deliveryMethod, setDeliveryMethod] = useState("EMAIL");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [step, setStep] = useState("request");
    const [notice, setNotice] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleRequestOtp = async (e) => {
        e.preventDefault();
        setError("");
        setNotice("");
        setLoading(true);
        
        try {
            const message = await authService.forgotPassword({
                email,
                whatsappNumber,
                deliveryMethod,
            });
            setNotice(message);
            setStep("reset");
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        setNotice("");

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        setLoading(true);

        try {
            await authService.resetPassword({ email, otp, newPassword });
            setNotice("Password changed successfully. Redirecting to sign in...");
            setTimeout(() => navigate("/login"), 1200);
        } catch (err) {
            setError(err.message || "Unable to change password. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                
                {step === "request" ? (
                    <>
                        <p className="auth-subtitle">Choose where to receive your reset OTP</p>
                        
                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                        {notice && <div className="alert alert-success py-2" role="alert">{notice}</div>}

                        <form onSubmit={handleRequestOtp}>
                            <div className="form-group-custom">
                                <label>Email Address</label>
                                <input 
                                    type="email" 
                                    className="form-control-custom" 
                                    placeholder="name@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="delivery-options" role="group" aria-label="OTP delivery method">
                                <button
                                    type="button"
                                    className={deliveryMethod === "EMAIL" ? "active" : ""}
                                    onClick={() => setDeliveryMethod("EMAIL")}
                                >
                                    <FaEnvelope /> Email
                                </button>
                                <button
                                    type="button"
                                    className={deliveryMethod === "WHATSAPP" ? "active" : ""}
                                    onClick={() => setDeliveryMethod("WHATSAPP")}
                                >
                                    <FaWhatsapp /> WhatsApp
                                </button>
                                <button
                                    type="button"
                                    className={deliveryMethod === "BOTH" ? "active" : ""}
                                    onClick={() => setDeliveryMethod("BOTH")}
                                >
                                    <FaCheckCircle /> Both
                                </button>
                            </div>

                            {(deliveryMethod === "WHATSAPP" || deliveryMethod === "BOTH") && (
                                <div className="form-group-custom">
                                    <label>WhatsApp Number</label>
                                    <input
                                        type="tel"
                                        className="form-control-custom"
                                        placeholder="+91 98765 43210"
                                        value={whatsappNumber}
                                        onChange={(e) => setWhatsappNumber(e.target.value)}
                                        required
                                    />
                                </div>
                            )}

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? "Sending OTP..." : "Send OTP"}
                            </button>
                        </form>
                    </>
                ) : (
                    <>
                        <p className="auth-subtitle">Enter the OTP and set a new password</p>

                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                        {notice && <div className="alert alert-success py-2" role="alert">{notice}</div>}

                        <form onSubmit={handleResetPassword}>
                            <div className="form-group-custom">
                                <label><FaKey /> OTP</label>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    className="form-control-custom"
                                    placeholder="6 digit OTP"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group-custom">
                                <label><FaLock /> New Password</label>
                                <input
                                    type="password"
                                    className="form-control-custom"
                                    placeholder="Enter new password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group-custom">
                                <label>Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-control-custom"
                                    placeholder="Confirm new password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? "Changing Password..." : "Change Password"}
                            </button>
                            <button type="button" className="auth-ghost-button" onClick={() => setStep("request")}>
                                Resend OTP
                            </button>
                        </form>
                    </>
                )}

                <div className="auth-footer">
                    Back to 
                    <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
