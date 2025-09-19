// import { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import AuthLayout from "../../components/AuthLayout";
// import { useDispatch } from "react-redux";
// import { signUp } from "../../redux/user/userSlice";

// export const SignUp = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     username: "",
//     email: "",
//     password: "",
//   });

//   const handleChangeInputValue = (e) => {
//     setFormData((prev) => ({
//       ...prev,
//       [e.target.name]: e.target.value,
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const resultAction = await dispatch(signUp(formData));

//       if (signUp.fulfilled(resultAction)) {
//         console.log("✅ New user registered:", resultAction);
//         navigate("/signin");
//       } else {
//         console.warn("⚠️ Sign-up failed:", resultAction.payload);
//       }
//     } catch (err) {
//       console.error("❌ Unexpected sign-up error:", err);
//     }
//   };

//   return (
//     <AuthLayout
//       title="Create Account"
//       subtitle="Join EmotiVoice and empower expression."
//     >
//       <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//         <input
//           type="text"
//           placeholder="Username"
//           name="username"
//           className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           value={formData.username}
//           onChange={handleChangeInputValue}
//           required
//         />
//         <input
//           type="email"
//           placeholder="Email"
//           name="email"
//           className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           value={formData.email}
//           onChange={handleChangeInputValue}
//           required
//         />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           className="bg-gray-800 text-white p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
//           value={formData.password}
//           onChange={handleChangeInputValue}
//           required
//         />

//         <button
//           type="submit"
//           className="bg-gradient-to-r from-purple-500 to-pink-500 py-3 rounded-lg font-semibold hover:opacity-90 transition duration-300"
//         >
//           Sign Up
//         </button>
//         <p className="text-sm text-center text-gray-400">
//           Already have an account?{" "}
//           <Link to="/signin" className="text-pink-400 hover:underline">
//             Sign in here
//           </Link>
//         </p>
//       </form>
//     </AuthLayout>
//   );
// };

// export default SignUp;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout from "../../components/AuthLayout";
import { useDispatch } from "react-redux";
import { signUp } from "../../redux/user/userSlice";
import { User, Mail, Lock } from "lucide-react";

export const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChangeInputValue = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(signUp(formData));

      if (signUp.fulfilled(resultAction)) {
        console.log("✅ New user registered:", resultAction);
        navigate("/signin");
      } else {
        console.warn("⚠️ Sign-up failed:", resultAction.payload);
      }
    } catch (err) {
      console.error("❌ Unexpected sign-up error:", err);
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Join ClipoFrameAI and unlock your creative AI powers ⚡"
    >
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-gray-900/70 p-8 rounded-2xl shadow-2xl backdrop-blur-md border border-pink-500/30"
      >
        {/* Username */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-purple-500 transition">
          <span className="px-3 text-purple-400">
            <User size={20} />
          </span>
          <input
            type="text"
            placeholder="Username"
            name="username"
            className="flex-1 bg-transparent text-white p-3 focus:outline-none"
            value={formData.username}
            onChange={handleChangeInputValue}
            required
          />
        </div>

        {/* Email */}
        <div className="flex items-center bg-gray-800 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-cyan-500 transition">
          <span className="px-3 text-cyan-400">
            <Mail size={20} />
          </span>
          <input
            type="email"
            placeholder="Email"
            name="email"
            className="flex-1 bg-transparent text-white p-3 focus:outline-none"
            value={formData.email}
            onChange={handleChangeInputValue}
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
            onChange={handleChangeInputValue}
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          className="relative overflow-hidden py-3 rounded-lg font-semibold text-white 
                     bg-gradient-to-r from-pink-500 to-purple-600 
                     hover:scale-105 transition duration-300"
        >
          <span className="relative z-10">⚡ Create My Account</span>
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 opacity-0 hover:opacity-100 blur-xl transition"></div>
        </button>

        {/* Link to Sign In */}
        <p className="text-sm text-center text-gray-400">
          Already have an account?{" "}
          <Link to="/signin" className="text-pink-400 hover:underline">
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default SignUp;
