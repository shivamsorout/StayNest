import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../services/auth";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await authService.signup(fullName, email, password);
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                <p className="auth-subtitle">Create your account to get started</p>

                {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                {success && <div className="alert alert-success py-2" role="alert">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-custom">
                        <label>Full Name</label>
                        <input 
                            type="text" 
                            className="form-control-custom" 
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required
                        />
                    </div>

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

                    <div className="form-group-custom">
                        <label>Password</label>
                        <input 
                            type="password" 
                            className="form-control-custom" 
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="auth-button" disabled={loading}>
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                <div className="auth-footer">
                    Already have an account? 
                    <Link to="/login" className="auth-link">Sign In</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
