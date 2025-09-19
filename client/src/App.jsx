import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import PublicRoute from "./components/PublicRoute";
// import DashboardLayout from "./components/layout/DashboardLayout";

import { getCurrentUser } from "./redux/user/userSlice";

// Pages
import Home from "./pages/home/Home";
import About from "./pages/about/About";
import SignIn from "./pages/login/SignIn";
import SignUp from "./pages/register/SignUp";
import ForgotPassword from "./pages/forgot/ForgotPassword";
import ResetPassword from "./pages/resetPass/ResetPassword";
import Profile from "./pages/EditProfile/Profile";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import UserDashboard from "./pages/dashboard/UserDashboard";
import UploadPage from "./pages/dashboard/UploadPage";
import SummariesPage from "./pages/dashboard/SummariesPage";
import HistoryPage from "./pages/dashboard/HistoryPage";
import ChatPage from "./pages/dashboard/ChatPage";
import SubscribePage from "./pages/subscribe/SubscribePage";
import MyWorkPage from "./pages/mywork/MyworkPage";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Navbar />
      <ToastContainer />

      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot-pass" element={<ForgotPassword />} />
          <Route path="/reset-pass/:token" element={<ResetPassword />} />
        </Route>

        {/* Home */}
        <Route path="/" element={<Home />} />
        <Route path="/subscribe" element={<SubscribePage />} />

        {/* Protected User Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/edit-profile" element={<Profile />} />

          <Route path="/user-dashboard" element={<UserDashboard />} />

          {/* <Route
            path="/user-dashboard/upload"
            element={
              <DashboardLayout>
                <UploadPage />
              </DashboardLayout>
            }
          /> */}
          {/* <Route
            path="/user-dashboard/summaries"
            element={
              <DashboardLayout>
                <SummariesPage />
              </DashboardLayout>
            }
          /> */}
          {/* <Route
            path="/user-dashboard/history"
            element={
              <DashboardLayout>
                <HistoryPage />
              </DashboardLayout>
            }
          /> */}
          {/* <Route
            path="/user-dashboard/chat"
            element={
              <DashboardLayout>
                <ChatPage />
              </DashboardLayout>
            }
          /> */}

          <Route path="/user-dashboard/my-work" element={<MyWorkPage />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />

        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
