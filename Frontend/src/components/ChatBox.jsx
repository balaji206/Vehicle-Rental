import { connectSocket, sendMessage } from './chat/socket';
import { useState, useRef, useEffect } from 'react';
import API_BASE_URL from '../config/api';
import toast from 'react-hot-toast';
const ChatBox = ({ rentalId, currentUser, receiverId, otherPartyName, onClose, isVisible }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchMessages = async () => {
        if (!rentalId || rentalId === 0) {
            setMessages([]);
            return;
        }
        try {
            const res = await fetch(`${API_BASE_URL}/messages/${rentalId}`, {
                headers: { 'Authorization': `Bearer ${currentUser.token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
                scrollToBottom();
            }
        } catch (err) {
            console.error("Error fetching messages", err);
        }
    };

    useEffect(() => {
        fetchMessages();

        // Initial Connection Toast
        toast("Comms Link Established", {
            icon: '📡',
            duration: 2000,
            style: {
                borderRadius: '0',
                background: '#09090b',
                color: '#3b82f6', // blue
                border: '1px solid #3b82f6',
                fontFamily: 'monospace',
                fontSize: '10px',
                textTransform: 'uppercase'
            }
        });

        // Connect to WebSocket
        connectSocket(currentUser.id, (incomingMsg) => {
            // Toast notification for incoming message
            const senderTag = incomingMsg.senderId.toString().startsWith('USR-') ? incomingMsg.senderId : `USR-${incomingMsg.senderId}`;
            toast.success(`Incoming Signal: ${senderTag}`, {
                icon: '💬',
                duration: 3000,
                style: {
                    borderRadius: '0',
                    background: '#09090b',
                    color: '#f59e0b',
                    border: '1px solid rgba(245,158,11,0.5)',
                    fontFamily: 'monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase'
                }
            });

            // Update local messages if it's from the person we are currently chatting with
            if (String(incomingMsg.senderId) === String(receiverId)) {
                setMessages((prev) => [...prev, {
                    content: incomingMsg.message,
                    senderId: incomingMsg.senderId,
                    timestamp: new Date().toISOString()
                }]);
                setTimeout(scrollToBottom, 50);
            }
        });
    }, [rentalId, currentUser.id]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        const msgToTransmit = newMessage.trim();
        if (!msgToTransmit) return;

        const messageData = {
            senderId: currentUser.id.toString(),
            receiverId: receiverId.toString(),
            message: msgToTransmit,
            rentalId: rentalId
        };

        // UI Feedback: Optimistic Update
        const optimisticMsg = {
            content: msgToTransmit,
            senderId: currentUser.id,
            timestamp: new Date().toISOString()
        };

        setMessages(prev => [...prev, optimisticMsg]);
        setNewMessage('');
        setTimeout(scrollToBottom, 50);

        // Send via WebSocket for real-time
        sendMessage(messageData);

        // UI Feedback: Success Toast
        toast.success("Transmission Sent", {
            duration: 1500,
            style: {
                borderRadius: '0',
                background: '#09090b',
                color: '#10b981',
                border: '1px solid #10b981',
                fontFamily: 'monospace',
                fontSize: '10px',
                textTransform: 'uppercase'
            }
        });

        // Save to DB for persistence
        try {
            await fetch(`${API_BASE_URL}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentUser.token}`
                },
                body: JSON.stringify({
                    rentalId: rentalId,
                    senderId: currentUser.id,
                    receiverId: receiverId,
                    content: msgToTransmit
                })
            });
            // We already added it optimistically, so no need to refresh list here
        } catch (err) {
            console.error("Error sending message", err);
            toast.error("Cloud Save Failed", {
                style: { borderRadius: '0', background: '#450a0a', color: '#fca5a5' }
            });
        }
    };

    return (
        <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm ${isVisible ? '' : 'hidden'}`}>
            <div className="w-full max-w-md bg-zinc-950 border border-amber-500/50 shadow-2xl flex flex-col font-sans h-[600px] animate-in fade-in zoom-in duration-300">
                {/* Header */}
                <div className="bg-zinc-900 border-b border-amber-500/20 p-4 flex justify-between items-center">
                    <div>
                        <h3 className="text-amber-500 font-black uppercase tracking-tighter">COMMS LINK: ACTIVE</h3>
                        <p className="text-zinc-500 text-[10px] font-mono uppercase tracking-widest">Target: {otherPartyName}</p>
                    </div>
                    <button onClick={onClose} className="text-zinc-500 hover:text-white font-bold p-2 bg-zinc-800 hover:bg-zinc-700 transition-colors w-10 h-10 flex items-center justify-center">X</button>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-zinc-950/50 relative">
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none opacity-20"></div>

                    {messages.length === 0 ? (
                        <div className="h-full flex items-center justify-center">
                            <p className="text-zinc-600 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">Awaiting Signal...</p>
                        </div>
                    ) : (
                        messages.map((msg, idx) => {
                            // Use loose equality and handle mixed types for IDs
                            const isMine = String(msg.senderId) === String(currentUser.id);
                            return (
                                <div key={idx} className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[85%] p-3 text-sm leading-relaxed border ${isMine
                                        ? 'bg-amber-500/10 border-amber-500/40 text-amber-500'
                                        : 'bg-zinc-900 border-zinc-800 text-zinc-300'
                                        }`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[9px] text-zinc-600 font-mono mt-1 uppercase tracking-tighter">
                                        {msg.timestamp ? new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'NOW'}
                                    </span>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="p-4 bg-zinc-900 border-t border-amber-500/10 flex gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="TYPE MESSAGE..."
                        className="flex-1 bg-zinc-950 border border-zinc-700 p-3 text-white font-mono text-xs uppercase focus:border-amber-500 focus:outline-none transition-colors placeholder:text-zinc-800"
                    />
                    <button
                        type="submit"
                        className="bg-amber-500 text-black px-6 font-black text-xs uppercase tracking-widest hover:bg-white transition-all active:scale-95"
                    >
                        SEND
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;
