"use client"

import Image from "next/image"
import type React from "react"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Copy } from "@/components/animate-ui/icons/copy"
import { RefreshCcw } from "@/components/animate-ui/icons/refresh-ccw"
import { UserRound, Share2, PencilLine } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"

type Message = {
    id: string
    content: string
    sender: { role: "user" | "ai" }
    timestamp: string
}

const Messages: Message[] = [
    /*
    {
        id: "1",
        content: "こんにちは！今日はいい天気ですね。",
        sender: {
            role: "ai",
        },
        timestamp: "10:30",
    },
    {
        id: "2",
        content: "本当ですね！散歩日和です。公園に行こうと思っています。",
        sender: {
            role: "user",
        },
        timestamp: "10:32",
    },
    {
        id: "3",
        content: "いいですね！私も午後から外出する予定です。桜が咲き始めているので、写真を撮りに行きたいと思います。",
        sender: {
            role: "ai",
        },
        timestamp: "10:35",
    },
    {
        id: "4",
        content: "桜の季節ですね！私も写真撮影が好きです。どちらの公園に行かれるんですか？",
        sender: {
            role: "user",
        },
        timestamp: "10:37",
    },
    {
        id: "5",
        content: "上野公園を考えています。毎年この時期は多くの人で賑わいますが、桜の美しさは格別ですよね。",
        sender: {
            role: "ai",
        },
        timestamp: "10:40",
    },
    */
]

export function Message() {
    const [messages, setMessages] = useState<Message[]>(Messages)

    return (
        <>
            <div className={`${messages.length === 0 ? "block" : "hidden"} text-center text-gray-500 py-20`}>
                <h1 className="text-neutral-500 text-4xl font-semibold text-center">Hi, Rion</h1>

                <div className="pt-10 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-2 h-150">
                    <Card className="rounded-4xl md:col-span-2 md:row-span-2 border-0 shadow-none overflow-hidden">
                        <CardHeader className="pb-4">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <CardTitle className="text-neutral-700 text-2xl font-bold mb-2">Yajuu Model</CardTitle>
                                    <CardDescription className="text-neutral-400">野獣先輩と会話することができるモデル</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-0 flex justify-center items-center">

                        </CardContent>
                    </Card>

                    <Card className="rounded-4xl border-0 shadow-none pb-0 overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <CardTitle className="text-neutral-700 text-2xl font-bold mb-2">Coming soon</CardTitle>
                                    <CardDescription className="text-neutral-400">粉ぷんぷん？</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-0 flex justify-center items-center">
                            <Image src={"/assets/bento/coming-soon(j).png"} alt="Coming Soon (J)" width={600} height={600} className="w-full h-auto max-w-full -mt-6" />
                        </CardContent>
                    </Card>

                    <Card className="rounded-4xl border-0 shadow-none pb-0 overflow-hidden">
                        <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <CardTitle className="text-neutral-700 text-2xl font-bold mb-2">Coming soon</CardTitle>
                                    <CardDescription className="text-neutral-400">そうだよ（便乗）？</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-0 flex justify-center items-center">
                            <Image src={"/assets/bento/coming-soon(sou).png"} alt="Coming Soon (J)" width={600} height={600} className="w-full h-auto max-w-full -mt-6" />
                        </CardContent>
                    </Card>
                </div>
            </div>

            <div className={`${messages.length === 0 ? "hidden" : "block"} flex-1 overflow-y-auto py-10 space-y-4`}>
                {messages.map((message) => {
                    if (message.sender.role === "user") {
                        return (
                            <div key={message.id} className="flex gap-3 flex-row-reverse">
                                <div className="flex items-center justify-center bg-neutral-50 rounded-full w-10 h-10 flex-shrink-0">
                                    <UserRound size={20} />
                                </div>

                                <div className="flex flex-col max-w-[70%] items-end">
                                    <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                        <span className="text-sm font-medium text-gray-700">ユーザー</span>
                                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>

                                    <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-2.5">
                                        <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><Copy animation="default-loop" animateOnHover /></Button>
                                        <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><PencilLine /></Button>
                                    </div>
                                </div>
                            </div>
                        );
                    } else {
                        return (
                            <div key={message.id} className="flex gap-3 flex-row">
                                <Avatar className="w-10 h-10 flex-shrink-0">
                                    <AvatarImage src={"/assets/yajuu.webp"} alt={"AI"} />
                                    <AvatarFallback>{"AI"}</AvatarFallback>
                                </Avatar>

                                <div className="flex flex-col max-w-[70%] items-start">
                                    <div className="flex items-center gap-2 mb-1 flex-row">
                                        <span className="text-sm font-medium text-gray-700">野獣先輩</span>
                                        <span className="text-xs text-gray-500">{message.timestamp}</span>
                                    </div>

                                    <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                        <p className="text-sm leading-relaxed">{message.content}</p>
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-2.5">
                                        <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><Copy animation="default-loop" animateOnHover /></Button>
                                        <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><RefreshCcw animation="rotate" animateOnHover /></Button>
                                        <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><Share2 /></Button>
                                    </div>
                                </div>
                            </div>
                        );
                    }
                })}
            </div>
        </>
    )
}
