import { Header } from '@/components/layout/header';
import { ChatUI } from './chat-ui';

export default function ChatPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full flex-col">
      <Header title="Group Chat" />
      <main className="flex-1 overflow-hidden">
        <ChatUI />
      </main>
    </div>
  );
}
