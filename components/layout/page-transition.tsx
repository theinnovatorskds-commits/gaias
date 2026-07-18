'use client';

import { usePathname } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { Plane } from 'lucide-react';

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [animationType, setAnimationType] = useState<'plane' | 'wave' | null>(null);
  const previousPathnameRef = useRef(pathname);

  useEffect(() => {
    if (previousPathnameRef.current !== pathname) {
      // Show wave animation when navigating to a trip's main overview page.
      const isTripOverviewPage = /^\/trips\/[^\/]+$/.test(pathname);

      if (isTripOverviewPage) {
        setAnimationType('wave');
      } else {
        setAnimationType('plane');
      }

      setIsTransitioning(true);
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setAnimationType(null);
      }, 2500); // Duration of the transition

      previousPathnameRef.current = pathname;
      return () => clearTimeout(timer);
    }
  }, [pathname]);

  const renderAnimation = () => {
    if (!isTransitioning) return null;

    if (animationType === 'wave') {
      return (
        <div className="wave-transition-overlay">
          <div className="wave" style={{ zIndex: 1001, opacity: 1 }}>
            <svg
              className="wave-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="hsl(var(--primary))"
                d="M0,160L48,181.3C96,203,192,245,288,250.7C384,256,480,224,576,213.3C672,203,768,213,864,197.3C960,181,1056,139,1152,128C1248,117,1344,139,1392,149.3L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
          <div
            className="wave"
            style={{ zIndex: 1000, animationDelay: '0.1s', opacity: 0.7 }}
          >
            <svg
              className="wave-svg"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 1440 320"
            >
              <path
                fill="hsl(var(--primary))"
                d="M0,224L48,208C96,192,192,160,288,165.3C384,171,480,213,576,208C672,203,768,149,864,138.7C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
              ></path>
            </svg>
          </div>
        </div>
      );
    }

    if (animationType === 'plane') {
      return (
        <div className="plane-transition-overlay">
          <Plane className="flying-plane h-12 w-12" />
        </div>
      );
    }
    
    return null;
  };


  return (
    <div className="relative flex-1 flex flex-col">
      {renderAnimation()}
      {children}
    </div>
  );
}
