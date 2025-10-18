"use client";

import { useState } from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { TermsWarning } from "@/components/ui/terms-warning";

export function TermsAlert({ open, onOpenChange, onAgreed, onDeclined }: { open: boolean, onOpenChange: (open: boolean) => void, onAgreed: () => void, onDeclined: () => void }) {
    const [showWarning, setShowWarning] = useState(false);

    return (
        <>
            <AlertDialog open={open} onOpenChange={onOpenChange}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>ちょっと待って！</AlertDialogTitle>
                        <AlertDialogDescription className="flex flex-col gap-2">
                            <p>Yajuusenp.aiを利用する前に、以下の事項をご確認ください。</p>
                            <ul className="flex flex-col gap-1 list-decimal list-inside pt-1" style={{ textIndent: '-1.2em', paddingLeft: '1.2em' }}>
                                <li><a href="https://www.ri0n.dev/tos" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer">利用規約</a>、<a href="https://www.ri0n.dev/privacy" target="_blank" rel="noopener noreferrer" className="underline cursor-pointer">プライバシーポリシー</a>に同意する。</li>
                                <li>ユーザーの会話内容が第三者に送信される可能性があることをご理解の上で、利用する。<a onClick={() => setShowWarning(true)} className="text-blue-500 cursor-pointer text-xs">※詳しく</a></li>
                                <li>AIの回答は正確でない。</li>
                            </ul>
                            <p>これらの事項に同意していただける方のみ、同意するを押してお進みください。同意できない場合はサービスのご利用をお控えください。</p>
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => { onDeclined(); onOpenChange(false) }}>閉じる</AlertDialogCancel>
                        <AlertDialogAction onClick={() => { onAgreed(); onOpenChange(false) }}>同意する</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>

            <TermsWarning open={showWarning} onOpenChange={setShowWarning} />
        </>
    );
}