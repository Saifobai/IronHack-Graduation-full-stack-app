// import React, { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllUsers } from "../../redux/admin/adminSlice";

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, loading, error } = useSelector((state) => state.admin);
//   const { currentUser } = useSelector((state) => state.user);
//   const userToken = currentUser.token;

//   useEffect(() => {
//     dispatch(fetchAllUsers(userToken));
//   }, [dispatch, userToken]);

//   const handleRoleChange = (userId, newRole) => {
//     // implement your role change logic here
//     console.log(`Change user ${userId} role to ${newRole}`);
//   };

//   return (
//     <div className="p-4 md:p-8 bg-gray-900 min-h-screen text-white">
//       <h1 className="text-3xl font-bold mb-6 text-cyan-400">Admin Dashboard</h1>

//       {loading && <p className="text-cyan-300">Loading users...</p>}
//       {error && <p className="text-red-500 font-medium">Error: {error}</p>}

//       <div className="overflow-x-auto rounded-lg shadow border border-gray-700">
//         <table className="min-w-full text-sm text-left text-gray-200">
//           <thead className="bg-gray-800 text-cyan-300">
//             <tr>
//               <th className="px-6 py-3">Full Name</th>
//               <th className="px-6 py-3">Role</th>
//               <th className="px-6 py-3">User ID</th>
//               <th className="px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr
//                 key={user._id}
//                 className="border-t border-gray-700 hover:bg-gray-800 transition"
//               >
//                 <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
//                 <td className="px-6 py-4">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide
//                       ${user.role === "admin" && "bg-yellow-300 text-black"}
//                       ${user.role === "therapist" && "bg-green-300 text-black"}
//                       ${user.role === "parent" && "bg-blue-300 text-black"}
//                     `}
//                   >
//                     {user.role}
//                   </span>
//                 </td>
//                 <td className="px-6 py-4 text-xs break-all">{user._id}</td>
//                 <td className="px-6 py-4 flex flex-wrap gap-2 justify-center">
//                   {user.role !== "admin" && (
//                     <button
//                       onClick={() => handleRoleChange(user._id, "admin")}
//                       className="bg-yellow-500 hover:bg-yellow-600 text-black px-3 py-1 rounded text-xs font-semibold"
//                     >
//                       Promote to Admin
//                     </button>
//                   )}
//                   {user.role !== "therapist" && (
//                     <button
//                       onClick={() => handleRoleChange(user._id, "therapist")}
//                       className="bg-green-500 hover:bg-green-600 text-black px-3 py-1 rounded text-xs font-semibold"
//                     >
//                       Promote to Therapist
//                     </button>
//                   )}
//                   {user.role !== "parent" && (
//                     <button
//                       onClick={() => handleRoleChange(user._id, "parent")}
//                       className="bg-blue-500 hover:bg-blue-600 text-black px-3 py-1 rounded text-xs font-semibold"
//                     >
//                       Demote to Parent
//                     </button>
//                   )}
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default AdminDashboard;

//======================================================================

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllUsers } from "../../redux/admin/adminSlice";
// import { motion } from "framer-motion";
// import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
// import EditCreditsModal from "../../components/EditCreditsModal"; // ✅ import modal

// const COLORS = ["#00C49F", "#FF1493"];

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, loading } = useSelector((state) => state.admin);
//   const { currentUser, token } = useSelector((state) => state.user);

//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchAllUsers(token));
//     }
//   }, [dispatch, token]);

//   const handleCreditsUpdated = () => {
//     dispatch(fetchAllUsers(token)); // refresh users list
//   };

//   const stats = [
//     { label: "Total Users", value: users.length },
//     {
//       label: "Total Credits",
//       value: users.reduce((sum, u) => sum + u.credits, 0),
//     },
//     { label: "Admins", value: users.filter((u) => u.role === "admin").length },
//   ];

//   const roleData = [
//     { name: "Users", value: users.filter((u) => u.role === "user").length },
//     { name: "Admins", value: users.filter((u) => u.role === "admin").length },
//   ];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold mb-8 flex items-center gap-2"
//       >
//         👑 Admin Dashboard
//       </motion.h1>

//       {/* Top Stats */}
//       <div className="grid md:grid-cols-3 gap-6 mb-10">
//         {stats.map((s, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: i * 0.2 }}
//             className="bg-gradient-to-r from-cyan-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
//           >
//             <h2 className="text-lg">{s.label}</h2>
//             <p className="text-3xl font-bold">{s.value}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Users Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="overflow-x-auto mb-10"
//       >
//         <table className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
//           <thead>
//             <tr className="bg-gray-700 text-left">
//               <th className="p-3">Username</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Role</th>
//               <th className="p-3">Credits</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr
//                 key={u._id}
//                 className="border-b border-gray-700 hover:bg-gray-700 transition"
//               >
//                 <td className="p-3">{u.username}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3">
//                   {u.role === "admin" ? "👑 Admin" : "👤 User"}
//                 </td>
//                 <td className="p-3">{u.credits}</td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => setSelectedUser(u)}
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                   >
//                     Edit Credits
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>

//       {/* Charts Section */}
//       <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
//         <h2 className="text-2xl font-semibold mb-4">📊 User Roles</h2>
//         <ResponsiveContainer width="100%" height={300}>
//           <PieChart>
//             <Pie
//               data={roleData}
//               cx="50%"
//               cy="50%"
//               outerRadius={100}
//               fill="#8884d8"
//               dataKey="value"
//               label
//             >
//               {roleData.map((entry, index) => (
//                 <Cell
//                   key={`cell-${index}`}
//                   fill={COLORS[index % COLORS.length]}
//                 />
//               ))}
//             </Pie>
//             <Tooltip />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Edit Credits Modal */}
//       {selectedUser && (
//         <EditCreditsModal
//           user={selectedUser}
//           token={token}
//           onClose={() => setSelectedUser(null)}
//           onCreditsUpdated={handleCreditsUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchAllUsers, fetchJobStats } from "../../redux/admin/adminSlice";
// import { motion } from "framer-motion";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import EditCreditsModal from "../../components/EditCreditsModal";

// const COLORS = ["#00C49F", "#FF1493", "#FF6347", "#1E90FF"];

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, jobStats, loading } = useSelector((state) => state.admin);
//   const { token } = useSelector((state) => state.user);

//   const [selectedUser, setSelectedUser] = useState(null);

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchAllUsers(token));
//       dispatch(fetchJobStats(token));
//     }
//   }, [dispatch, token]);

//   const handleCreditsUpdated = () => {
//     dispatch(fetchAllUsers(token));
//   };

//   const stats = [
//     { label: "Total Users", value: users.length },
//     {
//       label: "Total Credits",
//       value: users.reduce((sum, u) => sum + u.credits, 0),
//     },
//     { label: "Admins", value: users.filter((u) => u.role === "admin").length },
//     { label: "Total Jobs", value: jobStats?.totalJobs || 0 },
//     { label: "Success Jobs", value: jobStats?.successJobs || 0 },
//     { label: "Failed Jobs", value: jobStats?.failedJobs || 0 },
//   ];

//   const roleData = [
//     { name: "Users", value: users.filter((u) => u.role === "user").length },
//     { name: "Admins", value: users.filter((u) => u.role === "admin").length },
//   ];

//   const taskUsageData =
//     jobStats?.taskUsage?.map((t) => ({ name: t.task, count: t.count })) || [];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold mb-8 flex items-center gap-2"
//       >
//         👑 Admin Dashboard
//       </motion.h1>

//       {/* Top Stats */}
//       <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
//         {stats.map((s, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: i * 0.1 }}
//             className="bg-gradient-to-r from-cyan-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
//           >
//             <h2 className="text-lg">{s.label}</h2>
//             <p className="text-2xl font-bold">{s.value}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Users Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="overflow-x-auto mb-10"
//       >
//         <table className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
//           <thead>
//             <tr className="bg-gray-700 text-left">
//               <th className="p-3">Username</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Role</th>
//               <th className="p-3">Credits</th>
//               <th className="p-3">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((u) => (
//               <tr
//                 key={u._id}
//                 className="border-b border-gray-700 hover:bg-gray-700 transition"
//               >
//                 <td className="p-3">{u.username}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3">
//                   {u.role === "admin" ? "👑 Admin" : "👤 User"}
//                 </td>
//                 <td className="p-3">{u.credits}</td>
//                 <td className="p-3">
//                   <button
//                     onClick={() => setSelectedUser(u)}
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 px-4 py-2 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                   >
//                     Edit Credits
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </motion.div>

//       {/* Charts Section */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Roles Pie Chart */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">📊 User Roles</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={roleData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label
//               >
//                 {roleData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Job Usage Bar Chart */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">📈 Task Usage</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={taskUsageData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" stroke="#fff" />
//               <YAxis stroke="#fff" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#00C49F" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Edit Credits Modal */}
//       {selectedUser && (
//         <EditCreditsModal
//           user={selectedUser}
//           token={token}
//           onClose={() => setSelectedUser(null)}
//           onCreditsUpdated={handleCreditsUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

//======================================================================

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   deleteUser,
//   fetchJobStats,
// } from "../../redux/admin/adminSlice";
// import { motion } from "framer-motion";
// import {
//   PieChart,
//   Pie,
//   Cell,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Legend,
// } from "recharts";
// import EditCreditsModal from "../../components/EditCreditsModal";

// const COLORS = ["#00C49F", "#FF1493", "#FF6347", "#1E90FF"];

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, jobStats, loading } = useSelector((state) => state.admin);
//   const { token } = useSelector((state) => state.user);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [deleteUserId, setDeleteUserId] = useState(null);

//   // Pagination
//   const [currentPage, setCurrentPage] = useState(1);
//   const usersPerPage = 5;

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchAllUsers(token));
//       dispatch(fetchJobStats(token));
//     }
//   }, [dispatch, token]);

//   const handleCreditsUpdated = () => {
//     dispatch(fetchAllUsers(token));
//   };

//   const handleDeleteUser = async (id) => {
//     if (window.confirm("⚠️ Are you sure you want to delete this user?")) {
//       await dispatch(deleteUser({ id, token }));
//       dispatch(fetchAllUsers(token)); // refresh list
//     }
//   };

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(users.length / usersPerPage);

//   const stats = [
//     { label: "Total Users", value: users.length },
//     {
//       label: "Total Credits",
//       value: users.reduce((sum, u) => sum + u.credits, 0),
//     },
//     { label: "Admins", value: users.filter((u) => u.role === "admin").length },
//     { label: "Total Jobs", value: jobStats?.totalJobs || 0 },
//     { label: "Success Jobs", value: jobStats?.successJobs || 0 },
//     { label: "Failed Jobs", value: jobStats?.failedJobs || 0 },
//   ];

//   const roleData = [
//     { name: "Users", value: users.filter((u) => u.role === "user").length },
//     { name: "Admins", value: users.filter((u) => u.role === "admin").length },
//   ];

//   const taskUsageData =
//     jobStats?.taskUsage?.map((t) => ({ name: t.task, count: t.count })) || [];

//   return (
//     <div className=" min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold mb-8 flex items-center gap-2"
//       >
//         👑 Admin Dashboard
//       </motion.h1>

//       {/* Top Stats */}
//       <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
//         {stats.map((s, i) => (
//           <motion.div
//             key={i}
//             initial={{ opacity: 0, scale: 0.8 }}
//             animate={{ opacity: 1, scale: 1 }}
//             transition={{ delay: i * 0.1 }}
//             className="bg-gradient-to-r from-cyan-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
//           >
//             <h2 className="text-lg">{s.label}</h2>
//             <p className="text-2xl font-bold">{s.value}</p>
//           </motion.div>
//         ))}
//       </div>

//       {/* Users Table */}
//       <motion.div
//         initial={{ opacity: 0, y: 40 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="overflow-x-auto mb-10"
//       >
//         <table className="w-full bg-gray-800 rounded-xl shadow-xl overflow-hidden">
//           <thead>
//             <tr className="bg-gray-700 text-left">
//               <th className="p-3">Username</th>
//               <th className="p-3">Email</th>
//               <th className="p-3">Role</th>
//               <th className="p-3">Credits</th>
//               <th className="p-3 text-center">Actions</th>
//             </tr>
//           </thead>
//           <tbody>
//             {currentUsers.map((u) => (
//               <tr
//                 key={u._id}
//                 className="border-b border-gray-700 hover:bg-gray-700 transition"
//               >
//                 <td className="p-3">{u.username}</td>
//                 <td className="p-3">{u.email}</td>
//                 <td className="p-3">
//                   {u.role === "admin" ? "👑 Admin" : "👤 User"}
//                 </td>
//                 <td className="p-3">{u.credits}</td>
//                 <td className="p-3 flex gap-3 justify-center">
//                   <button
//                     onClick={() => setSelectedUser(u)}
//                     className="bg-gradient-to-r from-cyan-500 to-purple-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                   >
//                     Edit
//                   </button>
//                   <button
//                     onClick={() => handleDeleteUser(u._id)}
//                     className="bg-gradient-to-r from-red-500 to-pink-600 px-3 py-1 rounded-lg hover:shadow-lg hover:scale-105 transition"
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Pagination Controls */}
//         <div className="flex justify-center items-center gap-3 mt-4">
//           <button
//             disabled={currentPage === 1}
//             onClick={() => setCurrentPage((prev) => prev - 1)}
//             className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
//           >
//             Prev
//           </button>
//           <span>
//             Page {currentPage} of {totalPages}
//           </span>
//           <button
//             disabled={currentPage === totalPages}
//             onClick={() => setCurrentPage((prev) => prev + 1)}
//             className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
//           >
//             Next
//           </button>
//         </div>
//       </motion.div>

//       {/* Charts Section */}
//       <div className="grid md:grid-cols-2 gap-6">
//         {/* Roles Pie Chart */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">📊 User Roles</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <PieChart>
//               <Pie
//                 data={roleData}
//                 cx="50%"
//                 cy="50%"
//                 outerRadius={100}
//                 fill="#8884d8"
//                 dataKey="value"
//                 label
//               >
//                 {roleData.map((entry, index) => (
//                   <Cell
//                     key={`cell-${index}`}
//                     fill={COLORS[index % COLORS.length]}
//                   />
//                 ))}
//               </Pie>
//               <Tooltip />
//             </PieChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Job Usage Bar Chart */}
//         <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
//           <h2 className="text-2xl font-semibold mb-4">📈 Task Usage</h2>
//           <ResponsiveContainer width="100%" height={300}>
//             <BarChart data={taskUsageData}>
//               <CartesianGrid strokeDasharray="3 3" />
//               <XAxis dataKey="name" stroke="#fff" />
//               <YAxis stroke="#fff" />
//               <Tooltip />
//               <Legend />
//               <Bar dataKey="count" fill="#00C49F" />
//             </BarChart>
//           </ResponsiveContainer>
//         </div>
//       </div>

//       {/* Edit Credits Modal */}
//       {selectedUser && (
//         <EditCreditsModal
//           user={selectedUser}
//           token={token}
//           onClose={() => setSelectedUser(null)}
//           onCreditsUpdated={handleCreditsUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

//======================================================================

// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import {
//   fetchAllUsers,
//   deleteUser,
//   fetchJobStats,
// } from "../../redux/admin/adminSlice";
// import { motion } from "framer-motion";

// import EditCreditsModal from "../../components/EditCreditsModal";
// import AdminStats from "../../components/admin/AdminStats";
// import UserSearchFilter from "../../components/admin/UserSearchFilter";
// import UserTable from "../../components/admin/UserTable";
// import Pagination from "../../components/admin/Pagination";
// import AdminUsageCharts from "../../components/admin/AdminUsageCharts";

// const AdminDashboard = () => {
//   const dispatch = useDispatch();
//   const { users, jobStats, loading } = useSelector((state) => state.admin);
//   const { token } = useSelector((state) => state.user);

//   const [selectedUser, setSelectedUser] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [sortConfig, setSortConfig] = useState({
//     key: "credits",
//     direction: "desc",
//   });

//   const usersPerPage = 5;

//   useEffect(() => {
//     if (token) {
//       dispatch(fetchAllUsers(token));
//       dispatch(fetchJobStats(token));
//     }
//   }, [dispatch, token]);

//   const handleCreditsUpdated = () => {
//     dispatch(fetchAllUsers(token));
//   };

//   const handleDeleteUser = async (id) => {
//     if (window.confirm("⚠️ Are you sure you want to delete this user?")) {
//       await dispatch(deleteUser({ id, token }));
//       dispatch(fetchAllUsers(token));
//     }
//   };

//   // Filter users
//   const filteredUsers = users.filter(
//     (u) =>
//       u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       u.email.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   // Sort users
//   const sortedUsers = [...filteredUsers].sort((a, b) => {
//     if (sortConfig.key === "credits") {
//       return sortConfig.direction === "asc"
//         ? a.credits - b.credits
//         : b.credits - a.credits;
//     }
//     if (sortConfig.key === "createdAt") {
//       return sortConfig.direction === "asc"
//         ? new Date(a.createdAt) - new Date(b.createdAt)
//         : new Date(b.createdAt) - new Date(a.createdAt);
//     }
//     return 0;
//   });

//   // Pagination logic
//   const indexOfLastUser = currentPage * usersPerPage;
//   const indexOfFirstUser = indexOfLastUser - usersPerPage;
//   const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);
//   const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
//       <motion.h1
//         initial={{ opacity: 0, y: -30 }}
//         animate={{ opacity: 1, y: 0 }}
//         className="text-4xl font-extrabold mb-8 flex items-center gap-2"
//       >
//         👑 Admin Dashboard
//       </motion.h1>

//       {/* Stats */}
//       <AdminStats users={users} jobStats={jobStats} />

//       {/* Search + Filter */}
//       <UserSearchFilter searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

//       {/* Table */}
//       <UserTable
//         users={currentUsers}
//         onEdit={setSelectedUser}
//         onDelete={handleDeleteUser}
//         sortConfig={sortConfig}
//         setSortConfig={setSortConfig}
//       />

//       {/* Pagination */}
//       <Pagination
//         currentPage={currentPage}
//         totalPages={totalPages}
//         setCurrentPage={setCurrentPage}
//       />

//       {/* Charts Section */}
//       <AdminUsageCharts users={users} jobStats={jobStats} />

//       {/* Modal */}
//       {selectedUser && (
//         <EditCreditsModal
//           user={selectedUser}
//           token={token}
//           onClose={() => setSelectedUser(null)}
//           onCreditsUpdated={handleCreditsUpdated}
//         />
//       )}
//     </div>
//   );
// };

// export default AdminDashboard;

// =======================================================================\
//============= admin dashboard with react table update   ==================

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllUsers,
  deleteUser,
  fetchJobStats,
} from "../../redux/admin/adminSlice";
import { motion } from "framer-motion";
import AdminStats from "../../components/admin/AdminStats";
import AdminUsageCharts from "../../components/admin/AdminUsageCharts";
import UserTable from "./../../components/admin/UserTable";
import EditCreditsModal from "../../components/EditCreditsModal";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const { users, jobStats } = useSelector((state) => state.admin);
  const { token } = useSelector((state) => state.user);

  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (token) {
      dispatch(fetchAllUsers(token));
      dispatch(fetchJobStats(token));
    }
  }, [dispatch, token]);

  const handleCreditsUpdated = () => {
    dispatch(fetchAllUsers(token));
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("⚠️ Are you sure you want to delete this user?")) {
      await dispatch(deleteUser({ id, token }));
      dispatch(fetchAllUsers(token));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white p-6">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-extrabold mb-8 flex items-center gap-2"
      >
        👑 Admin Dashboard
      </motion.h1>

      {/* Stats Section */}
      <AdminStats users={users} jobStats={jobStats} />

      {/* Users Table (with sorting, filtering, pagination) */}
      <UserTable
        users={users}
        onEdit={setSelectedUser}
        onDelete={handleDeleteUser}
      />

      {/* Charts Section */}
      <AdminUsageCharts users={users} jobStats={jobStats} />

      {/* Edit Credits Modal */}
      {selectedUser && (
        <EditCreditsModal
          user={selectedUser}
          token={token}
          onClose={() => setSelectedUser(null)}
          onCreditsUpdated={handleCreditsUpdated}
        />
      )}
    </div>
  );
};

export default AdminDashboard;
