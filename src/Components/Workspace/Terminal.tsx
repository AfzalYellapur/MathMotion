import React from 'react';

interface TerminalProps {
  output: string;
}

export default function Terminal({ output }: TerminalProps) {
  return (
    <div
      id="terminal"
      className="mt-1 h-24 font-mono bg-black text-green-300 text-xs p-2 overflow-y-auto border whitespace-pre-wrap"
    >
      {output}
    </div>
  );
}