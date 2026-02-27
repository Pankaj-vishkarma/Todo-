import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";
import { toast } from "react-toastify";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [reminder, setReminder] = useState("");

  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!title.trim()) {
      setErrorMessage("Title is required");
      toast.error("Title is required");
      return;
    }

    if (title.trim().length < 3) {
      setErrorMessage("Title must be at least 3 characters");
      toast.error("Title must be at least 3 characters");
      return;
    }

    if (dueDate) {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        setErrorMessage("Due date cannot be in the past");
        toast.error("Due date cannot be in the past");
        return;
      }
    }

    if (reminder && dueDate) {
      const reminderDate = new Date(reminder);
      const due = new Date(dueDate);

      if (reminderDate > due) {
        setErrorMessage("Reminder cannot be after due date");
        toast.error("Reminder cannot be after due date");
        return;
      }
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const payload = {
        title: title.trim(),
        description: description?.trim() || "",
        priority,
        category: category?.trim() || "general",
        tags: tags
          ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
        status: "pending",
      };

      if (reminder) {
        payload.reminder = reminder;
      }

      // Only add dueDate if exists
      if (dueDate) {
        payload.dueDate = dueDate;
      }

      await axiosInstance.post("/api/todos", payload);

      toast.success("Task added successfully 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);

    } catch (error) {
      console.error(error);
      const message =
        error?.response?.data?.message || "Failed to add todo.";

      setErrorMessage(message);
      toast.error(message);
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

          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* TITLE */}
            <div className="flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Task Title *
              </label>
              <input
                type="text"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errorMessage) setErrorMessage("");
                }}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Category
              </label>
              <input
                type="text"
                placeholder="e.g. Work, Personal"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>

            {/* DESCRIPTION */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Description
              </label>
              <textarea
                rows="3"
                placeholder="Write task details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono resize-none"
              />
            </div>

            {/* PRIORITY */}
            <div className="flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Priority Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            {/* DUE DATE */}
            <div className="flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>

            {/* REMINDER */}
            <div className="flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Reminder Date (Optional)
              </label>
              <input
                type="date"
                value={reminder}
                onChange={(e) => setReminder(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>

            {/* TAGS */}
            <div className="md:col-span-2 flex flex-col">
              <label className="text-xs text-green-400 mb-1 font-mono">
                Tags
              </label>
              <input
                type="text"
                placeholder="e.g. frontend, urgent, client"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
              />
            </div>

            {/* BUTTONS */}
            <div className="md:col-span-2 flex gap-3 mt-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg font-semibold transition ${loading
                    ? "bg-green-800 text-green-200"
                    : "bg-green-500 text-black hover:bg-green-400"
                  }`}
              >
                <Plus size={16} />
                {loading ? "ADDING..." : "ADD TASK"}
              </button>

              <button
                type="button"
                disabled={loading}
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