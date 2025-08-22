"use client"

import { useEffect, useState, useCallback } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AlertCircleIcon } from "lucide-react"

export function FactCheck({ open, onOpenChange, content, onResult, cachedResult }: { open: boolean, onOpenChange: (open: boolean) => void, content: string, onResult: (result: string) => void, cachedResult?: string }) {
    const [checking, setChecking] = useState(false)
    const [result, setResult] = useState("")

    const onResultCallback = useCallback(onResult, [])
    const onOpenChangeCallback = useCallback(onOpenChange, [])

    useEffect(() => {
        const run = async () => {
            if (!open || !content) return
            if (cachedResult) {
                setResult(cachedResult)
                onResultCallback(cachedResult)
                return
            }

            setChecking(true)
            try {
                const res = await fetch("/api/factcheck", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ message: content }),
                })
                const data = await res.json()
                setResult(data.result)
                onResultCallback(data.result)
            } catch (error) {
                console.error("Error fetching fact check:", error)
                onOpenChangeCallback(false)
                toast.error("ファクトチェック中にエラーが発生しました。ご時間を開けて再度お試しください。")
            } finally {
                setChecking(false)
            }
        }

        run()
    }, [open, content, cachedResult, onResultCallback, onOpenChangeCallback])

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>ファクトチェック</DialogTitle>
                    <DialogDescription>AIが生成した文章が正確かどうかチェックします。</DialogDescription>
                </DialogHeader>
                <div className="whitespace-pre-wrap text-sm text-neutral-800">
                    <div className="max-h-35 overflow-y-auto border border-neutral-200 p-2 rounded-md">
                        {checking ? "チェック中・・・" : result}
                    </div>

                    <Alert className="mt-3">
                        <AlertCircleIcon />
                        <AlertTitle>ファクトチェックについて</AlertTitle>
                        <AlertDescription>
                            <p>ファクトチェックはサーチを通じて行われます。信憑性はちょっと上がる程度です。</p>
                        </AlertDescription>
                    </Alert>
                </div>
            </DialogContent>
        </Dialog>
    )
}