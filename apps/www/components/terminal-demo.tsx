"use client"

import { CodeBlock } from "./code-block"
import { useCommand } from "./command-context"

export function TerminalDemo() {
  const { formatCommand } = useCommand()

  const commands = [
    formatCommand("creanote init"),
    formatCommand("creanote add daily"),
    formatCommand("creanote add note"),
  ]

  const terminalCommands = `${commands[0]}
✓ Initialized creanote in current directory

${commands[1]}
✓ Created daily/2024/2024-12/week-51/2024-12-20.md

${commands[2]}
✓ Created 2024-12-20.md`

  return (
    <CodeBlock copyText={terminalCommands} title="Terminal" showToggle={true}>
      <div className="text-green-400">$ {commands[0]}</div>
      <div className="text-slate-300 mt-2">✓ Initialized creanote in current directory</div>
      <div className="text-green-400 mt-4">$ {commands[1]}</div>
      <div className="text-slate-300 mt-2">✓ Created daily/2024/2024-12/week-51/2024-12-20.md</div>
      <div className="text-green-400 mt-4">$ {commands[2]}</div>
      <div className="text-slate-300 mt-2">✓ Created 2024-12-20.md</div>
    </CodeBlock>
  )
}
