import { Link } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar text-white p-3">
            <h3 className="mb-4">🏨 PG Admin</h3>

            <ul className="nav flex-column gap-2">
                <li><Link to="/" className="nav-link text-white">Dashboard</Link></li>
                <li><Link to="/tenants" className="nav-link text-white">Tenants</Link></li>
                <li><Link to="/add-tenant" className="nav-link text-white">Add Tenant</Link></li>
                <li><Link to="/rent" className="nav-link text-white">Rent</Link></li>
            </ul>
        </div>
    );
}

export default Sidebar;