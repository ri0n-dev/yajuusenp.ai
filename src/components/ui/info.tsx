import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export function Info() {
    return (
        <Dialog>
            <DialogTrigger>
                <Button variant="outline" className="fixed bottom-6 right-6 h-14 w-14 rounded-full size-8 border border-neutral-200 shadow-none">
                    <p className="text-neutral-800">?</p>
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Yajuusenp.AI</DialogTitle>
                    <p className="text-sm text-neutral-800">このサイトは野獣先輩と会話するという夢を持っている人たちのために作られました。
                        GPT-4oを使用して動いています。何か問題や要望、ご意見などあれば<a href="https://discord.gg/teamzisty" target="_blank" rel="noopener noreferrer" className="text-primary underline">Discord</a>からお願いします</p>

                    <div className="mt-3">
                        <h3 className="text-base font-semibold mb-1">Project Member</h3>
                        <p className="text-xs text-neutral-800 mb-2">Zistyのメンバーによって開発されています。</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                            <a href="https://github.com/ri0n-dev" target="_blank" rel="noopener noreferrer">
                                <h4 className="font-medium text-sm mb-2">Rion</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">設立者、開発者</p>
                            </a>
                            <a href="https://github.com/xxtomm" target="_blank" rel="noopener noreferrer">
                                <h4 className="font-medium text-sm mb-2">Tom</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">開発者、アイデア</p>
                            </a>
                        </div>
                    </div>

                    <div className="mt-3">
                        <h3 className="text-base font-semibold mb-2">Special Thanks</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
                            <a href="https://voids.top/" target="_blank" rel="noopener noreferrer">
                                <h4 className="font-medium text-sm mb-2">Voids.top</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">GPT-4oのAPIミラーを提供していただいています。</p>
                            </a>
                            <a href="http://evex.land" target="_blank" rel="noopener noreferrer">
                                <h4 className="font-medium text-sm mb-2">Evex Developers</h4>
                                <p className="text-xs text-muted-foreground leading-relaxed">ドメイン料金を支払っていただいています。</p>
                            </a>
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
    )
}