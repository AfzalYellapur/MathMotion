import { useState, useEffect } from 'react';

export default function useTerminal() {
  const [terminalOutput, setTerminalOutput] = useState<string>('');

  const addOutput = (text: string) => {
    setTerminalOutput(prev => prev + text);
  };

  const clearOutput = () => {
    setTerminalOutput('');
  };

  useEffect(() => {
    const el = document.getElementById("terminal");
    if (el) el.scrollTop = el.scrollHeight;
  }, [terminalOutput]);

  return { terminalOutput, addOutput, clearOutput };
}