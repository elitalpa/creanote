"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface CommandContextType {
  useNpx: boolean
  setUseNpx: (useNpx: boolean) => void
  formatCommand: (command: string) => string
  currentPackageManager: "npm" | "pnpm" | "yarn" | "bun"
  setCurrentPackageManager: (pm: "npm" | "pnpm" | "yarn" | "bun") => void
}

const CommandContext = createContext<CommandContextType | undefined>(undefined)

export function CommandProvider({ children }: { children: ReactNode }) {
  const [useNpx, setUseNpx] = useState(false)
  const [currentPackageManager, setCurrentPackageManager] = useState<"npm" | "pnpm" | "yarn" | "bun">("npm")

  const formatCommand = (command: string) => {
    if (
      useNpx &&
      !command.startsWith("npx") &&
      !command.startsWith("pnpm dlx") &&
      !command.startsWith("yarn dlx") &&
      !command.startsWith("bunx")
    ) {
      const prefixes = {
        npm: "npx",
        pnpm: "pnpm dlx",
        yarn: "npx", // Yarn also uses npx
        bun: "bunx",
      }
      return command.replace(/^creanote/, `${prefixes[currentPackageManager]} creanote`)
    }
    return command
  }

  return (
    <CommandContext.Provider
      value={{
        useNpx,
        setUseNpx,
        formatCommand,
        currentPackageManager,
        setCurrentPackageManager,
      }}
    >
      {children}
    </CommandContext.Provider>
  )
}

export function useCommand() {
  const context = useContext(CommandContext)
  if (context === undefined) {
    throw new Error("useCommand must be used within a CommandProvider")
  }
  return context
}
