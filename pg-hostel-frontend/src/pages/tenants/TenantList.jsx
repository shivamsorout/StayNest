import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaDoorOpen, FaPlus, FaSearch, FaUserCheck, FaUserMinus, FaUsers } from "react-icons/fa";
import { tenantApi } from "../../api/tenants/tenantApi";

function TenantList() {
    const [tenants, setTenants] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadTenants = async () => {
        try {
            setLoading(true);
            setError("");
            setTenants(await tenantApi.getTenants());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const fetchTenants = async () => {
            try {
                const data = await tenantApi.getTenants();
                if (isActive) {
                    setTenants(data);
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

        fetchTenants();

        return () => {
            isActive = false;
        };
    }, []);

    const summary = useMemo(() => {
        return tenants.reduce(
            (acc, tenant) => ({
                total: acc.total + 1,
                active: acc.active + (tenant.status === "ACTIVE" ? 1 : 0),
                checkedOut: acc.checkedOut + (tenant.status === "CHECKED_OUT" ? 1 : 0),
            }),
            { total: 0, active: 0, checkedOut: 0 }
        );
    }, [tenants]);

    const filteredTenants = tenants.filter((tenant) => {
        const value = `${tenant.fullName} ${tenant.mobile} ${tenant.roomNo || ""} ${tenant.bedNo || ""}`.toLowerCase();
        const matchesSearch = value.includes(search.toLowerCase());
        const matchesStatus = status === "ALL" || tenant.status === status;
        return matchesSearch && matchesStatus;
    });

    const handleCheckOut = async (tenantId) => {
        if (!window.confirm("Check out this tenant and free their bed?")) return;

        try {
            setError("");
            await tenantApi.checkOutTenant(tenantId);
            loadTenants();
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Tenant management</p>
                    <h2>Tenants</h2>
                    <p className="page-subtitle">Manage active residents, bed allocation, and check-outs.</p>
                </div>
                <Link to="/add-tenant" className="primary-action">
                    <FaPlus /> Add Tenant
                </Link>
            </div>

            <div className="metric-grid">
                <div className="metric-card">
                    <FaUsers />
                    <span>Total Tenants</span>
                    <strong>{summary.total}</strong>
                </div>
                <div className="metric-card success">
                    <FaUserCheck />
                    <span>Active Tenants</span>
                    <strong>{summary.active}</strong>
                </div>
                <div className="metric-card warning">
                    <FaUserMinus />
                    <span>Checked Out</span>
                    <strong>{summary.checkedOut}</strong>
                </div>
            </div>

            <div className="toolbar-panel">
                <div className="search-control">
                    <FaSearch />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search name, mobile, room, or bed"
                    />
                </div>
                <div className="segmented-control">
                    {["ALL", "ACTIVE", "CHECKED_OUT", "INACTIVE"].map((item) => (
                        <button
                            key={item}
                            type="button"
                            className={status === item ? "active" : ""}
                            onClick={() => setStatus(item)}
                        >
                            {item.toLowerCase().replace("_", " ")}
                        </button>
                    ))}
                </div>
            </div>

            {error && <div className="alert-panel">{error}</div>}

            <div className="data-panel">
                {loading && <div className="empty-state">Loading tenants...</div>}

                {!loading && filteredTenants.length === 0 && (
                    <div className="empty-state">No tenants found. Add a tenant to assign the first occupied bed.</div>
                )}

                {!loading && filteredTenants.map((tenant) => (
                    <article className="tenant-row" key={tenant.id}>
                        <div className="tenant-avatar">{tenant.fullName.charAt(0).toUpperCase()}</div>
                        <div className="tenant-main">
                            <h3>{tenant.fullName}</h3>
                            <span>{tenant.mobile}</span>
                        </div>
                        <div className="tenant-meta">
                            <FaDoorOpen />
                            <span>{tenant.roomNo || "No room"}</span>
                        </div>
                        <div className="tenant-meta">
                            <FaBed />
                            <span>{tenant.bedNo || "No bed"}</span>
                        </div>
                        <span className={`status-pill ${tenant.status.toLowerCase().replace("_", "-")}`}>
                            {tenant.status.replace("_", " ")}
                        </span>
                        {tenant.status === "ACTIVE" && (
                            <button type="button" className="secondary-action" onClick={() => handleCheckOut(tenant.id)}>
                                Check Out
                            </button>
                        )}
                    </article>
                ))}
            </div>
        </div>
    );
}

export default TenantList;
