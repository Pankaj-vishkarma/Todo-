import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import MatrixBackground from "../components/MatrixBackground";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get("/api/todos/analytics");
        setStats(res?.data?.data || null);
      } catch (error) {
        console.error("Analytics error:", error);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <MatrixBackground />

      <div className="relative z-20 h-full max-w-7xl mx-auto px-4 py-6 flex flex-col">

        <h1 className="text-center text-xl md:text-2xl font-bold text-green-400 font-mono mb-6 tracking-widest">
          ANALYTICS DASHBOARD
        </h1>

        {loading ? (
          <div className="flex flex-1 justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500 border-opacity-50"></div>
          </div>
        ) : stats ? (
          <div className="flex-1 flex flex-col justify-between">

            {/* ===== SUMMARY CARDS ===== */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <StatCard title="TOTAL" value={stats.total} />
              <StatCard title="DONE" value={stats.completed} />
              <StatCard title="PENDING" value={stats.total - stats.completed} />
              <StatCard title="ARCHIVED" value={stats.archived} />
            </div>

            {/* ===== COMPLETION RATE ===== */}
            <div className="bg-black/60 border border-green-500/40 rounded-xl p-4 mb-6 shadow-md">
              <p className="text-green-400 text-xs font-mono text-center mb-2">
                COMPLETION RATE
              </p>

              <div className="w-full bg-black/40 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-green-500 h-3 transition-all duration-700"
                  style={{ width: `${stats.completionRate}%` }}
                ></div>
              </div>

              <p className="text-green-300 text-center mt-2 font-mono text-lg">
                {stats.completionRate}%
              </p>
            </div>

            {/* ===== BREAKDOWN ===== */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1 overflow-hidden">

              <BreakdownCard
                title="STATUS"
                data={stats.statusBreakdown}
              />

              <BreakdownCard
                title="PRIORITY"
                data={stats.priorityBreakdown}
              />

              <BreakdownCard
                title="CATEGORY"
                data={stats.categoryBreakdown}
              />

            </div>
          </div>
        ) : (
          <div className="flex flex-1 justify-center items-center text-red-400">
            Failed to load analytics
          </div>
        )}

        {/* BACK BUTTON */}
        <div className="flex justify-center mt-4">
          <button
            onClick={() => navigate("/dashboard")}
            className="px-6 py-2 text-sm rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
          >
            BACK
          </button>
        </div>

      </div>
    </div>
  );
};

/* ================= SMALL COMPONENTS ================= */

const StatCard = ({ title, value }) => (
  <div className="bg-black/60 border border-green-500/40 p-4 rounded-xl shadow-sm text-center hover:shadow-green-500/20 transition">
    <p className="text-green-400 text-xs font-mono">{title}</p>
    <p className="text-green-300 text-xl mt-1 font-bold">{value}</p>
  </div>
);

const BreakdownCard = ({ title, data }) => (
  <div className="bg-black/60 border border-green-500/40 p-4 rounded-xl shadow-sm flex flex-col">
    <h3 className="text-green-400 text-xs font-mono mb-3 text-center">
      {title}
    </h3>

    <div className="flex-1 overflow-y-auto pr-1">
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div
            key={index}
            className="flex justify-between text-green-300 text-sm py-1 border-b border-green-500/10 last:border-none"
          >
            <span className="capitalize truncate">{item._id}</span>
            <span>{item.count}</span>
          </div>
        ))
      ) : (
        <p className="text-center text-green-300/60 text-sm">
          No Data
        </p>
      )}
    </div>
  </div>
);

export default Analytics;