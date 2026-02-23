import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddTodo = () => {
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/todos", {
        title,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Failed to add todo");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            
            <h4 className="text-center mb-4 fw-bold">Add New Todo</h4>

            <form onSubmit={handleAdd}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Todo Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  placeholder="Enter your todo"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg w-100 rounded-3"
              >
                Add Todo
              </button>
            </form>

            <button
              className="btn btn-outline-secondary w-100 mt-3"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </button>

          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTodo;