import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Login from "@/pages/admin/Login";
// import Home from "@/pages/Home";
import Customer from "@/pages/admin/Customer";
import Employee from "@/pages/admin/Employee";
import Department from "@/pages/admin/Department";
import CustomerFirm from "@/pages/admin/CustomerFirm";
import Service from "@/pages/admin/Service";
import FirmService from "@/pages/admin/FirmService";
import Task from "@/pages/admin/Task";
import BasicInputs from "@/pages/admin/form/BasicInputs";
import FormEditors from "@/pages/admin/form/FormEditors";
import FormSelect from "@/pages/admin/form/FormSelect";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AppRouter() {
  const navigate = useNavigate();

  useEffect(() => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");
    if (!token) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  return (
    <Routes>
      <Route path="/" element={<Login />} />

      <Route path="/admin-login" element={<Login />} />

      {/* Dashboard should show Task page (no UI changes in Task) */}
      <Route path="/dashboard" element={<AdminLayout />}>
        <Route index element={<Task />} />
      </Route>

      <Route path="/basic-inputs" element={<AdminLayout />}>
        <Route index element={<BasicInputs />} />
      </Route>

      <Route path="/form-select" element={<AdminLayout />}>
        <Route index element={<FormSelect />} />
      </Route>

      <Route path="/form-editors" element={<AdminLayout />}>
        <Route index element={<FormEditors />} />
      </Route>

      <Route path="/customer" element={<AdminLayout />}>
        <Route index element={<Customer />} />
      </Route>

      <Route path="/employee" element={<AdminLayout />}>
        <Route index element={<Employee />} />
      </Route>

      <Route path="/departments" element={<AdminLayout />}>
        <Route index element={<Department />} />
      </Route>

      <Route path="/customer-firm" element={<AdminLayout />}>
        <Route index element={<CustomerFirm />} />
      </Route>

      <Route path="/services" element={<AdminLayout />}>
        <Route index element={<Service />} />
      </Route>

      <Route path="/firm-services" element={<AdminLayout />}>
        <Route index element={<FirmService />} />
      </Route>

      <Route path="/tasks" element={<AdminLayout />}>
        <Route index element={<Task />} />
      </Route>

      {/* Avoid blank page for unknown routes */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
export default AppRouter;
