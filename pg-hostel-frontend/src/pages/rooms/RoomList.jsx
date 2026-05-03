import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { FaBed, FaDoorOpen, FaLayerGroup, FaPlus, FaSearch, FaTrash } from "react-icons/fa";
import { roomApi } from "../../api/rooms/roomApi";

function RoomList() {
    const [rooms, setRooms] = useState([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("ALL");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRooms = async (showLoading = true) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError("");
            setRooms(await roomApi.getRooms());
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let isActive = true;

        const loadRooms = async () => {
            try {
                const data = await roomApi.getRooms();
                if (isActive) {
                    setRooms(data);
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

        loadRooms();

        return () => {
            isActive = false;
        };
    }, []);

    const summary = useMemo(() => {
        return rooms.reduce(
            (acc, room) => ({
                rooms: acc.rooms + 1,
                beds: acc.beds + room.capacity,
                vacant: acc.vacant + room.vacantCount,
                occupied: acc.occupied + room.occupiedCount,
            }),
            { rooms: 0, beds: 0, vacant: 0, occupied: 0 }
        );
    }, [rooms]);

    const filteredRooms = rooms.filter((room) => {
        const matchesSearch = room.roomNo.toLowerCase().includes(search.toLowerCase())
            || String(room.floor).includes(search);
        const matchesStatus = status === "ALL" || room.status === status;
        return matchesSearch && matchesStatus;
    });

    const handleDelete = async (id) => {
        if (!window.confirm("Delete this room?")) return;
        try {
            await roomApi.deleteRoom(id);
            fetchRooms(false);
        } catch (err) {
            setError(err.message);
        }
    };

    const handleBedToggle = async (room, bed) => {
        const nextStatus = bed.status === "OCCUPIED" ? "VACANT" : "OCCUPIED";
        try {
            setError("");
            const updatedRoom = await roomApi.updateBedStatus(room.id, bed.id, nextStatus);
            setRooms((currentRooms) => currentRooms.map((item) => (
                item.id === updatedRoom.id ? updatedRoom : item
            )));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="page-shell">
            <div className="page-header">
                <div>
                    <p className="eyebrow">Room and bed management</p>
                    <h2>Rooms</h2>
                    <p className="page-subtitle">Track capacity, occupancy, and rent for every room.</p>
                </div>
                <Link to="/rooms/add" className="primary-action">
                    <FaPlus /> Add Room
                </Link>
            </div>

            <div className="metric-grid">
                <div className="metric-card">
                    <FaDoorOpen />
                    <span>Total Rooms</span>
                    <strong>{summary.rooms}</strong>
                </div>
                <div className="metric-card">
                    <FaBed />
                    <span>Total Beds</span>
                    <strong>{summary.beds}</strong>
                </div>
                <div className="metric-card success">
                    <FaLayerGroup />
                    <span>Vacant Beds</span>
                    <strong>{summary.vacant}</strong>
                </div>
                <div className="metric-card warning">
                    <FaBed />
                    <span>Occupied Beds</span>
                    <strong>{summary.occupied}</strong>
                </div>
            </div>

            <div className="toolbar-panel">
                <div className="search-control">
                    <FaSearch />
                    <input
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        placeholder="Search room or floor"
                    />
                </div>
                <div className="segmented-control">
                    {["ALL", "AVAILABLE", "FULL", "INACTIVE"].map((item) => (
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

            <div className="room-grid">
                {loading && <div className="empty-state">Loading rooms...</div>}

                {!loading && filteredRooms.length === 0 && (
                    <div className="empty-state">No rooms found. Add your first room to begin allocation.</div>
                )}

                {!loading && filteredRooms.map((room) => {
                    const occupancyPercent = room.capacity ? Math.round((room.occupiedCount / room.capacity) * 100) : 0;
                    return (
                        <article className="room-card" key={room.id}>
                            <div className="room-card-top">
                                <div>
                                    <span className="room-label">Room</span>
                                    <h3>{room.roomNo}</h3>
                                </div>
                                <span className={`status-pill ${room.status.toLowerCase()}`}>{room.status}</span>
                            </div>

                            <div className="room-meta">
                                <span>Floor {room.floor}</span>
                                <span>INR {Number(room.rentAmount).toLocaleString()} / month</span>
                            </div>
                            {room.pgName && <div className="room-meta"><span>PG</span><strong>{room.pgName}</strong></div>}

                            <div className="occupancy-row">
                                <span>{room.occupiedCount} occupied</span>
                                <strong>{room.vacantCount} vacant</strong>
                            </div>
                            <div className="progress-track">
                                <span style={{ width: `${occupancyPercent}%` }} />
                            </div>

                            <div className="bed-dots">
                                {room.beds.map((bed) => (
                                    <button
                                        type="button"
                                        key={bed.id}
                                        title={`Click to mark ${bed.status === "OCCUPIED" ? "vacant" : "occupied"}: ${bed.bedNo}`}
                                        className={bed.status.toLowerCase()}
                                        onClick={() => handleBedToggle(room, bed)}
                                    />
                                ))}
                            </div>

                            <button type="button" className="icon-danger" onClick={() => handleDelete(room.id)} title="Delete room">
                                <FaTrash />
                            </button>
                        </article>
                    );
                })}
            </div>
        </div>
    );
}

export default RoomList;
