import { ThemeProvider } from "next-themes"
import CodeEditor from "./components/CodeEditor"

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <CodeEditor />
      </div>
    </ThemeProvider>
  )
}

export default App
