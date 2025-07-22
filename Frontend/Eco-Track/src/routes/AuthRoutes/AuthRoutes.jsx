import { Routes, Route } from "react-router-dom";
import UserLogin from "../../pages/Auth/UserAuth/UserLogin/UserLogin";
import UserRegister from "../../pages/Auth/UserAuth/UserRegister/UserRegister";
import UserForgotPassword from "../../pages/Auth/UserAuth/UserForgotPassword/UserForgotPassword";

const AuthRoutes = () => {
  return (
    <> 
        <Routes>
           <Route path="/login" element={<UserLogin />} />
           <Route path="/register" element={<UserRegister />} />
           <Route path="/forgot-password" element={<UserForgotPassword />} />
        </Routes>
    </>
  )
}

export default AuthRoutes;
