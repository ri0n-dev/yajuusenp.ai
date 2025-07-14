import { Message } from '@/components/ui/message';
import { Ask } from '@/components/ui/ask';
import { Info } from '@/components/ui/info';

export default function AIChatBar() {
  return (
    <>
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-neutral-100 to-transparent"></div>
      <Message />
      <Ask />
      <Info />
    </>
  );
}
