import { useEffect, useMemo, useState } from "react";
import { FaBolt, FaDoorOpen, FaReceipt, FaWallet } from "react-icons/fa";
import { tenantProfileApi } from "../api/tenants/tenantProfileApi";
import { authService } from "../services/auth";

function TenantProfile() {
    const currentUser = authService.getCurrentUser();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [needsOnboarding, setNeedsOnboarding] = useState(false);
    const [documentFile, setDocumentFile] = useState(null);
    const [form, setForm] = useState({
        fullName: currentUser?.fullName || "",
        fatherName: "",
        mobile: currentUser?.mobileNumbers?.[0] || "",
        aadhaarNo: "",
        address: "",
    });

    useEffect(() => {
        let isActive = true;

        const loadProfile = async () => {
            try {
                const data = await tenantProfileApi.getMyProfile();
                if (isActive) {
                    setProfile(data);
                }
            } catch (err) {
                if (isActive) {
                    if ((err.message || "").includes("No active tenant profile")) {
                        setNeedsOnboarding(true);
                    } else {
                        setError(err.message);
                    }
                }
            } finally {
                if (isActive) {
                    setLoading(false);
                }
            }
        };

        loadProfile();

        return () => {
            isActive = false;
        };
    }, []);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleOnboardingSubmit = async (event) => {
        event.preventDefault();
        setError("");

        try {
            setSaving(true);
            const data = await tenantProfileApi.createMyProfile(form);
            const profileData = documentFile ? await tenantProfileApi.uploadAadhaar(documentFile) : data;
            setProfile(profileData);
            setNeedsOnboarding(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (value) => new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));

    const formatMonth = (item) => new Date(item.year, item.month - 1).toLocaleDateString("en-IN", {
        month: "short",
        year: "numeric",
    });

    const summary = useMemo(() => {
        if (!profile) {
            return { pendingRent: 0, paidRent: 0, electricity: 0 };
        }

        const rent = profile.rentHistory || [];
        const electricity = profile.electricityHistory || [];

        return {
            pendingRent: rent
                .filter((item) => item.status !== "PAID")
                .reduce((sum, item) => sum + Number(item.rentAmount || 0) + Number(item.lateFee || 0), 0),
            paidRent: rent
                .filter((item) => item.status === "PAID")
                .reduce((sum, item) => sum + Number(item.rentAmount || 0) + Number(item.lateFee || 0), 0),
            electricity: electricity.reduce((sum, item) => sum + Number(item.tenantShare || 0), 0),
        };
    }, [profile]);

    if (loading) {
        return <div className="empty-state">Loading tenant profile...</div>;
    }

    if (needsOnboarding) {
        return (
            <div className="page-shell">
                <div className="page-header compact">
                    <div>
                        <p className="eyebrow">Tenant onboarding</p>
                        <h2>Complete Your Tenant Profile</h2>
                        <p className="page-subtitle">Fill these details once to access your StayNest profile.</p>
                    </div>
                </div>

                <form className="form-panel" onSubmit={handleOnboardingSubmit}>
                    {error && <div className="alert-panel">{error}</div>}

                    <div className="form-grid">
                        <label className="input-block">
                            <span>Full Name</span>
                            <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
                        </label>

                        <label className="input-block">
                            <span>Father Name</span>
                            <input value={form.fatherName} onChange={(event) => updateField("fatherName", event.target.value)} />
                        </label>

                        <label className="input-block">
                            <span>Mobile Number</span>
                            <input
                                value={form.mobile}
                                maxLength="10"
                                onChange={(event) => updateField("mobile", event.target.value.replace(/\D/g, ""))}
                                required
                            />
                        </label>

                        <label className="input-block">
                            <span>Aadhaar Number</span>
                            <input
                                value={form.aadhaarNo}
                                maxLength="12"
                                onChange={(event) => updateField("aadhaarNo", event.target.value.replace(/\D/g, ""))}
                            />
                        </label>
                    </div>

                    <label className="input-block">
                        <span>Address</span>
                        <textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} rows="3" />
                    </label>

                    <label className="input-block">
                        <span>Aadhaar Card / ID Proof</span>
                        <input
                            type="file"
                            accept=".pdf,.png,.jpg,.jpeg"
                            onChange={(event) => setDocumentFile(event.target.files?.[0] || null)}
                        />
                    </label>

                    <button type="submit" className="primary-action wide" disabled={saving}>
                        {saving ? "Saving..." : "Save Tenant Profile"}
                    </button>
                </form>
            </div>
        );
    }

    if (error) {
        return <div className="alert-panel">{error}</div>;
    }

    const tenant = profile?.tenant;

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Tenant profile</p>
                    <h2>{tenant.fullName}</h2>
                    <p className="page-subtitle">
                        {tenant.roomNo ? `Room ${tenant.roomNo} / Bed ${tenant.bedNo || "-"} since ${tenant.checkInDate}` : "Room assignment is pending from owner"}
                    </p>
                </div>
                <span className={`status-pill ${tenant.status.toLowerCase().replace("_", "-")}`}>
                    {tenant.status.replace("_", " ")}
                </span>
            </div>

            <section className="history-panel mb-3">
                <h3>Profile Details</h3>
                <article className="history-row">
                    <div>
                        <strong>Mobile</strong>
                        <span>{tenant.mobile}</span>
                    </div>
                    <div>
                        <strong>Aadhaar</strong>
                        <span>{tenant.aadhaarNo || "-"}</span>
                    </div>
                    <b>{tenant.idProofFile ? "Document uploaded" : "Document pending"}</b>
                </article>
            </section>

            <div className="metric-grid">
                <div className="metric-card warning">
                    <FaReceipt />
                    <span>Rent Due</span>
                    <strong>{formatCurrency(summary.pendingRent)}</strong>
                </div>
                <div className="metric-card success">
                    <FaWallet />
                    <span>Rent Paid</span>
                    <strong>{formatCurrency(summary.paidRent)}</strong>
                </div>
                <div className="metric-card">
                    <FaBolt />
                    <span>Electricity Share</span>
                    <strong>{formatCurrency(summary.electricity)}</strong>
                </div>
                <div className="metric-card">
                    <FaDoorOpen />
                    <span>Monthly Rent</span>
                    <strong>{formatCurrency(tenant.rentAmount)}</strong>
                </div>
            </div>

            <div className="profile-history-grid">
                <section className="history-panel">
                    <h3>Rent History</h3>
                    {(profile.rentHistory || []).length === 0 && <div className="empty-state">No rent history found.</div>}
                    {(profile.rentHistory || []).map((payment) => (
                        <article className="history-row" key={payment.id}>
                            <div>
                                <strong>{formatMonth(payment)}</strong>
                                <span>Due {payment.dueDate}</span>
                            </div>
                            <span className={`status-pill ${payment.status.toLowerCase().replace("_", "-")}`}>{payment.status}</span>
                            <b>{formatCurrency(Number(payment.rentAmount) + Number(payment.lateFee || 0))}</b>
                        </article>
                    ))}
                </section>

                <section className="history-panel">
                    <h3>Electricity History</h3>
                    {(profile.electricityHistory || []).length === 0 && <div className="empty-state">No electricity readings found.</div>}
                    {(profile.electricityHistory || []).map((reading) => (
                        <article className="history-row" key={reading.id}>
                            <div>
                                <strong>{formatMonth(reading)}</strong>
                                <span>{reading.consumedUnits} units / {reading.tenantCount} tenant(s)</span>
                            </div>
                            <span>{formatCurrency(reading.totalAmount)}</span>
                            <b>{formatCurrency(reading.tenantShare)}</b>
                        </article>
                    ))}
                </section>
            </div>
        </div>
    );
}

export default TenantProfile;
