function Dashboard() {
    return (
        <>
            <h2 className="mb-4">Dashboard</h2>

            <div className="row g-4">
                <div className="col-md-3">
                    <div className="card stat-card p-3">
                        <h5>Total Tenants</h5>
                        <h2>48</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card p-3">
                        <h5>Vacant Beds</h5>
                        <h2>12</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card p-3">
                        <h5>Pending Rent</h5>
                        <h2>₹24,000</h2>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card stat-card p-3">
                        <h5>Monthly Income</h5>
                        <h2>₹1,20,000</h2>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Dashboard;