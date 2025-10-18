import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export function TermsWarning({ open, onOpenChange }: { open: boolean, onOpenChange: (v: boolean) => void }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>APIミラーについて</DialogTitle>
                    <DialogDescription>
                        Yajuusenp.aiでは、voids.proによって提供されているAPIミラーを使用しています。
                        そのため、第三者のサーバーに送信されます。それにより、ユーザーの会話が保存されてしまう恐れがあります。
                        <br /><br />
                        そのことを理解した上でご利用していただけると幸いです。納得のいけない方は、ご利用を控えていただくことをお勧めします。
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>

    );
}