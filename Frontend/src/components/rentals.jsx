import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";

function Rentals() {
  const [rentalFleet, setRentalFleet] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/vehicles`);
        if (res.ok) {
          const data = await res.json();
          setRentalFleet(data);
        }
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  const handleBook = async (car) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      alert("ACCESS DENIED: Please authenticate to book a machine.");
      return;
    }
    if (user.role === 'OWNER' && car.ownerId === user.id) {
      alert("ACTION PROHIBITED: Self-rental prohibited. Machine must be listed for external deployment.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/rentals`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || 1, // fallback to 1 if missing for demo
          vehicleId: car.id,
          startDate: new Date().toISOString().split('T')[0],
          durationDays: 3 // Default 3 days for demo purposes
        })
      });
      if (res.ok) {
        alert(`SUCCESS: Telemetry linked. ${car.name} is scheduled for deployment.`);
        navigate('/renter-dashboard');
      } else {
        alert(`ERROR: Deployment failed.`);
      }
    } catch (err) {
      console.error(err);
      alert(`CRITICAL ERROR: Connection lost.`);
    }
  };

  const RentalCard = ({ car, onBook }) => (
    <div className="group glass-premium hover:border-amber-500/50 overflow-hidden relative transition-all duration-500 animate-industrial">
      <div className="overflow-hidden relative h-56 bg-zinc-900">
        <img
          src={car.image}
          alt={car.name}
          className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700"
        />
        <div className="absolute top-4 left-4 bg-zinc-950/80 backdrop-blur-sm px-3 py-1 text-[10px] font-mono text-amber-500 border border-zinc-800 uppercase tracking-widest z-10">
          STATUS: READY
        </div>
      </div>
      <div className="p-6 relative">
        <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_10px_10px,_var(--tw-gradient-stops))] from-white to-transparent shadow-[inset_0_0_20px_rgba(0,0,0,1)] pointer-events-none"></div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tighter group-hover:text-amber-500 transition-colors">{car.name}</h3>
        <p className="text-zinc-500 text-xs font-mono uppercase tracking-widest mt-1 mb-4">{car.details}</p>
        <div className="flex justify-between items-center border-t border-zinc-800/50 pt-4 mt-2 z-10 relative">
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em] mb-1">Standard Rate</span>
            <p className="text-white text-2xl font-black tracking-tighter">${car.pricePerDay} <span className="text-xs text-amber-500 font-bold tracking-normal">/ DAY</span></p>
          </div>
          <Link to={`/car-details/${car.id}`} className="bg-zinc-900 border border-zinc-800 hover:border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-zinc-950 p-3 transition-all relative group/btn">
            <span className="absolute -top-8 right-0 bg-zinc-950 text-amber-500 border border-amber-500/30 text-[8px] font-mono px-2 py-1 opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap tracking-widest uppercase">
              View Machine Details
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </Link>

        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Scanline Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <Navbar />

      {/* Page Header */}
      <header className="text-center py-24 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
        <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-7xl font-black text-white mb-4 uppercase tracking-tighter italic">
            Showroom <span className="text-amber-500">Inventory</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm uppercase tracking-widest">
            Select your machine and hit the ignition. <br /><span className="text-amber-500">High-performance models authorized for deployment.</span>
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen relative z-20 py-12 px-8 bg-zinc-950 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filter */}
          <aside className="lg:w-1/4 backdrop-blur-md bg-zinc-950/80 border border-zinc-900 p-8 h-fit relative rounded-none shadow-2xl">
            <h3 className="text-xl font-black text-white mb-8 border-b border-zinc-800 pb-4 uppercase tracking-tighter">
              Diagnostics
            </h3>

            <div className="space-y-8">
              {/* Vehicle Type */}
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-3 uppercase tracking-[0.2em]">
                  Select Class
                </label>
                <select className="w-full p-4 bg-zinc-950 border border-zinc-700 text-zinc-100 rounded-none focus:outline-none focus:border-amber-500 font-medium uppercase text-sm tracking-widest cursor-pointer hover:border-zinc-500 transition-colors">
                  <option>All Classes</option>
                  <option>SUV / Heavy</option>
                  <option>Hatchback / Light</option>
                  <option>Sedan / Standard</option>
                  <option>Motorcycle / 2W</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs font-mono text-zinc-500 mb-3 uppercase tracking-[0.2em]">
                  Power Limit (Max $)
                </label>
                <input
                  type="range"
                  min="30"
                  max="100"
                  defaultValue="100"
                  className="w-full h-1 bg-zinc-800 rounded-none appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-xs text-amber-500 mt-4 font-mono font-bold tracking-[0.2em]">LIMIT VALUE: <span className="text-white">$100</span></p>
              </div>

              <button className="w-full bg-zinc-950 text-amber-500 border border-amber-500/50 hover:bg-amber-500 hover:text-zinc-950 text-sm py-4 rounded-none font-black uppercase tracking-[0.2em] transition-all duration-300">
                Calibrate Array
              </button>
            </div>
          </aside>

          {/* Car Grid */}
          <section className="lg:w-3/4">
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading ? (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-center border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
                  <div className="w-12 h-12 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                  <div className="text-amber-500 font-mono text-sm tracking-[0.3em] uppercase animate-pulse">
                    Initiating telemetry handshake...
                  </div>
                </div>
              ) : rentalFleet.length === 0 ? (
                <div className="col-span-full text-center py-20 border border-zinc-900 bg-zinc-950/50 backdrop-blur-sm">
                  <div className="text-zinc-600 font-mono text-sm uppercase tracking-widest">
                    WARN: No machines available in this sector.
                  </div>
                </div>
              ) : (
                rentalFleet.map((car, index) => (
                  <RentalCard key={car.id || index} car={{ ...car, image: car.imagePath || 'https://via.placeholder.com/300x200?text=No+Image' }} onBook={handleBook} />
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-16 pt-8 border-t border-zinc-800/50 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-[1px] bg-amber-500"></div>
              <button className="bg-transparent text-amber-500 border border-amber-500/30 hover:border-amber-500 font-black px-12 py-4 rounded-none uppercase tracking-[0.2em] hover:bg-amber-500/10 transition-colors text-xs">
                Load More Units +
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 p-12 mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">©2026 GARAGE_RENTALS_SYSTEMS // ALL RIGHTS RESERVED</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <span className="text-amber-500">SYSTEMS ON</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Rentals;
