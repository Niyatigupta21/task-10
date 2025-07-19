"use client"

import { useState, useEffect, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Download, Share2, Settings, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

interface FileContent {
  html: string
  css: string
  javascript: string
}

export default function CodeEditor() {
  const { theme, setTheme } = useTheme()
  const [files, setFiles] = useState<FileContent>({
    html: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Live Code Editor</title>
</head>
<body>
    <div class="container">
        <h1>Welcome to Live Code Editor</h1>
        <p>Edit the code and see live results!</p>
        <button onclick="changeColor()">Change Color</button>
    </div>
</body>
</html>`,
    css: `body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    margin: 0;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    text-align: center;
}

h1 {
    color: #333;
    margin-bottom: 20px;
}

button {
    background: #667eea;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

button:hover {
    background: #5a67d8;
}`,
    javascript: `function changeColor() {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelector('.container').style.background = randomColor;
}

// Add some interactivity
document.addEventListener('DOMContentLoaded', function() {
    console.log('Code editor loaded successfully!');
});`,
  })

  const [activeTab, setActiveTab] = useState<keyof FileContent>("html")
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const updatePreview = () => {
    if (iframeRef.current) {
      const iframe = iframeRef.current
      const document = iframe.contentDocument || iframe.contentWindow?.document

      if (document) {
        const fullHTML = `
          <!DOCTYPE html>
          <html>
          <head>
            <style>${files.css}</style>
          </head>
          <body>
            ${files.html.replace(/<html[^>]*>|<\/html>|<head[^>]*>[\s\S]*?<\/head>|<body[^>]*>|<\/body>/gi, "")}
            <script>${files.javascript}</script>
          </body>
          </html>
        `
        document.open()
        document.write(fullHTML)
        document.close()
      }
    }
  }

  useEffect(() => {
    const timer = setTimeout(updatePreview, 500)
    return () => clearTimeout(timer)
  }, [files])

  const handleFileChange = (fileType: keyof FileContent, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [fileType]: content,
    }))
  }

  const downloadProject = () => {
    const zip = `
      <!-- HTML File -->
      ${files.html}

      <!-- CSS File -->
      <style>
      ${files.css}
      </style>

      <!-- JavaScript File -->
      <script>
      ${files.javascript}
      </script>
    `

    const blob = new Blob([zip], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "project.html"
    a.click()
    URL.revokeObjectURL(url)
  }

  const resetCode = () => {
    setFiles({
      html: "<!-- Start coding your HTML here -->",
      css: "/* Start styling your CSS here */",
      javascript: "// Start coding your JavaScript here",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-white">Live Code Editor</h1>
              <span className="text-sm text-gray-300">Complete HTML, CSS and JavaScript on the web</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-white hover:bg-white/10"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="sm" onClick={updatePreview} className="text-white hover:bg-white/10">
                <Play className="h-4 w-4 mr-2" />
                Run
              </Button>
              <Button variant="ghost" size="sm" onClick={downloadProject} className="text-white hover:bg-white/10">
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Editor */}
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[calc(100vh-140px)]">
          {/* Code Editor Panel */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-slate-700 overflow-hidden">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as keyof FileContent)}>
              <div className="flex items-center justify-between p-4 border-b border-slate-700">
                <TabsList className="bg-slate-700/50">
                  <TabsTrigger value="html" className="data-[state=active]:bg-orange-500">
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="data-[state=active]:bg-blue-500">
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="javascript" className="data-[state=active]:bg-yellow-500">
                    JS
                  </TabsTrigger>
                </TabsList>
                <Button variant="ghost" size="sm" onClick={resetCode} className="text-gray-400 hover:text-white">
                  <Settings className="h-4 w-4" />
                </Button>
              </div>

              <TabsContent value="html" className="m-0 h-full">
                <textarea
                  value={files.html}
                  onChange={(e) => handleFileChange("html", e.target.value)}
                  className="w-full h-[calc(100vh-240px)] bg-slate-900 text-gray-100 p-4 font-mono text-sm resize-none border-none outline-none"
                  placeholder="Write your HTML code here..."
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="css" className="m-0 h-full">
                <textarea
                  value={files.css}
                  onChange={(e) => handleFileChange("css", e.target.value)}
                  className="w-full h-[calc(100vh-240px)] bg-slate-900 text-gray-100 p-4 font-mono text-sm resize-none border-none outline-none"
                  placeholder="Write your CSS code here..."
                  spellCheck={false}
                />
              </TabsContent>

              <TabsContent value="javascript" className="m-0 h-full">
                <textarea
                  value={files.javascript}
                  onChange={(e) => handleFileChange("javascript", e.target.value)}
                  className="w-full h-[calc(100vh-240px)] bg-slate-900 text-gray-100 p-4 font-mono text-sm resize-none border-none outline-none"
                  placeholder="Write your JavaScript code here..."
                  spellCheck={false}
                />
              </TabsContent>
            </Tabs>
          </Card>

          {/* Preview Panel */}
          <Card className="bg-white border-slate-300 overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">RESULT</h3>
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
            </div>
            <iframe
              ref={iframeRef}
              className="w-full h-[calc(100vh-240px)] border-none"
              title="Preview"
              sandbox="allow-scripts allow-same-origin"
            />
          </Card>
        </div>
      </div>
    </div>
  )
}
