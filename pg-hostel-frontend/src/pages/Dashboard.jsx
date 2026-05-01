function Dashboard() {
    return (
        <>
            <div className="page-header mb-4">
                <div>
                    <p className="eyebrow">Live operations</p>
                    <h2>Dashboard</h2>
                    <p className="page-subtitle">A quick view of occupancy, rent, and daily activity.</p>
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-3">
                    <div className="dashboard-card card-grad-1">
                        <p>Total Tenants</p>
                        <h2>48</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card-grad-2">
                        <p>Vacant Beds</p>
                        <h2>12</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card-grad-3">
                        <p>Pending Rent</p>
                        <h2>INR 24K</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="dashboard-card card-grad-4">
                        <p>Monthly Income</p>
                        <h2>INR 1.2L</h2>
                    </div>
                </div>
            </div>

            <div className="dashboard-card card-grad-5 mt-5">
                <h5 className="mb-3 text-dark">Recent Activity</h5>
                <p>3 new tenants added today.</p>
                <p className="mb-0">2 rents collected.</p>
            </div>
        </>
    );
}

export default Dashboard;
