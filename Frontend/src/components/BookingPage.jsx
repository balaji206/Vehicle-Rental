import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";

function BookingPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [car, setCar] = useState(null);
    const [loading, setLoading] = useState(true);
    const [bookingData, setBookingData] = useState({
        startDate: new Date().toISOString().split("T")[0],
        durationDays: 1,
    });
    const [processing, setProcessing] = useState(false);

    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }

        const fetchCar = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/vehicles/${id}`);
                if (res.ok) {
                    const data = await res.json();

                    // Safety Check: Owner cannot book their own machine
                    if (data.ownerId === user.id) {
                        alert("SECURITY_ALERT: Self-deployment prohibited. Redirecting to Management Hub.");
                        navigate("/profile");
                        return;
                    }

                    setCar(data);
                }
            } catch (err) {
                console.error("Telemetry failure:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchCar();
    }, [id, user, navigate]);

    const handleBooking = async (e) => {
        e.preventDefault();
        setProcessing(true);

        try {
            const res = await fetch(`${API_BASE_URL}/rentals`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: user.id || 1,
                    vehicleId: id,
                    startDate: bookingData.startDate,
                    durationDays: parseInt(bookingData.durationDays),
                }),
            });

            if (res.ok) {
                alert(`SUCCESS: Booking confirmed. Machine deployment scheduled.`);
                navigate("/renter-dashboard");
            } else {
                alert("CRITICAL ERROR: Deployment authorization failed.");
            }
        } catch (err) {
            console.error(err);
            alert("CONNECTION_LOST: Failed to reach command center.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-amber-500 font-mono tracking-widest uppercase">
                Verifying machine availability...
            </div>
        );
    }

    if (!car) return null;

    const totalCost = car.pricePerDay * bookingData.durationDays;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
            {/* Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <Navbar />

            <main className="flex-grow flex items-center justify-center py-20 px-4">
                <div className="w-full max-w-4xl grid md:grid-cols-2 bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                    <div className="absolute top-0 left-0 w-full h-1 bg-amber-500"></div>

                    {/* Machine Summary */}
                    <div className="p-12 border-b md:border-b-0 md:border-r border-zinc-800 bg-zinc-950/50">
                        <h2 className="text-3xl font-black uppercase tracking-tighter italic mb-8">
                            Deployment <span className="text-amber-500">Manifest</span>
                        </h2>

                        <div className="space-y-6">
                            <div className="aspect-video glass-premium border border-zinc-800 overflow-hidden group">
                                <img src={car.imagePath || 'https://via.placeholder.com/800x600?text=Registry+Missing'} alt={car.name} className="w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 transition-all duration-700 hover:scale-105" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold uppercase">{car.name}</h3>
                                <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">{car.brand} // UNIT_00{car.id}</p>
                            </div>
                            <div className="pt-6 border-t border-zinc-800 space-y-4">
                                <div className="flex justify-between text-sm uppercase">
                                    <span className="text-zinc-500 font-mono">Rate per cycle</span>
                                    <span className="text-white font-black">${car.pricePerDay}</span>
                                </div>
                                <div className="flex justify-between text-sm uppercase">
                                    <span className="text-zinc-500 font-mono">Service Fee</span>
                                    <span className="text-white font-black">$0.00</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Booking Form */}
                    <div className="p-12">
                        <h2 className="text-xl font-black uppercase tracking-widest text-amber-500 mb-8">// Initializing_Protocol</h2>

                        <form onSubmit={handleBooking} className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2">Deployment Start</label>
                                <input
                                    type="date"
                                    value={bookingData.startDate}
                                    min={new Date().toISOString().split("T")[0]}
                                    onChange={e => setBookingData({ ...bookingData, startDate: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none font-mono uppercase text-xs"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-mono text-zinc-500 uppercase tracking-[0.2em] mb-2">Operation Duration (Days)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="30"
                                    value={bookingData.durationDays}
                                    onChange={e => setBookingData({ ...bookingData, durationDays: e.target.value })}
                                    className="w-full bg-zinc-950 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none font-mono uppercase text-xs"
                                    required
                                />
                            </div>

                            <div className="pt-8 border-t border-zinc-800">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-[0.3em]">Total Logistics Cost:</span>
                                    <span className="text-3xl font-black text-amber-500">${totalCost}</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full group relative bg-amber-500 text-zinc-950 py-6 font-black uppercase tracking-[0.4em] overflow-hidden disabled:bg-zinc-800 disabled:text-zinc-600"
                                >
                                    <span className="relative z-10">{processing ? "Processing..." : "Confirm Deployment"}</span>
                                    <div className="absolute inset-0 bg-white translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
                                </button>

                                <Link to={`/car-details/${id}`} className="block text-center mt-6 text-[10px] font-mono text-zinc-600 uppercase tracking-widest hover:text-white transition-colors">
                                    Abort Calibration
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <footer className="p-8 text-center bg-zinc-950 border-t border-zinc-900 border-opacity-50">
                <p className="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">Encryption Mode: HIGH_TORQUE_256 // GARAGE_RENTALS</p>
            </footer>
        </div>
    );
}

export default BookingPage;
