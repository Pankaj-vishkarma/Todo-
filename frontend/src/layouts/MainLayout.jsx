import React from "react";
import { Link, useNavigate } from "react-router-dom";

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const logoutHandler = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-indigo-600">TodoApp</h1>
        <button
          onClick={logoutHandler}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
        >
          Logout
        </button>
      </nav>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto p-6">
        {children}
      </div>
    </div>
  );
};

export default MainLayout;