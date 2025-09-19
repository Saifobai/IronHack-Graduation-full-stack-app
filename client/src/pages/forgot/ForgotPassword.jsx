import React, { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../redux/user/userSlice";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState({ email: "" });

  const handleChange = (e) => {
    setEmail((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(forgotPassword(email));

      if (forgotPassword.fulfilled(resultAction)) {
        console.log("✅ rest password link sent successfully:", resultAction);
        toast.success(resultAction.payload.msg || "Reset email sent!");
        navigate("/");
      }
    } catch (err) {
      console.error("❌ Unexpected sign-up error:", err.msg);
    }
  };

  return (
    <AuthLayout
      title="Forgot your password?"
      subtitle="Welcome back! Please enter your details."
    >
      <p>
        {" "}
        No worries — it happens! Enter your email below and we’ll send you a
        link to reset your password.
      </p>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-10">
        <input
          type="email"
          name="email"
          placeholder="Email"
          className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-5"
          value={email.email}
          onChange={handleChange}
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
