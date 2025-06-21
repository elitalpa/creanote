"use client"

import { CopyButton } from "./copy-button"
import { CommandToggle } from "./command-toggle"

interface CodeBlockControlsProps {
  copyText: string
  showToggle?: boolean
}

export function CodeBlockControls({ copyText, showToggle = false }: CodeBlockControlsProps) {
  return (
    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
      <div className="flex items-center space-x-2">
        {showToggle && <CommandToggle />}
        <CopyButton text={copyText} />
      </div>
    </div>
  )
}
