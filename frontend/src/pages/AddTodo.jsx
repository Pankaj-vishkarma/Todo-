import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Title is required");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      await axiosInstance.post("/api/todos", {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim(),
        tags: tags
          ? tags.split(",").map((tag) => tag.trim())
          : [],
        dueDate: dueDate || null,
        status: "pending",
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message || "Failed to add todo."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative h-screen bg-black overflow-hidden">
      <MatrixBackground />

      <div className="relative z-20 h-full flex items-center justify-center px-4">
        <div className="w-full max-w-4xl bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl p-5 md:p-6 shadow-[0_0_40px_rgba(0,255,150,0.2)]">

          <h1 className="text-center text-lg sm:text-xl md:text-2xl font-bold text-green-400 font-mono mb-4 tracking-widest">
            ADD NEW TASK
          </h1>

          {errorMessage && (
            <div className="bg-red-900/40 text-red-400 p-2 rounded-lg mb-4 text-xs sm:text-sm border border-red-500/40 font-mono text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-3">

            {/* TITLE */}
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            />

            {/* CATEGORY */}
            <input
              type="text"
              placeholder="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            />

            {/* DESCRIPTION */}
            <textarea
              rows="3"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="md:col-span-2 bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono resize-none"
            />

            {/* PRIORITY */}
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            {/* DUE DATE */}
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            />

            {/* TAGS */}
            <input
              type="text"
              placeholder="Tags (comma separated)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="md:col-span-2 bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
            />

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-3 mt-2">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg font-semibold transition ${
                  loading
                    ? "bg-green-800 text-green-200"
                    : "bg-green-500 text-black hover:bg-green-400"
                }`}
              >
                <Plus size={16} />
                {loading ? "ADDING..." : "ADD"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 text-green-400 border border-green-500/40 font-mono transition"
              >
                CANCEL
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTodo;