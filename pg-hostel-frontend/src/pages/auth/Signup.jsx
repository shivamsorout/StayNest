import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/auth";

function Signup() {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [mobileNumber, setMobileNumber] = useState("");
    const [password, setPassword] = useState("");
    const [accountType, setAccountType] = useState("OWNER");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);
        try {
            await authService.signup(fullName, email, password, mobileNumber ? [mobileNumber] : [], accountType);
            setSuccess("Account created successfully! Redirecting to login...");
            setTimeout(() => navigate("/login"), 2000);
        } catch (err) {
            setError(err.message || "Signup failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container split-auth">
            <section className="auth-info-panel">
                <p className="eyebrow">Start with the right account</p>
                <h1>{accountType === "OWNER" ? "Create an owner workspace for your PGs." : "Create a tenant account for your stay history."}</h1>
                <p>{accountType === "OWNER" ? "Owners can manage multiple PGs, rooms, beds, tenants, rent, and electricity billing." : "Tenants can view their profile, rent status, payment history, and electricity share."}</p>
                <div className="auth-info-grid">
                    <span>Fast setup</span>
                    <span>Mobile profile</span>
                    <span>Secure access</span>
                    <span>Clean records</span>
                </div>
            </section>

            <div className="auth-card">
                <h1 className="auth-title">StayNest</h1>
                <p className="auth-subtitle">Create your account to get started</p>

                {error && <div className="alert alert-danger py-2" role="alert">{error}</div>}
                {success && <div className="alert alert-success py-2" role="alert">{success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="auth-role-toggle" role="group" aria-label="Account type">
                        <button type="button" className={accountType === "OWNER" ? "active" : ""} onClick={() => setAccountType("OWNER")}>
                            Owner
                        </button>
                        <button type="button" className={accountType === "TENANT" ? "active" : ""} onClick={() => setAccountType("TENANT")}>
                            Tenant
                        </button>
                    </div>

                    <div className="form-group-custom">
                        <label>Full Name</label>
                        <input
                            type="text"
                            className="form-control-custom"
                            placeholder="John Doe"
                            value={fullName}
                            onChange={(event) => setFullName(event.target.value)}
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
                            onChange={(event) => setEmail(event.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group-custom">
                        <label>Mobile Number</label>
                        <input
                            type="tel"
                            className="form-control-custom"
                            placeholder="9876543210"
                            value={mobileNumber}
                            maxLength="10"
                            onChange={(event) => setMobileNumber(event.target.value.replace(/\D/g, ""))}
                        />
                    </div>

                    <div className="form-group-custom">
                        <label>Password</label>
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
                        {loading ? "Creating Account..." : `Create ${accountType === "OWNER" ? "Owner" : "Tenant"} Account`}
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
