import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "sonner";
import { LogIn } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (res.ok) {
        login(data.token, data.user);
        toast.success("Welcome back!");
        navigate("/shop");
      } else {
        toast.error(data.error || "Login failed");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-24">
      <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-serif font-bold text-neutral-900">Welcome Back</h1>
          <p className="text-neutral-500">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Email</label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-neutral-700">Password</label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-neutral-900"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white py-4 rounded-full font-bold hover:bg-neutral-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <LogIn className="w-5 h-5" />
            <span>{loading ? "Signing in..." : "Sign In"}</span>
          </button>
        </form>

        <p className="text-center text-sm text-neutral-500">
          Don't have an account? <Link to="/register" className="font-bold text-neutral-900 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
