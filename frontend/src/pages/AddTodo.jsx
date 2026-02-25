import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
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

      await axiosInstance.post(
        "/api/todos",
        { title, description }
      );

      navigate("/dashboard");
    } catch (error) {
      setErrorMessage("Failed to add todo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-200 py-10">

      {/* Title */}
      <h1 className="text-center text-4xl font-bold underline mb-4">
        Todo App
      </h1>

      <h2 className="text-center text-2xl font-semibold mb-8">
        Add New Todo
      </h2>

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-10">

        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-3 rounded-lg mb-4 text-sm">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleAdd} className="space-y-6">

          {/* Title Input */}
          <input
            type="text"
            placeholder="Enter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-black rounded-xl px-6 py-4 text-lg focus:outline-none"
          />

          {/* Description Textarea */}
          <textarea
            rows="6"
            placeholder="Enter Description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-black rounded-xl px-6 py-4 text-lg focus:outline-none"
          ></textarea>

          {/* Buttons */}
          <div className="flex justify-center gap-8 pt-4">

            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-3 px-10 py-4 text-lg rounded-xl text-white font-semibold ${loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
                }`}
            >
              <Plus size={22} />
              {loading ? "Adding..." : "Add"}
            </button>

            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="px-10 py-4 text-lg rounded-xl bg-gray-600 hover:bg-gray-700 text-white font-semibold"
            >
              Cancel
            </button>

          </div>
        </form>

      </div>
    </div>
  );
};

export default AddTodo;