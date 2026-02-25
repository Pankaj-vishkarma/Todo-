import React, { useEffect, useState, useMemo } from "react";
import axiosInstance from "../utils/axiosInstance";
import { Link } from "react-router-dom";
import { Plus, Eye, Pencil, Trash2, LogOut } from "lucide-react";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const [filter, setFilter] = useState("all");

  const fetchTodos = async () => {
    const res = await axiosInstance.get("/api/todos");
    setTodos(res.data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleLogout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user"); 
  window.location.href = "/";
};

  const handleToggle = async (id, currentStatus) => {
    try {
      const res = await axiosInstance.put(
  `/api/todos/${id}`,
  { completed: !currentStatus }
);

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, completed: res.data.completed } : todo
        )
      );
    } catch (error) {
      console.error("Failed to update status");
    }
  };

  const handleDelete = async (id) => {
    await axiosInstance.delete(`/api/todos/${id}`);
    setTodos((prev) => prev.filter((t) => t._id !== id));
  };

  const filteredTodos = useMemo(() => {
    if (filter === "completed")
      return todos.filter((t) => t.completed);
    if (filter === "pending")
      return todos.filter((t) => !t.completed);
    return todos;
  }, [todos, filter]);

  return (
    <div className="min-h-screen bg-gray-200 py-10">

      {/* Title */}
      <h1 className="text-center text-4xl font-bold underline mb-8">
        Todo App
      </h1>

      {/* Filter Section */}
      <div className="max-w-6xl mx-auto flex justify-between items-center px-6 mb-10">

  {/* Left Side - Filters */}
  <div className="flex items-center gap-6">

    <Link
      to="/add"
      className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-green-600 transition"
    >
      <Plus size={18} />
      New
    </Link>

    <button
      onClick={() => setFilter("all")}
      className={`font-semibold ${
        filter === "all" ? "text-red-400" : "text-black"
      }`}
    >
      All
    </button>

    <button
      onClick={() => setFilter("pending")}
      className={`font-semibold ${
        filter === "pending" ? "text-red-400" : "text-black"
      }`}
    >
      Pending
    </button>

    <button
      onClick={() => setFilter("completed")}
      className={`font-semibold ${
        filter === "completed" ? "text-red-400" : "text-black"
      }`}
    >
      Completed
    </button>

  </div>

  {/* Right Side - Logout */}
  <button
    onClick={handleLogout}
    className="flex items-center gap-2 bg-red-500 text-white px-5 py-2 rounded-full shadow-md hover:bg-red-600 transition"
  >
    <LogOut size={18} />
    Logout
  </button>

</div>

      {/* If No Todo */}
      {filteredTodos.length === 0 ? (
        <div className="text-center mt-20 text-lg">
          No Todo Found.
        </div>
      ) : (
        /* Todo Grid */
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 px-6">

          {filteredTodos.map((todo) => (
            <div
              key={todo._id}
              className="bg-white border border-gray-400 rounded-lg p-4 flex justify-between items-center shadow-sm hover:shadow-md transition"
            >
              {/* Left Side */}
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={todo.completed || false}
                  onChange={() => handleToggle(todo._id, todo.completed)}
                  className="w-5 h-5 cursor-pointer"
                />
                <span className="text-lg font-medium">
                  {todo.title}
                </span>
              </div>

              {/* Right Icons */}
              <div className="flex gap-3">
                <Link
                  to={`/view/${todo._id}`}
                  className="bg-blue-600 p-2 rounded-md text-white hover:opacity-80 transition"
                >
                  <Eye size={18} />
                </Link>

                <Link
                  to={`/edit/${todo._id}`}
                  className="bg-yellow-500 p-2 rounded-md text-white hover:opacity-80 transition"
                >
                  <Pencil size={18} />
                </Link>

                <button
                  onClick={() => handleDelete(todo._id)}
                  className="bg-red-500 p-2 rounded-md text-white hover:opacity-80 transition"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}

        </div>
      )}

    </div>
  );
};

export default Dashboard;