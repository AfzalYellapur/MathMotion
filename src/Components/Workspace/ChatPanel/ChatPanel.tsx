import type { Message } from '../types/index';
import GlassyChatbox from '../../ui/GlassyChatBox';
import GlassyChatInterface from '../../ui/GlassyChatInterface';

export default function ChatPanel() {
  return (
    <div className="w-[30%] p-2 flex flex-col">
      <GlassyChatInterface />
      <GlassyChatbox />
    </div>
  );
}