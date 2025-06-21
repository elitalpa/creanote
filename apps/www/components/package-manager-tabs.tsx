"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CommandToggle } from "./command-toggle"
import { CopyButton } from "./copy-button"
import { useCommand } from "./command-context"

interface PackageManagerTabsProps {
  commands: {
    npm: string
    pnpm: string
    yarn: string
    bun: string
  }
  showToggle?: boolean
  onTabChange?: (tab: "npm" | "pnpm" | "yarn" | "bun") => void
}

export function PackageManagerTabs({ commands, showToggle = false, onTabChange }: PackageManagerTabsProps) {
  const { currentPackageManager, setCurrentPackageManager } = useCommand()

  const tabs = [
    { id: "npm" as const, label: "npm" },
    { id: "pnpm" as const, label: "pnpm" },
    { id: "yarn" as const, label: "yarn" },
    { id: "bun" as const, label: "bun" },
  ]

  useEffect(() => {
    onTabChange?.(currentPackageManager)
  }, [currentPackageManager, onTabChange])

  const handleTabChange = (tabId: "npm" | "pnpm" | "yarn" | "bun") => {
    setCurrentPackageManager(tabId)
  }

  return (
    <div>
      {/* Tab bar with background extending full width */}
      <div className="bg-slate-200 dark:bg-slate-700 rounded-t-lg p-1 flex">
        <div className="flex">
          {tabs.map((tab, index) => (
            <Button
              key={tab.id}
              variant="ghost"
              size="sm"
              onClick={() => handleTabChange(tab.id)}
              className={`px-3 py-1.5 text-xs font-mono transition-colors ${
                currentPackageManager === tab.id
                  ? "bg-slate-300 dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-300/50 dark:hover:bg-slate-600/50"
              } ${index === 0 ? "rounded-l-md" : index === tabs.length - 1 ? "rounded-r-md" : ""}`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Code block connected to tab bar */}
      <div className="bg-slate-900 dark:bg-slate-950 rounded-b-lg p-4 relative group">
        <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="flex items-center space-x-2">
            {showToggle && <CommandToggle />}
            <CopyButton text={commands[currentPackageManager]} />
          </div>
        </div>
        <div className="font-mono text-sm">
          <div className="text-green-400">{commands[currentPackageManager]}</div>
        </div>
      </div>
    </div>
  )
}
