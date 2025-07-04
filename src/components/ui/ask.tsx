"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowUp, Paperclip } from 'lucide-react';

export function Ask() {
    const [input, setInput] = useState("")
    const [currentPlaceholder, setCurrentPlaceholder] = useState("")
    const [placeholderIndex, setPlaceholderIndex] = useState(0)
    const [charIndex, setCharIndex] = useState(0)
    const [isDeleting, setIsDeleting] = useState(false)
    const placeholders = [
        "野獣先輩のアソコの長さを教えて",
        "野獣先輩のアソコの太さを教えて",
        "野獣先輩のアソコの形を教えて",
        "野獣先輩のアソコの色を教えて",
        "野獣先輩の好きなプレイは教えて",
        "コードを生成して",
    ]

    useEffect(() => {
        const currentText = placeholders[placeholderIndex]
        const timer = setTimeout(() => {
            if (!isDeleting && charIndex < currentText.length) {
                setCurrentPlaceholder(currentText.slice(0, charIndex + 1))
                setCharIndex(charIndex + 1)
            } else if (isDeleting && charIndex > 0) {
                setCurrentPlaceholder(currentText.slice(0, charIndex - 1))
                setCharIndex(charIndex - 1)
            } else if (!isDeleting && charIndex === currentText.length) {
                setTimeout(() => setIsDeleting(true), isDeleting ? 500 : 2000)
            } else if (isDeleting && charIndex === 0) {
                setIsDeleting(false)
                setPlaceholderIndex((prevIndex) => (prevIndex + 1) % placeholders.length)
            }
        }, isDeleting ? 50 : 100)

        return () => clearTimeout(timer)
    }, [charIndex, isDeleting, placeholderIndex, placeholders])

    const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const textarea = e.target
        setInput(textarea.value)
        textarea.style.height = "auto"
        textarea.style.height = Math.min(textarea.scrollHeight, 150) + "px"
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 mb-10 w-full max-w-4xl mx-auto">
            <div className="flex bg-white rounded-4xl border border-neutral-200 px-3 py-2">
                <div className="flex w-full items-end justify-between gap-3">
                    <textarea value={input} onChange={handleInput} placeholder={currentPlaceholder} className="w-full px-2 py-2 border-0 focus:outline-none resize-none text-neutral-900 placeholder-neutral-400 leading-6 min-h-[2.5rem] max-h-[150px] overflow-y-auto" rows={1} />

                    <Button
                        className={`
                            flex-shrink-0 w-10 h-10 rounded-full flex-grow bg-neutral-50/0 border
                            ${input.length > 0 ? 'border-neutral-200' : 'border-neutral-100'}
                            ${input.length > 0 ? 'text-neutral-800' : 'text-neutral-700'}
                            ${input.length > 0 ? 'hover:bg-neutral-50' : 'hover:bg-neutral-50/50'}
                        `}>
                        <ArrowUp className="w-3 h-3" />
                    </Button>
                </div>
            </div>
        </div>
    );
}