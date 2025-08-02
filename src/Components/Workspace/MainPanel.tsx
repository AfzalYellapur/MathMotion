import { AnimatePresence, motion } from 'framer-motion';
import type { ViewType } from './types';
import ViewTabs from './ViewTabs';
import CodeEditor from './CodeEditor';
import VideoPreview from './VideoPreview';
import BlockingOverlay from './BlockingOverlay';
import GenerateButton from './GenerateButton';

interface MainPanelProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  status: string;
  onReconnect: () => void;
  onGenerate: () => void;
  userCode: string;
  onCodeChange: (code: string) => void;
  videoData: string | null;
  codeError: string | null;
  isGenerating: boolean;
}

export default function MainPanel({
  view,
  onViewChange,
  status,
  onReconnect,
  onGenerate,
  userCode,
  onCodeChange,
  videoData,
  codeError,
  isGenerating,
}: MainPanelProps) {
  return (
    <div className="w-2/3 m-2 p-2 bg-zinc-800 rounded-2xl flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <div className=' flex items-center'>
          <ViewTabs currentView={view} onViewChange={onViewChange} />
        </div>
        <GenerateButton onGenerate={onGenerate} disabled= {isGenerating || status !== 'Kernel Ready'} />
      </div>

      <div className="flex-1 rounded-xl overflow-hidden">
        <AnimatePresence mode="wait">
          {view === 'editor' ? (
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <CodeEditor code={userCode} onChange={onCodeChange} />
              <BlockingOverlay
                isVisible={["Connecting", "Getting Response", "Setting Up Environment", "Kernel disconnected", "WebSocket error"].includes(status)}
                status={status}
                onReconnect={onReconnect}
              />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="relative h-full w-full"
            >
              <VideoPreview videoData={videoData} codeError={codeError} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}