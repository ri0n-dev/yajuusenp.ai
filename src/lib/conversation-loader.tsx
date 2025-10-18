"use client"

import { useEffect } from 'react';
import { useConversationStore } from '@/store/conversation';
import { toast } from 'sonner';

export function ConversationLoader() {
  const { setMessages } = useConversationStore();

  useEffect(() => {
    const loadSharedConversation = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const encryptedData = urlParams.get('d');
      const keyStr = urlParams.get('k');

      if (encryptedData && keyStr) {
        try {
          toast("共有された会話を読み込み中・・・");

          const keyData = Uint8Array.from(atob(keyStr), c => c.charCodeAt(0));
          const key = await crypto.subtle.importKey(
            "raw",
            keyData,
            { name: "AES-GCM" },
            false,
            ["decrypt"]
          );

          const encryptedBytes = Uint8Array.from(atob(decodeURIComponent(encryptedData)), c => c.charCodeAt(0));
          const iv = encryptedBytes.slice(0, 12);
          const encrypted = encryptedBytes.slice(12);

          const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            key,
            encrypted
          );

          const jsonStr = new TextDecoder().decode(decrypted);
          const messagesData = JSON.parse(jsonStr);

          let idCounter = 0;
          const messages = messagesData.map((msg: { content: string; role: "user" | "ai"; timestamp: string; prompt?: string }) => ({
            id: `${Date.now()}-${++idCounter}`,
            content: msg.content,
            sender: { role: msg.role },
            timestamp: msg.timestamp,
            prompt: msg.prompt,
          }));

          setMessages(messages);
          toast.success("共有された会話を読み込みました！");

          const newUrl = new URL(window.location.href);
          newUrl.searchParams.delete('d');
          newUrl.searchParams.delete('k');
          window.history.replaceState({}, '', newUrl.toString());

        } catch (error) {
          console.error("Error loading shared conversation:", error);
          toast.error("共有された会話の読み込みに失敗しました。");
        }
      }
    };

    loadSharedConversation();
  }, [setMessages]);

  return null;
}
