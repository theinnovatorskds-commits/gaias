'use client';

import { useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useTheme } from 'next-themes';
import { doc } from 'firebase/firestore';

import { Header } from '@/components/layout/header';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import {
  useDoc,
  useFirestore,
  useUser,
  useMemoFirebase,
  setDocumentNonBlocking,
} from '@/firebase';
import { Skeleton } from '@/components/ui/skeleton';
import { useCurrency } from '@/context/currency-provider';

const settingsFormSchema = z.object({
  notificationsEnabled: z.boolean().default(false),
  language: z.string(),
});

type SettingsFormValues = z.infer<typeof settingsFormSchema>;

export default function SettingsPage() {
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const firestore = useFirestore();
  const { theme, setTheme } = useTheme();
  const { currency } = useCurrency();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const settingsDocRef = useMemoFirebase(() => {
    if (!user) return null;
    return doc(firestore, 'users', user.uid, 'settings', user.uid);
  }, [firestore, user]);

  const { data: settingsData, isLoading: isSettingsLoading } = useDoc<SettingsFormValues>(settingsDocRef);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      notificationsEnabled: false,
      language: 'en-US',
    },
  });

  useEffect(() => {
    if (settingsData) {
      form.reset(settingsData);
    }
  }, [settingsData, form]);

  function onSubmit(data: SettingsFormValues) {
    if (!user || !settingsDocRef) return;
    setIsSubmitting(true);

    const dataToSave = {
        ...data,
        userId: user.uid, // Required by security rules
        theme: theme, // Save current theme preference
        currency: currency, // Save current currency
    };

    setDocumentNonBlocking(settingsDocRef, dataToSave, { merge: true });

    toast({
      title: 'Settings Saved',
      description: 'Your new settings have been applied.',
    });
    setIsSubmitting(false);
  }

  const isLoading = isUserLoading || isSettingsLoading;

  return (
    <div className="flex min-h-screen w-full flex-col">
      <Header title="Settings" />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-6">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle>Application Settings</CardTitle>
                <CardDescription>
                  Manage your account settings and preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="space-y-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-10 w-full" />
                    </div>
                     <div className="flex items-center justify-between rounded-lg border p-4">
                        <div className="space-y-1">
                             <Skeleton className="h-4 w-32" />
                             <Skeleton className="h-3 w-48" />
                        </div>
                        <Skeleton className="h-6 w-11 rounded-full" />
                    </div>
                  </div>
                ) : (
                  <>
                    <FormItem>
                        <FormLabel>Theme</FormLabel>
                         <Select onValueChange={(value) => setTheme(value)} defaultValue={theme}>
                            <FormControl>
                                <SelectTrigger>
                                <SelectValue placeholder="Select a theme" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectItem value="light">Light</SelectItem>
                                <SelectItem value="dark">Dark</SelectItem>
                                <SelectItem value="system">System</SelectItem>
                            </SelectContent>
                        </Select>
                        <FormDescription>
                           Select the theme for the dashboard.
                        </FormDescription>
                    </FormItem>
                    
                    <FormField
                      control={form.control}
                      name="notificationsEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Receive emails about trip updates and offers.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 gap-4">
                         <FormField
                            control={form.control}
                            name="language"
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Language</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a language" />
                                    </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                    <SelectItem value="en-US">English</SelectItem>
                                    <SelectItem value="es-ES">Español</SelectItem>
                                    <SelectItem value="fr-FR">Français</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormDescription>
                                    This is the language that will be used in the dashboard.
                                </FormDescription>
                                </FormItem>
                            )}
                            />
                    </div>
                  </>
                )}
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button type="submit" disabled={isSubmitting || isLoading}>
                  {isSubmitting ? 'Saving...' : 'Save Settings'}
                </Button>
              </CardFooter>
            </form>
          </Form>
        </Card>
      </main>
    </div>
  );
}
