import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { toast } from "sonner"
import { Copy, TriangleAlert } from "lucide-react"

export function ShareDialog({ open, onOpenChange, url }: { open: boolean, onOpenChange: (v: boolean) => void, url: string }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[450px]">
                <DialogHeader>
                    <DialogTitle>シェア</DialogTitle>
                    <DialogDescription>リンクへアクセスすることで会話を共有できます。</DialogDescription>
                </DialogHeader>
                <div className="flex gap-1">
                    <Input readOnly value={url} className="w-full text-sm px-3 py-2 border rounded" />
                    <Button variant="outline" onClick={() => { navigator.clipboard.writeText(url); toast.success("リンクをコピーしました！") }}>
                        <Copy className="w-4 h-4" />
                    </Button>
                </div>

                <Alert>
                    <TriangleAlert />
                    <AlertTitle>注意</AlertTitle>
                    <AlertDescription>
                        <p>会話内容を暗号化し、URLを短縮させています。リンクは削除することができません。共有は責任を持って行ってください。</p>
                    </AlertDescription>
                </Alert>
            </DialogContent>
        </Dialog>
    );
}