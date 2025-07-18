import { useEffect, useState } from "react";

export function useBinderKernel() {
  const [ws, setWs] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState("connecting");

  useEffect(() => {
    const connect = async () => {
      const repo = "AfzalYellapur/MathMotion-Dockerfile/main";
      const res = await fetch(`https://mybinder.org/build/gh/${repo}`);
      const reader = res.body!.getReader();
      const decoder = new TextDecoder("utf-8");

      let binderUrl = "";
      let binderToken = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n");

        for (let line of lines) {
          if (line.startsWith("data:")) {
            const json = JSON.parse(line.substring(5));
            if (json.phase === "ready") {
              binderUrl = json.url;
              binderToken = json.token;
              break;
            }
          }
        }

        if (binderUrl) break;
      }

      setStatus("Binder ready. Starting kernel...");
      const startRes = await fetch(`${binderUrl}api/kernels?token=${binderToken}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "python3" })
      });

      const kernel = await startRes.json();
      const kernelId = kernel.id;

      const wsUrl = binderUrl.replace(/^http/, "ws") +
        `api/kernels/${kernelId}/channels?token=${binderToken}`;

      const socket = new WebSocket(wsUrl);

      socket.onopen = () => {
        setStatus("Kernel WebSocket connected");
        setWs(socket);
      };

      socket.onerror = () => {
        setStatus("WebSocket error");
      };


    };

    connect();
  }, []);

  return { ws, status };
}
