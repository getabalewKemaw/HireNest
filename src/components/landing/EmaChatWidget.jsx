import React, { useState, useRef, useEffect } from 'react';
import { Send, X, MessageCircle, Sparkles, User, Bot, Minimize2, Maximize2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { chatWithEma } from '../../services/geminiService';

const EmaChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'ema', text: 'Hello! I am Ema, your Etworks AI assistant. ✨ How can I help you today?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
        setIsLoading(true);

        try {
            // Prepare history for context (last 5 messages)
            const history = messages.slice(-5).map(m => ({
                role: m.role === 'user' ? 'user' : 'model',
                text: m.text
            }));

            const response = await chatWithEma(userMessage, history);
            setMessages(prev => [...prev, { role: 'ema', text: response }]);
        } catch (error) {
            setMessages(prev => [...prev, { role: 'ema', text: "I'm sorry, I encountered an error. Please try again." }]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 translate-y-2 animate-bounce-slow">
                {/* AI Hint Tooltip */}
                <div className="bg-white dark:bg-[#0B1C2D] px-4 py-2 rounded-2xl shadow-xl border border-gray-100 dark:border-white/10 flex items-center gap-2 animate-fade-in">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary dark:text-white">Ema AI is Online</span>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-1 group transition-all duration-500 hover:scale-110 active:scale-95"
                >
                    <div className="absolute inset-0 bg-secondary rounded-full blur-lg opacity-40 group-hover:opacity-70 animate-pulse"></div>
                    <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-white dark:border-white/20 shadow-2xl flex items-center justify-center bg-white dark:bg-[#0B1C2D]">
                        <img src="/image.png" alt="Ema AI" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-secondary/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white dark:border-[#0B1C2D]"></div>
                    </div>
                </button>
            </div>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 z-50 transform transition-all duration-500 ease-out ${isMinimized ? 'h-16 w-64' : 'h-[600px] w-[400px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]'} bg-white dark:bg-[#0B1C2D] rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] border border-gray-100 dark:border-white/10 flex flex-col overflow-hidden`}>

            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-[#0B1C2D] to-secondary flex items-center justify-between text-white shrink-0">
                <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full border-2 border-white/20 overflow-hidden bg-white/10 p-0.5">
                        <img src="/image.png" alt="Ema AI" className="w-full h-full object-cover rounded-full" />
                    </div>
                    <div>
                        <h3 className="font-heading font-black text-sm tracking-tight">Ema <span className="text-[10px] font-sans font-bold bg-white/20 px-1.5 py-0.5 rounded ml-1">AI</span></h3>
                        <p className="text-[10px] opacity-80 font-medium">Online & Ready to Help</p>
                    </div>
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-grow overflow-y-auto p-4 space-y-4 no-scrollbar bg-gray-50/30 dark:bg-transparent">
                        {messages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}>
                                <div className={`flex gap-2 max-w-[90%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                    <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center overflow-hidden ${msg.role === 'user' ? 'bg-secondary' : 'bg-[#0B1C2D] border border-white/10'}`}>
                                        {msg.role === 'user' ? (
                                            <User size={14} className="text-white" />
                                        ) : (
                                            <img src="/image.png" alt="Ema" className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className={`p-4 rounded-2xl shadow-sm text-sm ${msg.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white dark:bg-white/5 dark:text-gray-200 text-gray-800 border border-gray-100 dark:border-white/5 rounded-tl-none'}`}>
                                        <div className="prose prose-sm dark:prose-invert max-w-none">
                                            <ReactMarkdown
                                                components={{
                                                    p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
                                                    ul: ({ node, ...props }) => <ul className="list-disc ml-4 mb-2" {...props} />,
                                                    li: ({ node, ...props }) => <li className="mb-1" {...props} />,
                                                    h3: ({ node, ...props }) => <h3 className="text-base font-black italic mb-2 mt-3 first:mt-0" {...props} />,
                                                    strong: ({ node, ...props }) => <strong className="font-black text-secondary dark:text-secondary-light" {...props} />
                                                }}
                                            >
                                                {msg.text}
                                            </ReactMarkdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="flex gap-2 items-end">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-[#0B1C2D] border border-white/10 shrink-0">
                                        <img src="/image.png" alt="Ema" className="w-full h-full object-cover" />
                                    </div>
                                    <div className="bg-white dark:bg-white/5 p-4 rounded-2xl rounded-tl-none flex gap-1.5 items-center shadow-sm border border-gray-100 dark:border-white/5">
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce"></div>
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce delay-75"></div>
                                        <div className="w-1.5 h-1.5 bg-secondary rounded-full animate-bounce delay-150"></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white dark:bg-[#0B1C2D] border-t border-gray-100 dark:border-white/10 shrink-0">
                        <div className="relative flex items-center">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                placeholder="Ask Ema anything about Etworks..."
                                className="w-full bg-gray-50 dark:bg-white/5 pl-4 pr-12 py-3 rounded-2xl text-sm border-none focus:ring-2 focus:ring-secondary/50 dark:text-white transition-all outline-none"
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-2 p-2 rounded-xl transition-all ${input.trim() ? 'bg-secondary text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                        <p className="text-[9px] text-center mt-3 text-gray-400 font-medium tracking-tight">
                            Powered by **Gemini 2.5 Flash** • Intelligence Verified for **Etworks**
                        </p>
                    </div>
                </>
            )}
        </div>
    );
};

export default EmaChatWidget;
