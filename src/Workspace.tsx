import { useState, useEffect } from "react";
import { useBinderKernel } from "./hooks/useBinderKernel";
import AnsiToHtml from 'ansi-to-html';

function Workspace() {
    const [view, setView] = useState<'editor' | 'video'>('editor');
    const [chatInput, setChatInput] = useState('');
    const [messages, setMessages] = useState<
        { sender: 'user' | 'ai'; text: string }[]
    >([]);
    const { ws, status } = useBinderKernel();
    const [code, setCode] = useState('');
    const [videoData, setVideoData] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string>('');
    const ansiConverter = new AnsiToHtml();


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
                    console.log("Received video data.");
                }
                else {
                    // Append any regular output to terminal
                    setTerminalOutput(prev => prev + text);
                }
            }

            if (msgType === "error") {
                const { ename, evalue, traceback } = msg.content;
                const errorText = `\nKernel Error: ${ename}: ${evalue}\n${(traceback || []).join("\n")}`;
                setTerminalOutput(prev => prev + ansiConverter.toHtml(errorText));
                console.error(errorText);
            }

        };


        ws.addEventListener("message", handleMessage);

        return () => {
            ws.removeEventListener("message", handleMessage);
        };
    }, [ws]);



    const sendCodeToKernel = () => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.log("WebSocket not ready");
            return;
        }
        // setTerminalOutput('');

        const msg = {
            header: {
                msg_id: "1",
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
        console.log("Code sent to kernel");
    };

    const handleSend = () => {
        if (chatInput.trim() === '') return;
        setMessages(prev => [...prev,
        { sender: 'user', text: chatInput },
        { sender: 'ai', text: `You said: ${chatInput}` }]);
        setChatInput('');
    }
    return (
        <>
            <div className="flex h-screen">
                <div className="w-1/3 border border-black p-2 flex flex-col">
                    <div className="flex-1 overflow-y-hidden">
                        <div className="flex-1 overflow-y-auto mb-2 border p-2">
                            {messages.map((msg, idx) => (
                                <p key={idx} className="mb-1">
                                    <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
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
                            onClick={handleSend}
                            className="h-24 px-4 bg-blue-500 text-white rounded"
                        >
                            Send
                        </button>
                    </div>

                </div>


                <div className="w-2/3 border border-black p-2 flex flex-col">
                    <div className="flex gap-x-2 mb-2">
                        <button className={`p-[4px] ${view === "editor" ? 'bg-red-600' : 'bg-red-300'}  text-white rounded-[4px] `}
                            onClick={() => setView('editor')}>Editor</button>
                        <button className={`p-[4px] ${view === "video" ? 'bg-blue-600' : 'bg-blue-300'} text-white rounded-[4px] `} onClick={() => setView('video')}>Preview</button>
                        {view === 'editor' && (
                            <button
                                onClick={sendCodeToKernel}
                                className="ml-auto p-[4px] bg-green-800 text-white rounded-[4px]"
                            >
                                Generate
                            </button>
                        )}
                    </div>

                    <div className="flex-1 border overflow-hidden flex flex-col">
                        {view === 'editor' ? (
                            <>
                                <textarea
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
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

                    <div className="mt-1 h-24 font-mono text-xs p-2 overflow-y-auto border whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: terminalOutput }} />

                </div>
            </div >
        </>
    )
}

export default Workspace;