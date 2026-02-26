import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-green-400 font-mono">
      <h1 className="text-5xl mb-6">404</h1>
      <p className="mb-6">PAGE NOT FOUND</p>
      <Link
        to="/dashboard"
        className="px-6 py-3 bg-green-500 text-black rounded-xl"
      >
        BACK TO DASHBOARD
      </Link>
    </div>
  );
};

export default NotFound;