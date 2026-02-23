import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditTodo = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTodo = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/todos");
        const single = res.data.find((t) => t._id === id);
        if (single) setTitle(single.title);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTodo();
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/todos/${id}`, {
        title,
      });

      navigate("/dashboard");
    } catch (error) {
      alert("Failed to update todo");
    }
  };

  return (
    <div className="container-fluid bg-light min-vh-100 d-flex align-items-center">
      <div className="row w-100 justify-content-center">
        <div className="col-11 col-sm-8 col-md-6 col-lg-4">
          <div className="card shadow-lg border-0 rounded-4 p-4">
            
            <h4 className="text-center mb-4 fw-bold">Edit Todo</h4>

            <form onSubmit={handleUpdate}>
              <div className="mb-3">
                <label className="form-label fw-semibold">
                  Todo Title
                </label>
                <input
                  type="text"
                  className="form-control form-control-lg"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                className="btn btn-warning btn-lg w-100 rounded-3"
              >
                Update Todo
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

export default EditTodo;