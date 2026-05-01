import { useState } from "react";
import { Link } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";
import { authService } from "../../services/auth";

function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        
        try {
            await authService.forgotPassword(email);
            setSubmitted(true);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                
                {!submitted ? (
                    <>
                        <p className="auth-subtitle">Enter your email to reset your password</p>
                        
                        {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

                        <form onSubmit={handleSubmit}>
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

                            <button type="submit" className="auth-button" disabled={loading}>
                                {loading ? "Sending Link..." : "Send Reset Link"}
                            </button>
                        </form>
                    </>
                ) : (
                    <div className="text-center">
                        <div className="mb-4" style={{ color: "#60a5fa" }}>
                            <FaCheckCircle size={64} />
                        </div>
                        <h2 className="h4 mb-3">Check your email</h2>
                        <p className="auth-subtitle">
                            We've sent a password reset link to <strong>{email}</strong>
                        </p>
                        <button 
                            className="auth-button mt-4" 
                            onClick={() => setSubmitted(false)}
                        >
                            Resend Link
                        </button>
                    </div>
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
