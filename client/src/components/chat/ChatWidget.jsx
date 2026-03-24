import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MessageSquare, X, Send, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toggleChat, sendMessage, receiveMessage } from '../../redux/slices/chatSlice';
import Button from '../ui/Button';

const ChatWidget = () => {
    const dispatch = useDispatch();
    const { isOpen, messages, unreadCount } = useSelector((state) => state.chat);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen) {
            scrollToBottom();
        }
    }, [messages, isOpen]);

    const handleSendMessage = (e) => {
        e.preventDefault();
        if (!inputValue.trim()) return;

        dispatch(sendMessage(inputValue));
        setInputValue('');

        // Simulate reply
        setTimeout(() => {
            const replies = [
                "Sounds good!",
                "I'll check that out.",
                "Can you send me the link?",
                "Great work!",
                "Let's discuss this in the meeting."
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const randomSender = Math.random() > 0.5 ? "Alex Johnson" : "Sarah Williams";

            dispatch(receiveMessage({
                text: randomReply,
                sender: randomSender,
                senderId: randomSender === "Alex Johnson" ? 1 : 2
            }));
        }, 2000);
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-none">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="pointer-events-auto bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-2xl rounded-2xl w-80 sm:w-96 h-[32rem] mb-4 flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 bg-gradient-to-r from-primary-500 to-red-600 text-white flex justify-between items-center shrink-0">
                            <div className="flex items-center gap-2">
                                <MessageSquare className="w-5 h-5" />
                                <h3 className="font-bold">Team Chat</h3>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => dispatch(toggleChat())}
                                    className="p-1 hover:bg-white/20 rounded transition-colors"
                                >
                                    <Minus className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50 dark:bg-stone-900 custom-scrollbar">
                            {messages.map((msg) => (
                                <div
                                    key={msg.id}
                                    className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}
                                >
                                    <div className="flex items-end gap-2 max-w-[85%]">
                                        {!msg.isMe && (
                                            <div className="w-6 h-6 rounded-full bg-stone-200 dark:bg-stone-700 flex items-center justify-center text-xs font-bold text-stone-600 dark:text-stone-300 shrink-0 mb-1">
                                                {msg.sender[0]}
                                            </div>
                                        )}
                                        <div
                                            className={`p-3 rounded-2xl text-sm ${msg.isMe
                                                ? 'bg-primary-500 text-white rounded-tr-none'
                                                : 'bg-white dark:bg-stone-800 text-stone-800 dark:text-stone-100 border border-stone-100 dark:border-stone-700 rounded-tl-none shadow-sm'
                                                }`}
                                        >
                                            {!msg.isMe && <p className="text-[10px] font-bold opacity-70 mb-1">{msg.sender}</p>}
                                            {msg.text}
                                        </div>
                                    </div>
                                    <span className="text-[10px] text-stone-400 mt-1 px-1">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <form onSubmit={handleSendMessage} className="p-3 bg-white dark:bg-stone-900 border-t border-stone-200 dark:border-stone-800 shrink-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder="Type a message..."
                                    className="w-full pl-4 pr-10 py-2.5 rounded-xl bg-stone-100 dark:bg-stone-800 border-none focus:ring-2 focus:ring-primary-500 outline-none text-sm text-stone-900 dark:text-white placeholder-stone-400"
                                />
                                <button
                                    type="submit"
                                    disabled={!inputValue.trim()}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Toggle Button */}
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(toggleChat())}
                className="pointer-events-auto w-14 h-14 rounded-full bg-gradient-to-r from-primary-500 to-red-600 text-white shadow-lg shadow-primary-500/30 flex items-center justify-center relative"
            >
                {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}

                {!isOpen && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-stone-900">
                        {unreadCount}
                    </span>
                )}
            </motion.button>
        </div>
    );
};

export default ChatWidget;
