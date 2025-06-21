"use client"

import type React from "react"
import { CodeBlockControls } from "./code-block-controls"

interface CodeBlockProps {
  children: React.ReactNode
  copyText: string
  title?: string
  showToggle?: boolean
}

export function CodeBlock({ children, copyText, title, showToggle = false }: CodeBlockProps) {
  return (
    <div className="bg-slate-900 dark:bg-slate-950 rounded-lg p-4 relative group">
      {title && (
        <div className="flex items-center space-x-2 mb-4">
          <div className="w-3 h-3 bg-red-500 rounded-full"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          <span className="text-slate-400 text-sm ml-4">{title}</span>
        </div>
      )}

      <CodeBlockControls copyText={copyText} showToggle={showToggle} />

      <div className="font-mono text-sm">{children}</div>
    </div>
  )
}
