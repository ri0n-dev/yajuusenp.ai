"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useConversationStore } from "@/store/conversation"
import { toast } from "sonner"
import { TermsAlert } from "@/components/ui/terms"
import { NameDialog } from "@/components/ui/name"
import { ArrowUp, Key, Loader, Bot } from "lucide-react"
import { SiOpenai, SiGooglegemini } from "@icons-pack/react-simple-icons"

const placeholders = [
    "野獣先輩のアソコの長さを教えて",
    "野獣先輩のアソコの太さを教えて",
    "野獣先輩のアソコの形を教えて",
    "野獣先輩のアソコの色を教えて",
    "野獣先輩の好きなプレイは教えて",
    "コードを生成して",
]

const models = [
    { value: "gpt-4o", label: "GPT-4o (OpenAI)", icon: SiOpenai },
    { value: "gpt-5", label: "GPT-5 (OpenAI)", icon: SiOpenai },
    { value: "gpt-5-mini", label: "GPT-5-mini (OpenAI)", icon: SiOpenai },
    { value: "gemini-2.5-flash", label: "Gemini 2.5 Flash (Google)", icon: SiGooglegemini },
]

const prompts = [
    { value: "yajuu", label: "野獣先輩" },
    { value: "kona", label: "粉ぷんぷん" },
    { value: "normal", label: "ノーマル（開発者向け）" },
]

export function Ask() {
    const { addMessage, removeThinkingMessage, messages } = useConversationStore()
    const [input, setInput] = useState("")
    const [selectedModel, setSelectedModel] = useState("gpt-4o")
    const [selectedPrompt, setSelectedPrompt] = useState("yajuu")
    const [currentPlaceholder, setCurrentPlaceholder] = useState("")
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const [authenticated, setAuthenticated] = useState(false)
    const [name, setName] = useState<string | null>(null)
    const [showTerms, setShowTerms] = useState(false)
    const [showNameDialog, setShowNameDialog] = useState(false)
    const [pendingMessage, setPendingMessage] = useState<string | null>(null)
    const [loadingAuth, setLoadingAuth] = useState(true)
    const [isSending, setIsSending] = useState(false)

    useEffect(() => {
        fetch("/api/auth", { method: "POST", credentials: "include" })
            .then((res) => res.json())
            .then((data) => {
                setAuthenticated(data.authenticated === true)
                setLoadingAuth(false)
                if (!data.authenticated) {
                    setShowTerms(true)
                }
            })
            .catch(() => setLoadingAuth(false))
    }, [])

    useEffect(() => {
        if (authenticated) {
            const savedName = document.cookie.split(";").find((row) => row.trim().startsWith("name="))
            if (savedName) {
                const nameValue = savedName.split("=")[1]
                const decodedName = decodeURIComponent(nameValue)
                setName(decodedName)
            } else {
                setShowNameDialog(true)
            }
        }
    }, [authenticated])

    useEffect(() => {
        const currentText = placeholders[placeholderIndex]
        const timer = setTimeout(
            () => {
                if (!isDeleting && charIndex < currentText.length) {
                    setCurrentPlaceholder(currentText.slice(0, charIndex + 1))
                    setCharIndex(charIndex + 1)
                } else if (isDeleting && charIndex > 0) {
                    setCurrentPlaceholder(currentText.slice(0, charIndex - 1))
                    setCharIndex(charIndex - 1)
                } else if (!isDeleting && charIndex === currentText.length) {
                    setTimeout(() => setIsDeleting(true), 2000)
                } else if (isDeleting && charIndex === 0) {
                    setIsDeleting(false)
                    setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
                }
            },
            isDeleting ? 50 : 100,
        )

        return () => clearTimeout(timer)
    }, [charIndex, isDeleting, placeholderIndex])

    const Icon = ({ icon: Icon, className }: { icon?: React.ComponentType<Record<string, unknown>>, className?: string }) => {
        if (!Icon) return null
        return <Icon className={className} />
    }

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target
        setInput(textarea.value)
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"
    }

    const handleSubmit = async () => {
        if (input.trim().length === 0) return

        if (!authenticated) {
            setPendingMessage(input)
            setShowTerms(true)
            return
        }

        if (!name) {
            setShowNameDialog(true)
            return
        }

        setIsSending(true)
        const messageToSend = input
        addMessage(messageToSend, "user")
        addMessage("[thinking]", "ai", true, selectedPrompt)
        setInput("")

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageToSend,
                    model: selectedModel,
                    prompt: selectedPrompt,
                    history: messages.filter(m => !m.isThinking && m.content !== "[stop]"),
                }),
            })

            if (res.ok) {
                const data = await res.json()
                removeThinkingMessage()
                addMessage(data.result, "ai", false, selectedPrompt)
            } else {
                console.error("API request failed")
                toast.error("APIリクエストに失敗しました。しばらくしてから再度お試しください。")
                addMessage("[stop]", "ai", true)
            }
        } catch (error) {
            console.error("Error during API request:", error)
            toast.error("リクエスト処理中にエラーが発生しました。再度お試しください。")
            addMessage("[stop]", "ai", true)
        } finally {
            setIsSending(false)
        }
    }

    const handleAgree = async () => {
        try {
            setLoadingAuth(true)

            const nonceRes = await fetch("/api/auth/nonce")
            if (!nonceRes.ok) throw new Error("Failed to get nonce")
            const { nonce } = await nonceRes.json()

            const authRes = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nonce }),
            })

            if (authRes.ok) {
                setAuthenticated(true)
                setShowTerms(false)

                if (pendingMessage) {
                    const messageToSend = pendingMessage
                    setPendingMessage(null)

                    setIsSending(true)
                    addMessage(messageToSend, "user")
                    addMessage("[thinking]", "ai", true, selectedPrompt)
                    setInput("")

                    try {
                        const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                message: messageToSend,
                                model: selectedModel,
                                prompt: selectedPrompt,
                                messages: messages.filter(m => !m.isThinking && m.content !== "[stop]"),
                            }),
                        })

                        if (res.ok) {
                            const data = await res.json()
                            removeThinkingMessage()
                            addMessage(data.result, "ai", false, selectedPrompt)
                        } else {
                            const errorText = await res.text()
                            console.error("API request failed with status:", res.status, "Error:", errorText)
                            toast.error("APIリクエストに失敗しました。しばらくしてから再度お試しください。")
                            addMessage("[stop]", "ai", true)
                        }
                    } catch (error) {
                        console.error("Error during API request:", error)
                        toast.error("リクエスト処理中にエラーが発生しました。再度お試しください。")
                        addMessage("[stop]", "ai", true)
                    }
                }
            } else {
                console.error("Auth failed")
                toast.error("認証に失敗しました。再度お試しください。")
                addMessage("[stop]", "ai", true)
            }
        } catch (e) {
            console.error(e)
            toast.error("認証に失敗しました。再度お試しください。")
            addMessage("[stop]", "ai", true)
        } finally {
            setLoadingAuth(false)
            setIsSending(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault()
            handleSubmit()
        }
    }

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 mb-10 w-full max-w-4xl px-3 mx-auto">
                <div className="flex flex-col bg-white rounded-4xl border border-neutral-200/60 px-3 py-2">
                    <div className="w-full">
                        <textarea
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyPress}
                            placeholder={currentPlaceholder}
                            className="w-full px-2 py-2 border-0 focus:outline-none resize-none text-sm md:text-base text-neutral-900 placeholder-neutral-400 leading-6 min-h-[2.5rem] max-h-[150px] overflow-y-auto"
                            rows={1}
                            disabled={isSending}
                        />
                    </div>
                    <div className="flex items-center justify-between gap-3 pt-2">
                        <div className="flex items-center gap-1.5">
                            <Select value={selectedModel} onValueChange={setSelectedModel}>
                                <SelectTrigger className="rounded-4xl text-xs border-neutral-100 shadow-none flex items-center justify-center">
                                    {selectedModel && (
                                        <span className="sm:hidden">
                                            <Icon icon={models.find((m) => m.value === selectedModel)?.icon} className="w-4 h-4" />
                                        </span>
                                    )}
                                    {selectedModel && (
                                        <span className="hidden sm:flex gap-1">
                                            <Icon icon={models.find((m) => m.value === selectedModel)?.icon} className="w-4 h-4" />
                                            <span className="truncate">
                                                {models.find((m) => m.value === selectedModel)?.label}
                                            </span>
                                        </span>
                                    )}
                                </SelectTrigger>

                                <SelectContent className="min-w-40">
                                    {models.map((model) => (
                                        <SelectItem key={model.value} value={model.value} className="text-xs flex items-center gap-2">
                                            <div className="flex items-center gap-2">
                                                <Icon icon={model.icon} className="w-4 h-4" />
                                                <span>{model.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            <Select value={selectedPrompt} onValueChange={setSelectedPrompt}>
                                <SelectTrigger className="rounded-4xl text-xs border-neutral-100 shadow-none">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="min-w-40">
                                    {prompts.map((prompt) => (
                                        <SelectItem key={prompt.value} value={prompt.value} className="text-xs">
                                            <div className="flex items-center gap-2">
                                                <Bot className="w-4 h-4" />
                                                <span>{prompt.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            className={`
                                flex-shrink-0 w-10 h-10 rounded-full bg-neutral-50/0 border hover:bg-neutral-100
                                ${input.trim().length > 0 ? "border-neutral-200 text-neutral-500/40" : "border-neutral-200 text-neutral-400"}
                                ${input.trim().length === 0 || isSending ? "cursor-not-allowed" : ""}
                            `}
                            disabled={input.trim().length === 0 || isSending}
                            onClick={handleSubmit}
                        >
                            {isSending ? <Loader className="w-4 h-4 animate-spin" /> : <ArrowUp className="w-3 h-3" />}
                        </Button>
                    </div>
                </div>
                <p className="text-center mt-1 text-xs text-neutral-400">AI can make mistakes. Check Important Info.</p>
            </div>

            <TermsAlert
                open={showTerms}
                onOpenChange={setShowTerms}
                onAgreed={handleAgree}
                onDeclined={() => setShowTerms(false)}
            />
            <NameDialog
                open={showNameDialog}
                onClose={() => setShowNameDialog(false)}
                onSave={(newName: string) => {
                    document.cookie = `name=${encodeURIComponent(newName)}; path=/; max-age=${60 * 60 * 24 * 365}`
                    setName(newName)
                    setShowNameDialog(false)
                }}
            />

            {loadingAuth && (
                <>
                    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 text-neutral-800 text-center px-4">
                        <Key className="mb-2 text-neutral-800" />
                        <p className="text-sm">認証中です。しばらくお待ちください…</p>
                    </div>
                </>
            )}
        </>
    )
}
