import { useState, useCallback, useRef } from 'react';
import { streamChat } from '../api/chat';

export function useChat() {
  const [messages, setMessages] = useState([]);
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef(false);

  const send = useCallback(async (content, problemContext) => {
    abortRef.current = false;
    const userMsg = { role: 'user', content };
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setStreaming(true);

    let accumulated = '';
    await streamChat({
      messages: newMessages,
      problemContext,
      onChunk: (text) => {
        if (abortRef.current) return;
        accumulated += text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: 'assistant', content: accumulated };
          return updated;
        });
      },
      onDone: () => {
        setStreaming(false);
      },
      onError: (err) => {
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: `Error: ${err}`,
          };
          return updated;
        });
        setStreaming(false);
      },
    });
  }, [messages]);

  const clear = useCallback(() => {
    abortRef.current = true;
    setMessages([]);
    setStreaming(false);
  }, []);

  return { messages, streaming, send, clear };
}
