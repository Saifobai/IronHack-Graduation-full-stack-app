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
