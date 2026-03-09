import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")));

    useEffect(() => {
        // Sync user state if it changes in localStorage (e.g. from other tabs or components)
        const handleStorageChange = () => {
            setUser(JSON.parse(localStorage.getItem("user")));
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        // Use navigate instead of reload for smoother transition
        navigate("/login");
        // Trigger storage event for other components if needed, though here we just want to update this component
        window.dispatchEvent(new Event('storage'));
    };

    const navItems = [
        { name: "Home", path: "/" },
        { name: "Showroom", path: "/showroom" },
        { name: "Fleet", path: "/fleet" }
    ];

    return (
        <nav className="flex justify-between items-center px-8 md:px-16 py-4 bg-zinc-950/90 backdrop-blur-xl border-b border-amber-500/20 sticky top-0 z-[60]">
            <div className="text-zinc-100 text-2xl font-black tracking-tighter flex items-center gap-2 group cursor-default">
                <div className="relative">
                    <span className="text-amber-500 relative z-10">⚙️</span>
                    <div className="absolute inset-0 bg-amber-500 blur-md opacity-20 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <Link to="/" className="group-hover:tracking-[0.2em] transition-all duration-500 uppercase">
                    Garage<span className="text-amber-500">Rentals</span>
                </Link>
            </div>

            <ul className="hidden md:flex space-x-10 items-center">
                {navItems.map((item, index) => (
                    <li key={item.name}>
                        <Link to={item.path}>
                            <button className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 hover:text-amber-500 ${location.pathname === item.path ? "text-amber-500" : "text-zinc-500"}`}>
                                0{index + 1}. {item.name}
                            </button>
                        </Link>
                    </li>
                ))}

                {user ? (
                    <>
                        <li>
                            <Link to="/profile">
                                <button className={`text-[10px] font-black tracking-[0.3em] uppercase transition-all duration-300 hover:text-amber-500 ${location.pathname === '/profile' ? "text-amber-500" : "text-zinc-500"}`}>
                                    04. Dashboard
                                </button>
                            </Link>
                        </li>
                        <li>
                            <button
                                onClick={handleLogout}
                                className="bg-transparent border border-zinc-700 text-zinc-500 hover:text-amber-500 hover:border-amber-500 px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-colors duration-300"
                            >
                                Logout
                            </button>
                        </li>
                    </>
                ) : (
                    <li>
                        <Link to="/login">
                            <button className="bg-amber-500 text-zinc-950 px-5 py-2 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-colors duration-300">
                                Access Granted
                            </button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;
