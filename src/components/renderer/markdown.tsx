"use client"

import type React from "react"

import { memo } from "react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { oneLight, oneDark } from "react-syntax-highlighter/dist/esm/styles/prism"
import { Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { toast } from "sonner"

interface MarkdownRendererProps {
    content: string
    className?: string
    theme?: "light" | "dark"
    enableCopyButton?: boolean
    textAlign?: "left" | "right" | "center"
}

export const MarkdownRenderer = memo(({ content, className = "", theme = "light", enableCopyButton = true, textAlign = "left", }: MarkdownRendererProps) => {
    const [copiedCode, setCopiedCode] = useState<string | null>(null)

    const handleCopyCode = (code: string) => {
        navigator.clipboard.writeText(code)
        toast.success("クリップボードにコードをコピーしました！")
        setCopiedCode(code)
        setTimeout(() => setCopiedCode(null), 2000)
    }

    const CodeBlock = ({ language, code }: { language: string; code: string }) => {
        const isCopied = copiedCode === code
        return (
            <div className="relative group">
                <SyntaxHighlighter
                    style={theme === "dark" ? oneDark : oneLight}
                    language={language}
                    PreTag="div"
                    className="rounded-lg text-sm !my-4"
                    showLineNumbers={true}
                    wrapLines={true}
                    customStyle={{
                        margin: 0,
                        padding: "1rem",
                        fontSize: "0.875rem",
                        lineHeight: "1.5",
                    }}
                >
                    {code}
                </SyntaxHighlighter>
                {enableCopyButton && (
                    <Button onClick={() => handleCopyCode(code)} className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 h-8 w-8 p-0 bg-neutral-200/50 hover:bg-neutral-200/60 dark:bg-neutral-800 dark:hover:bg-neutral-700" variant="ghost" size="sm">
                        {isCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    </Button>
                )}
            </div>
        )
    }

    return (
        <div className={`markdown-renderer ${className}`}>
            <ReactMarkdown
                components={{
                    code(props: any) {
                        const { node, inline, className, children, ...rest } = props
                        const match = /language-(\w+)/.exec(className || "")
                        const code = String(children).replace(/\n$/, "")
                        return !inline && match ? (
                            <CodeBlock language={match[1]} code={code} />
                        ) : (
                            <code className="rounded-xl px-1.5 py-0.5 text-sm font-mono text-neutral-800 mx-0.5" {...rest}>
                                {children}
                            </code>
                        )
                    },
                    p(props: any) {
                        const { children } = props
                        return <p className={`mb-3 last:mb-0 text-${textAlign} leading-relaxed`}>{children}</p>
                    },
                    ul(props: any) {
                        const { children } = props
                        return <ul className={`list-disc list-inside mb-4 space-y-1 text-${textAlign} pl-4`}>{children}</ul>
                    },
                    ol(props: any) {
                        const { children } = props
                        return <ol className={`list-decimal list-inside mb-4 space-y-1 text-${textAlign} pl-4`}>{children}</ol>
                    },
                    li(props: any) {
                        const { children } = props
                        return <li className="leading-relaxed">{children}</li>
                    },
                    a(props: any) {
                        const { children, href } = props
                        return (
                            <a href={href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:underline-offset-4 transition-all duration-200">
                                {children}
                            </a>
                        )
                    },
                    blockquote(props: any) {
                        const { children } = props
                        return (
                            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 italic text-neutral-700 dark:text-neutral-300 bg-neutral-50 dark:bg-neutral-800/50 rounded-r-lg">
                                {children}
                            </blockquote>
                        )
                    },
                    strong(props: any) {
                        const { children } = props
                        return <strong className="font-semibold text-neutral-900 dark:text-neutral-100">{children}</strong>
                    },
                    em(props: any) {
                        const { children } = props
                        return <em className="italic text-neutral-800 dark:text-neutral-200">{children}</em>
                    },
                    del(props: any) {
                        const { children } = props
                        return <del className="line-through text-neutral-500 dark:text-neutral-400">{children}</del>
                    },
                    hr() {
                        return <hr className="border-neutral-300 dark:border-neutral-600 my-6" />
                    },
                    table(props: any) {
                        const { children } = props
                        return (
                            <div className="overflow-x-auto my-4">
                                <table className="min-w-full border-collapse border border-neutral-300 dark:border-neutral-600 rounded-lg overflow-hidden">
                                    {children}
                                </table>
                            </div>
                        )
                    },
                    thead(props: any) {
                        const { children } = props
                        return <thead className="bg-neutral-50 dark:bg-neutral-800">{children}</thead>
                    },
                    tbody(props: any) {
                        const { children } = props
                        return <tbody className="bg-white dark:bg-neutral-900">{children}</tbody>
                    },
                    tr(props: any) {
                        const { children } = props
                        return (
                            <tr className="border-b border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-150">
                                {children}
                            </tr>
                        )
                    },
                    th(props: any) {
                        const { children } = props
                        return (
                            <th className="border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-left font-semibold text-neutral-900 dark:text-neutral-100 bg-neutral-100 dark:bg-neutral-700">
                                {children}
                            </th>
                        )
                    },
                    td(props: any) {
                        const { children } = props
                        return (
                            <td className="border border-neutral-300 dark:border-neutral-600 px-4 py-3 text-neutral-700 dark:text-neutral-300">
                                {children}
                            </td>
                        )
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
});

MarkdownRenderer.displayName = "MarkdownRenderer"