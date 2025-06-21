"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { CodeBlock } from "./code-block"
import { PackageManagerTabs } from "./package-manager-tabs"
import { useCommand } from "./command-context"
import { Download, Zap, RefreshCw } from "lucide-react"

export function InstallationSection() {
  const { formatCommand } = useCommand()

  const quickStartCommands = {
    npm: "npx creanote --help",
    pnpm: "pnpm dlx creanote --help",
    yarn: "npx creanote --help", // Yarn uses npx
    bun: "bunx creanote --help",
  }

  const installCommands = {
    npm: "npm install -g creanote",
    pnpm: "pnpm install -g creanote",
    yarn: "yarn global add creanote",
    bun: "bun install -g creanote",
  }

  const updateCommands = {
    npm: "npm install -g creanote@latest",
    pnpm: "pnpm install -g creanote@latest",
    yarn: "yarn global add creanote@latest",
    bun: "bun install -g creanote@latest",
  }

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900 dark:text-slate-100">
              <Zap className="h-5 w-5 mr-2" />
              Quick Start (No Installation)
            </CardTitle>
            <CardDescription className="dark:text-slate-400">
              Use creanote instantly without installation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PackageManagerTabs commands={quickStartCommands} showToggle={false} />
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-3">
              Always uses the latest version automatically
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
          <CardHeader>
            <CardTitle className="flex items-center text-slate-900 dark:text-slate-100">
              <Download className="h-5 w-5 mr-2" />
              Global Installation (Recommended)
            </CardTitle>
            <CardDescription className="dark:text-slate-400">Install globally for system-wide access</CardDescription>
          </CardHeader>
          <CardContent>
            <PackageManagerTabs commands={installCommands} showToggle={false} />
            <div className="mt-4">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">Then use creanote anywhere:</p>
              <CodeBlock copyText={formatCommand("creanote --help")} showToggle={true}>
                <div className="text-green-400">{formatCommand("creanote --help")}</div>
              </CodeBlock>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
        <CardHeader>
          <CardTitle className="flex items-center text-slate-900 dark:text-slate-100">
            <RefreshCw className="h-5 w-5 mr-2" />
            Update to Latest Version
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Keep creanote up to date with the latest features
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">If installed globally:</h4>
              <PackageManagerTabs commands={updateCommands} showToggle={false} />
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">If using npx/dlx/bunx:</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                These tools automatically use the latest version - no update needed!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
