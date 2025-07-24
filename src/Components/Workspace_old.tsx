import { useState, useEffect } from "react";
import  useBinderKernel  from "../hooks/useBinderKernel";
import { useLocation } from 'react-router-dom';

function stripAnsiCodes(text: string): string {
    return text.replace(
        /\x1b\[[0-9;]*m/g,
        ''
    );
}


function Workspace_old() {

    const [view, setView] = useState<'editor' | 'video'>('editor');
    const location = useLocation();
    const initialPrompt = location.state?.prompt || '';
    const [chatInput, setChatInput] = useState(initialPrompt);
    const [messages, setMessages] = useState<
        { sender: 'user' | 'ai'; text: string }[]
    >([]);
    const { ws, status, connect } = useBinderKernel();
    const [userCode, setUserCode] = useState('');
    const [videoData, setVideoData] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string>('');

    useEffect(() => {
        const el = document.getElementById("terminal");
        if (el) el.scrollTop = el.scrollHeight;
    }, [terminalOutput]);


    useEffect(() => {
        if (status === "Kernel disconnected") {
            setTerminalOutput(prev => prev + "\n\nKernel has shut down due to inactivity.\n\n");
        }
    }, [status]);


    useEffect(() => {
        if (!ws) return;

        const handleMessage = (event: MessageEvent) => {
            const msg = JSON.parse(event.data);
            const msgType = msg.header.msg_type;

            if (msgType === "stream" && msg.content.name === "stdout") {
                const text = msg.content.text;

                // Show base64 video if present
                if (text.startsWith("VIDEO:")) {
                    const base64 = text.replace("VIDEO:", "").trim();
                    setVideoData("data:video/mp4;base64," + base64);
                    setTerminalOutput(prev => prev + "\nVideo Generated\n");
                }
                else {
                    // Append any regular output to terminal
                    setTerminalOutput(prev => prev + "\n" + stripAnsiCodes(text));
                }
            }

            if (msgType === "error") {
                const { ename, evalue, traceback } = msg.content;
                const errorText = `\nKernel Error: ${ename}: ${evalue}\n${(traceback || []).join("\n")}`;
                setTerminalOutput(prev => prev + "\n" + stripAnsiCodes(errorText));
            }

        };


        ws.addEventListener("message", handleMessage);


        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws]);

    const extractManimClass = (code: string): string | null => {
        const classMatch = code.match(/(\w+)\s*\(\)\s*\.render\s*\(\s*\)/);
        return classMatch ? classMatch[1] : null;
    };


    const sendCodeToKernel = () => {

        const codeclass = extractManimClass(userCode);
        if (!codeclass) {
            alert("Your code must define a class extending Scene, like: class MyScene(Scene):");
            return;
        }

        const code = `
from manim import *
import base64
from manim import tempconfig
config.quality = "medium_quality"  # corresponds to 720p30
config.disable_caching = True

${userCode}

with open("media/videos/720p30/${codeclass}.mp4", "rb") as f:
    data = base64.b64encode(f.read()).decode()
    print("VIDEO:" + data)
`;

        if (!ws || ws.readyState !== WebSocket.OPEN) {
            return;
        }

        const msg = {
            header: {
                msg_id: Date.now().toString(),
                username: "user",
                session: "sess",
                msg_type: "execute_request",
                version: "5.3"
            },
            parent_header: {},
            metadata: {},
            content: {
                code: code,
                silent: false,
                store_history: true,
                user_expressions: {},
                allow_stdin: false,
                stop_on_error: true
            }
        };

        ws.send(JSON.stringify(msg));
    };

    const handleprompt = () => {
        if (chatInput.trim() === '') return;
        setMessages(prev => [...prev,
        { sender: 'user', text: chatInput },
        { sender: 'ai', text: `You said: ${chatInput}` }]);
        setChatInput('');
    }

    useEffect(handleprompt,[])

    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/3 border border-black p-2 flex flex-col">
                    <div className="flex-1 overflow-y-hidden">
                        <div className="flex-1 overflow-y-auto mb-2 border p-2">
                            {messages.map((msg, idx) => (
                                <p key={idx} className="mb-1">
                                    <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong>
                                    {msg.text}
                                </p>
                            ))}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <textarea
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            placeholder="Ask something..."
                            className="flex-1 border p-2 rounded resize-none h-24 overflow-y-auto"
                        />
                        <button
                            onClick={handleprompt}
                            className="h-24 px-4 bg-blue-500 text-white rounded"
                        >
                            Send
                        </button>
                    </div>

                </div>


                <div className="w-2/3 border border-black p-2 flex flex-col">
                    <div className="flex gap-x-2 mb-2">
                        <button className={`p-[4px] ${view === "editor" ? 'bg-red-600' : 'bg-red-300'}  text-white rounded-[4px] `}
                            onClick={() => setView('editor')}>
                            Editor
                        </button>
                        <button className={`p-[4px] ${view === "video" ? 'bg-blue-600' : 'bg-blue-300'} text-white rounded-[4px] `} onClick={() => setView('video')}>
                            Preview
                        </button>

                        <div className="mb-2 ml-auto mr-auto text-sm font-semibold text-gray-700">
                            Kernel Status:{" "}
                            <span className={
                                status === 'Kernel Ready' ? 'text-green-600' :
                                    (status === 'Connecting') || (status === 'Setting Up Environment') ? 'text-yellow-500' :
                                        'text-red-600'
                            }>
                                {status}
                            </span>
                        </div>
                        {status === "Kernel disconnected" ?
                            <button
                                onClick={connect}
                                className="ml-auto p-[4px] bg-green-400 text-white rounded-[4px]">
                                Reconnect
                            </button>
                            :
                            <button
                                onClick={sendCodeToKernel}
                                className="ml-auto p-[4px] bg-green-800 text-white rounded-[4px]"
                            >
                                Generate
                            </button>
                        }

                    </div>

                    <div className="flex-1 border overflow-hidden flex flex-col">
                        {view === 'editor' ? (
                            <>
                                <textarea
                                    value={userCode}
                                    onChange={(e) => setUserCode(e.target.value)}
                                    className="flex-1 resize-none w-full p-2 outline-none" />
                            </>
                        ) : (
                            <video
                                className="w-full h-full object-contain"
                                controls
                                style={{ display: videoData ? 'block' : 'none' }}
                                src={videoData || undefined}
                            />

                        )}
                    </div>

                    <div
                        id="terminal"
                        className="mt-1 h-24 font-mono bg-black text-green-300 text-xs p-2 overflow-y-auto border whitespace-pre-wrap" >
                        {terminalOutput}
                    </div>

                </div>
            </div >
        </>
    )
}

export default Workspace_old;