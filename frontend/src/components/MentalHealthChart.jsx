import { useEffect, useState } from "react";
import aiApi from "../api/aiApi";
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from "recharts";

const COLORS = ["#4caf50", "#9e9e9e", "#ff9800", "#f44336", "#2196f3"]; 
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
          // Convert AI response 
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

  if (loading) return <p>Loading analysis...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (chartData.length === 0) return <p>No analysis data available.</p>;

  return (
    <div className="w-full h-80 bg-white p-4 rounded-xl shadow-md border">
      <h2 className="text-xl font-semibold mb-4">Mental Health Analysis</h2>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            outerRadius={100}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
    
  );
}
