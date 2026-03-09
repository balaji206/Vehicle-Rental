import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import API_BASE_URL from '../config/api';
import ChatBox from './ChatBox.jsx';

function OwnerDashboard() {
    const [vehicles, setVehicles] = useState([]);
    const [rentals, setRentals] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [newVehicle, setNewVehicle] = useState({
        name: '', type: 'SUV', pricePerDay: '', details: '', brand: '', releaseYear: '', imagePath: ''
    });
    const [imagePreview, setImagePreview] = useState(null);
    const [activeChat, setActiveChat] = useState(null);
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'OWNER') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            // Assuming user ID is 1 for now if decoded token is not available. 
            // In a real app, you'd get the ID from the token. We'll use a mocked ID 1L for the demo.
            const userId = user?.id || 1;
            const headers = { 'Authorization': `Bearer ${user.token}` };

            const vRes = await fetch(`${API_BASE_URL}/vehicles/owner/${userId}`, { headers });
            if (vRes.ok) setVehicles(await vRes.json());

            const rRes = await fetch(`${API_BASE_URL}/rentals/owner/${userId}`, { headers });
            if (rRes.ok) setRentals(await rRes.json());
        } catch (err) {
            console.error("Error fetching admin data", err);
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
        } else {
            setImagePreview(null);
            setNewVehicle({ ...newVehicle, imagePath: '' });
        }
    };

    const handleAddVehicle = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...newVehicle, ownerId: user?.id || 1 };
            const res = await fetch(`${API_BASE_URL}/vehicles`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${user.token}` },
                body: JSON.stringify(payload)
            });
            if (res.ok) {
                setShowAddModal(false);
                setNewVehicle({ name: '', type: 'SUV', pricePerDay: '', details: '', brand: '', releaseYear: '', imagePath: '' });
                setImagePreview(null);
                fetchData();
            } else {
                alert("Failed to create vehicle. The image might be too large.");
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Stats Calculations
    const activeRentals = rentals.filter(r => r.status === 'ACTIVE');
    const returnedRentals = rentals.filter(r => r.status === 'RETURNED');
    const availableVehicles = vehicles.length - activeRentals.length;
    const totalProfit = returnedRentals.reduce((sum, r) => sum + r.totalAmount, 0);

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
            <Navbar />

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-12">
                <header className="mb-12 border-b border-zinc-900 pb-8 flex justify-between items-end">
                    <div>
                        <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Fleet <span className="text-amber-500">Overview</span></h1>
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Operator: {user?.name} // Level: ADMIN</p>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-amber-500 text-zinc-950 font-black px-6 py-3 uppercase tracking-widest hover:bg-white transition-colors"
                    >
                        + Add Machine
                    </button>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Units Deployed</p>
                        <p className="text-4xl font-black text-white">{activeRentals.length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Available Fleet</p>
                        <p className="text-4xl font-black text-amber-500">{availableVehicles}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Total Yield</p>
                        <p className="text-4xl font-black text-green-500">${totalProfit.toFixed(2)}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Completed Ops</p>
                        <p className="text-4xl font-black text-white">{returnedRentals.length}</p>
                    </div>
                </div>

                {/* Comms Hub / Recent Chats */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b border-zinc-900 pb-2">Comms <span className="text-amber-500">Hub</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {rentals.length === 0 ? (
                            <p className="col-span-full p-8 text-center text-zinc-500 font-mono uppercase text-sm border border-zinc-800 bg-zinc-900/30">No active signals.</p>
                        ) : (
                            rentals.map(r => (
                                <div key={r.id} className="bg-zinc-900/30 border border-zinc-800 p-6 flex flex-col justify-between hover:border-amber-500 transition-colors group">
                                    <div className="mb-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-black uppercase text-white">USR-{r.user?.id}</h3>
                                            <span className="text-[10px] font-mono text-zinc-500 bg-zinc-900 px-2 py-1 border border-zinc-800">{r.vehicle?.name}</span>
                                        </div>
                                        <p className="text-xs text-zinc-400 font-mono uppercase truncate">Active Link Established</p>
                                    </div>
                                    <button
                                        onClick={() => setActiveChat({
                                            rentalId: r.id,
                                            otherPartyName: 'Renter (USR-' + r.user?.id + ')',
                                            receiverId: r.user?.id
                                        })}
                                        className="w-full bg-transparent border border-amber-500/50 text-amber-500 font-black text-xs uppercase py-3 tracking-widest hover:bg-amber-500 hover:text-black transition-all"
                                    >
                                        Open Transmission
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Recent Rentals List */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6">Active Telemetry / Rentals</h2>
                    <div className="bg-zinc-900/30 border border-zinc-800">
                        {rentals.length === 0 ? (
                            <p className="p-8 text-center text-zinc-500 font-mono uppercase text-sm">No active operations.</p>
                        ) : (
                            <table className="w-full text-left">
                                <thead className="border-b border-zinc-800 bg-zinc-900/50 font-mono text-[10px] uppercase tracking-widest text-zinc-500">
                                    <tr>
                                        <th className="p-4">Unit</th>
                                        <th className="p-4">Renter ID</th>
                                        <th className="p-4">Duration</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4 text-center">Comms</th>
                                        <th className="p-4 text-right">Yield</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rentals.map(r => (
                                        <tr key={r.id} className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors">
                                            <td className="p-4 font-bold">{r.vehicle?.name}</td>
                                            <td className="p-4 font-mono text-xs text-zinc-400">USR-{r.user?.id}</td>
                                            <td className="p-4 font-mono text-xs">{r.durationDays} DAYS</td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 text-[10px] uppercase font-bold tracking-widest ${r.status === 'ACTIVE' ? 'bg-amber-500/10 text-amber-500' : 'bg-green-500/10 text-green-500'}`}>
                                                    {r.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-center">
                                                {r.status === 'ACTIVE' && (
                                                    <button
                                                        onClick={() => setActiveChat({
                                                            rentalId: r.id,
                                                            otherPartyName: 'USR-' + r.user?.id,
                                                            receiverId: r.user?.id
                                                        })}
                                                        className="bg-transparent border border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-[10px] px-3 py-1 uppercase tracking-widest transition-colors"
                                                    >
                                                        LINK
                                                    </button>
                                                )}
                                            </td>
                                            <td className="p-4 text-right font-mono text-white">${r.totalAmount}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                {/* Fleet Inventory List */}
                <div className="mb-16">
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 border-b border-zinc-900 pb-2">Fleet <span className="text-amber-500">Inventory</span></h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {vehicles.length === 0 ? (
                            <p className="col-span-full p-8 text-center text-zinc-500 font-mono uppercase text-sm border border-zinc-800 bg-zinc-900/30">No machines in fleet.</p>
                        ) : (
                            vehicles.map(v => {
                                const isDeployed = activeRentals.some(r => r.vehicle?.id === v.id);
                                return (
                                    <div key={v.id} className="bg-zinc-950 border border-zinc-800 p-6 flex flex-col justify-between group hover:border-amber-500 transition-colors">
                                        <div>
                                            <div className="flex justify-between items-start mb-4">
                                                <div>
                                                    <h3 className="text-xl font-black uppercase text-white group-hover:text-amber-500 transition-colors">{v.name}</h3>
                                                    <p className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest">{v.brand} // {v.releaseYear}</p>
                                                </div>
                                                <span className="bg-zinc-900 text-zinc-400 border border-zinc-800 text-[10px] font-bold px-2 py-1 uppercase tracking-widest">{v.type}</span>
                                            </div>
                                            {/* Image display */}
                                            {v.imagePath && (
                                                <div className="h-32 w-full mb-4 bg-zinc-900 overflow-hidden relative border border-zinc-800/50">
                                                    <img src={v.imagePath} alt={v.name} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500 grayscale group-hover:grayscale-0" onError={(e) => { e.target.style.display = 'none' }} />
                                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_10px_10px,_var(--tw-gradient-stops))] from-zinc-500/10 to-transparent pointer-events-none"></div>
                                                </div>
                                            )}
                                            <p className="text-xs text-zinc-500 font-mono tracking-widest mb-4 h-12 overflow-hidden">{v.details}</p>
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-zinc-800 flex justify-between items-center">
                                            <span className="text-amber-500 font-black text-xl">${v.pricePerDay}<span className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest pl-1">/ DAY</span></span>
                                            <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1.5 ${isDeployed ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'}`}>
                                                {isDeployed ? 'DEPLOYED' : 'READY'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </main>

            {/* Add Modal */}
            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-amber-500/50 p-8 w-full max-w-[800px] shadow-2xl relative max-h-[90vh] overflow-y-auto">
                        <button onClick={() => { setShowAddModal(false); setImagePreview(null); }} className="absolute top-4 right-4 text-zinc-500 hover:text-white pb-3 px-3">X</button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-amber-500">Register New Unit</h2>

                        <form onSubmit={handleAddVehicle} className="space-y-4 font-mono text-xs uppercase tracking-widest">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* Left Column: Form Fields */}
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-zinc-500 mb-1">Designation (Model)</label>
                                        <input className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" required value={newVehicle.name} onChange={e => setNewVehicle({ ...newVehicle, name: e.target.value })} />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Brand</label>
                                            <input className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" required value={newVehicle.brand} onChange={e => setNewVehicle({ ...newVehicle, brand: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Class</label>
                                            <select className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" value={newVehicle.type} onChange={e => setNewVehicle({ ...newVehicle, type: e.target.value })}>
                                                <option>SUV</option><option>Sedan</option><option>Hatchback</option><option>Motorcycle</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Year</label>
                                            <input type="number" className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" required value={newVehicle.releaseYear} onChange={e => setNewVehicle({ ...newVehicle, releaseYear: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-zinc-500 mb-1">Daily Rate ($)</label>
                                            <input type="number" className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" required value={newVehicle.pricePerDay} onChange={e => setNewVehicle({ ...newVehicle, pricePerDay: e.target.value })} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-zinc-500 mb-1">Specs (Comma Separated)</label>
                                        <input className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white" required value={newVehicle.details} onChange={e => setNewVehicle({ ...newVehicle, details: e.target.value })} placeholder="V8, 4WD, Manual" />
                                    </div>
                                    <div className="pt-2 border-t border-zinc-900">
                                        <label className="block text-amber-500 mb-2 font-black italic underline decoration-zinc-800 underline-offset-4 text-[10px]">Remote Image Link (Optional Override)</label>
                                        <input
                                            className="w-full bg-zinc-900 border border-zinc-800 p-3 text-white focus:border-amber-500 outline-none placeholder:text-zinc-700"
                                            placeholder="https://images.site.com/your-machine.jpg"
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
                                        <input type="file" accept="image/*" className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white cursor-pointer file:mr-4 file:py-2 file:px-4 file:border-0 file:text-black file:bg-amber-500 file:font-black file:uppercase file:tracking-widest hover:file:bg-white transition-colors" onChange={handleImageChange} />
                                    </div>
                                </div>

                                {/* Right Column: Image Preview */}
                                <div className="space-y-4 flex flex-col items-center justify-center">
                                    <label className="block text-zinc-500 w-full text-left mb-1">Image Preview</label>
                                    <div className="w-full h-64 border-2 border-dashed border-zinc-700 bg-zinc-900/50 flex flex-col justify-center items-center relative overflow-hidden group">
                                        {imagePreview ? (
                                            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                        ) : (
                                            <span className="text-zinc-600 uppercase tracking-widest text-[10px] absolute pointer-events-none">NO IMAGE SELECTED</span>
                                        )}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10px_10px,_var(--tw-gradient-stops))] from-zinc-500/10 to-transparent pointer-events-none"></div>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-amber-500 text-black font-black uppercase tracking-widest py-4 mt-6 hover:bg-white transition-colors">
                                Deploy Unit
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Persistent Chat Box for Alerts & Active Comms */}
            {user && (
                <ChatBox
                    rentalId={activeChat?.rentalId || 0}
                    currentUser={user}
                    receiverId={activeChat?.receiverId || 0}
                    otherPartyName={activeChat?.otherPartyName || "Signal Standby"}
                    onClose={() => setActiveChat(null)}
                    isVisible={!!activeChat}
                />
            )}
        </div>
    );
}

export default OwnerDashboard;
