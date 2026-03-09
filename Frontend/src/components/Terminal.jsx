import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Terminal() {
    const [inputCode, setInputCode] = useState("");
    const [logs, setLogs] = useState([
        "INITIATING SECURE CONNECTION...",
        "ESTABLISHING HANDSHAKE...",
        "CONNECTION SECURED. ENCRYPTION PROTOCOL: AES-256",
        "> SYSTEM READY. AWAITING OPERATOR INPUT."
    ]);
    const navigate = useNavigate();

    useEffect(() => {
        // Faux typing effect for logs could go here
    }, []);

    const handleCommand = (e) => {
        e.preventDefault();
        if (!inputCode.trim()) return;

        setLogs(prev => [...prev, `> ${inputCode}`]);

        const cmd = inputCode.toLowerCase().trim();
        if (cmd === 'clear') {
            setLogs(["> SYSTEM READY. AWAITING OPERATOR INPUT."]);
        } else if (cmd === 'login' || cmd === 'auth') {
            setLogs(prev => [...prev, "REDIRECTING TO SECURE AUTH MODULE..."]);
            setTimeout(() => navigate('/login'), 1000);
        } else if (cmd === 'register' || cmd === 'signup') {
            setLogs(prev => [...prev, "REDIRECTING TO REGISTRATION MODULE..."]);
            setTimeout(() => navigate('/signup'), 1000);
        } else if (cmd === 'home') {
            setLogs(prev => [...prev, "TERMINATING CONNECTION..."]);
            setTimeout(() => navigate('/'), 1000);
        } else {
            setLogs(prev => [...prev, "ERROR: COMMAND NOT RECOGNIZED. VALID COMMANDS: LOGIN, REGISTER, HOME, CLEAR"]);
        }

        setInputCode("");
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-green-500 flex flex-col font-mono selection:bg-green-500 selection:text-black overflow-hidden relative">
            {/* CRT Scanline Overlay */}
            <div className="fixed inset-0 pointer-events-none z-50 opacity-[0.1] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]"></div>

            {/* Screen Vignette/Glow */}
            <div className="fixed inset-0 pointer-events-none z-40 shadow-[inset_0_0_150px_rgba(0,0,0,0.9)]"></div>

            <div className="flex-grow p-8 md:p-16 max-w-4xl w-full mx-auto flex flex-col relative z-10 h-screen overflow-y-auto">

                <div className="mb-12 border-b border-green-900/50 pb-8">
                    <pre className="text-xs md:text-sm leading-tight text-green-600 font-bold mb-6 whitespace-pre-wrap animate-pulse">
                        {`   _____          _____             _____ ______ 
  / ____|   /\\   |  __ \\     /\\    / ____|  ____|
 | |  __   /  \\  | |__) |   /  \\  | |  __| |__   
 | | |_ | / /\\ \\ |  _  /   / /\\ \\ | | |_ |  __|  
 | |__| |/ ____ \\| | \\ \\  / ____ \\| |__| | |____ 
  \\_____/_/    \\_\\_|  \\_\\/_/    \\_\\\\_____|______|
                                                 
 >> RESTRICTED ACCESS TERMINAL <<
`}
                    </pre>
                    <div className="flex justify-between items-center text-[10px] text-green-700 tracking-[0.2em] uppercase">
                        <span>Server: NODE_ALPHA_01</span>
                        <span>Uptime: 99.99%</span>
                        <span>Date: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex-grow flex flex-col justify-end space-y-2 mb-6">
                    {logs.map((log, i) => (
                        <div key={i} className={`text-sm tracking-wide ${log.startsWith('ERROR') ? 'text-red-500' : 'text-green-500'}`}>
                            {log}
                        </div>
                    ))}
                </div>

                <form onSubmit={handleCommand} className="flex items-center text-sm border-t border-green-900/50 pt-4">
                    <span className="mr-3 font-bold text-green-400">root@garage:~#</span>
                    <input
                        type="text"
                        value={inputCode}
                        onChange={(e) => setInputCode(e.target.value)}
                        className="flex-grow bg-transparent outline-none text-green-300 font-mono focus:ring-0 placeholder-green-800/50"
                        autoFocus
                        spellCheck="false"
                        autoComplete="off"
                        placeholder="Type 'login' or 'home'..."
                    />
                    <div className="w-2 h-5 bg-green-500 animate-[pulse_1s_cubic-bezier(0.4,0,0.6,1)_infinite]"></div>
                </form>

            </div>
        </div>
    );
}

export default Terminal;
