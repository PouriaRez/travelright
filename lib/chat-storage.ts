export type ChatMessage = { role: 'user' | 'assistant'; content: string };

export type ChatSession = {
  id: string;
  name: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
};

export type ChatStore = {
  activeChatId: string;
  chats: ChatSession[];
};

export const CHAT_STORE_KEY = 'travelright:chats';
const LEGACY_MESSAGES_KEY = 'messages';
export const DEFAULT_CHAT_NAME = 'New chat';

export function deriveChatTitle(text: string, maxLen = 48): string {
  const cleaned = text.replace(/\s+/g, ' ').trim();
  if (!cleaned) return DEFAULT_CHAT_NAME;
  if (cleaned.length <= maxLen) return cleaned;
  return `${cleaned.slice(0, maxLen).trim()}…`;
}

export function createChatSession(name = DEFAULT_CHAT_NAME): ChatSession {
  const now = Date.now();
  return {
    id: crypto.randomUUID(),
    name,
    messages: [],
    createdAt: now,
    updatedAt: now,
  };
}

function isMessage(value: unknown): value is ChatMessage {
  return (
    typeof value === 'object' &&
    value !== null &&
    'role' in value &&
    'content' in value &&
    ((value as ChatMessage).role === 'user' ||
      (value as ChatMessage).role === 'assistant') &&
    typeof (value as ChatMessage).content === 'string'
  );
}

function isChatSession(value: unknown): value is ChatSession {
  if (typeof value !== 'object' || value === null) return false;
  const c = value as ChatSession;
  return (
    typeof c.id === 'string' &&
    typeof c.name === 'string' &&
    Array.isArray(c.messages) &&
    c.messages.every(isMessage) &&
    typeof c.createdAt === 'number' &&
    typeof c.updatedAt === 'number'
  );
}

function isChatStore(value: unknown): value is ChatStore {
  if (typeof value !== 'object' || value === null) return false;
  const s = value as ChatStore;
  return (
    typeof s.activeChatId === 'string' &&
    Array.isArray(s.chats) &&
    s.chats.every(isChatSession) &&
    s.chats.some((c) => c.id === s.activeChatId)
  );
}

export function createDefaultStore(): ChatStore {
  const chat = createChatSession();
  return { activeChatId: chat.id, chats: [chat] };
}

export function loadChatStore(): ChatStore {
  if (typeof window === 'undefined') return createDefaultStore();

  try {
    const saved = localStorage.getItem(CHAT_STORE_KEY);
    if (saved) {
      const parsed: unknown = JSON.parse(saved);
      if (isChatStore(parsed)) {
        return {
          ...parsed,
          chats: [...parsed.chats].sort((a, b) => b.updatedAt - a.updatedAt),
        };
      }
      localStorage.removeItem(CHAT_STORE_KEY);
    }
  } catch {
    localStorage.removeItem(CHAT_STORE_KEY);
  }

  try {
    const legacy = localStorage.getItem(LEGACY_MESSAGES_KEY);
    if (legacy) {
      const parsed: unknown = JSON.parse(legacy);
      if (Array.isArray(parsed) && parsed.every(isMessage)) {
        const firstUser = parsed.find((m) => m.role === 'user');
        const chat = createChatSession(
          firstUser ? deriveChatTitle(firstUser.content) : DEFAULT_CHAT_NAME,
        );
        chat.messages = parsed;
        localStorage.removeItem(LEGACY_MESSAGES_KEY);
        const store: ChatStore = { activeChatId: chat.id, chats: [chat] };
        saveChatStore(store);
        return store;
      }
      localStorage.removeItem(LEGACY_MESSAGES_KEY);
    }
  } catch {
    localStorage.removeItem(LEGACY_MESSAGES_KEY);
  }

  return createDefaultStore();
}

export function saveChatStore(store: ChatStore): void {
  try {
    localStorage.setItem(CHAT_STORE_KEY, JSON.stringify(store));
  } catch {
    // storage full or unavailable
  }
}

export function getActiveChat(store: ChatStore): ChatSession {
  return (
    store.chats.find((c) => c.id === store.activeChatId) ?? store.chats[0]
  );
}

export function updateChatInStore(
  store: ChatStore,
  chatId: string,
  patch: Partial<Pick<ChatSession, 'name' | 'messages'>>,
): ChatStore {
  const now = Date.now();
  const chats = store.chats.map((c) =>
    c.id === chatId
      ? {
          ...c,
          ...patch,
          updatedAt: patch.messages || patch.name ? now : c.updatedAt,
        }
      : c,
  );
  if (patch.messages || patch.name) {
    chats.sort((a, b) => b.updatedAt - a.updatedAt);
  }
  return { ...store, chats };
}

export function addChatToStore(store: ChatStore, chat: ChatSession): ChatStore {
  return {
    activeChatId: chat.id,
    chats: [chat, ...store.chats],
  };
}

export function setActiveChat(store: ChatStore, chatId: string): ChatStore {
  if (!store.chats.some((c) => c.id === chatId)) return store;
  return { ...store, activeChatId: chatId };
}
