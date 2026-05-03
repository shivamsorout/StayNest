import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TenantList from "./pages/tenants/TenantList";
import AddTenant from "./pages/tenants/AddTenant";
import RentList from "./pages/RentList";
import TenantProfile from "./pages/TenantProfile";
import RoomList from "./pages/rooms/RoomList";
import AddRoom from "./pages/rooms/AddRoom";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ForgotPassword from "./pages/auth/ForgotPassword";
import { authService } from "./services/auth";

const normalizeRole = (role) => (role || "").trim().toUpperCase();
const roleOfCurrentUser = () => normalizeRole(authService.getCurrentUser()?.role);
const isOwnerRole = (role) => role === "OWNER" || role === "ADMIN";

const OwnerRoute = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return isOwnerRole(roleOfCurrentUser()) ? <Layout>{children}</Layout> : <Navigate to="/my-profile" replace />;
};

const ProfileRoute = () => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    return roleOfCurrentUser() === "TENANT" ? (
        <Layout>
            <TenantProfile />
        </Layout>
    ) : (
        <Navigate to="/" replace />
    );
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/" element={
                    <OwnerRoute>
                        <Dashboard />
                    </OwnerRoute>
                } />
                <Route path="/tenants" element={
                    <OwnerRoute>
                        <TenantList />
                    </OwnerRoute>
                } />
                <Route path="/add-tenant" element={
                    <OwnerRoute>
                        <AddTenant />
                    </OwnerRoute>
                } />
                <Route path="/rent" element={
                    <OwnerRoute>
                        <RentList />
                    </OwnerRoute>
                } />
                <Route path="/my-profile" element={<ProfileRoute />} />
                <Route path="/rooms" element={
                    <OwnerRoute>
                        <RoomList />
                    </OwnerRoute>
                } />
                <Route path="/rooms/add" element={
                    <OwnerRoute>
                        <AddRoom />
                    </OwnerRoute>
                } />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
