"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import {
  Send,
  History,
  Clock,
  Sparkles,
  Play,
  Download,
  Copy,
  Code,
  Video,
  Loader2,
  CheckCircle,
  XCircle,
  Menu,
  ArrowLeft,LogIn,UserPlus
} from "lucide-react"

interface ChatMessage {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: string
}

interface ChatHistoryItem {
  id: string
  prompt: string
  timestamp: string
  status: "completed" | "processing" | "failed"
}

interface GenerationState {
  isGenerating: boolean
  videoStatus: "idle" | "generating" | "completed" | "failed"
  codeStatus: "idle" | "generating" | "completed" | "failed"
  videoProgress: number
  codeProgress: number
}

export default function MathMotionLanding() {
  const [prompt, setPrompt] = useState("")
  const [hoverSidebar, setHoverSidebar] = useState(false)
  const [showSplitView, setShowSplitView] = useState(false)
  const [activeTab, setActiveTab] = useState<"video" | "code">("video")
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [generationState, setGenerationState] = useState<GenerationState>({
    isGenerating: false,
    videoStatus: "idle",
    codeStatus: "idle",
    videoProgress: 0,
    codeProgress: 0,
  })

  const [chatHistory] = useState<ChatHistoryItem[]>([
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

  const [generatedCode, setGeneratedCode] = useState("")
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState("")
  const chatEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [chatMessages])

  const simulateGeneration = async (userPrompt: string) => {
    setGenerationState({
      isGenerating: true,
      videoStatus: "generating",
      codeStatus: "generating",
      videoProgress: 0,
      codeProgress: 0,
    })

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: userPrompt,
      timestamp: new Date().toLocaleTimeString(),
    }
    setChatMessages((prev) => [...prev, userMessage])

    // Add assistant thinking message
    const thinkingMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: "I'll create a math animation for you. Let me generate the code and render the video...",
      timestamp: new Date().toLocaleTimeString(),
    }
    setChatMessages((prev) => [...prev, thinkingMessage])

    // Simulate code generation progress
    const codeInterval = setInterval(() => {
      setGenerationState((prev) => {
        const newProgress = Math.min(prev.codeProgress + Math.random() * 15, 100)
        if (newProgress >= 100) {
          clearInterval(codeInterval)
          return {
            ...prev,
            codeProgress: 100,
            codeStatus: "completed",
          }
        }
        return { ...prev, codeProgress: newProgress }
      })
    }, 200)

    // Simulate video generation progress
    const videoInterval = setInterval(() => {
      setGenerationState((prev) => {
        const newProgress = Math.min(prev.videoProgress + Math.random() * 10, 100)
        if (newProgress >= 100) {
          clearInterval(videoInterval)
          return {
            ...prev,
            videoProgress: 100,
            videoStatus: "completed",
          }
        }
        return { ...prev, videoProgress: newProgress }
      })
    }, 300)

    // Generate dummy code after 2 seconds
    setTimeout(() => {
      const dummyCode = `from manim import *

class DerivativeAnimation(Scene):
    def construct(self):
        # Create the function f(x) = x²
        func_text = MathTex(r"f(x) = x^2").to_edge(UP)
        self.play(Write(func_text))
        
        # Create axes
        axes = Axes(
            x_range=[-3, 3, 1],
            y_range=[-1, 9, 1],
            x_length=6,
            y_length=6,
        )
        
        # Create the parabola
        parabola = axes.plot(lambda x: x**2, color=BLUE)
        parabola_label = axes.get_graph_label(parabola, "x^2")
        
        self.play(Create(axes))
        self.play(Create(parabola), Write(parabola_label))
        
        # Show derivative calculation
        derivative_text = MathTex(r"f'(x) = 2x").next_to(func_text, DOWN)
        self.play(Write(derivative_text))
        
        self.wait(2)`

      setGeneratedCode(dummyCode)
    }, 2000)

    // Generate dummy video URL after 4 seconds
    setTimeout(() => {
      setGeneratedVideoUrl("/placeholder.svg?height=400&width=600&text=Math+Animation")
    }, 4000)

    // Complete generation after 5 seconds
    setTimeout(() => {
      setGenerationState((prev) => ({
        ...prev,
        isGenerating: false,
      }))

      // Add completion message
      const completionMessage: ChatMessage = {
        id: (Date.now() + 2).toString(),
        type: "assistant",
        content: "✅ Animation generated successfully! You can view the video and code in the panels on the right.",
        timestamp: new Date().toLocaleTimeString(),
      }
      setChatMessages((prev) => [...prev, completionMessage])
    }, 5000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    const userPrompt = prompt.trim()
    // Do NOT clear the prompt here, so it persists when returning to main view
    setShowSplitView(true)

    await simulateGeneration(userPrompt)
  }

  const copyCode = () => {
    navigator.clipboard.writeText(generatedCode)
  }

  const downloadVideo = () => {
    console.log("Downloading video...")
  }

  const StatusIndicator = ({ status, progress }: { status: string; progress: number }) => {
    switch (status) {
      case "generating":
        return (
          <div className="flex items-center gap-2 text-yellow-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Generating... {Math.round(progress)}%</span>
          </div>
        )
      case "completed":
        return (
          <div className="flex items-center gap-2 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <span className="text-sm">Completed</span>
          </div>
        )
      case "failed":
        return (
          <div className="flex items-center gap-2 text-red-400">
            <XCircle className="h-4 w-4" />
            <span className="text-sm">Failed</span>
          </div>
        )
      default:
        return null
    }
  }

  if (showSplitView) {
    return (
      <div className="min-h-screen bg-gray-950 text-white">
        {/* Navbar */}
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowSplitView(false)}
                className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800/50 flex items-center gap-2"
              >
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to Home</span>
              </button>
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                MathMotion
              </h1>
              <span className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded-full border border-blue-600/30">
                Demo
              </span>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                <button className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50">
                  Examples
                </button>
                <button className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50">
                  Docs
                </button>
              </div>
              <button className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800/50">
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>
        </nav>

        <div className="flex h-[calc(100vh-73px)]">
          {/* Chat Panel */}
          <div className="w-1/2 border-r border-gray-800 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-800">
              <div className="flex items-center gap-2 text-white">
                <History className="h-5 w-5" />
                <h2 className="font-semibold">Chat</h2>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-3 ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                        : "bg-gray-800 text-gray-100"
                    }`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs opacity-70 mt-1">{message.timestamp}</p>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Chat Input */}
            <div className="p-4 border-t border-gray-800">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="text"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ask a follow-up question..."
                  className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  disabled={!prompt.trim() || generationState.isGenerating}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 p-2 rounded-lg"
                >
                  <Send className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Content Panel */}
          <div className="w-1/2 flex flex-col">
            <div className="border-b border-gray-800">
              <div className="flex">
                <button
                  onClick={() => setActiveTab("video")}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                    activeTab === "video"
                      ? "text-blue-400 border-b-2 border-blue-400 bg-gray-900/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Video className="h-4 w-4" />
                  Video
                  <StatusIndicator status={generationState.videoStatus} progress={generationState.videoProgress} />
                </button>
                <button
                  onClick={() => setActiveTab("code")}
                  className={`flex-1 px-4 py-3 text-sm font-medium flex items-center justify-center gap-2 ${
                    activeTab === "code"
                      ? "text-blue-400 border-b-2 border-blue-400 bg-gray-900/50"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Code className="h-4 w-4" />
                  Code
                  <StatusIndicator status={generationState.codeStatus} progress={generationState.codeProgress} />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-hidden">
              {activeTab === "video" ? (
                <div className="h-full flex flex-col">
                  {generationState.videoStatus === "generating" ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">Generating video...</p>
                        <div className="w-64 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationState.videoProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{Math.round(generationState.videoProgress)}%</p>
                      </div>
                    </div>
                  ) : generationState.videoStatus === "completed" && generatedVideoUrl ? (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 p-4 flex items-center justify-center bg-gray-900">
                        <div className="relative">
                          <img
                            src={generatedVideoUrl || "/placeholder.svg"}
                            alt="Generated Math Animation"
                            className="max-w-full max-h-full rounded-lg border border-gray-700"
                          />
                          <button className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg hover:bg-black/70 transition-colors">
                            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                              <Play className="h-12 w-12 text-white" />
                            </div>
                          </button>
                        </div>
                      </div>
                      <div className="p-4 border-t border-gray-800">
                        <button
                          onClick={downloadVideo}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Download className="h-4 w-4" />
                          Download Video
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Video className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Video will appear here once generated</p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-full flex flex-col">
                  {generationState.codeStatus === "generating" ? (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">Generating code...</p>
                        <div className="w-64 bg-gray-800 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${generationState.codeProgress}%` }}
                          />
                        </div>
                        <p className="text-sm text-gray-500 mt-2">{Math.round(generationState.codeProgress)}%</p>
                      </div>
                    </div>
                  ) : generationState.codeStatus === "completed" && generatedCode ? (
                    <div className="h-full flex flex-col">
                      <div className="flex-1 overflow-auto">
                        <pre className="p-4 text-sm text-gray-300 bg-gray-900 h-full overflow-auto font-mono">
                          <code>{generatedCode}</code>
                        </pre>
                      </div>
                      <div className="p-4 border-t border-gray-800">
                        <button
                          onClick={copyCode}
                          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-4 py-2 rounded-lg flex items-center justify-center gap-2"
                        >
                          <Copy className="h-4 w-4" />
                          Copy Code
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Code will appear here once generated</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Original landing page view
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
                Docs
              </button>
            </div>
               <div className="flex items-center gap-2">
              <a href="/login">
                <button className="text-gray-400 hover:text-white text-sm px-3 py-2 rounded-md hover:bg-gray-800/50 flex items-center">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </button>
              </a>
              <a href="/signup">
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm px-3 py-2 rounded-md flex items-center">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </button>
              </a>
            </div>
            <button className="text-gray-400 hover:text-white p-2 rounded-md hover:bg-gray-800/50">
              <Menu className="h-5 w-5" />
            </button>
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
                    <p className="text-sm text-gray-300">{item.prompt}</p>
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
                  <span>Press Ctrl+Enter to generate</span>
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
