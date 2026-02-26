import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";

const ViewTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);

  /* ================= FETCH TODO (UNCHANGED) ================= */
  useEffect(() => {
    const fetchTodo = async () => {
      const res = await axiosInstance.get(`/api/todos/${id}`);
      setTodo(res.data);
    };

    fetchTodo();
  }, [id]);

  if (!todo)
    return (
      <div className="relative min-h-screen bg-black overflow-x-hidden">
        <MatrixBackground />
        <div className="relative z-20 min-h-screen flex items-center justify-center text-green-400 font-mono text-lg sm:text-xl">
          LOADING DATA...
        </div>
      </div>
    );

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* MATRIX BACKGROUND */}
      <MatrixBackground />

      {/* CONTENT */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 py-10">

        <div className="w-full max-w-3xl bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl shadow-[0_0_40px_rgba(0,255,150,0.2)] p-6 sm:p-8 md:p-10 transition-all duration-300">

          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 font-mono mb-8 tracking-widest">
            TASK DETAILS
          </h1>

          <div className="space-y-6 sm:space-y-8 font-mono">

            <div>
              <p className="text-green-400 text-base sm:text-lg mb-2">
                TITLE:
              </p>
              <p className="text-green-300 text-lg sm:text-xl break-words">
                {todo.title}
              </p>
            </div>

            <div>
              <p className="text-green-400 text-base sm:text-lg mb-2">
                DESCRIPTION:
              </p>
              <p className="text-green-300 text-base sm:text-lg leading-relaxed break-words">
                {todo.description || "No description available."}
              </p>
            </div>

          </div>

          <div className="flex justify-center mt-8 sm:mt-10">
            <button
              onClick={() => navigate("/dashboard")}
              className="px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-xl bg-green-500 text-black font-semibold hover:bg-green-400 active:scale-[0.98] shadow-[0_0_20px_rgba(0,255,150,0.6)] transition-all duration-300"
            >
              BACK TO PANEL
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ViewTodo;