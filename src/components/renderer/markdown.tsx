"use client"

import type React from "react"

import { memo, ReactNode } from "react"
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
                    code({ inline, className, children, ...rest }: { inline?: boolean; className?: string; children?: ReactNode }) {
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
                    p(props: React.HTMLAttributes<HTMLParagraphElement>) {
                        return <p {...props} className={`mb-3 last:mb-0 text-${textAlign} leading-relaxed`} />
                    },                
                    ul(props: React.HTMLAttributes<HTMLUListElement>) {
                        return <ul {...props} className={`list-disc list-inside mb-4 space-y-1 text-${textAlign} pl-4`} />
                    },                 
                    ol(props: React.OlHTMLAttributes<HTMLOListElement>) {
                        return <ol {...props} className={`list-decimal list-inside mb-4 space-y-1 text-${textAlign} pl-4`} />
                    },                 
                    li(props: React.LiHTMLAttributes<HTMLLIElement>) {
                        return <li {...props} className="leading-relaxed" />
                    },
                    a(props: React.AnchorHTMLAttributes<HTMLAnchorElement>) {
                        return <a {...props} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2" />
                    },
                    blockquote(props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>) {
                        return <blockquote {...props} className="border-l-4 border-neutral-300 dark:border-neutral-600 pl-4 py-1 my-2 text-neutral-600 dark:text-neutral-300" />
                    },                    
                    del(props: React.DelHTMLAttributes<HTMLModElement>) {
                        return <del {...props} className="line-through" />
                    },
                    table(props: React.TableHTMLAttributes<HTMLTableElement>) {
                        return <div className="overflow-x-auto my-4"><table {...props} className="min-w-full divide-y divide-neutral-200 dark:divide-neutral-700" /></div>
                    },              
                    thead(props: React.HTMLAttributes<HTMLTableSectionElement>) {
                        return <thead {...props} className="bg-neutral-50 dark:bg-neutral-800" />
                    },
                    tbody(props: React.HTMLAttributes<HTMLTableSectionElement>) {
                        return <tbody {...props} className="divide-y divide-neutral-200 dark:divide-neutral-700" />
                    },
                    tr(props: React.HTMLAttributes<HTMLTableRowElement>) {
                        return <tr {...props} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors" />
                    },
                    th(props: React.ThHTMLAttributes<HTMLTableHeaderCellElement>) {
                        return <th {...props} className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider" />
                    },
                    td(props: React.TdHTMLAttributes<HTMLTableDataCellElement>) {
                        return <td {...props} className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 dark:text-neutral-100" />
                    },
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    )
});

MarkdownRenderer.displayName = "MarkdownRenderer"