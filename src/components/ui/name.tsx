import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export function NameDialog({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (name: string) => void }) {
    const [inputName, setInputName] = useState("");

    const handleSubmit = () => {
        if (inputName.trim() === "") return;
        if (!/^[ぁ-んァ-ン一-龥a-zA-Z0-9\s]+$/.test(inputName.trim())) return;
        onSave(inputName.trim());
        onClose();
    };

    const isValidInput = (value: string) => {
        return value === "" || /^[ぁ-んァ-ン一-龥a-zA-Z0-9\s]+$/.test(value);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSubmit();
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>名前を設定しましょう</DialogTitle>
                    <DialogDescription>会話の際に使用する名前を設定してください。</DialogDescription>
                </DialogHeader>
                <div className="grid gap-4">
                    <Label htmlFor="name">名前</Label>
                    <Input id="name" value={inputName} onChange={e => isValidInput(e.target.value) && setInputName(e.target.value)} onKeyPress={handleKeyPress} placeholder="田所 浩二" />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={inputName.trim() === ""}>保存</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}