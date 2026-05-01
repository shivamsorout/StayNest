import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TenantList from "./pages/TenantList";
import AddTenant from "./pages/AddTenant";
import RentList from "./pages/RentList";
import RoomList from "./pages/rooms/RoomList";
import AddRoom from "./pages/rooms/AddRoom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import ForgotPassword from "./pages/ForgotPassword";
import { authService } from "./services/auth";

const ProtectedRoute = ({ children }) => {
    if (!authService.isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }
    return <Layout>{children}</Layout>;
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                } />
                <Route path="/tenants" element={
                    <ProtectedRoute>
                        <TenantList />
                    </ProtectedRoute>
                } />
                <Route path="/add-tenant" element={
                    <ProtectedRoute>
                        <AddTenant />
                    </ProtectedRoute>
                } />
                <Route path="/rent" element={
                    <ProtectedRoute>
                        <RentList />
                    </ProtectedRoute>
                } />
                <Route path="/rooms" element={
                    <ProtectedRoute>
                        <RoomList />
                    </ProtectedRoute>
                } />
                <Route path="/rooms/add" element={
                    <ProtectedRoute>
                        <AddRoom />
                    </ProtectedRoute>
                } />

                {/* Redirect any unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
