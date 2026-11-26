import { useState } from 'react';
import { CarFront } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackLabel?: string;
}

export function ResilientImage({
  src,
  alt,
  className = '',
  fallbackLabel,
}: ResilientImageProps) {
  const [failed, setFailed] = useState(false);

  if (failed || !src) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#12121a] via-[#1c1026] to-[#0a1320] text-zinc-400 ${className}`}
        role="img"
        aria-label={alt}
      >
        <CarFront className="h-8 w-8 text-[#ff2e93]/70 mb-2" aria-hidden="true" />
        <span className="text-xs font-medium tracking-wide text-zinc-300 px-4 text-center">
          {fallbackLabel || alt}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      loading="lazy"
      onError={() => setFailed(true)}
      className={className}
    />
  );
}
