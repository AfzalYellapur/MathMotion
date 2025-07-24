import React from 'react';

interface KernelStatusProps {
  status: string;
  onReconnect: () => void;
  onGenerate: () => void;
}

export default function KernelStatus({ status, onReconnect, onGenerate }: KernelStatusProps) {
  const getStatusColor = () => {
    if (status === 'Kernel Ready') return 'text-green-600';
    if (status === 'Connecting' || status === 'Setting Up Environment') return 'text-yellow-500';
    return 'text-red-600';
  };

  return (
    <div className="flex items-center gap-2">
      <div className="text-sm font-semibold text-gray-700 mr-auto">
        Kernel Status:{" "}
        <span className={getStatusColor()}>
          {status}
        </span>
      </div>
      <div>
        {status === "Kernel disconnected" ? (
          <button
            onClick={onReconnect}
            className="p-[4px] bg-green-400 text-white rounded-[4px]"
          >
            Reconnect
          </button>
        ) : (
          <button
            onClick={onGenerate}
            className="p-[4px] bg-green-800 text-white rounded-[4px]"
          >
            Generate
          </button>
        )}
      </div>
    </div>
  );
}