import { useEffect, useState } from 'react';

interface ProductImageProps {
  src?: string;
  alt: string;
  className?: string;
  placeholderClassName?: string;
  iconClassName?: string;
  placeholderLabel?: string;
}

export default function ProductImage({
  src,
  alt,
  className = 'w-full h-full object-cover',
  placeholderClassName = 'w-full h-full flex items-center justify-center text-slate-400',
  iconClassName = 'w-16 h-16',
  placeholderLabel,
}: ProductImageProps) {
  const [hasError, setHasError] = useState(false);
  const safeSrc = src?.trim();

  useEffect(() => {
    setHasError(false);
  }, [safeSrc]);

  if (!safeSrc || hasError) {
    return (
      <div className={placeholderClassName}>
        <div className="text-center p-8">
          <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {placeholderLabel ? <p className="text-sm text-slate-500 font-medium mt-4">{placeholderLabel}</p> : null}
        </div>
      </div>
    );
  }

  return <img src={safeSrc} alt={alt} className={className} onError={() => setHasError(true)} />;
}
