import { Route ,Routes } from "react-router-dom";
import UserLayout from "../../components/UserLayout/Layout/UserLayout";
import Dashboard from "../../pages/User/Dashboard";
import CollectWaste from "../../pages/User/CollectWaste";
import ReportWaste from "../../pages/User/ReportWaste";
import UserProfile from "../../pages/User/UserProfile";


const UserRoutes = () => {
  return (
    <>
        <Routes> 
          <Route element={<UserLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/collect-waste" element={<CollectWaste />} />
              <Route path="/report-waste" element={<ReportWaste />} />
              <Route path="/user-profile" element={<UserProfile />} />
          </Route>
        </Routes>
    </>
  )
}

export default UserRoutes;
