import React from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  chatMessages,
  trips,
  users as allUsers,
} from '@/lib/data';
import { notFound } from 'next/navigation';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';

export default function ChatPage({ params }: { params: { id: string } }) {
  const resolvedParams = React.use(params);
  const trip = trips.find((t) => t.id === resolvedParams.id);
  if (!trip) {
    notFound();
  }

  const messages = chatMessages.filter((m) => m.tripId === trip.id);
  const currentUser = allUsers[0]; // Assuming the current user is Alex

  return (
    <Card className="flex h-[calc(100vh-12rem)] flex-col">
      <CardHeader>
        <CardTitle>Group Chat</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-6">
          <div className="space-y-6">
            {messages.map((message) => {
              const user = allUsers.find((u) => u.id === message.userId);
              const userAvatar = PlaceHolderImages.find(
                (img) => img.id === user?.avatar
              );
              const isCurrentUser = message.userId === currentUser.id;

              return (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-end gap-3',
                    isCurrentUser ? 'justify-end' : 'justify-start'
                  )}
                >
                  {!isCurrentUser && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage
                        src={userAvatar?.imageUrl}
                        alt={user?.name}
                        data-ai-hint={userAvatar?.imageHint}
                      />
                      <AvatarFallback>{user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      'max-w-md space-y-1 rounded-lg p-3',
                      isCurrentUser
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted'
                    )}
                  >
                    {!isCurrentUser && (
                      <p className="text-xs font-semibold">{user?.name}</p>
                    )}
                    <p className="text-sm">{message.content}</p>
                    <p
                      className={cn(
                        'text-xs',
                        isCurrentUser
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      )}
                    >
                      {format(parseISO(message.timestamp), 'h:mm a')}
                    </p>
                  </div>
                  {isCurrentUser && (
                    <Avatar className="h-9 w-9 border">
                      <AvatarImage
                        src={PlaceHolderImages.find(p => p.id === currentUser.avatar)?.imageUrl}
                        alt={currentUser?.name}
                        data-ai-hint={PlaceHolderImages.find(p => p.id === currentUser.avatar)?.imageHint}
                      />
                      <AvatarFallback>
                        {currentUser?.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="border-t p-4">
        <div className="flex w-full items-center gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input placeholder="Type your message..." className="flex-1" />
          <Button size="icon">
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

    