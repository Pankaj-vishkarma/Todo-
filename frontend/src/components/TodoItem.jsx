import React from "react";
import { Link } from "react-router-dom";

const TodoItem = ({ todo, onDelete }) => {
  return (
    <div className="card shadow-sm border-0 rounded-4 h-100">
      <div className="card-body d-flex flex-column justify-content-between">
        <h5 className="card-title">{todo.title}</h5>

        <div className="d-flex justify-content-between mt-3">
          <Link
            to={`/edit/${todo._id}`}
            className="btn btn-sm btn-warning"
          >
            Edit
          </Link>

          <button
            onClick={() => onDelete(todo._id)}
            className="btn btn-sm btn-danger"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TodoItem;