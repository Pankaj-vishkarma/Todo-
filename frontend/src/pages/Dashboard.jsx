import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import TodoItem from "../components/TodoItem";

const Dashboard = () => {
  const [todos, setTodos] = useState([]);
  const navigate = useNavigate();

  const fetchTodos = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/todos");
      setTodos(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/todos/${id}`);
    fetchTodos();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="container-fluid bg-light min-vh-100">
      
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center p-3 bg-white shadow-sm">
        <h4 className="mb-0 fw-bold">My Dashboard</h4>
        <div>
          <Link to="/add" className="btn btn-primary me-2">
            + Add Todo
          </Link>
          <button onClick={handleLogout} className="btn btn-outline-danger">
            Logout
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="container py-4">
        <div className="row">
          {todos.length === 0 ? (
            <div className="text-center mt-5">
              <h5 className="text-muted">No Todos Found</h5>
            </div>
          ) : (
            todos.map((todo) => (
              <div key={todo._id} className="col-12 col-md-6 col-lg-4 mb-4">
                <TodoItem
                  todo={todo}
                  onDelete={handleDelete}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;