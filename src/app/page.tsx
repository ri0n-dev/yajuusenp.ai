import { Button } from "@/components/ui/button"
import { Ask } from '@/components/ui/ask';

export default function AIChatBar() {
  return (
    <div className="flex flex-col w-full max-w-4xl min-h-screen pb-32">
      <Ask />

      <Button variant="outline" className="fixed bottom-6 right-6 h-14 w-14 rounded-full size-8 border border-neutral-200">
        <p className="text-neutral-800">?</p>
      </Button>
    </div>
  );
}