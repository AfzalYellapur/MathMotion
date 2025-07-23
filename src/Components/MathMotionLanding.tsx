"use client"

import type React from "react"
import { useState } from "react"
import { Send, History, Clock, Sparkles, LogIn, UserPlus } from "lucide-react"

interface ChatHistoryItem {
  id: string
  prompt: string
  timestamp: string
  status: "completed" | "processing" | "failed"
}

export default function MathMotionLanding() {
  const [prompt, setPrompt] = useState("")
  const [hoverSidebar, setHoverSidebar] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([
    {
      id: "1",
      prompt: "Create an animation showing the derivative of x²",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      prompt: "Animate the Pythagorean theorem proof",
      timestamp: "1 day ago",
      status: "completed",
    },
    {
      id: "3",
      prompt: "Show integration by parts step by step",
      timestamp: "2 days ago",
      status: "failed",
    },
  ])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    // Add to chat history
    const newItem: ChatHistoryItem = {
      id: Date.now().toString(),
      prompt: prompt.trim(),
      timestamp: "Just now",
      status: "processing",
    }
    setChatHistory((prev) => [newItem, ...prev])
    setPrompt("")
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              MathMotion
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-2">
              <button className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50">
                Examples
              </button>
              <button className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50">
               About
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={() => window.location.href = "/login"} className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50 flex items-center">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </button>
              <button onClick={() => window.location.href = "/signup"} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm px-3 py-2 rounded-md flex items-center">
                <UserPlus className="h-4 w-4 mr-2" />
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex h-[calc(100vh-73px)] relative">
        {/* Hover Trigger Area */}
        <div className="absolute left-0 top-0 w-12 h-full z-40" onMouseEnter={() => setHoverSidebar(true)} />

        {/* Sidebar */}
        <div
          className={`fixed left-0 top-[73px] h-[calc(100vh-73px)] w-80 bg-gray-950 border-r border-gray-800 transform transition-transform duration-300 ease-in-out z-30 ${
            hoverSidebar ? "translate-x-0" : "-translate-x-full"
          }`}
          onMouseEnter={() => setHoverSidebar(true)}
          onMouseLeave={() => setHoverSidebar(false)}
        >
          <div className="flex flex-col h-full">
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-white">
                <History className="h-5 w-5" />
                <h2 className="font-semibold">Chat History</h2>
              </div>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
              <div className="space-y-3">
                {chatHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-3 rounded-lg bg-gray-900 hover:bg-gray-800 cursor-pointer transition-colors border border-gray-800"
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-2 ${
                          item.status === "completed"
                            ? "bg-green-500"
                            : item.status === "processing"
                              ? "bg-yellow-500"
                              : "bg-red-500"
                        }`}
                      />
                      <div className="flex items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {item.timestamp}
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 line-clamp-2">{item.prompt}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-2xl space-y-8">
              {/* Hero Section */}
              <div className="text-center space-y-4">
                <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Create Beautiful Math Animations
                </h2>
                <p className="text-xl text-gray-400 max-w-lg mx-auto">
                  Transform mathematical concepts into stunning visual animations using the power of Manim
                </p>
              </div>

              {/* Prompt Input */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe the math animation you want to create... (e.g., 'Show how the sine function relates to the unit circle')"
                    className="w-full min-h-[120px] bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 resize-none p-3 pr-12 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="absolute bottom-3 right-3">
                    <button
                      type="submit"
                      disabled={!prompt.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 p-2 rounded-md flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-4">
                    <span>Press Ctrl+Enter to generate</span>
                  </div>
                  <span>{prompt.length}/500</span>
                </div>
              </form>

              {/* Example Prompts */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-gray-400">Try these examples:</h3>
                <div className="grid gap-2">
                  {[
                    "Animate the transformation of y = x² to y = (x-2)² + 3",
                    "Show the geometric interpretation of the derivative",
                    "Create a visualization of Euler's identity e^(iπ) + 1 = 0",
                  ].map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      className="text-left p-3 rounded-lg bg-gray-900/50 hover:bg-gray-900 border border-gray-800 hover:border-gray-700 transition-colors text-sm text-gray-300"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span>Powered by Manim</span>
              <span>•</span>
              <span>Built for educators and students</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
