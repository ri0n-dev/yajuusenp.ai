"use client"

import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { AlertCircleIcon } from "lucide-react"

export function FactCheck({ open, onOpenChange, content, onResult, cachedResult }: { open: boolean, onOpenChange: (open: boolean) => void, content: string, onResult: (result: string) => void, cachedResult?: string }) {
    const [checking, setChecking] = useState(false)
    const [result, setResult] = useState("")

    useEffect(() => {
        const run = async () => {
            if (!open || !content) return
            if (cachedResult) {
                setResult(cachedResult)
                onResult(cachedResult)
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
                onResult(data.result)
            } catch (error) {
                console.error("Error fetching fact check:", error)
                onOpenChange(false)
                toast.error("ファクトチェック中にエラーが発生しました。ご時間を開けて再度お試しください。")
            } finally {
                setChecking(false)
            }
        }

        run()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open, content, cachedResult])

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