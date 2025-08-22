import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MoveUpRight } from "lucide-react"

export function Info() {
    return (
        <>
            <Button variant="outline" className="fixed bottom-6 right-16 h-14 w-14 rounded-full size-8 border border-neutral-200 shadow-none">
                <Link href="https://discord.gg/teamzisty" target="_blank" rel="noopener noreferrer" className="text-neutral-800">
                    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>Discord</title><path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z" /></svg>
                </Link>
            </Button>
            <Dialog>
                <DialogTrigger>
                    <Button variant="outline" className="fixed bottom-6 right-6 h-14 w-14 rounded-full size-8 border border-neutral-200 shadow-none">
                        <p className="text-neutral-800">?</p>
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-left">Yajuusenp.AI</DialogTitle>
                        <p className="text-sm text-neutral-800 text-left">このサイトは野獣先輩と会話するという夢を持っている人たちのために作られました。
                            GPT-4oを使用して動いています。何か問題や要望、ご意見などあれば<a href="https://discord.gg/teamzisty" target="_blank" rel="noopener noreferrer" className="text-primary underline">Discord</a>からお願いします</p>

                        <div className="mt-3 text-left">
                            <h3 className="text-base font-semibold mb-1">Project Member</h3>
                            <p className="text-xs text-neutral-800 mb-2">Zistyのメンバーによって開発されています。</p>
                            <div className="grid grid-cols-2 gap-4 p-2">
                                <Link href="https://x.com/ri0n_dev" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Rion <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">設立者、開発者</p>
                                </Link>
                                <Link href="https://x.com/tom_3x" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Tom <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">アイデア</p>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 text-left">
                            <h3 className="text-base font-semibold mb-2">Special Thanks</h3>
                            <div className="grid grid-cols-2 gap-4 p-2">
                                <Link href="https://voids.top/" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Voids.top <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">GPT-4oのAPIミラーを提供していただいています。</p>
                                </Link>
                                <Link href="https://evex.land" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Evex Developers <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">スポンサーをしていただいています。</p>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-6 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
                            <p className="text-sm text-center text-muted-foreground">
                                このプロジェクトに関わってくださった全ての方々に心から感謝します。
                            </p>
                        </div>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}