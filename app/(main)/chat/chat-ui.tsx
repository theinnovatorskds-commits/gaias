'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  trips as initialTrips,
  chatMessages as initialChatMessages,
  users as allUsers,
} from '@/lib/data';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Paperclip, Send, UserPlus, Copy } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { format, parseISO } from 'date-fns';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
  } from "@/components/ui/select"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from '@/components/ui/separator';
import type { Trip, ChatMessage, User } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
  

export function ChatUI() {
  const { toast } = useToast();
  const [trips, setTrips] = useState<Trip[]>(initialTrips);
  const [messages, setMessages] = useState<ChatMessage[]>(initialChatMessages);
  const [selectedTripId, setSelectedTripId] = useState(trips[0].id);
  const [newMessage, setNewMessage] = useState('');

  const selectedTrip = trips.find((t) => t.id === selectedTripId);
  const tripMessages = messages.filter((m) => m.tripId === selectedTripId);
  const currentUser = allUsers[0];
  const tripParticipants = selectedTrip?.participants || [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTripId) return;

    const message: ChatMessage = {
        id: `msg-${Date.now()}`,
        tripId: selectedTripId,
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        content: newMessage.trim(),
    };

    setMessages(prevMessages => [...prevMessages, message]);
    setNewMessage('');
  };

  const handleAddParticipant = (user: User) => {
    if (!selectedTrip) return;

    const updatedTrips = trips.map(trip => {
        if (trip.id === selectedTripId) {
            // Avoid adding duplicate participants
            if (trip.participants.find(p => p.id === user.id)) {
                return trip;
            }
            return {
                ...trip,
                participants: [...trip.participants, user]
            };
        }
        return trip;
    });

    setTrips(updatedTrips);
  };

  const handleCopyLink = () => {
    if (!selectedTrip) return;
    const tripUrl = `${window.location.origin}/trips/${selectedTrip.id}/chat`;
    navigator.clipboard.writeText(tripUrl).then(() => {
        toast({
            title: "Link Copied!",
            description: "The trip chat link has been copied to your clipboard.",
        });
    });
  };

  const usersNotInTrip = allUsers.filter(user => 
    !tripParticipants.some(p => p.id === user.id)
  );

  return (
    <Card className="flex h-full flex-col border-0 shadow-none rounded-none">
      <CardHeader className="border-b">
        <div className="flex items-center gap-4">
            <CardTitle className="flex-1">Conversation</CardTitle>
            <Select value={selectedTripId} onValueChange={setSelectedTripId}>
                <SelectTrigger className="w-[280px]">
                    <SelectValue placeholder="Select a trip" />
                </SelectTrigger>
                <SelectContent>
                    {trips.map(trip => (
                        <SelectItem key={trip.id} value={trip.id}>{trip.destination}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Participants:</span>
                <div className="flex -space-x-2 overflow-hidden">
                    {tripParticipants.map(participant => {
                         const avatar = PlaceHolderImages.find((img) => img.id === participant.avatar);
                         return (
                            <Avatar key={participant.id} className="h-8 w-8 border-2 border-background">
                                <AvatarImage src={avatar?.imageUrl} alt={participant.name} data-ai-hint={avatar?.imageHint} />
                                <AvatarFallback>{participant.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                         )
                    })}
                </div>
            </div>
            <Popover>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                        <UserPlus className="mr-2 h-4 w-4" />
                        Invite People
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                    <div className="grid gap-4">
                        <div className="space-y-2">
                            <h4 className="font-medium leading-none">Invite to Trip</h4>
                            <p className="text-sm text-muted-foreground">
                                Add participants or share a link to the chat.
                            </p>
                        </div>
                        <Separator />
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="trip-link" className="text-sm font-medium">Shareable Link</Label>
                                <div className="flex items-center gap-2 mt-1">
                                    <Input
                                        id="trip-link"
                                        readOnly
                                        value={selectedTrip ? `${window.location.origin}/trips/${selectedTrip.id}/chat` : ''}
                                        className="h-8 text-xs"
                                    />
                                    <Button size="icon" variant="outline" className="h-8 w-8 flex-shrink-0" onClick={handleCopyLink} disabled={!selectedTrip}>
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                            <div className="relative">
                                <Separator />
                                <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-popover px-2 text-xs text-muted-foreground">
                                OR
                                </span>
                            </div>
                            <div>
                                <h5 className="text-sm font-medium mb-2">Add from users</h5>
                                <div className="grid gap-2">
                                    {usersNotInTrip.length > 0 ? usersNotInTrip.map(user => {
                                        const avatar = PlaceHolderImages.find(p => p.id === user.avatar);
                                        return (
                                        <div key={user.id} className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <Avatar className="h-8 w-8 border">
                                                    <AvatarImage src={avatar?.imageUrl} alt={user.name} data-ai-hint={avatar?.imageHint} />
                                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                                </Avatar>
                                                <span className="text-sm font-medium">{user.name}</span>
                                            </div>
                                            <Button size="sm" onClick={() => handleAddParticipant(user)}>Add</Button>
                                        </div>
                                    )}) : (
                                        <p className="text-sm text-muted-foreground text-center">All users are in this trip.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-0">
        <ScrollArea className="h-full p-6">
          <div className="space-y-6">
            {tripMessages.map((message) => {
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
        <form onSubmit={handleSendMessage} className="flex w-full items-center gap-2">
          <Button variant="ghost" size="icon" type="button">
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input 
            placeholder="Type your message..." 
            className="flex-1"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button size="icon" type="submit" disabled={!newMessage.trim()}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
