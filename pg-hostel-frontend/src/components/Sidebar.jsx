import { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaChevronLeft, FaComments, FaDoorOpen, FaHome, FaIdBadge, FaMoneyBillWave, FaPaperPlane, FaTimes, FaUsers } from "react-icons/fa";

function Sidebar({ isOpen, toggleSidebar }) {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            from: "bot",
            text: "Hi, I can help with rooms, tenants, rent, and common StayNest workflows.",
        },
    ]);

    const getBotReply = (text) => {
        const value = text.toLowerCase();

        if (value.includes("tenant") || value.includes("add")) {
            return "To add a tenant, open Tenants and use the Add Tenant button. You can assign an available room and bed from that form.";
        }

        if (value.includes("room") || value.includes("bed")) {
            return "Rooms lets you create room capacity and beds. Bed availability updates when tenants check in or check out.";
        }

        if (value.includes("rent") || value.includes("payment")) {
            return "Open Rent to generate monthly rent for active tenants, filter dues, and mark payments as paid.";
        }

        if (value.includes("checkout") || value.includes("check out")) {
            return "Use the Check Out action on an active tenant row. StayNest will mark the tenant checked out and free the bed.";
        }

        return "I can guide you around StayNest. Try asking about adding tenants, managing rooms, rent collection, or check-out.";
    };

    const handleChatSubmit = (event) => {
        event.preventDefault();
        const trimmedMessage = message.trim();
        if (!trimmedMessage) return;

        setMessages((currentMessages) => [
            ...currentMessages,
            { from: "user", text: trimmedMessage },
            { from: "bot", text: getBotReply(trimmedMessage) },
        ]);
        setMessage("");
    };

    return (
        <div className={`sidebar p-3 text-white ${isOpen ? "" : "sidebar-closed"} position-relative`}>
            <button 
                onClick={toggleSidebar} 
                className="btn border-0 p-0 text-white sidebar-toggle-btn"
            >
                <span className={`toggle-icon ${isOpen ? "hide" : "show"}`}>
                    <FaBars />
                </span>
                <span className={`toggle-icon ${isOpen ? "show" : "hide"}`}>
                    <FaChevronLeft />
                </span>
            </button>

            <div className={`mb-4 ${isOpen ? "" : "text-center"}`} style={{ paddingLeft: isOpen ? "12px" : "0" }}>
                <h2 className="logo m-0" aria-label="StayNest">
                    {isOpen ? (
                        <>
                            <span className="logo-accent logo-s">S</span>tay<span className="logo-accent logo-n">N</span>est
                        </>
                    ) : (
                        <>
                            <span className="logo-accent logo-s">S</span><span className="logo-accent logo-n">N</span>
                        </>
                    )}
                </h2>
            </div>

            <ul className="nav flex-column gap-2 sidebar-menu">

                <li>
                    <Link to="/" className="nav-link menu-link">
                        <FaHome size={20} /> <span className={isOpen ? "" : "d-none"}>Dashboard</span>
                    </Link>
                </li>

                <li>
                    <Link to="/rooms" className="nav-link menu-link">
                        <FaDoorOpen size={20} /> <span className={isOpen ? "" : "d-none"}>Rooms</span>
                    </Link>
                </li>

                <li>
                    <Link to="/tenants" className="nav-link menu-link">
                        <FaUsers size={20} /> <span className={isOpen ? "" : "d-none"}>Tenants</span>
                    </Link>
                </li>

                <li>
                    <Link to="/rent" className="nav-link menu-link">
                        <FaMoneyBillWave size={20} /> <span className={isOpen ? "" : "d-none"}>Rent</span>
                    </Link>
                </li>

                <li>
                    <Link to="/my-profile" className="nav-link menu-link">
                        <FaIdBadge size={20} /> <span className={isOpen ? "" : "d-none"}>My Profile</span>
                    </Link>
                </li>

            </ul>

            <div className="sidebar-chat">
                <button
                    type="button"
                    className="chatbot-toggle"
                    onClick={() => setIsChatOpen((current) => !current)}
                    aria-label="Open StayNest chatbot"
                >
                    <FaComments />
                    <span className={isOpen ? "" : "d-none"}>StayNest Bot</span>
                </button>
            </div>

            {isChatOpen && (
                <section className={`chatbot-panel ${isOpen ? "" : "collapsed-sidebar"}`}>
                    <div className="chatbot-header">
                        <div>
                            <span>StayNest Bot</span>
                            <small>Application assistant</small>
                        </div>
                        <button type="button" onClick={() => setIsChatOpen(false)} aria-label="Close chatbot">
                            <FaTimes />
                        </button>
                    </div>
                    <div className="chatbot-messages">
                        {messages.map((item, index) => (
                            <div className={`chat-message ${item.from}`} key={`${item.from}-${index}`}>
                                {item.text}
                            </div>
                        ))}
                    </div>
                    <form className="chatbot-input" onSubmit={handleChatSubmit}>
                        <input
                            value={message}
                            onChange={(event) => setMessage(event.target.value)}
                            placeholder="Ask about StayNest"
                            aria-label="Chat message"
                        />
                        <button type="submit" aria-label="Send message">
                            <FaPaperPlane />
                        </button>
                    </form>
                </section>
            )}
        </div>
    );
}

export default Sidebar;
