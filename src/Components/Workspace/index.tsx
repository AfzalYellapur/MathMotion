import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import useBinderKernel from "../../hooks/useBinderKernel";
import useWebSocketHandler from "../../hooks/useWebSocketHandler";
import useCodeExecution from "../../hooks/useCodeExecution";
import ChatPanel from "./ChatPanel/ChatPanel";
import MainPanel from "./MainPanel/MainPanel";
import type { Message, ViewType } from "./types";

function Workspace() {
    const [view, setView] = useState<ViewType>('editor');
    const location = useLocation();
    const initialPrompt = location.state?.prompt || '';
    const [chatInput, setChatInput] = useState(initialPrompt);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userCode, setUserCode] = useState('');
    const [videoData, setVideoData] = useState<string | null>(null);
    const [codeError, setCodeError] = useState<string | null>(null);
    const { ws, status, connect } = useBinderKernel();
    const { executeCode } = useCodeExecution({ ws });
    const [isGenerating, setIsGenerating] = useState(false);

    // Handle WebSocket messages
    useWebSocketHandler({
        ws,
        onVideoData: (data) => {
            setVideoData(data);
            setIsGenerating(false); // This will run every time
        },
        onCodeError: (error) => {
            setCodeError(error);
            setIsGenerating(false); // This will run every time
        }
    });

    // Handle initial prompt
    useEffect(() => {
        if (initialPrompt.trim()) {
            handleSendMessage();
        }
    }, []); // Run once on mount

    const handleSendMessage = () => {
        if (chatInput.trim() === '') return;

        setMessages(prev => [
            ...prev,
            { sender: 'user', text: chatInput },
            { sender: 'ai', text: `You said: ${chatInput}` }
        ]);
        setChatInput('');
    };

    return (
        <div className="flex h-screen bg-black">
            <ChatPanel
                // messages={messages}
                // // chatInput={chatInput}
                // onChatInputChange={setChatInput}
                // onSendMessage={handleSendMessage}
            />

            <MainPanel
                view={view}
                onViewChange={setView}
                status={status}
                onReconnect={connect}
                isGenerating={isGenerating}
                onGenerate={() => {
                    if (status === 'Kernel Ready') {
                        setIsGenerating(true);
                        setVideoData(null);
                        setCodeError(null);
                        executeCode(userCode);
                        setView("preview");
                    }
                }}
                userCode={userCode}
                onCodeChange={setUserCode}
                videoData={videoData}
                codeError={codeError}
            />
        </div>
    );
}

export default Workspace;