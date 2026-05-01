import { useEffect, useMemo, useState } from "react";
import { FaCalendarAlt, FaCheck, FaClock, FaMoneyBillWave, FaReceipt, FaSearch, FaWallet } from "react-icons/fa";
import { rentApi } from "../api/rent/rentApi";

const statusOptions = ["ALL", "PENDING", "PAID", "PARTIAL", "OVERDUE"];
const paymentModes = ["CASH", "UPI", "BANK_TRANSFER", "CARD", "OTHER"];

function RentList() {
    const currentDate = new Date();
    const [rentPayments, setRentPayments] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [month, setMonth] = useState(currentDate.getMonth() + 1);
    const [year, setYear] = useState(currentDate.getFullYear());
    const [selectedPayment, setSelectedPayment] = useState(null);
    const [paymentForm, setPaymentForm] = useState({
        paymentMode: "UPI",
        paidDate: currentDate.toISOString().slice(0, 10),
        lateFee: "",
        remarks: "",
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [notice, setNotice] = useState("");

    const loadRentPayments = async () => {
        try {
            setLoading(true);
            setError("");
            setRentPayments(await rentApi.getRentPayments());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const fetchRentPayments = async () => {
            try {
                const data = await rentApi.getRentPayments();
                if (isActive) {
                    setRentPayments(data);
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

        fetchRentPayments();

        return () => {
            isActive = false;
        };
    }, []);

    const summary = useMemo(() => {
        return rentPayments.reduce(
            (acc, payment) => {
                const rentAmount = Number(payment.rentAmount || 0);
                const lateFee = Number(payment.lateFee || 0);
                const totalAmount = rentAmount + lateFee;

                return {
                    total: acc.total + totalAmount,
                    pending: payment.status === "PENDING" || payment.status === "PARTIAL" || payment.status === "OVERDUE"
                        ? acc.pending + totalAmount
                        : acc.pending,
                    collected: payment.status === "PAID" ? acc.collected + totalAmount : acc.collected,
                    overdue: payment.status === "OVERDUE" ? acc.overdue + totalAmount : acc.overdue,
                };
            },
            { total: 0, pending: 0, collected: 0, overdue: 0 }
        );
    }, [rentPayments]);

    const filteredRentPayments = rentPayments.filter((payment) => {
        const value = `${payment.tenantName} ${payment.mobile} ${payment.roomNo || ""} ${payment.bedNo || ""}`.toLowerCase();
        const matchesSearch = value.includes(search.toLowerCase());
        const matchesStatus = status === "ALL" || payment.status === status;
        return matchesSearch && matchesStatus;
    });

    const handleGenerateRent = async () => {
        try {
            setSaving(true);
            setError("");
            setNotice("");
            const created = await rentApi.generateMonthlyRent(month, year);
            setNotice(created.length ? `Generated ${created.length} rent record(s).` : "Rent is already generated for active tenants.");
            await loadRentPayments();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const openPaymentForm = (payment) => {
        setSelectedPayment(payment);
        setPaymentForm({
            paymentMode: "UPI",
            paidDate: currentDate.toISOString().slice(0, 10),
            lateFee: payment.lateFee || "",
            remarks: payment.remarks || "",
        });
    };

    const handleMarkPaid = async (event) => {
        event.preventDefault();
        if (!selectedPayment) return;

        try {
            setSaving(true);
            setError("");
            setNotice("");
            await rentApi.markAsPaid(selectedPayment.id, {
                ...paymentForm,
                lateFee: paymentForm.lateFee === "" ? 0 : Number(paymentForm.lateFee),
            });
            setSelectedPayment(null);
            setNotice("Payment marked as paid.");
            await loadRentPayments();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));
    };

    const formatMonth = (payment) => {
        return new Date(payment.year, payment.month - 1).toLocaleDateString("en-IN", {
            month: "short",
            year: "numeric",
        });
    };

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Rent management</p>
                    <h2>Rent & Payments</h2>
                    <p className="page-subtitle">Generate monthly rent, track dues, and record collections.</p>
                </div>
                <div className="rent-generate">
                    <input
                        type="number"
                        min="1"
                        max="12"
                        value={month}
                        onChange={(event) => setMonth(event.target.value)}
                        aria-label="Rent month"
                    />
                    <input
                        type="number"
                        min="2024"
                        value={year}
                        onChange={(event) => setYear(event.target.value)}
                        aria-label="Rent year"
                    />
                    <button type="button" className="primary-action" onClick={handleGenerateRent} disabled={saving}>
                        <FaCalendarAlt /> Generate
                    </button>
                </div>
            </div>

            <div className="metric-grid">
                <div className="metric-card">
                    <FaReceipt />
                    <span>Total Billed</span>
                    <strong>{formatCurrency(summary.total)}</strong>
                </div>
                <div className="metric-card warning">
                    <FaClock />
                    <span>Pending</span>
                    <strong>{formatCurrency(summary.pending)}</strong>
                </div>
                <div className="metric-card success">
                    <FaWallet />
                    <span>Collected</span>
                    <strong>{formatCurrency(summary.collected)}</strong>
                </div>
                <div className="metric-card danger">
                    <FaMoneyBillWave />
                    <span>Overdue</span>
                    <strong>{formatCurrency(summary.overdue)}</strong>
                </div>
            </div>

            <div className="toolbar-panel">
                <div className="search-control">
                    <FaSearch />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search tenant, mobile, room, or bed"
                    />
                </div>
                <div className="segmented-control">
                    {statusOptions.map((item) => (
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
            {notice && <div className="success-panel">{notice}</div>}

            <div className="data-panel">
                {loading && <div className="empty-state">Loading rent records...</div>}

                {!loading && filteredRentPayments.length === 0 && (
                    <div className="empty-state">No rent records found. Generate monthly rent for active tenants.</div>
                )}

                {!loading && filteredRentPayments.map((payment) => (
                    <article className="rent-row" key={payment.id}>
                        <div className="rent-main">
                            <h3>{payment.tenantName}</h3>
                            <span>{payment.mobile}</span>
                        </div>
                        <div className="rent-meta">
                            <span>Period</span>
                            <strong>{formatMonth(payment)}</strong>
                        </div>
                        <div className="rent-meta">
                            <span>Room</span>
                            <strong>{payment.roomNo || "-"} / {payment.bedNo || "-"}</strong>
                        </div>
                        <div className="rent-meta">
                            <span>Due</span>
                            <strong>{payment.dueDate}</strong>
                        </div>
                        <div className="rent-amount">{formatCurrency(Number(payment.rentAmount) + Number(payment.lateFee || 0))}</div>
                        <span className={`status-pill ${payment.status.toLowerCase().replace("_", "-")}`}>
                            {payment.status.replace("_", " ")}
                        </span>
                        {payment.status !== "PAID" ? (
                            <button type="button" className="secondary-action" onClick={() => openPaymentForm(payment)}>
                                <FaCheck /> Paid
                            </button>
                        ) : (
                            <span className="payment-mode">{payment.paymentMode?.replace("_", " ")}</span>
                        )}
                    </article>
                ))}
            </div>

            {selectedPayment && (
                <div className="modal-backdrop-custom" role="presentation">
                    <form className="payment-modal" onSubmit={handleMarkPaid}>
                        <div className="modal-heading">
                            <div>
                                <p className="eyebrow">Record payment</p>
                                <h3>{selectedPayment.tenantName}</h3>
                            </div>
                            <button type="button" className="icon-close" onClick={() => setSelectedPayment(null)}>x</button>
                        </div>

                        <label className="input-block">
                            <span>Payment Mode</span>
                            <select
                                value={paymentForm.paymentMode}
                                onChange={(event) => setPaymentForm((prev) => ({ ...prev, paymentMode: event.target.value }))}
                            >
                                {paymentModes.map((mode) => (
                                    <option key={mode} value={mode}>{mode.replace("_", " ")}</option>
                                ))}
                            </select>
                        </label>

                        <label className="input-block">
                            <span>Paid Date</span>
                            <input
                                type="date"
                                value={paymentForm.paidDate}
                                onChange={(event) => setPaymentForm((prev) => ({ ...prev, paidDate: event.target.value }))}
                            />
                        </label>

                        <label className="input-block">
                            <span>Late Fee</span>
                            <input
                                type="number"
                                min="0"
                                value={paymentForm.lateFee}
                                onChange={(event) => setPaymentForm((prev) => ({ ...prev, lateFee: event.target.value }))}
                            />
                        </label>

                        <label className="input-block">
                            <span>Remarks</span>
                            <textarea
                                rows="3"
                                value={paymentForm.remarks}
                                onChange={(event) => setPaymentForm((prev) => ({ ...prev, remarks: event.target.value }))}
                            />
                        </label>

                        <button type="submit" className="primary-action wide" disabled={saving}>
                            Mark Paid
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default RentList;
