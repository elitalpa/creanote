"use client"

import { Button } from "@/components/ui/button"
import { useCommand } from "./command-context"

export function CommandToggle() {
  const { useNpx, setUseNpx, currentPackageManager } = useCommand()

  const getToggleText = () => {
    const prefixes = {
      npm: "npx",
      pnpm: "pnpm",
      yarn: "npx", // Yarn also uses npx
      bun: "bunx",
    }
    return prefixes[currentPackageManager]
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setUseNpx(!useNpx)}
      className={`h-6 w-8 p-0 text-xs font-mono flex items-center justify-center transition-colors ${
        useNpx
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "hover:bg-slate-700 dark:hover:bg-slate-600 text-slate-400 hover:text-slate-200"
      }`}
      aria-label="Toggle npx mode"
      aria-pressed={useNpx}
    >
      {getToggleText()}
    </Button>
  )
}
