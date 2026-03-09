import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";

function Home() {
  const videoRef = useRef(null);
  const [fleetData, setFleetData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.error("Autoplay failed:", error);
      });
    }

    const fetchVehicles = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/vehicles`);
        if (res.ok) {
          const data = await res.json();
          // Only take first 4 for the home page
          setFleetData(data.slice(0, 4));
        }
      } catch (err) {
        console.error("Failed to fetch vehicles", err);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
      {/* Scanline Overlay Effect */}
      <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

      <Navbar />

      {/* Hero Section */}

      {/* Hero Section */}
      <header className="relative h-[90vh] flex flex-col justify-center items-center px-8 overflow-hidden border-b border-zinc-900">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          className="absolute inset-0 w-full h-full object-cover z-0 grayscale-[0.3] brightness-[0.4] scale-110"
        >
          <source src="/bmw-m4-comp-g82-jaw-dropping-turbo-beast-owns-the-road-720p_aHirHwx0.mp4" type="video/mp4" />
        </video>

        {/* Deep Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-750 via-zinc-650/90 to-transparent z-10"></div>
        <div className="absolute inset-0 bg-zinc-350/40 mix-blend-multiply z-10"></div>

        <div className="relative z-20 text-center max-w-5xl px-4">
          <div className="mb-8 flex justify-center items-center gap-4">
            <span className="h-[1px] w-12 bg-amber-500/50"></span>
            <span className="text-amber-500 font-mono text-[10px] tracking-[0.5em] uppercase">Manual Override Active</span>
            <span className="h-[1px] w-12 bg-amber-500/50"></span>
          </div>

          <h1 className="text-7xl md:text-[8rem] font-black leading-[0.8] uppercase tracking-tighter mb-8 italic">
            Precision <br />
            <span className="text-transparent stroke-text bg-clip-text bg-gradient-to-b from-amber-400 to-amber-700 animate-pulse">Engineering</span>
          </h1>

          <p className="text-zinc-400 text-sm md:text-lg max-w-2xl mx-auto mb-12 font-light tracking-[0.1em] leading-relaxed uppercase">
            Curated performance. Tactical deployment. <br />
            <span className="text-white font-bold">The premier ecosystem for high-fidelity vehicle rentals.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link to="/showroom">
              <button className="group relative bg-amber-500 text-zinc-950 px-16 py-6 font-black uppercase tracking-[0.2em] overflow-hidden w-full sm:w-auto">
                <span className="relative z-10">Access Showroom</span>
                <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
              </button>
            </Link>
            <Link to="/fleet">
              <button className="border border-zinc-700 hover:border-amber-500 px-16 py-6 font-black uppercase tracking-[0.2em] backdrop-blur-sm transition-all duration-300 w-full sm:w-auto">
                View Fleet
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* Info Section: Fleet vs Garage */}
      <section className="py-24 bg-zinc-950 border-b border-zinc-900 relative">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h2 className="text-5xl font-black uppercase tracking-tighter italic animate-industrial">
                The <span className="text-amber-500">Distinction</span>
              </h2>
              <div className="space-y-6">
                <div className="p-8 glass-premium border-l-4 border-amber-500 animate-industrial [animation-delay:200ms]">
                  <h4 className="text-xl font-black uppercase mb-2 text-glow">The Fleet (The Arsenal)</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Our global inventory of high-performance machines. Every vehicle in the Fleet is maintained to military-grade standards, ready for immediate deployment. Browse the full manifest to find your perfect match.
                  </p>
                </div>
                <div className="p-8 glass-premium border-l-4 border-zinc-700 animate-industrial [animation-delay:400ms]">
                  <h4 className="text-xl font-black uppercase mb-2">The Garage (Owner & Renter Ops)</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    The Garage is where operations happen. For Owners, it's the control center for their assets. For Renters, it's their personal history and active deployments. It's the localized hub for your rental lifecycle.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative aspect-video bg-zinc-900 border border-zinc-800 overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center grayscale opacity-50 group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-transparent to-transparent"></div>
              <div className="absolute bottom-8 left-8">
                <p className="text-[10px] font-mono text-amber-500 tracking-[0.4em] uppercase mb-2">// System_Overview</p>
                <p className="text-2xl font-black uppercase">Operational <br /> Excellence</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ticker Bar */}
      <div className="bg-amber-500 py-3 overflow-hidden whitespace-nowrap border-y border-zinc-900 relative z-30">
        <div className="flex animate-marquee">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="text-zinc-950 font-black text-xs uppercase tracking-[0.4em] mx-10">
              High Torque Required • No Speed Limits • Premium Unleaded Only • High Torque Required •
            </span>
          ))}
        </div>
      </div>


      {/* Stats Section with Grid Background */}
      <section className="py-24 bg-zinc-950 relative border-b border-zinc-900 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:40px_40px]">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { label: "Horsepower Avg", value: "450+" },
            { label: "Deployment Rate", value: "98%" },
            { label: "Ready Frames", value: "142" },
            { label: "Support Nodes", value: "24/7" }
          ].map((stat, i) => (
            <div key={i} className="group cursor-crosshair">
              <p className="text-zinc-600 font-mono text-[10px] uppercase mb-2 tracking-widest group-hover:text-amber-500 transition-colors">// {stat.label}</p>
              <h3 className="text-5xl font-black tracking-tighter group-hover:translate-x-2 transition-transform">{stat.value}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* Main Fleet - Redesigned Cards */}
      <section className="py-32 px-8 max-w-7xl mx-auto">
        <div className="flex items-center gap-6 mb-20">
          <h2 className="text-6xl font-black uppercase tracking-tighter italic">The <span className="text-amber-500">Arsenal</span></h2>
          <div className="h-[2px] flex-grow bg-zinc-900 relative">
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-amber-500 rotate-45"></div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-amber-500 font-mono tracking-widest uppercase animate-pulse">
              Loading Arsenal Data...
            </div>
          ) : fleetData.length === 0 ? (
            <div className="col-span-full py-12 text-center text-zinc-500 font-mono tracking-widest uppercase">
              Arsenal currently empty.
            </div>
          ) : (
            fleetData.map((car, i) => (
              <div key={car.id || i} className="relative group bg-zinc-900 border border-zinc-800 p-2 hover:border-amber-500/50 transition-all duration-500">
                <div className="relative h-72 overflow-hidden">
                  <img src={car.imagePath || 'https://via.placeholder.com/300x400?text=No+Image'} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-110" alt={car.name} />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4">
                    <span className="bg-amber-500 text-zinc-950 text-[10px] font-black px-2 py-1 uppercase tracking-widest">Available</span>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-xl font-black uppercase tracking-tighter truncate w-3/4">
                      {car.name}
                    </h4>
                    <span className="font-mono text-amber-500 text-xs">#00{car.id || i + 1}</span>
                  </div>
                  <div className="flex items-end justify-between border-t border-zinc-800 pt-4">
                    <p className="text-2xl font-black">${car.pricePerDay}<span className="text-[10px] text-zinc-500 ml-1">/24H</span></p>
                    <Link to={`/car-details/${car.id}`}>
                      <button className="text-[10px] font-black uppercase tracking-widest text-amber-500 hover:text-white transition-colors">Select Machine +</button>
                    </Link>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Why Section - Cyberpunk Style */}
      <section className="bg-zinc-900 py-32 px-8 relative overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-3 gap-0 border border-zinc-800">
          {[
            { title: "Peak Torque", desc: "Engines tuned for immediate response and raw acceleration." },
            { title: "256-Bit Security", desc: "Biometric ignition and GPS tracking on every single unit." },
            { title: "Rapid Swap", desc: "Maintenance issues? We swap your vehicle in under 60 minutes." }
          ].map((item, i) => (
            <div key={i} className="p-12 border-zinc-800 border-r last:border-r-0 hover:bg-zinc-950 transition-all duration-500 group">
              <h5 className="text-amber-500 font-mono text-xs mb-6 tracking-[0.3em]">PROTOCOL_0{i + 1}</h5>
              <h3 className="text-2xl font-black uppercase mb-4 group-hover:text-amber-500 transition-colors">{item.title}</h3>
              <p className="text-zinc-500 text-sm leading-relaxed tracking-wide">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="py-40 text-center relative px-8">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-amber-500 to-transparent"></div>
        <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-10 italic">Start the <span className="text-amber-500 underline decoration-zinc-800 underline-offset-8">Engine</span></h2>
        <Link to="/signup">
          <button className="group relative bg-transparent border border-amber-500/50 text-amber-500 px-20 py-8 font-black uppercase tracking-[0.4em] hover:text-zinc-950 transition-colors duration-500">
            <span className="relative z-10">Initialize Protocol</span>
            <div className="absolute inset-0 bg-amber-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
          </button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-zinc-950 border-t border-zinc-900 p-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-[10px] font-mono text-zinc-600 tracking-widest">©2026 GARAGE_RENTALS_SYSTEMS // ALL RIGHTS RESERVED</p>
          <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
            <a href="#" className="hover:text-amber-500 transition-colors">Privacy</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Terms</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Emergency_Contact</a>
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          animation: marquee 25s linear infinite;
        }
        .stroke-text {
          -webkit-text-stroke: 1px rgba(245, 158, 11, 0.5);
        }
      `}</style>
    </div>
  );
}

export default Home;