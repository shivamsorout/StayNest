import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import TenantList from "./pages/TenantList";
import AddTenant from "./pages/AddTenant";
import RentList from "./pages/RentList";

function App() {
    return (
        <BrowserRouter>
            <Layout>
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/tenants" element={<TenantList />} />
                    <Route path="/add-tenant" element={<AddTenant />} />
                    <Route path="/rent" element={<RentList />} />
                </Routes>
            </Layout>
        </BrowserRouter>
    );
}

export default App;