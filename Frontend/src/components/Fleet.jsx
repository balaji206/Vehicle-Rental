import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";

function Fleet() {
    const [fleetData, setFleetData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVehicles = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/vehicles`);
                if (res.ok) {
                    const data = await res.json();
                    setFleetData(data);
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
            {/* Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <Navbar />

            {/* Page Header */}

            {/* Page Header */}
            <header className="text-center py-24 bg-zinc-900 border-b border-zinc-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none"></div>
                <div className="absolute top-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-50"></div>
                <div className="relative z-10">
                    <h1 className="text-7xl font-black text-white mb-4 uppercase tracking-tighter italic">
                        Full <span className="text-amber-500">Fleet</span> Manifest
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto font-mono text-sm uppercase tracking-widest">
                        Complete database of all authorized vehicles. <br /><span className="text-amber-500">Awaiting operator selection.</span>
                    </p>
                </div>
            </header>

            {/* Fleet Grid */}
            <main className="max-w-7xl mx-auto px-8 py-20 flex-grow w-full">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {loading ? (
                        <div className="col-span-full py-20 text-center text-amber-500 font-mono tracking-widest uppercase animate-pulse">
                            Loading Fleet Data...
                        </div>
                    ) : fleetData.length === 0 ? (
                        <div className="col-span-full py-20 text-center text-zinc-500 font-mono tracking-widest uppercase">
                            No vehicles found in the fleet.
                        </div>
                    ) : (
                        fleetData.map((car, i) => (
                            <Link key={car.id || i} to={`/car-details/${car.id}`} className="group glass-premium hover:border-amber-500/50 transition-all duration-500 p-4 relative overflow-hidden block animate-industrial">
                                <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-[30px] group-hover:bg-amber-500/20 transition-colors"></div>

                                <div className="aspect-video overflow-hidden relative mb-6 border border-zinc-900">
                                    <img src={car.imagePath || 'https://via.placeholder.com/300x200?text=No+Image'} alt={car.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105" />
                                    <div className="absolute bottom-2 left-2 bg-zinc-950 text-amber-500 text-[8px] font-black px-2 py-1 uppercase tracking-widest border border-zinc-800">
                                        TELEMETRY_LINKED
                                    </div>
                                    <div className="absolute bottom-2 right-2 bg-zinc-950 text-white text-[10px] font-black px-2 py-1 uppercase tracking-widest border border-zinc-800">
                                        CLASS: {car.type || "GT"}
                                    </div>
                                </div>

                                <div className="relative z-10">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter mb-1 group-hover:text-amber-500 transition-colors">{car.name}</h3>
                                    <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-6">{car.brand} // Unit 00{car.id}</p>

                                    <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-6">
                                        <div>
                                            <span className="block text-[10px] text-zinc-600 font-black tracking-widest uppercase mb-1">Daily Rate</span>
                                            <span className="block text-amber-500 font-mono text-sm">${car.pricePerDay}</span>
                                        </div>
                                        <div>
                                            <span className="block text-[10px] text-zinc-600 font-black tracking-widest uppercase mb-1">Release</span>
                                            <span className="block text-white font-mono text-sm">{car.releaseYear}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    )}
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

export default Fleet;
