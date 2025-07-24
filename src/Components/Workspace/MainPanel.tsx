import React from 'react';
import type { ViewType } from './types';
import ViewTabs from './ViewTabs';
import KernelStatus from './KernelStatus';
import CodeEditor from './CodeEditor';
import VideoPreview from './VideoPreview';
import Terminal from './Terminal';

interface CodePanelProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
  status: string;
  onReconnect: () => void;
  onGenerate: () => void;
  userCode: string;
  onCodeChange: (code: string) => void;
  videoData: string | null;
  terminalOutput: string;
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
  terminalOutput
}: CodePanelProps) {
  return (
    <div className="w-2/3 border border-black p-2 flex flex-col">
      <div className="flex justify-between items-center mb-2">
        <ViewTabs currentView={view} onViewChange={onViewChange} />
        <KernelStatus
          status={status}
          onReconnect={onReconnect}
          onGenerate={onGenerate}
        />
      </div>

      <div className="flex-1 border overflow-hidden flex flex-col">
        {view === 'editor' ? (
          <CodeEditor code={userCode} onChange={onCodeChange} />
        ) : (
          <VideoPreview videoData={videoData} />
        )}
      </div>

      <Terminal output={terminalOutput} />
    </div>
  );
}