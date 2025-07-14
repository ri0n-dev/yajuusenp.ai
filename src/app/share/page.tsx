"use client"
import { useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserRound } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Clock, Bot } from "lucide-react"

async function decryptText(data: string, key: CryptoKey): Promise<string> {
    const raw = atob(data)
    const combined = new Uint8Array([...raw].map(c => c.charCodeAt(0)))
    const iv = combined.slice(0, 12)
    const ciphertext = combined.slice(12)
    const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ciphertext)
    return new TextDecoder().decode(decrypted)
}

async function importKey(keyString: string): Promise<CryptoKey> {
    const raw = new Uint8Array([...atob(keyString)].map(c => c.charCodeAt(0)))
    return crypto.subtle.importKey("raw", raw, { name: "AES-GCM" }, false, ["decrypt"])
}

export default function SharePage() {
    const params = useSearchParams()
    const [messages, setMessages] = useState<{ role: string, content: string, timestamp: string, model: string }[] | null>(null)

    useEffect(() => {
        const d = params.get("d")
        const k = params.get("k")
        if (!d || !k) {
            setMessages([])
            return
        }

        importKey(k)
            .then(key => decryptText(d, key))
            .then((decoded) => {
                try {
                    const parsed = JSON.parse(decoded)
                    if (!Array.isArray(parsed)) throw new Error("Invalid")
                    setMessages(parsed)
                } catch {
                    setMessages([])
                }
            })
            .catch(() => {
                setMessages([])
            })
    }, [params])

    if (messages === null) {
        return <p className="p-4 text-gray-500">読み込み中...</p>
    }

    if (messages.length === 0) {
        return <p className="p-4 text-red-500">無効な共有リンクです。</p>
    }

    return (
        <div className="w-full max-w-4xl mx-auto py-10">
            <div className="flex items-end gap-x-2">
                <h1 className="text-neutral-700 text-3xl font-semibold text-left">会話履歴</h1>
                <div className="flex items-center gap-x-2">
                    <Badge variant="outline">
                        <Clock className="mr-1" />
                        {messages.length > 0 ? messages[0].timestamp : "不明"}
                    </Badge>
                    <Badge variant="outline">
                        <Bot className="mr-1" />
                        {messages.length > 0 ? messages[0].model : "Yajuu 4o"}
                    </Badge>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto space-y-4 p-4">
                {messages.map((message, index) => {
                    const isUser = message.role === "user"
                    return (
                        <div key={index} className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                            {isUser ? (
                                <div className="flex items-center justify-center bg-neutral-50 rounded-full w-10 h-10 flex-shrink-0">
                                    <UserRound size={20} />
                                </div>
                            ) : (
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src="/assets/yajuu.webp" alt="AI" />
                                    <AvatarFallback>AI</AvatarFallback>
                                </Avatar>
                            )}

                            <div className={`flex flex-col max-w-[70%] ${isUser ? "items-end" : "items-start"}`}>
                                <div className={`flex items-center gap-2 mb-1 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
                                    <span className="text-sm font-medium text-gray-700">{isUser ? "ユーザー" : "野獣先輩"}</span>
                                </div>
                                <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                    <p className={`text-sm leading-relaxed ${isUser ? "text-right" : "text-left"}`}>
                                        {message.content}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
