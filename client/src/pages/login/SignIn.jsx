// import { useState } from "react";
// import AuthLayout from "../../components/AuthLayout";
// import { Link, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { signIn } from "../../redux/user/userSlice";

// export const SignIn = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const [formData, setFormData] = useState({ email: "", password: "" });
//   const { error, loading } = useSelector((state) => state.user);

//   const handleChange = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const resultAction = await dispatch(signIn(formData));
//       console.log(resultAction);
//       if (signIn.fulfilled.match(resultAction)) {
//         navigate("/user-dashboard"); // Redirect after successful sign-in
//       }
//     } catch (err) {
//       console.error("Sign-in error:", err);
//     }
//   };

//   return (
//     <AuthLayout
//       title="Sign In"
//       subtitle="Welcome back! Please enter your details."
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.email}
//           onChange={handleChange}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
//           value={formData.password}
//           onChange={handleChange}
//           required
//         />
//         {error && (
//           <p className="text-red-400 text-sm text-center">
//             {error.message || error}
//           </p>
//         )}
//         <button
//           type="submit"
//           disabled={loading}
//           className="bg-gradient-to-r from-blue-500 to-purple-500 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300 disabled:opacity-50"
//         >
//           {loading ? "Signing In..." : "Sign In"}
//         </button>
//         <p className="text-sm text-center text-gray-400">
//           Don't have an account?{" "}
//           <Link to="/signup" className="text-blue-400 hover:underline">
//             Sign up here
//           </Link>
//         </p>
//         <div className="flex justify-between">
//           <div className="flex items-center justify-around w-35 ">
//             <input type="checkbox" name="" id="reset" />
//             <label htmlFor="reset">Remember me</label>
//           </div>
//           <p>
//             <Link className="text-sm hover:underline" to="/forgot-pass">
//               Forgot Password
//             </Link>
//           </p>
//         </div>
//       </form>
//     </AuthLayout>
//   );
// };

// export default SignIn;

import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../../redux/user/userSlice";
import { Mail, Lock } from "lucide-react";

export const SignIn = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { error, loading } = useSelector((state) => state.user);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(signIn(formData));
      if (signIn.fulfilled.match(resultAction)) {
        navigate("/");
      }
    } catch (err) {
      console.error("Sign-in error:", err);
    }
  };

  return (
    <AuthLayout
      title="Sign In"
      subtitle="Step into the AI realm 🚀 — Welcome back!"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-gray-900/70 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-cyan-500/30"
      >
        {/* Email */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 transition">
          <span className="px-3 text-cyan-400">
            <Mail size={20} />
          </span>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="flex-1 bg-transparent text-white p-3 focus:outline-none"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-pink-500 transition">
          <span className="px-3 text-pink-400">
            <Lock size={20} />
          </span>
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="flex-1 bg-transparent text-white p-3 focus:outline-none"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        {error && (
          <p className="text-red-400 text-sm text-center animate-pulse">
            {error.message || error}
          </p>
        )}

        {/* Sign In Button */}
        <button
          type="submit"
          disabled={loading}
          className="relative overflow-hidden py-3 rounded-lg font-semibold text-white 
                     bg-gradient-to-r from-cyan-500 to-pink-500 
                     hover:scale-105 transition duration-300 disabled:opacity-50"
        >
          <span className="relative z-10">
            {loading ? "Signing In..." : "Enter the Matrix"}
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-pink-500 to-cyan-500 opacity-0 hover:opacity-100 blur-xl transition"></div>
        </button>

        {/* Extra Options */}
        <div className="flex justify-between items-center text-sm text-gray-400">
          <label className="flex items-center gap-2">
            <input type="checkbox" className="accent-cyan-500" />
            Remember me
          </label>
          <Link to="/forgot-pass" className="hover:text-cyan-400">
            Forgot Password?
          </Link>
        </div>

        <p className="text-sm text-center text-gray-400">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-cyan-400 hover:underline">
            Sign up here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignIn;
