import { cn } from '@/lib/utils';
import { Compass } from 'lucide-react';

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Compass className="h-6 w-6 text-primary" />
      <h1 className="text-xl font-bold text-foreground">Gaia's Quest</h1>
    </div>
  );
}
