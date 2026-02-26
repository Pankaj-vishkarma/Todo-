import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { User, ChevronDown } from "lucide-react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  LogOut,
  BarChart3,
} from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";

const Dashboard = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [archived, setArchived] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ================= FETCH TODOS ================= */
  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await axiosInstance.get("/api/todos", {
        params: {
          page,
          limit: 6,
          search,
          priority: priorityFilter,
          archived,
          status: filter !== "all" ? filter : undefined,
        },
      });

      const data = res?.data || {};
      setTodos(data?.data || []);
      setTotalPages(data?.pages || 1);
    } catch (err) {
      console.error(err);
      setError("Failed to load todos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchTodos();
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [page, search, priorityFilter, archived, filter]);

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target)
    ) {
      setDropdownOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
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
      const newStatus =
        currentStatus === "completed" ? "pending" : "completed";

      await axiosInstance.put(`/api/todos/${id}`, {
        status: newStatus,
      });

      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  /* ================= ARCHIVE ================= */
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">
      <MatrixBackground />

      <div className="relative z-20 min-h-screen px-4 sm:px-6 lg:px-12 py-8">

        {/* HEADER */}
        <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">

          {/* Left Side */}
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-400 font-mono tracking-widest">
            TODO CONTROL PANEL
          </h1>

          {/* Right Side */}
          <div className="flex items-center gap-4">

            <Link
              to="/add"
              className="flex items-center gap-2 bg-green-500 text-black px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-400 transition shadow-md"
            >
              <Plus size={16} />
              NEW
            </Link>

            <Link
              to="/analytics"
              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-500 transition shadow-md"
            >
              <BarChart3 size={16} />
              ANALYTICS
            </Link>

            {/* PROFILE DROPDOWN */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-black/60 border border-green-500/30 px-3 py-2 rounded-lg hover:bg-black/80 transition"
              >
                <User size={18} className="text-green-400" />
                <ChevronDown size={16} className="text-green-400" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-black/90 border border-green-500/30 rounded-lg shadow-lg backdrop-blur-xl z-50">

                  <button
                    onClick={() => {
                      setDropdownOpen(false);
                      handleLogout();
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-900/40 transition rounded-lg"
                  >
                    Logout
                  </button>

                </div>
              )}
            </div>

          </div>
        </div>

        {/* FILTER BAR */}
        <div className="max-w-7xl mx-auto bg-black/60 backdrop-blur-xl border border-green-500/30 rounded-xl p-4 mb-8 shadow-lg">

          <div className="flex flex-col lg:flex-row gap-4">

            <input
              type="text"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => {
                setPage(1);
                setSearch(e.target.value);
              }}
              className="flex-1 bg-black/50 border border-green-500/30 text-green-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            <select
              value={priorityFilter}
              onChange={(e) => {
                setPage(1);
                setPriorityFilter(e.target.value);
              }}
              className="bg-black/50 border border-green-500/30 text-green-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button
              onClick={() => {
                setPage(1);
                setArchived(!archived);
              }}
              className="bg-gray-800 text-green-400 px-4 py-2 rounded-lg text-sm border border-green-500/30 hover:bg-gray-700 transition"
            >
              {archived ? "Show Active" : "Show Archived"}
            </button>
          </div>

          {/* STATUS FILTER */}
          <div className="flex gap-6 mt-4 text-sm font-mono">
            {["all", "pending", "completed"].map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`uppercase transition ${filter === type
                    ? "text-green-400 font-bold"
                    : "text-green-200 hover:text-green-400"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="text-center text-green-400 font-mono">
            Loading...
          </div>
        )}

        {error && (
          <div className="text-center text-red-500 font-mono">
            {error}
          </div>
        )}

        {/* TASK GRID */}
        {!loading && todos.length === 0 ? (
          <div className="text-center mt-20 text-green-400 font-mono text-sm">
            NO DATA FOUND
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">

            {todos.map((todo) => (
              <div
                key={todo._id}
                className="bg-black/70 border border-green-500/30 rounded-xl p-5 flex flex-col justify-between shadow-lg hover:shadow-green-500/20 transition-all duration-300"
              >

                <div className="flex items-start gap-3 mb-4">
                  <input
                    type="checkbox"
                    checked={todo.status === "completed"}
                    onChange={() =>
                      handleToggle(todo._id, todo.status)
                    }
                    className="w-4 h-4 accent-green-500 mt-1"
                  />

                  <div>
                    <p
                      className={`font-semibold text-sm ${todo.status === "completed"
                          ? "line-through text-green-600"
                          : "text-green-300"
                        }`}
                    >
                      {todo.title}
                    </p>
                  </div>
                </div>

                <div className="flex justify-between items-center">

                  <span
                    className={`text-xs px-2 py-1 rounded-md ${todo.priority === "high"
                        ? "bg-red-900/40 text-red-400"
                        : todo.priority === "medium"
                          ? "bg-yellow-900/40 text-yellow-400"
                          : "bg-green-900/40 text-green-400"
                      }`}
                  >
                    {todo.priority}
                  </span>

                  <div className="flex gap-2">
                    <Link
                      to={`/view/${todo._id}`}
                      className="bg-blue-600 p-2 rounded-md hover:opacity-80 transition"
                    >
                      <Eye size={14} />
                    </Link>

                    <Link
                      to={`/edit/${todo._id}`}
                      className="bg-yellow-500 p-2 rounded-md hover:opacity-80 transition"
                    >
                      <Pencil size={14} />
                    </Link>

                    <button
                      onClick={() => handleDelete(todo._id)}
                      className="bg-red-600 p-2 rounded-md hover:opacity-80 transition"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}

          </div>
        )}

        {/* PAGINATION */}
        <div className="flex justify-center items-center gap-6 mt-10 text-sm font-mono">
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
            className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
          >
            PREV
          </button>

          <span className="text-green-400">
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-800 text-green-400 rounded-lg disabled:opacity-40 hover:bg-gray-700 transition"
          >
            NEXT
          </button>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;