import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

const COLORS = ["#00C49F", "#FF1493", "#FF6347", "#1E90FF"];

const AdminUsageCharts = ({ users, jobStats }) => {
  const roleData = [
    { name: "Users", value: users.filter((u) => u.role === "user").length },
    { name: "Admins", value: users.filter((u) => u.role === "admin").length },
  ];

  const taskUsageData =
    jobStats?.taskUsage?.map((t) => ({ name: t.task, count: t.count })) || [];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {/* Roles Pie Chart */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📊 User Roles</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={roleData}
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label
            >
              {roleData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Job Usage Bar Chart */}
      <div className="bg-gray-800 p-6 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">📈 Task Usage</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={taskUsageData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" stroke="#fff" />
            <YAxis stroke="#fff" />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#00C49F" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AdminUsageCharts;
