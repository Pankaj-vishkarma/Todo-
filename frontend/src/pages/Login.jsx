import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, LogIn } from "lucide-react";
import MatrixBackground from "../components/MatrixBackground";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  /* ================= LOGIN LOGIC (UNCHANGED) ================= */
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError("Please fill all fields.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const res = await axiosInstance.post("/api/users/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      if (err.response && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Invalid credentials or server error.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* MATRIX BACKGROUND */}
      <MatrixBackground />

      {/* CONTENT */}
      <div className="relative z-20 min-h-screen flex items-center justify-center px-4 sm:px-6 md:px-10 py-10">

        <div className="w-full max-w-md bg-black/70 backdrop-blur-xl border border-green-500/40 rounded-3xl shadow-[0_0_40px_rgba(0,255,150,0.2)] p-6 sm:p-8 md:p-10 transition-all duration-300">

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-8 text-green-400 tracking-widest font-mono">
            SYSTEM LOGIN
          </h2>

          {error && (
            <div className="bg-red-900/40 text-red-400 text-sm p-3 rounded-xl mb-6 text-center border border-red-500/40 font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">

            <div className="relative">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                size={18}
              />
              <input
                type="email"
                placeholder="Enter Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/50 border border-green-500/40 text-green-300 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-mono"
              />
            </div>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400"
                size={18}
              />
              <input
                type="password"
                placeholder="Enter Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/50 border border-green-500/40 text-green-300 rounded-xl pl-10 sm:pl-12 pr-4 py-3 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-all duration-300 font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-semibold transition-all duration-300 ${
                loading
                  ? "bg-green-800 cursor-not-allowed text-green-200"
                  : "bg-green-500 text-black hover:bg-green-400 active:scale-[0.98] shadow-[0_0_20px_rgba(0,255,150,0.6)]"
              }`}
            >
              <LogIn size={18} />
              {loading ? "AUTHENTICATING..." : "ACCESS SYSTEM"}
            </button>

          </form>

          <p className="text-center text-sm text-green-400 mt-8 font-mono">
            New User?{" "}
            <Link
              to="/signup"
              className="hover:text-green-200 transition-colors duration-300 underline"
            >
              Register
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
};

export default Login;