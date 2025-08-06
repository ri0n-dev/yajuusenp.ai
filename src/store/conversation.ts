import { create } from 'zustand';

type Message = {
  id: string;
  content: string;
  sender: {
    role: "user" | "ai";
  };
  timestamp: string;
  isThinking?: boolean;
};

type ConversationState = {
  messages: Message[];
  addMessage: (content: string, role: "user" | "ai", isThinking?: boolean) => void;
  removeThinkingMessage: () => void;
};

let idCounter = 0;

export const useConversationStore = create<ConversationState>((set) => ({
  messages: [],
  addMessage: (content, role, isThinking = false) => {
    const timestamp = new Date().toLocaleTimeString("ja-JP", { hour: '2-digit', minute: '2-digit' });
    const id = `${Date.now()}-${++idCounter}`;

    set((state) => ({
      messages: [
        ...state.messages,
        { id, content, sender: { role }, timestamp, isThinking },
      ],
    }));
  },
  
  removeThinkingMessage: () => {
    set((state) => ({
      messages: state.messages.filter((m) => !m.isThinking),
    }));
  },
}));
