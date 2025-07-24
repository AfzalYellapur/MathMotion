import React, { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import useBinderKernel from "../../hooks/useBinderKernel";
import useTerminal from "../../hooks/useTerminal";
import useWebSocketHandler from "../../hooks/useWebSocketHandler";
import useCodeExecution from "../../hooks/useCodeExecution";
import ChatPanel from "./ChatPanel";
import MainPanel from "./MainPanel";
import type { Message, ViewType } from "./types";

function Workspace() {
    const [view, setView] = useState<ViewType>('editor');
    const location = useLocation();
    const initialPrompt = location.state?.prompt || '';

    const [chatInput, setChatInput] = useState(initialPrompt);
    const [messages, setMessages] = useState<Message[]>([]);
    const [userCode, setUserCode] = useState('');
    const [videoData, setVideoData] = useState<string | null>(null);

    const { ws, status, connect } = useBinderKernel();
    const { terminalOutput, addOutput } = useTerminal();
    const { executeCode } = useCodeExecution({ ws });

    // Handle WebSocket messages
    useWebSocketHandler({
        ws,
        onVideoData: setVideoData,
        onTerminalOutput: addOutput
    });

    // Handle kernel disconnection
    useEffect(() => {
        if (status === "Kernel disconnected") {
            addOutput("\n\nKernel has shut down due to inactivity.\n\n");
        }
    }, [status]);

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
        <div className="flex h-screen">
            <ChatPanel
                messages={messages}
                chatInput={chatInput}
                onChatInputChange={setChatInput}
                onSendMessage={handleSendMessage}
            />

            <MainPanel
                view={view}
                onViewChange={setView}
                status={status}
                onReconnect={connect}
                onGenerate={() => { executeCode(userCode) }}
                userCode={userCode}
                onCodeChange={setUserCode}
                videoData={videoData}
                terminalOutput={terminalOutput}
            />
        </div>
    );
}

export default Workspace;