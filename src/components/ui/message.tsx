"use client"

import Image from "next/image"
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { UserRound, Share2, PencilLine, Search, Check, Copy } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { toast } from "sonner"
import { useConversationStore } from '@/store/conversation';

export function Message() {
    const { messages } = useConversationStore();
    const [name, setName] = useState("User");
    const [copiedStates, setCopiedStates] = useState<Record<string, boolean>>({})

    const getNameFromCookie = () => {
        const match = document.cookie.match(new RegExp('(^| )name=([^;]+)'));
        if (match) {
            return decodeURIComponent(match[2]);
        }
        return "User";
    }

    useEffect(() => {
        setName(getNameFromCookie());
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const currentName = getNameFromCookie();
            if (currentName !== name) {
                setName(currentName);
            }
        };

        window.addEventListener('storage', handleStorageChange);
        window.addEventListener('focus', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('focus', handleStorageChange);
        };
    }, [name]);

    const handleCopy = (text: string) => {
        navigator.clipboard.writeText(text)
        toast.success("クリップボードにコピーしました！")

        setCopiedStates((prev) => ({ ...prev, [text]: true }))

        setTimeout(() => {
            setCopiedStates((prev) => ({ ...prev, [text]: false }))
        }, 2000)
    }

    return (
        <>
            <div className={`${messages.length === 0 ? "block" : "hidden"} text-center text-gray-500 py-20`}>
                <h1 className="text-neutral-500 text-4xl font-semibold text-center">Hi, {name}</h1>

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
                            <div className="flex-1 overflow-y-auto space-y-4">
                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex items-center justify-center bg-neutral-50 rounded-full w-10 h-10 flex-shrink-0">
                                        <UserRound size={20} />
                                    </div>

                                    <div className="flex flex-col max-w-[70%] items-end">
                                        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                            <span className="text-sm font-medium text-gray-700">ユーザー</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-right leading-relaxed">どういう系統が好きなの？</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row">
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage src={"/assets/yajuu.webp"} alt={"AI"} />
                                        <AvatarFallback>{"AI"}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col max-w-[70%] items-start">
                                        <div className="flex items-center gap-2 mb-1 flex-row">
                                            <span className="text-sm font-medium text-gray-700">野獣先輩</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-left leading-relaxed">そぉ～ですね…やっぱり僕は、王道を征く、ソープ系、ですか</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex items-center justify-center bg-neutral-50 rounded-full w-10 h-10 flex-shrink-0">
                                        <UserRound size={20} />
                                    </div>

                                    <div className="flex flex-col max-w-[70%] items-end">
                                        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                            <span className="text-sm font-medium text-gray-700">ユーザー</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-right leading-relaxed">ああソープ？高いでしょでもソープ</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row">
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage src={"/assets/yajuu.webp"} alt={"AI"} />
                                        <AvatarFallback>{"AI"}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col max-w-[70%] items-start">
                                        <div className="flex items-center gap-2 mb-1 flex-row">
                                            <span className="text-sm font-medium text-gray-700">野獣先輩</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-left leading-relaxed">ピンキリですよねでもね</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row-reverse">
                                    <div className="flex items-center justify-center bg-neutral-50 rounded-full w-10 h-10 flex-shrink-0">
                                        <UserRound size={20} />
                                    </div>

                                    <div className="flex flex-col max-w-[70%] items-end">
                                        <div className="flex items-center gap-2 mb-1 flex-row-reverse">
                                            <span className="text-sm font-medium text-gray-700">ユーザー</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-right leading-relaxed">ふーん</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 flex-row">
                                    <Avatar className="w-10 h-10 flex-shrink-0">
                                        <AvatarImage src={"/assets/yajuu.webp"} alt={"AI"} />
                                        <AvatarFallback>{"AI"}</AvatarFallback>
                                    </Avatar>

                                    <div className="flex flex-col max-w-[70%] items-start">
                                        <div className="flex items-center gap-2 mb-1 flex-row">
                                            <span className="text-sm font-medium text-gray-700">野獣先輩</span>
                                        </div>

                                        <div className="flex justify-center rounded-2xl px-4 py-2 bg-neutral-900/2 text-neutral-900 rounded-br-md">
                                            <p className="text-sm text-left leading-relaxed">うん</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
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
                            <Image src={"/assets/bento/coming-soon(j).png"} alt="Coming Soon (J)" width={600} height={600} className="w-full h-auto max-w-full opacity-85 -mt-6" />
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
                            <Image src={"/assets/bento/coming-soon(sou).png"} alt="Coming Soon (J)" width={600} height={600} className="w-full h-auto max-w-full opacity-85 -mt-6" />
                        </CardContent>
                    </Card>
                </div>
            </div >

            <div className={`${messages.length === 0 ? "hidden" : "block"} flex-1 overflow-y-auto py-10 space-y-4`}>
                {messages.map((message) => {
                    const isCopied = copiedStates[message.content] || false
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
                                        <p className="text-sm text-right leading-relaxed">{message.content}</p>
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-2.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button onClick={() => handleCopy(message.content)} className="hover:bg-neutral-900/3 size-7 transition-all duration-200" size="icon" variant="ghost">
                                                    <div className="relative">
                                                        <Copy className={`transition-all duration-200 ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} />
                                                        <Check className={`absolute inset-0 transition-all duration-200 ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                                                    </div>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>コピー</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><PencilLine /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>編集</p>
                                            </TooltipContent>
                                        </Tooltip>
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
                                        <p className="text-sm text-left leading-relaxed">{message.content}</p>
                                    </div>

                                    <div className="flex items-center gap-x-1 mt-2.5">
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button onClick={() => handleCopy(message.content)} className="hover:bg-neutral-900/3 size-7 transition-all duration-200" size="icon" variant="ghost">
                                                    <div className="relative">
                                                        <Copy className={`transition-all duration-200 ${isCopied ? "opacity-0 scale-75" : "opacity-100 scale-100"}`} />
                                                        <Check className={`absolute inset-0 transition-all duration-200 ${isCopied ? "opacity-100 scale-100" : "opacity-0 scale-75"}`} />
                                                    </div>
                                                </Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>コピー</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><Search /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>ファクトチェック</p>
                                            </TooltipContent>
                                        </Tooltip>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <Button className="hover:bg-neutral-900/3 size-7" size="icon" variant="ghost"><Share2 /></Button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>共有</p>
                                            </TooltipContent>
                                        </Tooltip>
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
