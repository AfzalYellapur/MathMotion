function generateManimCode(userCode: string, className: string): string {
  return `
from manim import *
import base64
from manim import tempconfig
config.quality = "medium_quality"  # corresponds to 720p30
config.disable_caching = True

${userCode}

with open("media/videos/720p30/${className}.mp4", "rb") as f:
    data = base64.b64encode(f.read()).decode()
    print("VIDEO:" + data)
`;
}

function extractManimClass(code: string): string | null {
  const classMatch = code.match(/(\w+)\s*\(\)\s*\.render\s*\(\s*\)/);
  return classMatch ? classMatch[1] : null;
}

import { useCallback } from 'react';
import type { KernelMessage } from '../Components/Workspace/types';

interface UseCodeExecutionProps {
  ws: WebSocket | null;
}


function useCodeExecution({ ws }: UseCodeExecutionProps) {
  const executeCode = useCallback((userCode: string) => {
    const className = extractManimClass(userCode);

    if (!className) {
      alert("Your code must define a class extending Scene, like: class MyScene(Scene):");
      return false;
    }

    if (!ws || ws.readyState !== WebSocket.OPEN) {
      console.warn("WebSocket is not connected");
      return false;
    }

    const code = generateManimCode(userCode, className);

    const message: KernelMessage = {
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

    try {
      ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error("Failed to send code to kernel:", error);
      return false;
    }
  }, [ws]);

  return { executeCode };
}

export default useCodeExecution;