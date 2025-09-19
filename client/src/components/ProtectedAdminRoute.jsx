import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const { currentUser } = useSelector((state) => state.user);
  console.log("🔍 currentUser in route:", currentUser);

  if (!currentUser) {
    return <Navigate to="/signin" />;
  }

  if (currentUser?.role !== "admin") {
    return (
      <div className="p-6 text-center text-red-400 font-semibold">
        Access Denied – Admins only
      </div>
    );
  }

  return children;
};

export default ProtectedAdminRoute;
