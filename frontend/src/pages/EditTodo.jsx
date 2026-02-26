import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";

const EditTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");
  const [category, setCategory] = useState("general");
  const [tags, setTags] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [status, setStatus] = useState("pending");

  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH TODO ================= */
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        setErrorMessage("");

        const res = await axiosInstance.get(`/api/todos/${id}`);
        const todo = res?.data?.data;

        if (!todo) {
          setErrorMessage("Todo not found.");
          return;
        }

        setTitle(todo.title || "");
        setDescription(todo.description || "");
        setPriority(todo.priority || "medium");
        setCategory(todo.category || "general");
        setStatus(todo.status || "pending");
        setDueDate(todo.dueDate ? todo.dueDate.split("T")[0] : "");
        setTags(
          todo.tags && todo.tags.length > 0
            ? todo.tags.join(", ")
            : ""
        );
      } catch (error) {
        console.error(error);
        setErrorMessage("Failed to load todo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  /* ================= UPDATE LOGIC ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMessage("Title cannot be empty.");
      return;
    }

    try {
      setUpdating(true);
      setErrorMessage("");

      await axiosInstance.put(`/api/todos/${id}`, {
        title: title.trim(),
        description: description.trim(),
        priority,
        category: category.trim(),
        status,
        dueDate: dueDate || null,
        tags: tags
          ? tags.split(",").map((tag) => tag.trim())
          : [],
      });

      navigate("/dashboard");
    } catch (error) {
      console.error(error);
      setErrorMessage(
        error?.response?.data?.message ||
          "Failed to update todo."
      );
    } finally {
      setUpdating(false);
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

          {loading ? (
            <div className="text-center py-6 text-green-400 font-mono text-sm">
              LOADING...
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
                className="grid grid-cols-1 md:grid-cols-2 gap-3"
              >

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
                ></textarea>

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

                {/* STATUS */}
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="bg-black/50 border border-green-500/40 text-green-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 font-mono"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
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
                    disabled={updating}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm rounded-lg font-semibold transition ${
                      updating
                        ? "bg-green-800 text-green-200"
                        : "bg-green-500 text-black hover:bg-green-400"
                    }`}
                  >
                    <Plus size={16} />
                    {updating ? "UPDATING..." : "UPDATE"}
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditTodo;