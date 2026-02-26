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
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  /* ================= FETCH TODO (UNCHANGED) ================= */
  useEffect(() => {
    const fetchTodo = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/api/todos/${id}`);
        setTitle(res.data.title);
        setDescription(res.data.description || "");
      } catch (error) {
        setErrorMessage("Failed to load todo.");
      } finally {
        setLoading(false);
      }
    };

    fetchTodo();
  }, [id]);

  /* ================= UPDATE LOGIC (UNCHANGED) ================= */
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
        title,
        description,
      });

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Failed to update todo.");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* MATRIX BACKGROUND */}
      <MatrixBackground />

      {/* CONTENT */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 py-10">

        <div className="w-full max-w-3xl bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl shadow-[0_0_40px_rgba(0,255,150,0.2)] p-6 sm:p-8 md:p-10 transition-all duration-300">

          <h1 className="text-center text-2xl sm:text-3xl md:text-4xl font-bold text-green-400 font-mono mb-6 tracking-widest">
            UPDATE TASK
          </h1>

          {loading ? (
            <div className="text-center py-10 text-green-400 font-mono">
              LOADING...
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="bg-red-900/40 text-red-400 p-3 rounded-xl mb-6 text-sm border border-red-500/40 font-mono">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleUpdate} className="space-y-6">

                <input
                  type="text"
                  placeholder="Enter Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-black/50 border border-green-500/40 text-green-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-mono"
                />

                <textarea
                  rows="6"
                  placeholder="Enter Description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-black/50 border border-green-500/40 text-green-300 rounded-xl px-4 sm:px-6 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-mono resize-none"
                ></textarea>

                <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8 pt-4">

                  <button
                    type="submit"
                    disabled={updating}
                    className={`flex items-center justify-center gap-3 px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-xl font-semibold transition-all duration-300 ${
                      updating
                        ? "bg-green-800 cursor-not-allowed text-green-200"
                        : "bg-green-500 text-black hover:bg-green-400 active:scale-[0.98] shadow-[0_0_20px_rgba(0,255,150,0.6)]"
                    }`}
                  >
                    <Plus size={20} />
                    {updating ? "UPDATING..." : "UPDATE TASK"}
                  </button>

                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="px-6 sm:px-10 py-3 sm:py-4 text-base sm:text-lg rounded-xl bg-gray-800 hover:bg-gray-700 text-green-400 font-semibold border border-green-500/40 font-mono transition-all duration-300"
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