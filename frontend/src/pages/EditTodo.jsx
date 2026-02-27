import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";
import { toast } from "react-toastify";

const EditTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [reminder, setReminder] = useState("");
  const [status, setStatus] = useState("pending");

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH TODO ================= */
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await axiosInstance.get(`/api/todos/${id}`);
        const todo = res?.data?.data;

        if (!todo) {
          setErrorMessage("Todo not found");
          return;
        }

        setTitle(todo.title || "");
        setDescription(todo.description || "");
        setPriority(todo.priority || "medium");
        setCategory(todo.category || "general");
        setStatus(todo.status || "pending");
        setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
        setReminder(todo.reminder ? todo.reminder.split("T")[0] : "");
        setTags(todo.tags?.length ? todo.tags.join(", ") : "");
      } catch (error) {
        setErrorMessage("Failed to load todo.");
      } finally {
        setFetching(false);
      }
    };

    fetchTodo();
  }, [id]);

  /* ================= UPDATE ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!title.trim()) {
      setErrorMessage("Title is required");
      toast.error("Title is required");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");

      const payload = {
        title: title.trim(),
        description: description?.trim() || "",
        priority,
        category: category?.trim() || "general",
        status,
        tags: tags
          ? tags.split(",").map((tag) => tag.trim()).filter(Boolean)
          : [],
      };

      if (dueDate) payload.dueDate = dueDate;
      if (reminder) payload.reminder = reminder;

      await axiosInstance.put(`/api/todos/${id}`, payload);

      toast.success("Task updated successfully 🎉");

      setTimeout(() => {
        navigate("/dashboard");
      }, 800);
    } catch (error) {
      const message =
        error?.response?.data?.message || "Failed to update todo.";

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
            UPDATE TASK
          </h1>

          {fetching ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-500"></div>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-red-900/40 text-red-400 p-2 rounded-lg mb-4 text-xs sm:text-sm border border-red-500/40 font-mono text-center">
                  {errorMessage}
                </div>
              )}

              <form
                onSubmit={handleUpdate}
                className="grid grid-cols-1 md:grid-cols-2 gap-4"
              >

                {/* TITLE */}
                <div className="flex flex-col">
                  <label className="text-xs text-green-400 mb-1 font-mono">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    placeholder="Enter task title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
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

                {/* STATUS */}
                <div className="flex flex-col">
                  <label className="text-xs text-green-400 mb-1 font-mono">
                    Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
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
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg font-semibold transition ${
                      loading
                        ? "bg-green-800 text-green-200"
                        : "bg-green-500 text-black hover:bg-green-400"
                    }`}
                  >
                    <Plus size={16} />
                    {loading ? "UPDATING..." : "UPDATE TASK"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTodo;