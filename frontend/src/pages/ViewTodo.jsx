import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import MatrixBackground from "../components/MatrixBackground";

const ViewTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH TODO ================= */
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await axiosInstance.get(`/api/todos/${id}`);
        const data = res?.data?.data;

        if (!data) {
          setErrorMessage("Todo not found.");
          return;
        }

        setTodo(data);
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load todo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  /* ================= LOADING ================= */
  if (loading) {
    return (
      <div className="relative h-screen bg-black overflow-hidden">
        <MatrixBackground />
        <div className="relative z-20 h-full flex items-center justify-center text-green-400 font-mono text-sm">
          LOADING DATA...
        </div>
      </div>
    );
  }

  /* ================= ERROR ================= */
  if (errorMessage) {
    return (
      <div className="relative h-screen bg-black overflow-hidden">
        <MatrixBackground />
        <div className="relative z-20 h-full flex items-center justify-center text-red-400 font-mono text-sm text-center px-4">
          {errorMessage}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <MatrixBackground />

      <div className="relative z-20 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl p-5 md:p-6 shadow-[0_0_40px_rgba(0,255,150,0.2)]">

          <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-green-400 font-mono mb-4 tracking-widest">
            TASK DETAILS
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-sm">

            {/* TITLE */}
            <div className="md:col-span-2">
              <p className="text-green-400 mb-1">TITLE</p>
              <p className="text-green-300 break-words">
                {todo.title}
              </p>
            </div>

            {/* CATEGORY */}
            <div>
              <p className="text-green-400 mb-1">CATEGORY</p>
              <p className="text-green-300">
                {todo.category || "General"}
              </p>
            </div>

            {/* STATUS */}
            <div>
              <p className="text-green-400 mb-1">STATUS</p>
              <p
                className={`${
                  todo.status === "completed"
                    ? "text-green-500"
                    : todo.status === "in-progress"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {todo.status?.toUpperCase()}
              </p>
            </div>

            {/* PRIORITY */}
            <div>
              <p className="text-green-400 mb-1">PRIORITY</p>
              <p
                className={`${
                  todo.priority === "high"
                    ? "text-red-500"
                    : todo.priority === "medium"
                    ? "text-yellow-400"
                    : "text-green-400"
                }`}
              >
                {todo.priority?.toUpperCase()}
              </p>
            </div>

            {/* DUE DATE */}
            <div>
              <p className="text-green-400 mb-1">DUE DATE</p>
              <p className="text-green-300">
                {todo.dueDate
                  ? new Date(todo.dueDate).toLocaleDateString()
                  : "No due date"}
              </p>
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2">
              <p className="text-green-400 mb-1">DESCRIPTION</p>
              <p className="text-green-300 break-words">
                {todo.description || "No description available."}
              </p>
            </div>

            {/* TAGS */}
            <div className="md:col-span-2">
              <p className="text-green-400 mb-1">TAGS</p>
              <div className="flex flex-wrap gap-2">
                {todo.tags && todo.tags.length > 0 ? (
                  todo.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs bg-green-900/40 border border-green-500/40 rounded-full text-green-300"
                    >
                      {tag}
                    </span>
                  ))
                ) : (
                  <p className="text-green-300">
                    No tags added.
                  </p>
                )}
              </div>
            </div>

          </div>

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

export default ViewTodo;