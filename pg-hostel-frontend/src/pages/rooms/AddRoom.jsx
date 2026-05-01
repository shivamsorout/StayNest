import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaBed, FaBuilding, FaDoorOpen, FaSave } from "react-icons/fa";
import { roomApi } from "../../api/rooms/roomApi";

function AddRoom() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        roomNo: "",
        floor: "",
        capacity: "",
        rentAmount: "",
    });
    const [error, setError] = useState("");
    const [saving, setSaving] = useState(false);

    const updateField = (field, value) => {
        setForm((current) => ({ ...current, [field]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            setSaving(true);
            setError("");
            await roomApi.createRoom({
                roomNo: form.roomNo,
                floor: Number(form.floor),
                capacity: Number(form.capacity),
                rentAmount: Number(form.rentAmount),
            });
            navigate("/rooms");
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
                    <p className="eyebrow">Create allocation space</p>
                    <h2>Add Room</h2>
                    <p className="page-subtitle">Beds are generated automatically from the room capacity.</p>
                </div>
            </div>

            <form className="form-panel" onSubmit={handleSubmit}>
                {error && <div className="alert-panel">{error}</div>}

                <div className="form-grid">
                    <label className="input-block">
                        <span><FaDoorOpen /> Room Number</span>
                        <input
                            value={form.roomNo}
                            onChange={(event) => updateField("roomNo", event.target.value)}
                            placeholder="A-101"
                            required
                        />
                    </label>

                    <label className="input-block">
                        <span><FaBuilding /> Floor</span>
                        <input
                            type="number"
                            value={form.floor}
                            onChange={(event) => updateField("floor", event.target.value)}
                            placeholder="1"
                            required
                        />
                    </label>

                    <label className="input-block">
                        <span><FaBed /> Capacity</span>
                        <input
                            type="number"
                            min="1"
                            value={form.capacity}
                            onChange={(event) => updateField("capacity", event.target.value)}
                            placeholder="4"
                            required
                        />
                    </label>

                    <label className="input-block">
                        <span>INR Monthly Rent</span>
                        <input
                            type="number"
                            min="1"
                            value={form.rentAmount}
                            onChange={(event) => updateField("rentAmount", event.target.value)}
                            placeholder="6500"
                            required
                        />
                    </label>
                </div>

                <div className="bed-preview">
                    <span>Preview</span>
                    <div>
                        {Array.from({ length: Math.min(Number(form.capacity) || 0, 12) }).map((_, index) => (
                            <i key={index}>B{index + 1}</i>
                        ))}
                    </div>
                </div>

                <button type="submit" className="primary-action wide" disabled={saving}>
                    <FaSave /> {saving ? "Saving..." : "Create Room"}
                </button>
            </form>
        </div>
    );
}

export default AddRoom;
