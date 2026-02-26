import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import MatrixBackground from "../components/MatrixBackground";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/todos?limit=1000");
        const todos = res?.data?.data || [];

        const completed = todos.filter(
          (t) => t.status === "completed"
        ).length;

        setStats({
          total: todos.length,
          completed,
          pending: todos.length - completed,
        });
      } catch (error) {
        console.error("Analytics error:", error);
      }
    };

    fetchData();
  }, []);

  const completionRate =
    stats.total === 0
      ? 0
      : Math.round((stats.completed / stats.total) * 100);

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <MatrixBackground />

      <div className="relative z-20 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl p-5 md:p-6 shadow-[0_0_40px_rgba(0,255,150,0.2)]">

          <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-green-400 font-mono mb-6 tracking-widest">
            ANALYTICS DASHBOARD
          </h1>

          {/* STATS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center font-mono text-sm">

            <div className="bg-black/60 border border-green-500/40 p-4 rounded-xl">
              <p className="text-green-400">TOTAL TASKS</p>
              <p className="text-green-300 text-xl mt-2">
                {stats.total}
              </p>
            </div>

            <div className="bg-black/60 border border-green-500/40 p-4 rounded-xl">
              <p className="text-green-400">COMPLETED</p>
              <p className="text-green-300 text-xl mt-2">
                {stats.completed}
              </p>
            </div>

            <div className="bg-black/60 border border-green-500/40 p-4 rounded-xl">
              <p className="text-green-400">PENDING</p>
              <p className="text-green-300 text-xl mt-2">
                {stats.pending}
              </p>
            </div>

          </div>

          {/* COMPLETION RATE */}
          <div className="mt-6 bg-black/60 border border-green-500/40 p-5 rounded-xl text-center font-mono">
            <p className="text-green-400 text-sm">
              COMPLETION RATE
            </p>
            <p className="text-green-300 text-2xl mt-3">
              {completionRate}%
            </p>
          </div>

          {/* BACK BUTTON */}
          <div className="flex justify-center mt-6">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full md:w-auto px-6 py-2 text-sm rounded-lg bg-green-500 text-black font-semibold hover:bg-green-400 transition"
            >
              BACK TO PANEL
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Analytics;