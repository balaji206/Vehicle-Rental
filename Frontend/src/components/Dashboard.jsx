import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import carIcon from "../assets/car2.avif";
import userIcon from "../assets/car3.webp";
import revenueIcon from "../assets/car4.avif";
import profilePic from "../assets/user (2).png"; // Your profile image
import API_BASE_URL from "../config/api";

function Dashboard() {
  const [showProfile, setShowProfile] = useState(false);
  const [user, setUser] = useState(null);
  const [rentals, setRentals] = useState([]);
  const [stats, setStats] = useState({ cars: 0, activeRentals: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);
  const popupRef = useRef();
  const navigate = useNavigate();

  // ✅ Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      fetchUserRentals(storedUser.id || 1); // Assuming user ID is 1 for demo if missing in localStorage
    } else {
      // Redirect to login if no user found
      navigate("/login");
    }
  }, [navigate]);

  const fetchUserRentals = async (userId) => {
    try {
      const res = await fetch(`${API_BASE_URL}/rentals/user/${userId}`);
      if (res.ok) {
        const data = await res.json();
        setRentals(data);

        // Calculate simple stats based on user data for demo
        const totalRevenue = data.reduce((sum, rental) => sum + rental.totalAmount, 0);
        setStats({
          cars: new Set(data.map(r => r.vehicle.id)).size,
          activeRentals: data.length,
          revenue: totalRevenue
        });
      }
    } catch (err) {
      console.error("Failed to fetch rentals", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Close popup when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (popupRef.current && !popupRef.current.contains(event.target)) {
        setShowProfile(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ✅ Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-garage-base bg-mesh font-sans">
      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 md:px-16 py-4 glass-garage border-b border-zinc-800 sticky top-0 z-50">
        <div className="text-zinc-100 text-2xl font-extrabold tracking-tight flex items-center gap-2">
          <span className="text-amber-500">⚙️</span> Command Center
        </div>

        <ul className="flex items-center space-x-4 md:space-x-8">
          <li>
            <Link to="/rental">
              <button className="text-zinc-400 hover:text-amber-500 font-bold px-2 py-1 transition duration-300 tracking-wide uppercase text-sm">
                Showroom
              </button>
            </Link>
          </li>

          <li>
            {/* Profile Avatar */}
            <div className="relative" ref={popupRef}>
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center space-x-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 px-3 py-2 rounded-sm transition duration-300 shadow-inner"
              >
                <img
                  src={profilePic}
                  alt="Profile"
                  className="w-8 h-8 rounded-sm object-cover grayscale opacity-80"
                />
                <span className="hidden md:inline font-bold text-amber-500 uppercase tracking-wider text-sm">
                  {user ? user.name : "Operator"}
                </span>
              </button>

              {/* Profile Popup */}
              {showProfile && (
                <div className="absolute right-0 mt-3 w-64 bg-zinc-900 shadow-2xl rounded-sm border border-amber-500/30 overflow-hidden animate-industrial-fade z-50">
                  <div className="p-4 border-b border-zinc-800 bg-zinc-950">
                    <h3 className="text-sm font-black text-amber-500 uppercase tracking-wider">
                      {user?.name || "User"}
                    </h3>
                    <p className="text-xs text-zinc-500 font-mono mt-1">{user?.email}</p>
                  </div>

                  <div className="p-4 space-y-3">
                    <Link
                      to="/profile"
                      className="block text-zinc-400 hover:text-amber-500 font-bold uppercase text-xs tracking-wider"
                    >
                      View Profile
                    </Link>
                    <Link
                      to="/settings"
                      className="block text-zinc-400 hover:text-amber-500 font-bold uppercase text-xs tracking-wider"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full bg-zinc-800 text-amber-500 border border-zinc-700 py-2 rounded-sm hover:bg-zinc-700 transition duration-300 font-black uppercase text-xs tracking-widest mt-2"
                    >
                      System Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </li>
        </ul>
      </nav>

      {/* Main Dashboard */}
      <main className="p-8 md:p-16 relative z-10">
        {/* Welcome Header */}
        <div className="text-center mb-12 animate-industrial-fade">
          <h1 className="text-4xl font-black text-zinc-100 uppercase tracking-tighter">
            System Diagnostics, <span className="text-amber-500">{user ? user.name : "Guest"}</span>.
          </h1>
          <p className="text-zinc-400 mt-2 font-mono text-sm uppercase tracking-widest">
            Telemetry overview of your mechanical assets.
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Card 1 */}
          <div className="border-industrial bg-zinc-900 p-8 rounded-sm shadow-2xl flex flex-col items-center text-center hover:shadow-neon transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-zinc-800 font-mono text-4xl font-black italic">01</div>
            <img src={carIcon} alt="Cars" className="w-16 h-16 rounded-sm mb-4 grayscale contrast-125 relative z-10 border border-zinc-700" />
            <h2 className="text-4xl font-black text-amber-500 font-mono">{stats.cars}</h2>
            <p className="text-zinc-400 mt-2 font-bold uppercase tracking-widest text-xs">Machines Active</p>
          </div>

          {/* Card 2 */}
          <div className="border-industrial bg-zinc-900 p-8 rounded-sm shadow-2xl flex flex-col items-center text-center hover:shadow-neon transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-zinc-800 font-mono text-4xl font-black italic">02</div>
            <img src={userIcon} alt="Users" className="w-16 h-16 rounded-sm mb-4 grayscale contrast-125 relative z-10 border border-zinc-700" />
            <h2 className="text-4xl font-black text-amber-500 font-mono">{stats.activeRentals}</h2>
            <p className="text-zinc-400 mt-2 font-bold uppercase tracking-widest text-xs">Total Logs</p>
          </div>

          {/* Card 3 */}
          <div className="border-industrial bg-zinc-900 p-8 rounded-sm shadow-2xl flex flex-col items-center text-center hover:shadow-neon transition duration-300 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-2 text-zinc-800 font-mono text-4xl font-black italic">03</div>
            <img src={revenueIcon} alt="Revenue" className="w-16 h-16 rounded-sm mb-4 grayscale contrast-125 relative z-10 border border-zinc-700" />
            <h2 className="text-4xl font-black text-amber-500 font-mono">${stats.revenue}</h2>
            <p className="text-zinc-400 mt-2 font-bold uppercase tracking-widest text-xs">Revenue Extracted</p>
          </div>
        </div>

        {/* Recent Rentals Table */}
        <div className="mt-16 max-w-6xl mx-auto border-industrial bg-zinc-900 p-8 rounded-sm shadow-2xl animate-industrial-fade" style={{ animationDelay: '0.2s' }}>
          <h2 className="text-xl font-black text-amber-500 mb-6 uppercase tracking-wider flex items-center gap-2">
            <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            Recent Operations
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-zinc-800 border-y border-zinc-700">
                  <th className="p-4 text-left font-bold text-zinc-400 uppercase tracking-widest text-xs">Operator</th>
                  <th className="p-4 text-left font-bold text-zinc-400 uppercase tracking-widest text-xs">Machine</th>
                  <th className="p-4 text-left font-bold text-zinc-400 uppercase tracking-widest text-xs">Timestamp</th>
                  <th className="p-4 text-left font-bold text-zinc-400 uppercase tracking-widest text-xs">Cycles</th>
                  <th className="p-4 text-left font-bold text-zinc-400 uppercase tracking-widest text-xs">Yield</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-amber-500 font-mono animate-pulse">Running diagnostics...</td>
                  </tr>
                ) : rentals.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-6 text-center text-zinc-500 font-mono">No recent operations detected.</td>
                  </tr>
                ) : (
                  rentals.map((r, i) => (
                    <tr
                      key={r.id || i}
                      className="border-b border-zinc-800 hover:bg-zinc-800/50 transition duration-300 group"
                    >
                      <td className="p-4 font-bold text-zinc-300 uppercase text-sm group-hover:text-amber-500 transition-colors">{r.user?.name || user?.name || "Operator"}</td>
                      <td className="p-4 text-zinc-400 font-mono text-sm">{r.vehicle?.name || "Machine"}</td>
                      <td className="p-4 text-zinc-400 font-mono text-sm">{r.startDate || "N/A"}</td>
                      <td className="p-4 text-zinc-400 font-mono text-sm">{r.durationDays} C</td>
                      <td className="p-4 font-black text-amber-500 font-mono text-sm">${r.totalAmount}</td>
                    </tr>
                  )))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-800 text-zinc-500 text-center py-8 relative z-10 uppercase tracking-widest text-xs font-bold mt-auto">
        © {new Date().getFullYear()} GarageRentals Console. All systems nominal.
      </footer>
    </div>
  );
}

export default Dashboard;
