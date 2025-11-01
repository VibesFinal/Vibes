import { useEffect, useState } from "react";
import aiApi from "../api/aiApi";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const COLORS = ["#22c55e", "#a1a1aa", "#f59e0b", "#ef4444", "#3b82f6"]; 
// [positive, neutral, anxious, depressive, stressed]

export default function MentalHealthChart({ userId }) {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchAnalysis = async () => {
      try {
        const res = await aiApi.analyzeUser(userId);

        if (res.chartData) {
          const formatted = Object.entries(res.chartData).map(([key, value]) => ({
            name: key,
            value: value,
          }));
          setChartData(formatted);
        }
      } catch (err) {
        console.error("❌ AI Analysis error:", err);
        setError("Failed to fetch analysis.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalysis();
  }, [userId]);

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl shadow-inner">
        <Loader2 className="w-8 h-8 text-blue-500 animate-spin mb-2" />
        <p className="text-gray-600 font-medium">Analyzing your mental health...</p>
      </div>
    );

  if (error)
    return (
      <div className="p-6 bg-white border border-red-200 rounded-2xl shadow-sm text-center">
        <p className="text-red-600 font-semibold">{error}</p>
      </div>
    );

  if (chartData.length === 0)
    return (
      <div className="p-6 bg-white rounded-2xl shadow-sm text-center">
        <p className="text-gray-500">No analysis data available yet.</p>
      </div>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="bg-gradient-to-br from-white via-blue-50 to-green-50 border border-gray-100 shadow-lg rounded-3xl p-6 hover:shadow-2xl transition-shadow duration-500"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-gray-800 tracking-tight">
          🧠 Mental Health Overview
        </h2>
        <span className="text-sm text-gray-500 font-medium">
          AI-Generated Analysis
        </span>
      </div>

      {/* 👇 Reduced height for a smaller chart */}
      <div className="w-full h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
              outerRadius={85}   // 👈 smaller outer radius
              innerRadius={45}   // 👈 smaller inner radius
              paddingAngle={3}
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#fff"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#ffffffdd",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              }}
            />
            <Legend
              wrapperStyle={{
                fontSize: "0.85rem",
                fontWeight: 500,
                paddingTop: "10px",
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}
