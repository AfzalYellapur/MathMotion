import type { Message } from '../types/index';
import GlassyChatbox from '../../ui/GlassyChatBox';
import GlassyChatInterface from '../../ui/GlassyChatInterface';
interface ChatPanelProps {
  messages: Message[];
  chatInput: string;
  onChatInputChange: (value: string) => void;
  onSendMessage: () => void;
}

export default function ChatPanel() {
  return (
    <div className="w-[30%] p-2 flex flex-col">
      {/* <div className="flex-1 overflow-y-hidden">
        <div className="flex-1  text-white overflow-y-auto mb-2 border p-2">
          {messages.map((msg, idx) => (
            <p key={idx} className="mb-1">
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong>
              {msg.text}
            </p>
          ))}
        </div>
      </div> */}
<GlassyChatInterface />
      {/* <div className="flex gap-2">
        <textarea
          value={chatInput}
          onChange={(e) => onChatInputChange(e.target.value)}
          placeholder="Ask something..."
          className="flex-1 border p-2 rounded resize-none h-24 overflow-y-auto"
        />
        <button
          onClick={onSendMessage}
          className="h-24 px-4 bg-blue-500 text-white rounded"
        >
          Send
        </button> */}
      {/* </div> */}
        <GlassyChatbox />
    </div>
  );
}