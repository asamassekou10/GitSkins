'use client';

import { useRef, useEffect } from 'react';
import type { ChatMessage, ProfileData } from './types';

interface Props {
  messages: ChatMessage[];
  input: string;
  loading: boolean;
  username: string;
  profileData: ProfileData | null;
  onInputChange: (value: string) => void;
  onSend: () => void;
}

export function ChatTab({ messages, input, loading, onInputChange, onSend }: Props) {
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', width: '100%', background: '#161616', border: '1px solid #2a2a2a', borderRadius: '20px', overflow: 'hidden' }}>
      <div style={{ minHeight: 'clamp(280px, 50vh, 400px)', maxHeight: '400px', overflowY: 'auto', padding: '20px', WebkitOverflowScrolling: 'touch' as any }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: '16px' }}>
            <div style={{
              maxWidth: 'min(85%, 520px)', padding: '12px 16px',
              background: msg.role === 'user' ? '#22c55e' : '#1a1a1a',
              borderRadius: msg.role === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
              color: msg.role === 'user' ? '#000' : '#e5e5e5',
              fontSize: '15px', lineHeight: 1.5,
            }}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px' }}>
            <div style={{ padding: '12px 16px', background: '#1a1a1a', borderRadius: '16px 16px 16px 4px', color: '#888' }}>
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div style={{ padding: '16px 20px', borderTop: '1px solid #2a2a2a', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          placeholder="Ask me anything about GitSkins..."
          style={{ flex: '1 1 200px', minWidth: 0, padding: '14px 16px', background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: '12px', color: '#fff', fontSize: '15px', outline: 'none' }}
          onKeyDown={(e) => e.key === 'Enter' && onSend()}
        />
        <button
          onClick={onSend}
          disabled={loading || !input.trim()}
          style={{
            padding: '14px 24px', minHeight: '48px',
            background: loading || !input.trim() ? '#1a1a1a' : '#22c55e',
            border: 'none', borderRadius: '12px',
            color: loading || !input.trim() ? '#888' : '#000',
            fontWeight: 600, cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', flexShrink: 0,
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}
