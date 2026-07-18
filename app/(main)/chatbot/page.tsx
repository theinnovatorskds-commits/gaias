import { Header } from '@/components/layout/header';
import { ChatbotUI } from './chatbot-ui';

export default function ChatbotPage() {
  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] w-full flex-col">
      <Header title="AI Trip Planner" />
      <main className="flex-1 overflow-hidden">
        <ChatbotUI />
      </main>
    </div>
  );
}
