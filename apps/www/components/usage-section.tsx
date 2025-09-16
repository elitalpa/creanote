"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CodeBlock } from "./code-block";
import { useCommand } from "./command-context";

export function UsageSection() {
  const { formatCommand } = useCommand();

  const initCommand = formatCommand("creanote init");
  const dailyCommand = formatCommand("creanote add daily");
  const noteCommand = formatCommand("creanote add note");

  const completeStructure = `my-notes/
├── .creanote/
│   ├── config.json           # info and settings for creanote
│   └── templates/
│       ├── daily.md          # default template for daily notes
│       └── note.md           # default template for regular notes
└── daily/
    ├── 2023/
    │   ├── 2023-01/
    │   ├── 2023-02/
    │   ├── ...
    │   └── 2023-12/
    └── 2024/
        ├── 2024-01/
        ├── 2024-02/
        ├── ...
        └── 2024-12/
            ├── week-49/
            ├── week-50/
            ├── week-51/
            │   ├── 2024-12-16.md
            │   ├── 2024-12-17.md
            │   ├── 2024-12-18.md
            │   ├── 2024-12-19.md
            │   ├── 2024-12-20.md
            │   ├── 2024-12-21.md
            │   └── 2024-12-22.md
            └── week-52/
                ├── 2024-12-23.md
                ├── 2024-12-24.md
                ├── 2024-12-25.md
                ├── 2024-12-26.md
                ├── 2024-12-27.md
                ├── 2024-12-28.md
                └── 2024-12-29.md`;

  return (
    <div className="space-y-8">
      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            1. Initialize
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Set up creanote in your notes directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock copyText={initCommand} showToggle={true}>
            <div className="text-green-400">{initCommand}</div>
          </CodeBlock>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            {"Creates a "}
            <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
              {'.creanote/'}
            </code>
            {" directory with configuration and templates."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            2. Add Daily Notes
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Create organized daily notes with automatic structure
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock copyText={dailyCommand} showToggle={true}>
            <div className="text-green-400">{dailyCommand}</div>
          </CodeBlock>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            {"Creates notes in "}
            <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
              {'daily/2024/2024-12/week-51/2024-12-20.md'}
            </code>
            {" structure."}
          </p>
        </CardContent>
      </Card>

      <Card className="border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
        <CardHeader>
          <CardTitle className="text-slate-900 dark:text-slate-100">
            3. Add Regular Notes
          </CardTitle>
          <CardDescription className="dark:text-slate-400">
            Create timestamped notes in your main directory
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CodeBlock copyText={noteCommand} showToggle={true}>
            <div className="text-green-400">{noteCommand}</div>
          </CodeBlock>
          <p className="text-slate-600 dark:text-slate-400 mt-4">
            {"Creates notes as "}
            <code className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-sm">
              {'2024-12-20.md'}
            </code>
            {" in your project root directory."}
          </p>
        </CardContent>
      </Card>

      <div className="bg-slate-50 dark:bg-slate-900 rounded-lg p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Daily Notes Structure
        </h3>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          Here's how creanote organizes your daily notes with automatic
          year/month/week structure:
        </p>
        <CodeBlock copyText={completeStructure} showToggle={false}>
          <pre className="text-slate-600 dark:text-slate-300 text-xs leading-relaxed whitespace-pre overflow-x-scroll">
            {completeStructure}
          </pre>
        </CodeBlock>
      </div>
    </div>
  );
}
