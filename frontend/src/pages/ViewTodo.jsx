import React, { useEffect, useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useParams, useNavigate } from "react-router-dom";

const ViewTodo = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [todo, setTodo] = useState(null);

  useEffect(() => {
    const fetchTodo = async () => {
      const res = await axiosInstance.get(
        `/api/todos/${id}`
      );
      setTodo(res.data);
    };

    fetchTodo();
  }, [id]);

  if (!todo)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-200">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-200 py-10">

      {/* Title */}
      <h1 className="text-center text-4xl font-bold underline mb-4">
        Todo App
      </h1>

      {/* Subheading */}
      <h2 className="text-center text-2xl font-semibold mb-8">
        Details Todo
      </h2>

      {/* Card */}
      <div className="max-w-3xl mx-auto bg-gray-100 border border-gray-300 rounded-2xl shadow-lg p-10">

        <div className="space-y-6">

          <p className="text-xl">
            <span className="font-bold">Title:</span>{" "}
            <span className="text-gray-700">{todo.title}</span>
          </p>

          <div>
            <p className="text-xl font-bold mb-2">Description:</p>
            <p className="text-gray-600 leading-relaxed">
              {todo.description || "No description available."}
            </p>
          </div>

        </div>

        {/* Back Button */}
        <button
          onClick={() => navigate("/dashboard")}
          className="mt-10 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-8 py-3 rounded-xl shadow-md transition"
        >
          Back
        </button>

      </div>

    </div>
  );
};

export default ViewTodo;