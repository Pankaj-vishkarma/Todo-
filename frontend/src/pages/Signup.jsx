import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { User, Mail, Lock, CheckCircle, UserPlus } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Please fill all fields.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const res = await axiosInstance.post(
        "/api/users/register",
        {
          name,
          email,
          password,
          confirmPassword,
        }
      );

      setSuccess(res.data.message || "Signup successful! Redirecting...");

      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-gray-200 py-10">

    {/* Title */}
    <h1 className="text-center text-4xl font-bold underline mb-8">
      Todo App
    </h1>

    {/* Card */}
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-10 border border-gray-200">

      <h2 className="text-2xl font-semibold text-center mb-8">
        Create Your Account
      </h2>

      {error && (
        <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-100 text-green-600 text-sm p-3 rounded-lg mb-6 text-center">
          {success}
        </div>
      )}

      <form onSubmit={handleSignup} className="space-y-6">

        {/* Name */}
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Password */}
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Confirm Password */}
        <div className="relative">
          <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-xl pl-12 pr-4 py-4 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
          />
        </div>

        {/* Signup Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex items-center justify-center gap-2 py-4 rounded-xl text-white font-semibold transition ${
            loading
              ? "bg-indigo-400 cursor-not-allowed"
              : "bg-indigo-600 hover:bg-indigo-700"
          }`}
        >
          <UserPlus size={20} />
          {loading ? "Creating Account..." : "Signup"}
        </button>

      </form>

      <p className="text-center text-sm text-gray-600 mt-8">
        Already have an account?{" "}
        <Link
          to="/"
          className="text-indigo-600 font-semibold hover:underline"
        >
          Login
        </Link>
      </p>

    </div>
  </div>
);
};

export default Signup;