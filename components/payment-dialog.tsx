'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { useState } from 'react';
import { useCurrency } from '@/context/currency-provider';

interface PaymentDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  itemName: string;
  itemType: 'Flight' | 'Hotel';
  price: string | number;
  currency: string;
}

const USD_TO_INR_RATE = 83;

export function PaymentDialog({
  isOpen,
  onOpenChange,
  itemName,
  itemType,
  price,
  currency: originalCurrency,
}: PaymentDialogProps) {
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const { currency: displayCurrency } = useCurrency();

  const handlePayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      onOpenChange(false);
      toast({
        title: 'Payment Successful!',
        description: `Your ${itemType.toLowerCase()} booking for ${itemName} has been confirmed.`,
      });
    }, 1500);
  };

  let displayPrice = Number(price);
  if (originalCurrency === 'USD' && displayCurrency === 'INR') {
    displayPrice = displayPrice * USD_TO_INR_RATE;
  } else if (originalCurrency === 'INR' && displayCurrency === 'USD') {
    displayPrice = displayPrice / USD_TO_INR_RATE;
  }

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: displayCurrency,
  }).format(displayPrice);


  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Complete Your Booking</DialogTitle>
          <DialogDescription>
            You are booking a {itemType.toLowerCase()} for {itemName}.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Total Amount</span>
            <span className="font-semibold text-lg">{formattedPrice}</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-name">Name on Card</Label>
            <Input id="card-name" placeholder="John Doe" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="•••• •••• •••• 1234" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expiry-date">Expires</Label>
              <Input id="expiry-date" placeholder="MM/YY" />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="cvc">CVC</Label>
              <Input id="cvc" placeholder="123" />
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handlePayment} disabled={isProcessing} className="w-full">
            {isProcessing ? 'Processing...' : `Pay ${formattedPrice}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
