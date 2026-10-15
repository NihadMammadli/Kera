import { Photo } from './Photo';

/**
 * Every photograph on this page is cut into the same arch, and every arch
 * fires when it is reached: the gilt outline draws itself and the image rises
 * into the opening. Fired is the CSS default — motion.ts un-fires it first,
 * so no-JS and reduced-motion visitors get the finished wall.
 *
 * The picture name comes from the client's workbook; its cut sizes come from
 * `npm run images`.
 */
type Props = {
  picture: { file: string; alt: string };
  sizes: string;
  className?: string;
  priority?: boolean;
};

export function Arch({ picture, className, priority, sizes }: Props) {
  return (
    <figure className={`arch${className ? ` ${className}` : ''}`} data-arch>
      <div className="arch__frame">
        <div className="arch__veil" data-arch-veil>
          <Photo
            className="arch__img"
            data-arch-img
            name={picture.file}
            alt={picture.alt}
            sizes={sizes}
            priority={priority}
          />
        </div>
      </div>
      <svg className="arch__rule" viewBox="0 0 1 1" preserveAspectRatio="none" aria-hidden focusable="false">
        <path
          data-arch-rule
          pathLength={1}
          d="M0,1 L0,0.42 C0,0.17 0.19,0 0.5,0 C0.81,0 1,0.17 1,0.42 L1,1"
        />
      </svg>
    </figure>
  );
}
