import React from "react";
import AuthLayout from "../../components/AuthLayout";
import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";
import { resetPassword } from "../../redux/user/userSlice";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const inputType = showPassword ? "text" : "password";

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(resetPassword({ token, password }));

      if (resetPassword.fulfilled.match(resultAction)) {
        console.log("✅ Password reset Successfully", resultAction);
        toast.success(
          resultAction.payload.msg || "Password recovered Successfully"
        );
        navigate("/signin");
      } else {
        toast.error(resultAction.payload || "Reset failed.");
      }
    } catch (err) {
      console.error("❌ Unexpected reset error:", err.message);
      toast.error("Something went wrong");
    }
  };

  return (
    <AuthLayout title="Enter Password" subtitle="Enter your Strong Password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
        <input
          type={inputType}
          name="password"
          placeholder="Password"
          className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={password.password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
        >
          Reset Password
        </button>
        {showPassword ? (
          <FaRegEye
            onClick={handleShowPassword}
            className="absolute left-[350px] top-4 cursor-pointer"
          />
        ) : (
          <FaEyeSlash
            onClick={handleShowPassword}
            className="absolute left-[350px] top-4 cursor-pointer"
          />
        )}
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
