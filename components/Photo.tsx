import { photo } from '@/content';
import { asset } from '@/lib/paths';

/**
 * One cut picture from `npm run images`, offered at every width it was cut
 * to. `sizes` tells the browser how wide it will be drawn, so a phone takes
 * the 480px file and a large screen the biggest. width/height carry the
 * picture's shape, so nothing jumps while it loads.
 */
type Props = {
  name: string;
  alt: string;
  sizes: string;
  className?: string;
  priority?: boolean;
  [data: `data-${string}`]: unknown;
};

export function Photo({ name, alt, sizes, className, priority, ...rest }: Props) {
  const p = photo(name);
  if (!p) return null;
  const url = (w: number) => asset(`/img/${p.name}-${w}.webp`);
  const fallback = p.widths.find((w) => w >= 800) ?? p.widths.at(-1)!;

  return (
    <img
      {...rest}
      className={className}
      src={url(fallback)}
      srcSet={p.widths.map((w) => `${url(w)} ${w}w`).join(', ')}
      sizes={sizes}
      width={p.width}
      height={p.height}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding={priority ? 'sync' : 'async'}
      fetchPriority={priority ? 'high' : 'auto'}
    />
  );
}
