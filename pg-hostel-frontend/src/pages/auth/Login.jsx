import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.login(email, password);
            navigate("/");
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                <p className="auth-subtitle">Sign in to manage your PG hostel</p>

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

                    <div className="form-group-custom">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="mb-0">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#60a5fa', textDecoration: 'none' }}>
                                Forgot Password?
                            </Link>
                        </div>
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
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div className="auth-footer">
                    Don't have an account? 
                    <Link to="/signup" className="auth-link">Sign Up</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
