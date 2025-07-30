import { Route, Routes } from "react-router-dom";
import AdminLayout from "../../components/AdminLayout/Layout/AdminLayout";
import Analytics from "../../pages/Admin/Analytics";
import UserManagement from "../../pages/Admin/UserManagement";
import CollectedWaste from "../../pages/Admin/CollectedWaste";
import ReportedWaste from "../../pages/Admin/ReportedWaste";

const AdminRoutes = () => {
    return (
        <Routes>
            <Route element={<AdminLayout />}>
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/user-management" element={<UserManagement />} />
                <Route path="/collected-waste" element={<CollectedWaste />} />
                <Route path="/reported-waste" element={<ReportedWaste />} />
            </Route>
        </Routes>
    )
}

export default AdminRoutes;