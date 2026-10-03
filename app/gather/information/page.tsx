'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import {
  addChatToStore,
  createChatSession,
  DEFAULT_CHAT_NAME,
  deriveChatTitle,
  getActiveChat,
  loadChatStore,
  saveChatStore,
  setActiveChat,
  updateChatInStore,
  type ChatMessage,
  type ChatStore,
} from '@/lib/chat-storage';
import { ChatSidebar } from './ChatSidebar';
import {
  AlertCircle,
  Loader2,
  MapPin,
  PanelLeft,
  Send,
  Sparkles,
  User,
} from 'lucide-react';

const GENERIC_ERROR = 'Something went wrong, try again.';

const SUGGESTIONS = [
  'Weekend trip ideas near me',
  'Best time to visit Japan',
  'Plan a 5-day Italy itinerary',
];

export default function TravelChatPage() {
  const [store, setStore] = useState<ChatStore | null>(null);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const activeChat = store ? getActiveChat(store) : null;
  const messages = activeChat?.messages ?? [];

  useEffect(() => {
    setStore(loadChatStore());
  }, []);

  useEffect(() => {
    if (!store) return;
    saveChatStore(store);
  }, [store]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, loading, error, store?.activeChatId]);

  function handleNewChat() {
    if (loading) return;
    const chat = createChatSession();
    setStore((prev) => (prev ? addChatToStore(prev, chat) : prev));
    setError(null);
    setInput('');
    setMobileNavOpen(false);
    inputRef.current?.focus();
  }

  function handleSelectChat(chatId: string) {
    if (loading || !store || chatId === store.activeChatId) return;
    setStore(setActiveChat(store, chatId));
    setError(null);
    setInput('');
    setMobileNavOpen(false);
    inputRef.current?.focus();
  }

  function handleRenameChat(chatId: string, name: string) {
    if (!store) return;
    setStore(updateChatInStore(store, chatId, { name }));
  }

  async function sendMessage(e?: React.FormEvent, text?: string) {
    e?.preventDefault();
    const content = (text ?? input).trim();
    if (!content || loading || !store || !activeChat) return;

    const chatId = activeChat.id;
    const newMessages: ChatMessage[] = [
      ...activeChat.messages,
      { role: 'user', content },
    ];

    const shouldAutoTitle =
      activeChat.name === DEFAULT_CHAT_NAME && activeChat.messages.length === 0;

    setStore(
      updateChatInStore(store, chatId, {
        messages: newMessages,
        ...(shouldAutoTitle ? { name: deriveChatTitle(content) } : {}),
      }),
    );
    setInput('');
    setError(null);
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? GENERIC_ERROR);
        return;
      }

      setStore((prev) => {
        if (!prev) return prev;
        const chat = prev.chats.find((c) => c.id === chatId);
        if (!chat) return prev;
        return updateChatInStore(prev, chatId, {
          messages: [
            ...chat.messages,
            { role: 'assistant', content: data.content },
          ],
        });
      });
    } catch {
      setError(GENERIC_ERROR);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  }

  const hydrated = store !== null;
  const isEmpty = hydrated && messages.length === 0 && !loading && !error;

  const sidebarProps = {
    chats: store?.chats ?? [],
    activeChatId: store?.activeChatId ?? '',
    onSelect: handleSelectChat,
    onNewChat: handleNewChat,
    onRename: handleRenameChat,
    disabled: loading,
  };

  return (
    <div className="flex flex-1 flex-col bg-linear-to-b from-muted/50 via-background to-background md:h-[calc(100dvh-4.75rem)] md:min-h-0 md:bg-background">
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4 py-6 min-h-[calc(100dvh-4.75rem)] md:mx-0 md:h-full md:max-w-none md:min-h-0 md:px-0 md:py-0">
        <div className="flex min-h-0 flex-1 overflow-hidden rounded-4xl bg-card text-card-foreground shadow-lg ring-1 ring-foreground/5 md:h-full md:flex-row md:rounded-none md:shadow-none md:ring-0">
          <aside className="hidden h-full w-64 shrink-0 border-r border-border/80 md:flex md:flex-col">
            <ChatSidebar {...sidebarProps} className="h-full" />
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col">
            <header className="flex items-center gap-3 border-b border-border/80 px-4 py-4 md:px-6">
              <Sheet open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
                <SheetTrigger
                  render={
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      className="shrink-0 md:hidden"
                      aria-label="Open chats"
                    />
                  }
                >
                  <PanelLeft className="size-5" />
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <SheetHeader className="border-b border-border/80 px-4 py-4">
                    <SheetTitle>Chats</SheetTitle>
                  </SheetHeader>
                  <ChatSidebar
                    {...sidebarProps}
                    className="h-[calc(100%-4rem)]"
                  />
                </SheetContent>
              </Sheet>

              <div className="flex size-10 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Sparkles className="size-5" aria-hidden />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="truncate text-base font-semibold tracking-tight text-foreground md:text-lg">
                  {activeChat?.name ?? 'Trip planning assistant'}
                </h1>
                <p className="hidden text-sm text-muted-foreground sm:block">
                  Plan your trips with ease.
                </p>
              </div>
            </header>

            <div
              ref={scrollRef}
              className="flex flex-1 flex-col overflow-y-auto px-4 py-3 md:px-6 md:py-4"
            >
              {!hydrated ? (
                <div className="flex flex-1 items-center justify-center">
                  <Loader2 className="size-6 animate-spin text-muted-foreground" />
                </div>
              ) : isEmpty ? (
                <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4 pt-4 pb-2 text-center md:max-w-4xl md:pt-8">
                  <div className="flex size-14 items-center justify-center rounded-3xl bg-muted text-muted-foreground">
                    <MapPin className="size-7" aria-hidden />
                  </div>
                  <div className="max-w-sm space-y-2">
                    <p className="text-lg font-medium tracking-tight text-foreground">
                      Where are you headed?
                    </p>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      Ask about destinations, timing, budgets, or full
                      itineraries.
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
                <div className="mx-auto flex w-full max-w-3xl flex-col gap-3 md:max-w-4xl">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={cn(
                        'flex gap-2',
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
                          'max-w-[min(100%,28rem)] px-3.5 py-2 text-sm leading-snug shadow-sm',
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
                    <div className="flex gap-2">
                      <div className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-muted text-muted-foreground">
                        <Sparkles className="size-4" aria-hidden />
                      </div>
                      <div className="flex items-center gap-2 rounded-2xl rounded-tl-md bg-muted px-3.5 py-2 text-sm text-muted-foreground">
                        <span
                          className="flex gap-1"
                          aria-label="Assistant is typing"
                        >
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:0ms]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:150ms]" />
                          <span className="size-1.5 animate-bounce rounded-full bg-muted-foreground/60 [animation-delay:300ms]" />
                        </span>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div
                      role="alert"
                      className="flex items-center gap-2 self-start rounded-2xl border border-destructive/30 bg-destructive/10 px-3.5 py-2 text-sm text-destructive"
                    >
                      <AlertCircle className="size-4 shrink-0" aria-hidden />
                      {error}
                    </div>
                  )}
                </div>
              )}
            </div>

            <footer className="border-t border-border/80 bg-card/80 p-4 backdrop-blur-sm md:px-6 md:py-5">
              <form
                onSubmit={(e) => sendMessage(e)}
                className="mx-auto flex w-full max-w-3xl items-center gap-2 rounded-4xl border border-input bg-background p-1.5 pl-4 shadow-sm transition-[box-shadow,border-color] focus-within:border-ring/50 focus-within:ring-3 focus-within:ring-ring/20 md:max-w-4xl"
              >
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Where do you want to go?"
                  disabled={loading || !hydrated}
                  className="min-w-0 flex-1 bg-transparent py-2.5 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-60"
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={loading || !input.trim() || !hydrated}
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
              <p className="mx-auto mt-2 max-w-3xl text-center text-xs text-muted-foreground md:max-w-4xl">
                AI suggestions—always double-check dates and bookings.
              </p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
