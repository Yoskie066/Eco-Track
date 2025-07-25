import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to login without clearing anything
    navigate("/login");
  }, [navigate]);

  return (
    <div className="text-center mt-20">
      <p className="text-lg text-gray-700">Redirecting to login...</p>
    </div>
  );
};

export default Logout;
