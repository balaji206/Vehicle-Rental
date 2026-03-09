import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";
import ChatBox from "./ChatBox";
function CarDetails() {
    const { id } = useParams();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const [showChat, setShowChat] = useState(false);

    useEffect(() => {
        const fetchCar = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCar(data);
                } else {
                    console.error("Machine not found in sector.");
                }
            } catch (err) {
                console.error("Telemetry failure:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-amber-500 font-mono tracking-[0.3em] uppercase">
                <div className="w-16 h-16 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mb-8"></div>
                Decrypting machine data...
            </div>
        );
    }

    if (!car) {
        return (
            <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-zinc-500 font-mono tracking-widest uppercase">
                <h1 className="text-4xl font-black mb-4">404_NOT_FOUND</h1>
                <p>Machine ID in valid. Access Denied.</p>
                <Link to="/fleet" className="mt-8 text-amber-500 border border-amber-500/30 px-6 py-2 hover:bg-amber-500 hover:text-black transition-colors">
                    Return to Fleet
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black overflow-x-hidden">
            {/* Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-20 w-full flex-grow">
                <div className="grid lg:grid-cols-2 gap-16">
                    {/* Image Container */}
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-transparent blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                        <div className="relative bg-zinc-900 border border-zinc-800 p-2 overflow-hidden aspect-video">
                            <img
                                src={car.imagePath || 'https://via.placeholder.com/800x600?text=No+Spec+Image'}
                                alt={car.name}
                                className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
                            />
                            <div className="absolute top-4 left-4">
                                <span className="bg-zinc-950/80 backdrop-blur-md text-amber-500 text-[10px] font-black px-4 py-2 border border-zinc-800 uppercase tracking-widest">
                                    UNIT_00{car.id} // SECURED
                                </span>
                            </div>
                        </div>

                        {/* Spec Matrix */}
                        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { label: "Class", value: car.type || "GT" },
                                { label: "Year", value: car.releaseYear || "2024" },
                                { label: "Status", value: "Available" },
                                { label: "Base HP", value: "480+" }
                            ].map((spec, i) => (
                                <div key={i} className="bg-zinc-900/50 border border-zinc-800 p-4">
                                    <span className="block text-[8px] text-zinc-600 font-mono uppercase tracking-[0.3em] mb-1">{spec.label}</span>
                                    <span className="block text-white font-black uppercase text-sm">{spec.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Details & Actions */}
                    <div className="flex flex-col">
                        <div className="mb-12">
                            <span className="text-amber-500 font-mono text-xs tracking-[0.5em] uppercase mb-4 block">// Machine_Specifications</span>
                            <h1 className="text-6xl font-black uppercase tracking-tighter italic mb-4">{car.name}</h1>
                            <p className="text-zinc-500 font-mono text-sm tracking-widest uppercase mb-8 border-l-2 border-amber-500 pl-4">{car.brand} Engineering Systems</p>

                            <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed text-sm mb-12">
                                This {car.type || "high-performance"} model represents the pinnacle of {car.brand}'s commitment to precision and power. Featuring advanced aerodynamics and a high-torque engine configuration, it's designed for operators who demand absolute dominance on the tarmac.
                            </div>

                            <div className="flex items-baseline gap-4 mb-12 py-8 border-y border-zinc-900">
                                <span className="text-5xl font-black text-white">${car.pricePerDay}</span>
                                <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest">/ 24H Cycle Deployment</span>
                            </div>

                            <div className="flex flex-col gap-4">
                                {user?.id === car.ownerId ? (
                                    <Link to="/profile" className="w-full">
                                        <button className="w-full group relative bg-zinc-800 text-amber-500 px-10 py-6 font-black uppercase tracking-[0.4em] overflow-hidden border border-amber-500/20">
                                            <span className="relative z-10">Manage This Machine</span>
                                            <div className="absolute inset-0 bg-amber-500 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                                            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:text-zinc-950 transition-opacity z-20">Access Dashboard</span>
                                        </button>
                                    </Link>
                                ) : (
                                    <Link to={`/book/${car.id}`} className="w-full">
                                        <button className="w-full group relative bg-amber-500 text-zinc-950 px-10 py-6 font-black uppercase tracking-[0.4em] overflow-hidden">
                                            <span className="relative z-10">Initiate Booking Protocol</span>
                                            <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                                        </button>
                                    </Link>
                                )}
                                {user?.id !== car.ownerId && (
                                    <button
                                        onClick={() => setShowChat(!showChat)}
                                        className="w-full border border-zinc-800 text-zinc-500 hover:text-white hover:border-zinc-600 px-10 py-6 font-black uppercase tracking-[0.2em] transition-all duration-300 bg-zinc-900/10"
                                    >
                                        {showChat ? 'Close Comms' : 'Chat with Owner'}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Features Info */}
                        <div className="mt-auto pt-12 border-t border-zinc-900">
                            <h5 className="text-[10px] font-mono text-amber-500/50 uppercase tracking-[0.3em] mb-6">Standard Deployment Features:</h5>
                            <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                                {["GPS Tracking", "Full Insurance", "24/7 Support", "Clean Title", "Unlimited KM", "Zero Deductible"].map((f, i) => (
                                    <li key={i} className="flex items-center gap-3 text-xs text-zinc-500 font-black uppercase tracking-widest">
                                        <span className="w-1.5 h-1.5 bg-amber-500 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.5)]"></span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
                {user && (
                    <ChatBox
                        currentUser={user}
                        receiverId={car.ownerId}
                        otherPartyName={car.ownerId === user.id ? "System Admin" : "Machine Owner"}
                        onClose={() => setShowChat(false)}
                        isVisible={showChat}
                        rentalId={0}
                    />
                )}
            </main>

            {/* Footer */}
            <footer className="bg-zinc-950 border-t border-zinc-900 p-12">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] font-mono text-zinc-600 tracking-widest">©2026 GARAGE_RENTALS_SYSTEMS // ALL RIGHTS RESERVED</p>
                    <div className="flex gap-8 text-[10px] font-black uppercase tracking-widest text-zinc-400">
                        <span className="text-amber-500 uppercase tracking-[0.2em]">Ready For Deployment</span>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default CarDetails;
