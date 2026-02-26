import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, LogOut } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  /* ================= FETCH TODOS ================= */
  const fetchTodos = async () => {
    const res = await axiosInstance.get("/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  /* ================= TOGGLE ================= */
  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.put(`/api/todos/${id}`, {
        completed: !currentStatus,
      });

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id
            ? { ...todo, completed: res.data.completed }
            : todo
        )
      );
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    await axiosInstance.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  /* ================= FILTER ================= */
  const filteredTodos = useMemo(() => {
    if (filter === "completed")
      return todos.filter((t) => t.completed);
    if (filter === "pending")
      return todos.filter((t) => !t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* MATRIX BACKGROUND */}
      <MatrixBackground />

      {/* CONTENT */}
      <div className="relative z-20 min-h-screen px-4 sm:px-6 md:px-10 py-10">

        {/* Title */}
        <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 font-mono mb-10 tracking-widest">
          TODO CONTROL PANEL
        </h1>

        {/* Filter Section */}
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:justify-between md:items-center gap-6 mb-10">

          <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start">

            <Link
              to="/add"
              className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-full shadow-[0_0_15px_rgba(0,255,150,0.6)] hover:bg-green-400 transition text-sm sm:text-base"
            >
              <Plus size={18} />
              NEW
            </Link>

            {["all", "pending", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`font-mono uppercase text-sm sm:text-base ${
                  filter === type
                    ? "text-green-400"
                    : "text-green-200 hover:text-green-400"
                }`}
              >
                {type}
              </button>
            ))}

          </div>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-500 transition text-sm sm:text-base"
          >
            <LogOut size={18} />
            LOGOUT
          </button>

        </div>

        {/* Todos */}
        {filteredTodos.length === 0 ? (
          <div className="text-center mt-20 text-green-400 font-mono text-base sm:text-lg">
            NO DATA FOUND
          </div>
        ) : (
          <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {filteredTodos.map((todo) => (
              <div
                key={todo._id}
                className="bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-xl p-5 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow-[0_0_20px_rgba(0,255,150,0.2)] hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <input
                    type="checkbox"
                    checked={todo.completed || false}
                    onChange={() =>
                      handleToggle(todo._id, todo.completed)
                    }
                    className="w-5 h-5 accent-green-500 cursor-pointer"
                  />
                  <span
                    className={`font-mono text-base sm:text-lg break-words ${
                      todo.completed
                        ? "line-through text-green-600"
                        : "text-green-300"
                    }`}
                  >
                    {todo.title}
                  </span>
                </div>

                <div className="flex gap-3 justify-end">
                  <Link
                    to={`/view/${todo._id}`}
                    className="bg-blue-600 p-2 rounded-md text-white hover:opacity-80 transition"
                  >
                    <Eye size={16} />
                  </Link>

                  <Link
                    to={`/edit/${todo._id}`}
                    className="bg-yellow-500 p-2 rounded-md text-black hover:opacity-80 transition"
                  >
                    <Pencil size={16} />
                  </Link>

                  <button
                    onClick={() => handleDelete(todo._id)}
                    className="bg-red-600 p-2 rounded-md text-white hover:opacity-80 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Dashboard;