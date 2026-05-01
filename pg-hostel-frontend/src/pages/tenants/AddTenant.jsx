import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaDoorOpen, FaEnvelope, FaIdCard, FaLocationDot, FaPhone, FaUser } from "react-icons/fa6";
import { FaSave } from "react-icons/fa";
import { roomApi } from "../../api/rooms/roomApi";
import { tenantApi } from "../../api/tenants/tenantApi";

function AddTenant() {
    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    const [form, setForm] = useState({
        fullName: "",
        fatherName: "",
        mobile: "",
        email: "",
        aadhaarNo: "",
        address: "",
        roomId: "",
        bedId: "",
        checkInDate: new Date().toISOString().slice(0, 10),
    });
    const [loadingRooms, setLoadingRooms] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isActive = true;

        const loadRooms = async () => {
            try {
                const data = await roomApi.getAvailableRooms();
                if (isActive) {
                    setRooms(data);
                }
            } catch (err) {
                if (isActive) {
                    setError(err.message);
                }
            } finally {
                if (isActive) {
                    setLoadingRooms(false);
                }
            }
        };

        loadRooms();

        return () => {
            isActive = false;
        };
    }, []);

    const selectedRoom = useMemo(() => {
        return rooms.find((room) => String(room.id) === String(form.roomId));
    }, [rooms, form.roomId]);

    const vacantBeds = selectedRoom?.beds?.filter((bed) => bed.status === "VACANT") || [];

    const updateField = (field, value) => {
        setForm((current) => ({
            ...current,
            [field]: value,
            ...(field === "roomId" ? { bedId: "" } : {}),
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");
            await tenantApi.createTenant({
                ...form,
                roomId: Number(form.roomId),
                bedId: Number(form.bedId),
            });
            navigate("/tenants");
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="page-shell">
            <div className="page-header compact">
                <div>
                    <p className="eyebrow">Tenant onboarding</p>
                    <h2>Add Tenant</h2>
                    <p className="page-subtitle">Assign a vacant bed and mark it occupied in one flow.</p>
                </div>
            </div>

            <form className="form-panel" onSubmit={handleSubmit}>
                {error && <div className="alert-panel">{error}</div>}

                <div className="form-grid">
                    <label className="input-block">
                        <span><FaUser /> Full Name</span>
                        <input value={form.fullName} onChange={(event) => updateField("fullName", event.target.value)} required />
                    </label>

                    <label className="input-block">
                        <span><FaUser /> Father Name</span>
                        <input value={form.fatherName} onChange={(event) => updateField("fatherName", event.target.value)} />
                    </label>

                    <label className="input-block">
                        <span><FaPhone /> Mobile</span>
                        <input value={form.mobile} maxLength="10" onChange={(event) => updateField("mobile", event.target.value)} required />
                    </label>

                    <label className="input-block">
                        <span><FaEnvelope /> Email</span>
                        <input type="email" value={form.email} onChange={(event) => updateField("email", event.target.value)} />
                    </label>

                    <label className="input-block">
                        <span><FaIdCard /> Aadhaar</span>
                        <input value={form.aadhaarNo} maxLength="12" onChange={(event) => updateField("aadhaarNo", event.target.value)} />
                    </label>

                    <label className="input-block">
                        <span>Check-in Date</span>
                        <input type="date" value={form.checkInDate} onChange={(event) => updateField("checkInDate", event.target.value)} required />
                    </label>

                    <label className="input-block">
                        <span><FaDoorOpen /> Room</span>
                        <select value={form.roomId} onChange={(event) => updateField("roomId", event.target.value)} required>
                            <option value="">{loadingRooms ? "Loading rooms..." : "Select room"}</option>
                            {rooms.map((room) => (
                                <option key={room.id} value={room.id}>
                                    {room.roomNo} - {room.vacantCount} vacant beds
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="input-block">
                        <span><FaBed /> Bed</span>
                        <select value={form.bedId} onChange={(event) => updateField("bedId", event.target.value)} required disabled={!selectedRoom}>
                            <option value="">{selectedRoom ? "Select vacant bed" : "Select room first"}</option>
                            {vacantBeds.map((bed) => (
                                <option key={bed.id} value={bed.id}>{bed.bedNo}</option>
                            ))}
                        </select>
                    </label>
                </div>

                <label className="input-block">
                    <span><FaLocationDot /> Address</span>
                    <textarea value={form.address} onChange={(event) => updateField("address", event.target.value)} rows="3" />
                </label>

                {selectedRoom && (
                    <div className="bed-preview">
                        <span>Selected Room</span>
                        <div>
                            <i>{selectedRoom.roomNo}</i>
                            <i>INR {Number(selectedRoom.rentAmount).toLocaleString()} / month</i>
                            <i>{vacantBeds.length} vacant</i>
                        </div>
                    </div>
                )}

                <button type="submit" className="primary-action wide" disabled={saving}>
                    <FaSave /> {saving ? "Saving..." : "Add Tenant"}
                </button>
            </form>
        </div>
    );
}

export default AddTenant;
