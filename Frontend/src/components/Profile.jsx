import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "./Navbar";
import API_BASE_URL from "../config/api";

function Profile() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));
    const [vehicles, setVehicles] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        name: '', type: 'SUV', pricePerDay: '', details: '', brand: '', releaseYear: '', imagePath: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate("/login");
            return;
        }
        if (user.role === 'OWNER') {
            fetchOwnedVehicles();
        }
    }, [user, navigate]);

    const fetchOwnedVehicles = async () => {
        try {
            const userId = user?.id || 1;
            const res = await fetch(`${API_BASE_URL}/vehicles/owner/${userId}`);
            if (res.ok) setVehicles(await res.json());
        } catch (err) {
            console.error("Error fetching vehicles", err);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setNewVehicle({ ...newVehicle, imagePath: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleRegisterVehicle = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { ...newVehicle, ownerId: user?.id || 1 };
            const res = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${user.token}`
                },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewVehicle({ name: '', type: 'SUV', pricePerDay: '', details: '', brand: '', releaseYear: '', imagePath: '' });
                setImagePreview(null);
                fetchOwnedVehicles();
                alert("SUCCESS: Machine registered in the Arsenal.");
            } else {
                alert("ERROR: Registration failed.");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
            {/* Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-[100] opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>

            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-12 w-full">
                <header className="mb-12 border-b border-zinc-900 pb-8 flex justify-between items-end">
                    <div>
                        <span className="text-amber-500 font-mono text-[10px] tracking-[0.5em] uppercase mb-4 block">// Profile_Access</span>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">{user.name}</h1>
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">{user.email} // Role: {user.role}</p>
                    </div>
                    {user.role === 'OWNER' && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="bg-amber-500 text-zinc-950 font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-colors"
                        >
                            + Register Machine
                        </button>
                    )}
                </header>

                {user.role === 'OWNER' && (
                    <section className="mt-16">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-8 border-b border-zinc-900 pb-4">Managed <span className="text-amber-500">Assets</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {vehicles.length === 0 ? (
                                <p className="col-span-full py-20 text-center text-zinc-600 font-mono uppercase tracking-widest bg-zinc-900/10 border border-zinc-800 border-dashed">No machines registered in your sector.</p>
                            ) : (
                                vehicles.map(v => (
                                    <div key={v.id} className="bg-zinc-900/50 border border-zinc-800 p-6 group hover:border-amber-500 transition-colors">
                                        <div className="aspect-video bg-zinc-950 mb-4 overflow-hidden border border-zinc-800">
                                            <img src={v.imagePath || 'https://via.placeholder.com/400x300?text=Machine+Log+Missing'} alt={v.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                                        </div>
                                        <h3 className="text-xl font-bold uppercase mb-1">{v.name}</h3>
                                        <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest mb-4">{v.brand} // {v.type}</p>
                                        <div className="flex justify-between items-center pt-4 border-t border-zinc-800 font-mono text-sm">
                                            <span className="text-amber-500 font-black">${v.pricePerDay} / DAY</span>
                                            <span className="text-zinc-600 uppercase tracking-widest text-[10px]">Active</span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </section>
                )}

                {user.role === 'RENTER' && (
                    <section className="bg-zinc-900/30 border border-zinc-900 p-12 text-center">
                        <p className="text-zinc-500 font-mono text-sm uppercase tracking-widest">Operator status active. Browse the <Link to="/fleet" className="text-amber-500 hover:underline">Arsenal</Link> to initiate deployment.</p>
                    </section>
                )}
            </main>

            {/* Add Vehicle Modal (Same as OwnerDashboard but matching Profile theme) */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-amber-500/50 p-8 w-full max-w-[800px] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setShowAddModal(false); setImagePreview(null); }} className="absolute top-4 right-4 text-zinc-500 hover:text-white pb-3 px-3 italic font-black uppercase text-xs tracking-widest">Close [X]</button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-amber-500 italic">Initialize Machine Registration</h2>

                        <form onSubmit={handleRegisterVehicle} className="space-y-4 font-mono text-[10px] uppercase tracking-widest">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-zinc-500 mb-1">Model Designation</label>
                                        <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" required value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Manufacturer</label>
                                            <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" required value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Class</label>
                                            <select className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                                                <option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Motorcycle</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Year</label>
                                            <input type="number" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" required value={newVehicle.releaseYear} onChange={e => setNewVehicle({ ...newVehicle, releaseYear: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Daily Rate ($)</label>
                                            <input type="number" className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" required value={newVehicle.pricePerDay} onChange={e => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 mb-1">Telemetry Specs (V8, 4WD...)</label>
                                        <input className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none" required value={newVehicle.details} onChange={e => setNewVehicle({ ...newVehicle, details: e.target.value })} />
                                    </div>
                                    <div className="pt-2 border-t border-zinc-900">
                                        <label className="block text-amber-500 mb-2 font-black italic underline decoration-zinc-800 underline-offset-4">Remote Image Link (Optional Override)</label>
                                        <input
                                            className="w-full bg-zinc-900 border border-zinc-800 p-4 text-white focus:border-amber-500 outline-none placeholder:text-zinc-700"
                                            placeholder="https://images.site.com/your-machine-designation.jpg"
                                            value={newVehicle.imagePath}
                                            onChange={e => {
                                                setNewVehicle({ ...newVehicle, imagePath: e.target.value });
                                                setImagePreview(e.target.value);
                                            }}
                                        />
                                    </div>
                                    <div className="relative">
                                        <div className="absolute inset-x-0 top-1/2 h-[1px] bg-zinc-900"></div>
                                        <span className="relative z-10 bg-zinc-950 px-4 text-[8px] text-zinc-600 left-1/2 -translate-x-1/2 uppercase">Or Initialize Local Log</span>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 mb-1">Local Image Log Upload</label>
                                        <input type="file" accept="image/*" className="w-full border border-zinc-800 p-4 text-white cursor-pointer file:mr-4 file:bg-amber-500 file:border-0 file:py-1 file:px-2 file:text-black font-black" onChange={handleImageChange} />
                                    </div>
                                </div>
                                <div className="flex flex-col justify-center border border-zinc-800 border-dashed bg-zinc-900/20 p-4">
                                    <span className="text-[8px] text-zinc-600 mb-2">Visual_Confirmation:</span>
                                    <div className="aspect-video relative overflow-hidden bg-black border border-zinc-800">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-20">AWAITING_IMAGE</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className="w-full bg-amber-500 text-black font-black italic uppercase tracking-widest py-6 mt-8 hover:bg-white transition-all disabled:bg-zinc-800 disabled:text-zinc-600">
                                {loading ? "Transmitting..." : "Initialize Deployment"}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            <footer className="mt-auto bg-zinc-950 border-t border-zinc-900 p-12">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <p className="text-[10px] font-mono text-zinc-600 tracking-widest">©2026 IDENTITY_SYSTEMS // GARAGE_RENTALS</p>
                    <span className="text-amber-500 text-[8px] font-mono tracking-[0.4em] uppercase animate-pulse">Connected</span>
                </div>
            </footer>
        </div>
    );
}

export default Profile;
