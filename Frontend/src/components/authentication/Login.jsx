import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import API_BASE_URL from "../../config/api";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleGoBack = () => {
    window.history.back();
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Signing in...");

    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const data = await res.json();

        // ✅ Store user details
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: data.id,
            name: data.name,
            email: data.email,
            token: data.token,
            role: data.role
          })
        );

        setMessage(`✅ Welcome back, ${data.name}!`);

        if (data.role === 'OWNER') {
          navigate("/owner-dashboard");
        } else {
          navigate("/renter-dashboard");
        }
      } else {
        const error = await res.text();
        setMessage(`⚠️ Login failed: ${error}`);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="min-h-screen bg-garage-base bg-mesh flex items-center justify-center p-4 font-sans relative">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-[100px] pointer-events-none"></div>

      <Link to='/'>
        <button
          onClick={handleGoBack}
          className="absolute top-6 left-6 p-3 rounded-sm text-amber-500 bg-zinc-900 border border-zinc-700 hover:bg-zinc-800 transition duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500 shadow-xl z-20"
          aria-label="Go back"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </Link>

      <div className="w-full max-w-md glass-garage border-industrial p-8 md:p-10 rounded-sm animate-industrial-fade relative z-10">
        <h2 className="text-4xl font-black text-amber-500 text-center mb-2 uppercase tracking-tight">
          System Login
        </h2>
        <p className="text-center text-zinc-400 mb-8 font-mono text-xs uppercase tracking-widest">
          Authenticate to access terminal.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Operator Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={form.email}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-sm shadow-inner focus:ring-amber-500 focus:border-amber-500 font-medium"
              placeholder="operator@garagerentals.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-zinc-400 uppercase tracking-widest mb-2">
              Passcode
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={form.password}
              onChange={handleChange}
              className="w-full p-3 bg-zinc-800 border border-zinc-700 text-zinc-100 rounded-sm shadow-inner focus:ring-amber-500 focus:border-amber-500 font-medium tracking-widest"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-zinc-600 rounded-sm shadow-neon text-lg font-black text-zinc-900 bg-amber-500 hover:bg-amber-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-zinc-900 focus:ring-amber-500 transition duration-300 uppercase tracking-widest"
          >
            Engage
          </button>
        </form>

        <p className="text-center mt-6 text-amber-500 font-mono text-sm tracking-wider">{message}</p>

        <div className="mt-8 text-center border-t border-zinc-800 pt-6">
          <p className="text-xs text-zinc-500 font-mono uppercase tracking-widest">
            Unregistered operator?
            <a href="/signup" className="font-bold text-amber-500 hover:text-amber-400 ml-2 bg-zinc-800 px-2 py-1 rounded-sm border border-zinc-700">
              Create ID
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
