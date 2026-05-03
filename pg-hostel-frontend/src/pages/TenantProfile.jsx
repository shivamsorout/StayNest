import { useEffect, useMemo, useState } from "react";
import { FaBolt, FaDoorOpen, FaReceipt, FaWallet } from "react-icons/fa";
import { tenantProfileApi } from "../api/tenants/tenantProfileApi";

function TenantProfile() {
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
                    setError(err.message);
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
                    <p className="page-subtitle">Room {tenant.roomNo || "-"} / Bed {tenant.bedNo || "-"} since {tenant.checkInDate}</p>
                </div>
                <span className={`status-pill ${tenant.status.toLowerCase().replace("_", "-")}`}>
                    {tenant.status.replace("_", " ")}
                </span>
            </div>

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
