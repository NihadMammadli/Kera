/**
 * Drawn in one hand: 24×24 grid, 1.5 stroke, round caps, no fill.
 * Six of them are food that most Brussels diners have never seen, so they are
 * drawn as the object itself rather than as a generic plate or fork.
 */
type P = { className?: string };

const box = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

/* the arch every photograph on this page is cut into */
export function ArchDefs() {
  return (
    <svg width="0" height="0" aria-hidden focusable="false" style={{ position: 'absolute' }}>
      <defs>
        <clipPath id="kera-arch" clipPathUnits="objectBoundingBox">
          <path d="M0,1 L0,0.42 C0,0.17 0.19,0 0.5,0 C0.81,0 1,0.17 1,0.42 L1,1 Z" />
        </clipPath>
      </defs>
    </svg>
  );
}

/* mtsvadi — meat on a vine-wood skewer */
export const Skewer = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <g transform="rotate(-45 12 12)">
      <path d="M12 2.2v3.1M12 9.6v1.2M12 15.1v1.2M12 20.6v1.2" />
      <rect x="8.2" y="5.3" width="7.6" height="4.3" rx="1.8" />
      <rect x="8.2" y="10.8" width="7.6" height="4.3" rx="1.8" />
      <rect x="8.2" y="16.3" width="7.6" height="4.3" rx="1.8" />
    </g>
  </svg>
);

/* khachapuri — the Adjarian boat, egg still moving in it */
export const Bread = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <path d="M3.2 12.6c0-1 .9-1.8 1.9-1.6 2.2.4 4.5.7 6.9.7s4.7-.3 6.9-.7c1-.2 1.9.6 1.9 1.6 0 3.7-3.9 6.6-8.8 6.6s-8.8-2.9-8.8-6.6Z" />
    <path d="M5.4 11.2 6.8 6c.2-.7.9-1.1 1.6-.9 1.2.3 2.4.4 3.6.4s2.4-.1 3.6-.4c.7-.2 1.4.2 1.6.9l1.4 5.2" />
    <circle cx="12" cy="14" r="2.2" />
  </svg>
);

/* khinkali — hand-pleated, and you do not eat the knot */
export const Dumpling = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <path d="M4.6 18.2c0-4.3 3.3-7.8 7.4-7.8s7.4 3.5 7.4 7.8" />
    <path d="M3.4 18.2h17.2" />
    <path d="M12 10.4V5.6" />
    <path d="M12 5.6c-1.1 0-2-.7-2-1.5s.9-1.4 2-1.4 2 .6 2 1.4-.9 1.5-2 1.5Z" />
    <path d="M8.2 11.6 9.5 18.2M12 10.6v7.6M15.8 11.6 14.5 18.2" />
  </svg>
);

/* pkhali — walnut and herb, set in the palm */
export const Walnut = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <circle cx="12" cy="12" r="8.4" />
    <path d="M12 3.6v16.8" />
    <path d="M12 6.8c-2.1 1.3-3.3 3.1-3.3 5.2s1.2 3.9 3.3 5.2" />
    <path d="M12 6.8c2.1 1.3 3.3 3.1 3.3 5.2s-1.2 3.9-3.3 5.2" />
  </svg>
);

/* qvevri — the clay egg, buried to the neck in the floor */
export const Qvevri = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <path d="M12 3.4c-3 0-5.4 3.2-5.4 7.2 0 4.5 2.4 9.2 5.4 10.8 3-1.6 5.4-6.3 5.4-10.8 0-4-2.4-7.2-5.4-7.2Z" />
    <path d="M9.3 4.9h5.4" />
    <path d="M2.4 9.8h4.4M17.2 9.8h4.4" />
  </svg>
);

/* churchkhela — walnuts on a string, dipped in grape must */
export const Churchkhela = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.4}>
    <path d="M12 2.2v2.2" />
    <ellipse cx="12" cy="7" rx="3.2" ry="2.5" />
    <ellipse cx="12" cy="12" rx="3.2" ry="2.5" />
    <ellipse cx="12" cy="17" rx="3.2" ry="2.5" />
    <path d="M12 19.6v2.2" />
  </svg>
);

export const Flame = ({ className }: P) => (
  <svg {...box} className={className}>
    <path d="M12 21.2c3.7 0 6.4-2.5 6.4-5.9 0-4.7-4.4-6.8-4.4-10.4 0-.9.2-1.7.6-2.5-3.7 1-6.3 4.1-6.3 7.6 0 1.2.3 2.2.7 3.1-1-.4-1.7-1.3-2.1-2.3-1 1.4-1.5 3-1.5 4.5 0 3.4 2.8 5.9 6.6 5.9Z" />
  </svg>
);

export const Pin = ({ className }: P) => (
  <svg {...box} className={className}>
    <path d="M12 21.5s7-5.9 7-11.2a7 7 0 1 0-14 0c0 5.3 7 11.2 7 11.2Z" />
    <circle cx="12" cy="10.1" r="2.6" />
  </svg>
);

export const Clock = ({ className }: P) => (
  <svg {...box} className={className}>
    <circle cx="12" cy="12" r="8.8" />
    <path d="M12 6.9V12l3.4 2.1" />
  </svg>
);

export const Phone = ({ className }: P) => (
  <svg {...box} className={className}>
    <path d="M8.1 3.5H5.4A2 2 0 0 0 3.4 5.7c.35 3.6 1.7 7 3.9 9.8a24 24 0 0 0 4.9 4.9c2.8 2.2 6.2 3.5 9.8 3.9V21.7" transform="translate(0 -2)" />
    <path d="M8.1 3.5c.16 1.2.45 2.4.87 3.5a2 2 0 0 1-.45 2.1L7.4 10.2a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.45c1.1.42 2.3.71 3.5.87a2 2 0 0 1 1.7 2v2.6" />
  </svg>
);

export const Envelope = ({ className }: P) => (
  <svg {...box} className={className}>
    <rect x="2.6" y="4.9" width="18.8" height="14.2" rx="2.2" />
    <path d="m3.4 6.6 7.4 5.4a2 2 0 0 0 2.4 0l7.4-5.4" />
  </svg>
);

export const Instagram = ({ className }: P) => (
  <svg {...box} className={className}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.2" cy="6.8" r="1.05" fill="currentColor" stroke="none" />
  </svg>
);

export const ArrowRight = ({ className }: P) => (
  <svg {...box} className={className}>
    <path d="M4.2 12h15.6M13.6 5.8 19.8 12l-6.2 6.2" />
  </svg>
);

export const ArrowDown = ({ className }: P) => (
  <svg {...box} className={className} viewBox="0 0 16 24">
    <path d="M8 2.5v19M2.4 15.6 8 21.5l5.6-5.9" />
  </svg>
);

/* the grapevine that runs through every carved Georgian tympanum */
export const Vine = ({ className }: P) => (
  <svg {...box} className={className} strokeWidth={1.5}>
    <path d="M12 2.6v6.2" />
    <path d="M12 8.2c-2.7 0-4.8-1.7-4.8-3.8 2.7 0 4.8 1.7 4.8 3.8Z" />
    <circle cx="9.9" cy="13.2" r="2.5" />
    <circle cx="14.1" cy="13.2" r="2.5" />
    <circle cx="12" cy="17.6" r="2.5" />
  </svg>
);

/* the interlace band cut into the stone above a door; tiles horizontally */
export const Braid = ({ className }: P) => (
  <svg
    className={className}
    height="14"
    width="100%"
    preserveAspectRatio="none"
    aria-hidden
    focusable="false"
  >
    <defs>
      <pattern id="kera-braid" width="46" height="14" patternUnits="userSpaceOnUse">
        <path
          d="M0 7C7.7 -0.6 15.3 -0.6 23 7C30.7 14.6 38.3 14.6 46 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
        <path
          d="M0 7C7.7 14.6 15.3 14.6 23 7C30.7 -0.6 38.3 -0.6 46 7"
          fill="none"
          stroke="currentColor"
          strokeWidth="1"
        />
      </pattern>
    </defs>
    <rect width="100%" height="14" fill="url(#kera-braid)" />
  </svg>
);

export const dishIcons = {
  skewer: Skewer,
  bread: Bread,
  dumpling: Dumpling,
  walnut: Walnut,
  qvevri: Qvevri,
  churchkhela: Churchkhela,
} as const;
