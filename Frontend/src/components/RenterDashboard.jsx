import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import API_BASE_URL from '../config/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import ChatBox from './ChatBox.jsx';

function RenterDashboard() {
    const [rentals, setRentals] = useState([]);
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [selectedRentalId, setSelectedRentalId] = useState(null);
    const [feedback, setFeedback] = useState('');
    const [activeChat, setActiveChat] = useState(null);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user'));

    useEffect(() => {
        if (!user || user.role !== 'RENTER') {
            navigate('/login');
            return;
        }
        fetchData();
    }, [user, navigate]);

    const fetchData = async () => {
        try {
            const userId = user?.id || 1;
            const rRes = await fetch(`${API_BASE_URL}/rentals/user/${userId}`);
            if (rRes.ok) setRentals(await rRes.json());
        } catch (err) {
            console.error("Error fetching renter data", err);
        }
    };

    const activeRentals = rentals.filter(r => r.status === 'ACTIVE');
    const returnedRentals = rentals.filter(r => r.status === 'RETURNED');
    const totalSpent = rentals.reduce((sum, r) => sum + r.totalAmount, 0);

    // Chart Data Preparation
    const chartData = rentals.map(r => ({
        name: r.vehicle?.name,
        spent: r.totalAmount,
        date: new Date(r.startDate).toLocaleDateString()
    }));

    const handleReturn = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/rentals/${selectedRentalId}/return`, {
                method: 'POST',
                body: feedback
            });
            if (res.ok) {
                setShowFeedbackModal(false);
                setFeedback('');
                fetchData();
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-amber-500 selection:text-black">
            {/* Navbar */}
            <Navbar />

            <main className="max-w-7xl mx-auto px-8 py-12">
                <header className="mb-12 border-b border-zinc-900 pb-8">
                    <h1 className="text-5xl font-black uppercase tracking-tighter mb-2">Operator <span className="text-amber-500">Logistics</span></h1>
                    <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase">Operator: {user?.name} // Level: FIELD</p>
                </header>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Active Machines</p>
                        <p className="text-4xl font-black text-amber-500">{activeRentals.length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Completed Deployments</p>
                        <p className="text-4xl font-black text-white">{returnedRentals.length}</p>
                    </div>
                    <div className="bg-zinc-900/50 border border-zinc-800 p-6">
                        <p className="text-zinc-500 font-mono text-xs tracking-widest uppercase mb-2">Total Resource Cost</p>
                        <p className="text-4xl font-black text-red-500">${totalSpent.toFixed(2)}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Active Rentals Table */}
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white border-b border-zinc-800 pb-2">Active Deployments</h2>
                        <div className="space-y-4">
                            {activeRentals.length === 0 ? (
                                <p className="text-zinc-600 font-mono text-xs uppercase bg-zinc-900/30 p-4 border border-zinc-800">No active machines.</p>
                            ) : (
                                activeRentals.map(r => (
                                    <div key={r.id} className="bg-zinc-900/50 border border-amber-500/20 p-6 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
                                        <h3 className="text-xl font-black uppercase tracking-tighter mb-1">{r.vehicle?.name}</h3>
                                        <p className="text-zinc-500 font-mono text-[10px] tracking-widest uppercase mb-4">Start: {new Date(r.startDate).toLocaleDateString()} // Duration: {r.durationDays} Days</p>
                                        <div className="flex justify-between items-center border-t border-zinc-800 pt-4 mt-4 relative z-10 gap-2">
                                            <span className="font-mono text-white text-lg">${r.totalAmount}</span>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => setActiveChat({
                                                        rentalId: r.id,
                                                        otherPartyName: 'Shop Command',
                                                        receiverId: r.vehicle?.ownerId
                                                    })}
                                                    className="bg-zinc-900 border border-zinc-700 text-zinc-300 hover:border-amber-500 hover:text-amber-500 font-black text-[10px] uppercase tracking-widest px-4 py-2 transition-all"
                                                >
                                                    COMMS
                                                </button>
                                                <button
                                                    onClick={() => { setSelectedRentalId(r.id); setShowFeedbackModal(true); }}
                                                    className="bg-transparent border border-amber-500/50 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-[10px] uppercase tracking-widest px-4 py-2 transition-all"
                                                >
                                                    Return
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Recent Comms / Recent Chats */}
                    <div className="mb-12">
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white border-b border-zinc-800 pb-2">Recent <span className="text-amber-500">Comms</span></h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rentals.length === 0 ? (
                                <p className="col-span-full p-8 text-center text-zinc-500 font-mono uppercase text-[10px] border border-zinc-800 bg-zinc-900/10">No active signals.</p>
                            ) : (
                                rentals.map(r => (
                                    <div key={r.id} className="bg-zinc-900/30 border border-zinc-700 p-4 flex justify-between items-center group hover:border-amber-500 transition-colors">
                                        <div>
                                            <h4 className="text-sm font-black uppercase text-zinc-200">{r.vehicle?.name}</h4>
                                            <p className="text-[10px] font-mono text-zinc-500 uppercase">Target: Machine Owner</p>
                                        </div>
                                        <button
                                            onClick={() => setActiveChat({
                                                rentalId: r.id,
                                                otherPartyName: 'Machine Owner',
                                                receiverId: r.vehicle?.ownerId
                                            })}
                                            className="bg-amber-500/10 border border-amber-500/20 text-amber-500 hover:bg-amber-500 hover:text-black font-black text-[9px] uppercase px-3 py-2 transition-all tracking-tighter"
                                        >
                                            LINK
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Spending Chart */}
                    <div>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-6 text-white border-b border-zinc-800 pb-2">Resource Allocation Matrix</h2>
                        <div className="bg-zinc-900/30 border border-zinc-800 p-6 h-[400px]">
                            {chartData.length === 0 ? (
                                <div className="w-full h-full flex flex-col justify-center items-center font-mono text-xs uppercase text-zinc-600 tracking-widest">
                                    <span className="text-2xl mb-2">∅</span>
                                    Insufficient Data
                                </div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" stroke="#71717a" fontSize={10} tickMargin={10} />
                                        <YAxis stroke="#71717a" fontSize={10} tickFormatter={(val) => `$${val}`} />
                                        <Tooltip
                                            contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', color: '#fff' }}
                                            itemStyle={{ color: '#f59e0b' }}
                                        />
                                        <Bar dataKey="spent" fill="#f59e0b" radius={[2, 2, 0, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            )}
                        </div>

                        {/* Historical Log */}
                        <h2 className="text-xl font-black uppercase tracking-tighter mt-12 mb-4 text-white border-b border-zinc-800 pb-2">Historical Log</h2>
                        <ul className="space-y-2">
                            {returnedRentals.map(r => (
                                <li key={r.id} className="flex justify-between items-center text-xs font-mono border-b border-zinc-900 pb-2">
                                    <span className="text-zinc-400">[{new Date(r.startDate).toLocaleDateString()}] {r.vehicle?.name}</span>
                                    <span className="text-green-500 uppercase">RETURNED</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </main>

            {/* Return & Feedback Modal */}
            {showFeedbackModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                    <div className="bg-zinc-950 border border-amber-500/50 p-8 w-full max-w-md shadow-2xl relative">
                        <button onClick={() => setShowFeedbackModal(false)} className="absolute top-4 right-4 text-zinc-500 hover:text-white pb-3 px-3">X</button>
                        <h2 className="text-2xl font-black uppercase tracking-tighter mb-2 text-amber-500">Return Machine</h2>
                        <p className="text-xs font-mono text-zinc-500 tracking-widest uppercase mb-6 border-b border-zinc-800 pb-4">Submit post-operation telemetry report.</p>

                        <form onSubmit={handleReturn} className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono text-zinc-400 uppercase tracking-widest mb-2">Post-Op Feedback</label>
                                <textarea
                                    className="w-full bg-zinc-900 border border-zinc-700 p-3 text-white font-sans focus:border-amber-500 outline-none h-32"
                                    required
                                    placeholder="Machine performance, issues, structural integrity..."
                                    value={feedback}
                                    onChange={e => setFeedback(e.target.value)}
                                />
                            </div>

                            <button type="submit" className="w-full bg-amber-500 text-black font-black uppercase tracking-widest py-4 mt-6 hover:bg-white transition-colors">
                                Confirm Return
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Persistent Chat Box for alerts/active comms */}
            {user && (
                <ChatBox
                    rentalId={activeChat?.rentalId || 0}
                    currentUser={user}
                    receiverId={activeChat?.receiverId || 0}
                    otherPartyName={activeChat?.otherPartyName || "Shop Command"}
                    onClose={() => setActiveChat(null)}
                    isVisible={!!activeChat}
                />
            )}
        </div>
    );
}

export default RenterDashboard;
