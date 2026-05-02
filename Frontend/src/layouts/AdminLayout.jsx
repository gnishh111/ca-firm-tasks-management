import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import Sidebar from "@/components/admin/Sidebar";
import Navbar from "@/components/admin/Navbar";
import { initAdminPlugins } from "@/utils/initAdminPlugins";
 
function AdminLayout() {
    useEffect(() => {
        initAdminPlugins();
    }, []);
    return (
        <>
            <div className="main-wrapper">
                <Sidebar />
                <Navbar />
                <Outlet />
            </div>
        </>
    );
}
 
export default AdminLayout;
 
 