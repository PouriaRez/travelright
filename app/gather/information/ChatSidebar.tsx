'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { ChatSession } from '@/lib/chat-storage';
import { Check, MessageSquarePlus, Pencil, X } from 'lucide-react';

type ChatSidebarProps = {
  chats: ChatSession[];
  activeChatId: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
  onRename: (id: string, name: string) => void;
  disabled?: boolean;
  className?: string;
};

export function ChatSidebar({
  chats,
  activeChatId,
  onSelect,
  onNewChat,
  onRename,
  disabled,
  className,
}: ChatSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingId) renameInputRef.current?.focus();
  }, [editingId]);

  function startRename(chat: ChatSession, e: React.MouseEvent) {
    e.stopPropagation();
    if (disabled) return;
    setEditingId(chat.id);
    setDraftName(chat.name);
  }

  function commitRename(chatId: string) {
    const trimmed = draftName.trim();
    if (trimmed) onRename(chatId, trimmed);
    setEditingId(null);
    setDraftName('');
  }

  function cancelRename() {
    setEditingId(null);
    setDraftName('');
  }

  return (
    <div className={cn('flex h-full min-h-0 flex-col bg-muted/30', className)}>
      <div className="border-b border-border/80 p-4">
        <Button
          type="button"
          variant="outline"
          className="w-full justify-start gap-2 rounded-3xl bg-background"
          onClick={onNewChat}
          disabled={disabled}
        >
          <MessageSquarePlus className="size-4 shrink-0" aria-hidden />
          New chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        <p className="px-2 pb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Your chats
        </p>
        <ul className="flex flex-col gap-0.5">
          {chats.map((chat) => {
            const isActive = chat.id === activeChatId;
            const isEditing = editingId === chat.id;

            return (
              <li key={chat.id}>
                {isEditing ? (
                  <div className="flex items-center gap-1 rounded-2xl border border-border bg-background p-1.5">
                    <input
                      ref={renameInputRef}
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') commitRename(chat.id);
                        if (e.key === 'Escape') cancelRename();
                      }}
                      className="min-w-0 flex-1 bg-transparent px-2 py-1 text-sm outline-none"
                      aria-label="Chat name"
                    />
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="shrink-0"
                      onClick={() => commitRename(chat.id)}
                      aria-label="Save name"
                    >
                      <Check className="size-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className="shrink-0"
                      onClick={cancelRename}
                      aria-label="Cancel rename"
                    >
                      <X className="size-3.5" />
                    </Button>
                  </div>
                ) : (
                  <div
                    className={cn(
                      'group flex w-full items-center gap-0.5 rounded-2xl pr-1 transition-colors',
                      isActive ? 'bg-primary/10' : 'hover:bg-muted/80',
                      disabled && 'pointer-events-none opacity-60',
                    )}
                  >
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => onSelect(chat.id)}
                      className={cn(
                        'min-w-0 flex-1 truncate rounded-2xl px-3 py-2.5 text-left text-sm font-medium',
                        isActive
                          ? 'text-foreground'
                          : 'text-muted-foreground group-hover:text-foreground',
                      )}
                    >
                      {chat.name}
                    </button>
                    <Button
                      type="button"
                      size="icon-xs"
                      variant="ghost"
                      className={cn(
                        'shrink-0 opacity-0 transition-opacity group-hover:opacity-100',
                        isActive && 'opacity-100',
                      )}
                      onClick={(e) => startRename(chat, e)}
                      disabled={disabled}
                      aria-label={`Rename ${chat.name}`}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
