"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Terminal,
  FileText,
  Calendar,
  Folder,
  Download,
  Github,
  Zap,
  Shield,
  Globe,
} from "lucide-react";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { TerminalDemo } from "@/components/terminal-demo";
import { InstallationSection } from "@/components/installation-section";
import { UsageSection } from "@/components/usage-section";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm sticky top-0 z-40 border-slate-200 dark:border-slate-700">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center space-x-2">
            <Terminal className="h-8 w-8 text-slate-700 dark:text-slate-300" />
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              creanote
            </h1>
          </a>
          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="#features"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#installation"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Installation
            </Link>
            <Link
              href="#usage"
              className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
            >
              Usage
            </Link>
            <Link
              href="https://github.com/elitalpa/creanote"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Github className="h-4 w-4 mr-2" />
                GitHub
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-4xl">
          <Badge
            variant="secondary"
            className="mb-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300"
          >
            Note Management Tool
          </Badge>
          <h2 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-slate-100 mb-6 leading-tight">
            Easily create
            <span className="text-slate-600 dark:text-slate-400">
              {" "}
              organized notes
            </span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            A powerful CLI tool that helps you create and manage your notes in
            markdown format. Simple, portable, and designed for long-term access
            without vendor lock-in.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#installation">
              <Button
                size="lg"
                className="bg-slate-900 dark:bg-slate-100 hover:bg-slate-800 dark:hover:bg-slate-200 text-white dark:text-slate-900 px-8 py-3"
              >
                <Download className="h-5 w-5 mr-2" />
                Get Started
              </Button>
            </Link>
            <Link
              href="https://github.com/elitalpa/creanote#readme"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                variant="outline"
                size="lg"
                className="bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-700 px-8 py-3"
              >
                <Terminal className="h-5 w-5 mr-2" />
                View Docs
              </Button>
            </Link>
          </div>
          <div className="mt-2">
            <a
              href="https://www.npmjs.com/package/creanote"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant={"link"}>View on NPM</Button>
            </a>
          </div>
        </div>
      </section>

      {/* Terminal Demo */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <TerminalDemo />
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Why Choose Creanote?
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Built with simplicity and portability in mind, creanote ensures
              your notes remain accessible forever.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <FileText className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Markdown Format
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Store notes in plain text markdown for maximum portability and
                  tool compatibility.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <Calendar className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Daily Notes
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Automatically organized daily notes with year/month/week
                  structure for easy navigation.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <Folder className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Smart Organization
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Intelligent file structure that keeps your notes organized
                  without manual effort.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <Zap className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Quick Setup
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Get started instantly with npx or install globally. No complex
                  configuration required.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <Shield className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  No Lock-in
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Your notes remain yours forever. Plain text format works with
                  any editor or tool.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-slate-200 dark:border-slate-700 hover:shadow-lg dark:hover:shadow-slate-900/20 transition-shadow bg-white dark:bg-slate-800">
              <CardHeader>
                <Globe className="h-10 w-10 text-slate-700 dark:text-slate-300 mb-2" />
                <CardTitle className="text-slate-900 dark:text-slate-100">
                  Cross-Platform
                </CardTitle>
                <CardDescription className="dark:text-slate-400">
                  Works on any system with Node.js. Move your notes anywhere
                  without compatibility issues.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Installation Section */}
      <section
        id="installation"
        className="py-20 px-4 bg-slate-50 dark:bg-slate-800"
      >
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Get Started in Seconds
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Choose your preferred installation method
            </p>
          </div>

          <InstallationSection />

          <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg">
            <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
              Requirements
            </h4>
            <p className="text-blue-800 dark:text-blue-200">
              Node.js v20 LTS or higher is required. Download from{" "}
              <Link
                href="https://nodejs.org/en/download/prebuilt-binaries"
                className="underline hover:no-underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                nodejs.org
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Usage Section */}
      <section id="usage" className="py-20 px-4 bg-white dark:bg-slate-900">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Simple Commands, Powerful Results
            </h3>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Three simple commands to manage all your notes
            </p>
          </div>

          <UsageSection />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-slate-900 dark:bg-slate-950 text-white">
        <div className="container mx-auto text-center max-w-3xl">
          <h3 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Start Organizing Your Notes Today
          </h3>
          <p className="text-xl text-slate-300 dark:text-slate-400 mb-8">
            Join developers who trust creanote for their note-taking workflow.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="#installation">
              <Button
                size="lg"
                variant="secondary"
                className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3"
              >
                <Terminal className="h-5 w-5 mr-2" />
                Try with npx
              </Button>
            </Link>
            <Link
              href="https://github.com/elitalpa/creanote"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="lg"
                variant="outline"
                className="border-slate-400 dark:border-slate-500 text-slate-200 hover:text-white hover:bg-slate-800 dark:hover:bg-slate-700 bg-slate-800/20 dark:bg-slate-800 px-8 py-3"
              >
                <Github className="h-5 w-5 mr-2" />
                View on GitHub
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Terminal className="h-6 w-6 text-slate-600 dark:text-slate-400" />
            <span className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              creanote
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Built by{" "}
            <Link
              href="https://eli-talpa.com"
              className="text-slate-900 dark:text-slate-100 hover:underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              @elitalpa
            </Link>
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-500">
            Licensed under the MIT license
          </p>
        </div>
      </footer>

      {/* Theme Toggle Button */}
      <ThemeToggle />
    </div>
  );
}
