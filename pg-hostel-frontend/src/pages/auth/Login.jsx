import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);
        try {
            const user = await authService.login(email, password);
            navigate(user?.role === "TENANT" ? "/my-profile" : "/");
        } catch (err) {
            setError(err.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container split-auth">
            <section className="auth-info-panel">
                <p className="eyebrow">StayNest PG management</p>
                <h1>Run every stay from one calm dashboard.</h1>
                <p>Manage PG properties, rooms, tenants, monthly rent, electricity readings, and payment history without scattered registers.</p>
                <div className="auth-info-grid">
                    <span>Multiple PGs</span>
                    <span>Tenant history</span>
                    <span>Rent tracking</span>
                    <span>Electricity split</span>
                </div>
            </section>

            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                <p className="auth-subtitle">Sign in to continue</p>

                {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group-custom">
                        <label>Email Address</label>
                        <input
                            type="email"
                            className="form-control-custom"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-custom">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                            <label className="mb-0">Password</label>
                            <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "#2563eb", textDecoration: "none" }}>
                                Forgot Password?
                            </Link>
                        </div>
                        <input
                            type="password"
                            className="form-control-custom"
                            placeholder="Password"
                            value={password}
                            onChange={(event) => setPassword(event.target.value)}
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
