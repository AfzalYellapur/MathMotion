import React from 'react';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
}

export default function CodeEditor({ code, onChange }: CodeEditorProps) {
  return (
    <textarea
      value={code}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 resize-none w-full p-2 outline-none"
      placeholder="Enter your Manim code here..."
    />
  );
}