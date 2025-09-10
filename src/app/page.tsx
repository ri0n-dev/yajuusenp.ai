import { Message } from '@/components/message';
import { Ask } from '@/components/ask';
import { Info } from '@/components/info';
import { ConversationLoader } from '@/lib/conversation-loader';

export default function AIChatBar() {
  return (
    <>
      <ConversationLoader />
      <div className="absolute top-0 left-0 w-full h-16 bg-gradient-to-b from-neutral-100 to-transparent"></div>
      <Message />
      <Ask />
      <Info />
    </>
  );
}
