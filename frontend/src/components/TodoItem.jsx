import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Pencil, Trash2, Check, X } from "lucide-react";

const TodoItem = ({ todo, onDelete }) => {
  const [confirming, setConfirming] = useState(false);

  return (
    <div className="group relative bg-white rounded-3xl p-[1px] transition duration-300 hover:scale-[1.02]">

      {/* Gradient Border Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 blur-sm transition duration-500"></div>

      <div className="relative bg-white rounded-3xl shadow-md group-hover:shadow-2xl transition duration-300 p-6 flex flex-col justify-between h-full">

        {/* Title + Status */}
        <div>
          <div className="flex justify-between items-start gap-3">
            <h3 className="text-lg font-semibold text-gray-800 leading-relaxed break-words">
              {todo.title}
            </h3>

            {todo.completed !== undefined && (
              <span
                className={`px-3 py-1 text-xs font-semibold rounded-full ${
                  todo.completed
                    ? "bg-green-100 text-green-600"
                    : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {todo.completed ? "Completed" : "Pending"}
              </span>
            )}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-between items-center mt-6">

          <Link
            to={`/edit/${todo._id}`}
            className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm hover:shadow-md"
          >
            <Pencil size={16} />
            Edit
          </Link>

          {confirming ? (
            <div className="flex gap-2 animate-fadeIn">
              <button
                onClick={() => onDelete(todo._id)}
                className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-2 rounded-xl transition shadow-sm"
              >
                <Check size={16} />
                Confirm
              </button>

              <button
                onClick={() => setConfirming(false)}
                className="flex items-center gap-2 border border-gray-300 text-gray-600 text-sm px-3 py-2 rounded-xl hover:bg-gray-100 transition"
              >
                <X size={16} />
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirming(true)}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded-xl transition shadow-sm hover:shadow-md"
            >
              <Trash2 size={16} />
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TodoItem;