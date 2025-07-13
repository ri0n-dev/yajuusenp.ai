import { create } from 'zustand';

type Message = {
  id: string;
  content: string;
  sender: {
    role: "user" | "ai";
  };
  timestamp: string;
};

type ConversationState = {
  messages: Message[];
  addMessage: (content: string, role: "user" | "ai") => void;
};

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  addMessage: (content, role) => {
    const timestamp = new Date().toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' });
    const id = Date.now().toString();

    set((state) => ({
      messages: [
        ...state.messages,
        { id, content, sender: { role }, timestamp },
      ],
    }));
  },
}));
