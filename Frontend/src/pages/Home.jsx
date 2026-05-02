import { useEffect } from "react";
import { loadScript, loadStyle } from "../utils/loadAssets";
import { Link } from "react-router-dom";

function Home() {
    return (
        <>
            <Link to="/admin-login" className="btn btn-warning m-3"
                style={{ color: "white" }}>Login to Portal</Link>
            <Link to="/dashboard" className="btn btn-warning m-3"
                style={{ color: "white" }}>Dashboard</Link>
        </>
    );
}

export default Home;
