'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2, MapPin, Send, Sparkles, User } from 'lucide-react';

type Message = { role: 'user' | 'assistant'; content: string };

const SUGGESTIONS = [
  'Weekend trip ideas near me',
  'Best time to visit Japan',
  'Plan a 5-day Italy itinerary',
];

export default function TravelChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading]);

  async function sendMessage(e?: React.FormEvent, text?: string) {
    e?.preventDefault();
    const content = (text ?? input).trim();
    if (!content || loading) return;

    const newMessages: Message[] = [
      ...messages,
      { role: 'user', content },
    ];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: data.error ?? 'Something went wrong, try again.',
          },
        ]);
        return;
      }

      setMessages([
        ...newMessages,
        { role: 'assistant', content: data.content },
      ]);
    } catch {
      setMessages([
        ...newMessages,
        { role: 'assistant', content: 'Something went wrong, try again.' },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const isEmpty = messages.length === 0 && !loading;

  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-muted/50 via-background to-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 md:py-10 min-h-[calc(100dvh-4.75rem)]">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-4xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/5">
          <header className="flex items-center gap-3 border-b border-border/80 px-5 py-4 md:px-6">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <Sparkles className="size-5" aria-hidden />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight text-foreground md:text-lg">
                Trip planning assistant
              </h1>
              <p className="text-sm text-muted-foreground">
                Tell us where you want to go—we&apos;ll help you plan it.
              </p>
            </div>
          </header>

          <div
            ref={scrollRef}
            className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 md:px-6 md:py-6"
          >
            {isEmpty ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-6 py-8 text-center">
                <div className="flex size-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
                  <MapPin className="size-7" aria-hidden />
                </div>
                <div className="max-w-sm space-y-2">
                  <p className="text-lg font-medium tracking-tight text-foreground">
                    Where are you headed?
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    Ask about destinations, timing, budgets, or full itineraries.
                  </p>
                </div>
                <div className="flex w-full max-w-md flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                  {SUGGESTIONS.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => sendMessage(undefined, suggestion)}
                      className="rounded-4xl border border-border bg-background px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/30 hover:bg-muted/80 sm:text-center"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <>
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={cn(
                      'flex gap-3',
                      m.role === 'user' ? 'flex-row-reverse' : 'flex-row',
                    )}
                  >
                    <div
                      className={cn(
                        'flex size-8 shrink-0 items-center justify-center rounded-xl',
                        m.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground',
                      )}
                      aria-hidden
                    >
                      {m.role === 'user' ? (
                        <User className="size-4" />
                      ) : (
                        <Sparkles className="size-4" />
                      )}
                    </div>
                    <div
                      className={cn(
                        'max-w-[min(100%,28rem)] px-4 py-3 text-sm leading-relaxed shadow-sm',
                        m.role === 'user'
                          ? 'rounded-2xl rounded-tr-md bg-primary text-primary-foreground'
                          : 'rounded-2xl rounded-tl-md bg-muted text-foreground',
                      )}
                    >
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex gap-3">
                    <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                      <Sparkles className="size-4" aria-hidden />
                    </div>
                    <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-muted px-4 py-3 text-sm text-muted-foreground">
                      <span className="flex gap-1" aria-label="Assistant is typing">
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                        <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                      </span>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <footer className="border-t border-border/80 bg-card/80 p-4 backdrop-blur-sm md:p-5">
            <form
              onSubmit={(e) => sendMessage(e)}
              className="flex items-center gap-2 rounded-4xl border border-input bg-background p-1.5 pl-4 shadow-sm transition-[box-shadow,border-color] focus-within:border-ring/50 focus-within:ring-3 focus-within:ring-ring/20"
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Where do you want to go?"
                disabled={loading}
                className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
              />
              <Button
                type="submit"
                size="icon"
                disabled={loading || !input.trim()}
                className="size-10 shrink-0 rounded-3xl"
                aria-label="Send message"
              >
                {loading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Send className="size-4" />
                )}
              </Button>
            </form>
            <p className="mt-2 text-center text-xs text-muted-foreground">
              AI suggestions—always double-check dates and bookings.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
