import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';

// --- Type Definitions ---
type Message = {
    role: 'user' | 'ai';
    text: string;
};

// --- Main App Component ---
export default function GlassyChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'ai', text: 'Hello! How can I help you today?' },
        { role: 'user', text: 'Tell me about the glass UI theme we have here.' },
        { role: 'ai', text: 'Of course. It\'s a frosted glass effect using semi-transparent backgrounds and a backdrop blur. It gives the interface a modern, layered feel. The buttons and other elements have subtle 3D effects and magnification animations on hover to make them more interactive.' },
        { role: 'ai', text: 'Of course. It\'s a frosted glass effect using semi-transparent backgrounds and a backdrop blur. It gives the interface a modern, layered feel. The buttons and other elements have subtle 3D effects and magnification animations on hover to make them more interactive.' },
        { role: 'ai', text: 'Of course. It\'s a frosted glass effect using semi-transparent backgrounds and a backdrop blur. It gives the interface a modern, layered feel. The buttons and other elements have subtle 3D effects and magnification animations on hover to make them more interactive.' },
        { role: 'ai', text: 'Of course. It\'s a frosted glass effect using semi-transparent backgrounds and a backdrop blur. It gives the interface a modern, layered feel. The buttons and other elements have subtle 3D effects and magnification animations on hover to make them more interactive.' },
    ]);
    const chatContainerRef = useRef<HTMLDivElement>(null);


    // Scroll to the bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    return (
        <>             
            <div ref={chatContainerRef} className="flex-1 w-full max-w-3xl font-sans space-y-4 overflow-y-auto glassy-scrollbar pr-2">
                {messages.map((msg, index) => (
                    <ChatMessage key={index} message={msg} />
                ))}
            </div>

        </>
    );
}

// --- Chat Message Component ---
const ChatMessage = ({ message }: { message: Message }) => {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`flex ${isUser ? 'justify-end' : 'justify-start'} px-2 py-1`}
        >
            <div
                className={`max-w-lg px-4 py-2.5 text-sm md:text-base rounded-2xl text-white/90
        backdrop-blur-md border border-white/10 bg-gradient-to-b
        shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),inset_0_-1px_1px_rgba(0,0,0,0.15)]
        ${isUser
                        ? 'from-white/20 to-white/5'
                        : 'from-neutral-300/10 to-neutral-700/5'
                    }`}
            >
                {message.text}
            </div>
        </motion.div>
    );
};




