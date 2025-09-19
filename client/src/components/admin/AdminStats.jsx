import { motion } from "framer-motion";

const AdminStats = ({ users, jobStats }) => {
  const stats = [
    { label: "Total Users", value: users.length },
    {
      label: "Total Credits",
      value: users.reduce((sum, u) => sum + u.credits, 0),
    },
    { label: "Admins", value: users.filter((u) => u.role === "admin").length },
    { label: "Total Jobs", value: jobStats?.totalJobs || 0 },
    { label: "Success Jobs", value: jobStats?.successJobs || 0 },
    { label: "Failed Jobs", value: jobStats?.failedJobs || 0 },
  ];

  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-6 mb-10">
      {stats.map((s, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-gradient-to-r from-cyan-600 to-purple-700 p-6 rounded-2xl shadow-lg hover:scale-105 transition"
        >
          <h2 className="text-lg">{s.label}</h2>
          <p className="text-2xl font-bold">{s.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default AdminStats;
