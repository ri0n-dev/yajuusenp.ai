"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useConversationStore } from '@/store/conversation';
import { toast } from "sonner";
import { TermsAlert } from '@/components/ui/terms';
import { NameDialog } from '@/components/ui/name';
import { ArrowUp, Key, Loader } from "lucide-react"

const placeholders = [
    "野獣先輩のアソコの長さを教えて",
    "野獣先輩のアソコの太さを教えて",
    "野獣先輩のアソコの形を教えて",
    "野獣先輩のアソコの色を教えて",
    "野獣先輩の好きなプレイは教えて",
    "コードを生成して",
];

export function Ask() {
    const { addMessage, removeThinkingMessage } = useConversationStore();
    const [input, setInput] = useState("");
    const [currentPlaceholder, setCurrentPlaceholder] = useState("");
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [charIndex, setCharIndex] = useState(0);
    const [isDeleting, setIsDeleting] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [name, setName] = useState<string | null>(null);
    const [showTerms, setShowTerms] = useState(false);
    const [showNameDialog, setShowNameDialog] = useState(false);
    const [pendingMessage, setPendingMessage] = useState<string | null>(null);
    const [loadingAuth, setLoadingAuth] = useState(true);
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetch("/api/auth", { method: "POST", credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setAuthenticated(data.authenticated === true);
                setLoadingAuth(false);
                if (!data.authenticated) {
                    setShowTerms(true);
                }
            })
            .catch(() => setLoadingAuth(false));
    }, []);

    useEffect(() => {
        if (authenticated) {
            const savedName = document.cookie.split(';').find(row => row.trim().startsWith('name='));
            if (savedName) {
                const nameValue = savedName.split('=')[1];
                const decodedName = decodeURIComponent(nameValue);
                setName(decodedName);
            } else {
                setShowNameDialog(true);
            }
        }
    }, [authenticated]);

    useEffect(() => {
        const currentText = placeholders[placeholderIndex];
        const timer = setTimeout(() => {
            if (!isDeleting && charIndex < currentText.length) {
                setCurrentPlaceholder(currentText.slice(0, charIndex + 1));
                setCharIndex(charIndex + 1);
            } else if (isDeleting && charIndex > 0) {
                setCurrentPlaceholder(currentText.slice(0, charIndex - 1));
                setCharIndex(charIndex - 1);
            } else if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => setIsDeleting(true), 2000);
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false);
                setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length);
            }
        }, isDeleting ? 50 : 100);

        return () => clearTimeout(timer);
    }, [charIndex, isDeleting, placeholderIndex]);

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target;
        setInput(textarea.value);
        textarea.style.height = "auto";
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px";
    };

    const handleSubmit = async () => {
        if (input.trim().length === 0) return;

        if (!authenticated) {
            setPendingMessage(input);
            setShowTerms(true);
            return;
        }

        if (!name) {
            setShowNameDialog(true);
            return;
        }

        setIsSending(true);
        const messageToSend = input;
        addMessage(messageToSend, "user");
        addMessage("考えています・・・🤔", "ai", true);
        setInput("");

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    message: messageToSend,
                    model: "yajuu",
                }),
            });

            if (res.ok) {
                const data = await res.json();
                removeThinkingMessage();
                addMessage(data.result, "ai");
            } else {
                console.error("API request failed");
                toast.error("APIリクエストに失敗しました。しばらくしてから再度お試しください。");
            }
        } catch (error) {
            console.error("Error during API request:", error);
            toast.error("リクエスト処理中にエラーが発生しました。再度お試しください。");
        } finally {
            setIsSending(false);
        }
    };

    const handleAgree = async () => {
        try {
            setLoadingAuth(true);

            const nonceRes = await fetch("/api/auth/nonce");
            if (!nonceRes.ok) throw new Error("Failed to get nonce");
            const { nonce } = await nonceRes.json();

            const authRes = await fetch("/api/auth", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ nonce }),
            });

            if (authRes.ok) {
                setAuthenticated(true);
                setShowTerms(false);

                if (pendingMessage) {
                    const messageToSend = pendingMessage;
                    setPendingMessage(null);

                    setIsSending(true);
                    addMessage(messageToSend, "user");
                    addMessage("考えています・・・🤔", "ai", true);
                    setInput("");

                    try {
                        const res = await fetch("/api/chat", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            body: JSON.stringify({
                                message: messageToSend,
                                model: "yajuu",
                            }),
                        });

                        if (res.ok) {
                            const data = await res.json();
                            removeThinkingMessage();
                            addMessage(data.result, "ai");
                        } else {
                            const errorText = await res.text();
                            console.error("API request failed with status:", res.status, "Error:", errorText);
                            toast.error("APIリクエストに失敗しました。しばらくしてから再度お試しください。");
                        }
                    } catch (error) {
                        console.error("Error during API request:", error);
                        toast.error("リクエスト処理中にエラーが発生しました。再度お試しください。");
                    }
                }
            } else {
                console.error("Auth failed");
                toast.error("認証に失敗しました。再度お試しください。");
            }
        } catch (e) {
            console.error(e);
            toast.error("認証に失敗しました。再度お試しください。");
        } finally {
            setLoadingAuth(false);
            setIsSending(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <>
            <div className="fixed bottom-0 left-0 right-0 mb-10 w-full max-w-4xl px-3 mx-auto">
                <div className="flex bg-white rounded-4xl border border-neutral-200/60 px-3 py-2">
                    <div className="flex w-full items-end justify-between gap-3">
                        <textarea
                            value={input}
                            onChange={handleInput}
                            onKeyDown={handleKeyPress}
                            placeholder={currentPlaceholder}
                            className="w-full px-2 py-2 border-0 focus:outline-none resize-none text-sm md:text-base text-neutral-900 placeholder-neutral-400 leading-6 min-h-[2.5rem] max-h-[150px] overflow-y-auto"
                            rows={1}
                            disabled={isSending}
                        />
                        <Button
                            className={`
        flex-shrink-0 w-10 h-10 rounded-full flex-grow bg-neutral-50/0 border hover:bg-neutral-100
        ${input.trim().length > 0 ? 'border-neutral-400/40 text-neutral-500/40' : 'border-neutral-300 text-neutral-400'}
        ${(input.trim().length === 0 || isSending) ? 'cursor-not-allowed' : ''}
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

            <TermsAlert open={showTerms} onOpenChange={setShowTerms} onAgreed={handleAgree} onDeclined={() => setShowTerms(false)} />
            <NameDialog open={showNameDialog} onClose={() => setShowNameDialog(false)} onSave={(newName: string) => { document.cookie = `name=${encodeURIComponent(newName)}; path=/; max-age=${60 * 60 * 24 * 365}`; setName(newName); setShowNameDialog(false); }} />

            {loadingAuth && <>
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-white/90 text-neutral-800 text-center px-4">
                    <Key className="mb-2 text-neutral-800" />
                    <p className="text-sm">認証中です。しばらくお待ちください…</p>
                </div>
            </>}
        </>
    );
}
