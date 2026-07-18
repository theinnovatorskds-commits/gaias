import { Plane } from 'lucide-react';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export function LoadingAnimation() {
  const earthImage = PlaceHolderImages.find(p => p.id === 'earth-from-space');

  return (
    <div className="loading-container">
       <div className="absolute inset-0 bg-black/50"></div>
      <div className="animation-wrapper">
        {earthImage && (
            <Image
                src={earthImage.imageUrl}
                alt="Earth"
                width={192}
                height={192}
                className="globe"
                data-ai-hint={earthImage.imageHint}
                priority
            />
        )}
        <div className="plane-path">
          <Plane className="plane-icon h-8 w-8" />
        </div>
      </div>
       <p className="relative mt-8 text-xl font-medium text-white drop-shadow-lg">Preparing Your Adventure...</p>
    </div>
  );
}
