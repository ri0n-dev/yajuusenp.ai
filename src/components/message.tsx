"use client"

import { useState, useEffect, useRef } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserRound, Share2, Search, SearchCheck, Check, Copy, Bot } from "lucide-react"
import { TooltipContent, Tooltip, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useConversationStore } from "@/store/conversation"
import { MarkdownRenderer } from "@/components/renderer/markdown"
import { FactCheck } from "@/components/ui/factcheck"
import { ShareDialog } from "@/components/ui/share"

export function Message() {
    const { messages } = useConversationStore()
    const [name, setName] = useState("User")
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})
    const [copiedLocks, setCopiedLocks] = useState<Record<string, boolean>>({})
    const bottomRef = useRef<HTMLDivElement>(null)
    const [factTarget, setFactTarget] = useState("")
    const [factChecked, setFactChecked] = useState<Record<string, string>>({})
    const [isFactOpen, setIsFactOpen] = useState(false)
    const [shareUrl, setShareUrl] = useState("")
    const [isShareOpen, setIsShareOpen] = useState(false)
    const nameRef = useRef(name)

    const isThinking = messages.some((m) => m.content === "[thinking]" && m.sender.role === "ai")

    const getNameFromCookie = () => {
        const match = document.cookie.match(/(^| )name=([^;]+)/)
        if (match) {
            return decodeURIComponent(match[2])
        }
        return "User"
    }

    useEffect(() => {
        nameRef.current = name
    }, [name])

    useEffect(() => {
        setName(getNameFromCookie())
    }, [])

    useEffect(() => {
        const handleStorageChange = () => {
            const currentName = getNameFromCookie()
            if (currentName !== nameRef.current) {
                setName(currentName)
            }
        }

        window.addEventListener("storage", handleStorageChange)
        window.addEventListener("focus", handleStorageChange)

        return () => {
            window.removeEventListener("storage", handleStorageChange)
            window.removeEventListener("focus", handleStorageChange)
        }
    }, [])

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" })
    }, [messages])

    const getAIInfo = (prompt?: string) => {
        switch (prompt) {
            case "yajuu":
                return {
                    avatar: "/assets/yajuu.webp",
                    name: "野獣先輩",
                    id: "yajuu",
                    fallback: "YJ"
                };
            case "kona":
                return {
                    avatar: "/assets/kona.webp",
                    name: "粉ぷんぷん",
                    id: "kona",
                    fallback: "KP"
                };
            default:
                return {
                    avatar: null,
                    name: "AI",
                    fallback: "AI"
                };
        }
    };

    const handleCopy = (messageId: string, text: string) => {
        if (copiedLocks[messageId]) return

        navigator.clipboard.writeText(text)
        toast.success("クリップボードにコピーしました！")

        setCopiedStates((prev) => ({ ...prev, [messageId]: true }))
        setCopiedLocks((prev) => ({ ...prev, [messageId]: true }))

        setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [messageId]: false }))
            setCopiedLocks((prev) => ({ ...prev, [messageId]: false }))
        }, 2000)
    }

    return (
        <>
            <div className={`${messages.length === 0 ? "block" : "hidden"} text-center text-gray-500 py-20`}>
                <p>こんにちは, {name}</p>
                <p>伝説に残る会話を始めよう</p>
            </div>

            <div
                className={`${messages.length === 0 ? "hidden" : "block"} flex-1 overflow-y-auto py-10 space-y-4 relative`}
            >
                {messages.map((message) => {
                    const isCopied = copiedStates[message.id] || false
                    if (message.sender.role === "user") {
                        return (
                            <div key={message.id} className="flex gap-3 flex-row-reverse">
                                <div className="flex items-center justify-center bg-neutral-50 rounded-full w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
                                    <UserRound className="w-4 h-4 md:w-5 md:h-5" />
                                </div>

                                <div className="flex flex-col max-w-[70%] items-end">
                                    <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                        <span className="text-sm font-medium text-gray-700">{name}</span>
                                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>

                                    <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-50 text-neutral-900 rounded-br-md">
                                        <MarkdownRenderer
                                            content={message.content}
                                            textAlign="right"
                                            className="text-sm"
                                            theme="light"
                                        />
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-1.5 md:mt-2.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    onClick={() => handleCopy(message.id, message.content)}
                                                    className="hover:bg-neutral-900/3 size-7 transition-all duration-200"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <div className="relative">
                                                        <Copy
                                                            className={`transition-all duration-200 ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
                                                        />
                                                        <Check
                                                            className={`absolute inset-0 transition-all duration-200 ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                                                        />
                                                    </div>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>コピー</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        )
                    } else {
                        const aiInfo = getAIInfo(message.prompt);
                        return (
                            <div key={message.id} className="flex gap-3 flex-row">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src={aiInfo.avatar ?? undefined} alt={aiInfo.name} />
                                    <AvatarFallback>
                                        <Bot className="w-5 h-5" />
                                    </AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col max-w-[70%] items-start">
                                    <div className="flex items-center gap-2 mb-1 flex-row">
                                        <span className="text-sm font-medium text-gray-700">{aiInfo.name}</span>
                                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>

                                    <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-50 text-neutral-900 rounded-br-md">
                                        {message.content === "[thinking]" ? (
                                            <div className="flex items-center gap-2 py-2 text-gray-500">
                                                <div className="flex space-x-1">
                                                    <div className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce"></div>
                                                    <div
                                                        className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.1s" }}
                                                    ></div>
                                                    <div
                                                        className="w-2 h-2 bg-neutral-200 rounded-full animate-bounce"
                                                        style={{ animationDelay: "0.2s" }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ) : message.content === "[stop]" ? (
                                            <div className="flex items-center gap-2 py-2">
                                                <span className="text-sm">Error: エラーが発生しました。もう一度試してもエラーが解消されない場合は<a href="https://discord.gg/6BPfVm6cST" target="_blank" rel="noopener noreferrer" className="text-primary underline">Zisty Hub</a>にお問い合わせください。</span>
                                            </div>
                                        ) : (
                                            <MarkdownRenderer
                                                content={message.content}
                                                textAlign="left"
                                                className="text-sm"
                                                theme="light"
                                            />
                                        )}
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-1.5 md:mt-2.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    disabled={isThinking}
                                                    onClick={() => handleCopy(message.id, message.content)}
                                                    className="hover:bg-neutral-900/3 size-7 transition-all duration-200"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <div className="relative">
                                                        <Copy
                                                            className={`transition-all duration-200 ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`}
                                                        />
                                                        <Check
                                                            className={`absolute inset-0 transition-all duration-200 ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
                                                        />
                                                    </div>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>コピー</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    disabled={isThinking}
                                                    onClick={() => (setFactTarget(message.content), setIsFactOpen(true))}
                                                    className="hover:bg-neutral-900/3 size-7"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    {factChecked[message.content] ? <SearchCheck /> : <Search />}
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>ファクトチェック</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button
                                                    disabled={isThinking}
                                                    onClick={async () => {
                                                        try {
                                                            toast("共有URLを生成中・・・")

                                                            const jsonStr = JSON.stringify(
                                                                messages.map((m) => ({
                                                                    role: m.sender.role,
                                                                    prompt: m.prompt,
                                                                    timestamp: m.timestamp,
                                                                    content: m.content,
                                                                })),
                                                            )

                                                            const key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, [
                                                                "encrypt",
                                                            ])
                                                            const rawKey = await crypto.subtle.exportKey("raw", key)
                                                            const keyStr = btoa(String.fromCharCode(...new Uint8Array(rawKey)))

                                                            const iv = crypto.getRandomValues(new Uint8Array(12))
                                                            const encoded = new TextEncoder().encode(jsonStr)
                                                            const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, encoded)
                                                            const combined = new Uint8Array(iv.length + encrypted.byteLength)
                                                            combined.set(iv)
                                                            combined.set(new Uint8Array(encrypted), iv.length)
                                                            const encryptedStr = btoa(String.fromCharCode(...combined))

                                                            const url = `${location.origin}/?d=${encodeURIComponent(encryptedStr)}&k=${encodeURIComponent(keyStr)}`

                                                            const res = await fetch("/api/short", {
                                                                method: "POST",
                                                                headers: {
                                                                    "Content-Type": "application/json",
                                                                },
                                                                body: JSON.stringify({ url }),
                                                            })

                                                            if (res.ok) {
                                                                const shortData = await res.json()
                                                                setShareUrl(shortData.shorturl)
                                                            } else {
                                                                setShareUrl(url)
                                                            }

                                                            setIsShareOpen(true)
                                                            toast("共有URLの生成完了✓")
                                                        } catch (error) {
                                                            console.error("Error creating share URL:", error)
                                                            toast.error("共有URLの作成中にエラーが発生しました。")
                                                        }
                                                    }}
                                                    className="hover:bg-neutral-900/3 size-7"
                                                    size="icon"
                                                    variant="ghost"
                                                >
                                                    <Share2 />
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>共有</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        )
                    }
                })}
                <FactCheck
                    open={isFactOpen}
                    onOpenChange={(open) => {
                        if (!open) setFactTarget("")
                        setIsFactOpen(open)
                    }}
                    content={factTarget}
                    onResult={(result) => {
                        setFactChecked((prev) => ({ ...prev, [factTarget]: result }))
                    }}
                    cachedResult={factChecked[factTarget]}
                />
                <ShareDialog open={isShareOpen} onOpenChange={setIsShareOpen} url={shareUrl} />
                <div ref={bottomRef} />

                <div className="fixed bottom-0 left-0 right-0 h-32 pointer-events-none bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
        </>
    )
}