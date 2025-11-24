import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { MoveUpRight } from "lucide-react"
import { SiDiscord } from "@icons-pack/react-simple-icons"

export function Info() {
    return (
        <>
            <Button variant="outline" className="fixed bottom-6 right-16 h-14 w-14 rounded-full size-8 border border-neutral-200 shadow-none">
                <Link href="https://discord.gg/6BPfVm6cST" target="_blank" rel="noopener noreferrer" className="text-neutral-800">
                    <SiDiscord className="w-4 h-4" />
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
                            何か問題や要望、ご意見などあれば<a href="https://discord.gg/6BPfVm6cST" target="_blank" rel="noopener noreferrer" className="text-primary underline inline-flex items-center gap-1">Zisty Hub</a>からお願いします</p>
                        <div className="mt-3 text-left">
                            <h3 className="text-base font-semibold mb-1">Project Member</h3>
                            <p className="text-xs text-neutral-800 mb-2">Zistyのメンバーによって開発されています。</p>
                            <div className="grid grid-cols-2 gap-4 p-2">
                                <Link href="https://x.com/ri0n_dev" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Rion <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">創設者、開発者</p>
                                </Link>
                                <Link href="https://x.com/tomm_ui" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Tom <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">共同創設者、アイデア</p>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-3 text-left">
                            <h3 className="text-base font-semibold mb-2">Special Thanks</h3>
                            <div className="grid grid-cols-2 gap-4 p-2">
                                <Link href="https://voids.top/" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Voids.top <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">APIミラーを提供していただいています。</p>
                                </Link>
                                <Link href="https://evex.land" target="_blank" rel="noopener noreferrer">
                                    <h4 className="flex items-center font-medium text-sm mb-2">Evex Developers <MoveUpRight size={12} /></h4>
                                    <p className="text-xs text-muted-foreground leading-relaxed">スポンサーをしていただいています。</p>
                                </Link>
                            </div>
                        </div>

                        <div className="mt-4 p-4 border rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20">
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