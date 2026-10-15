'use client';

import { useEffect } from 'react';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import { SplitText } from 'gsap/SplitText';

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, SplitText, useGSAP);

const EASE = 'power3.out';

/**
 * One authored moment, used the whole way down: an arch fires. The gilt
 * outline draws itself, the image rises into the opening, and whatever stands
 * beside it comes up in the same breath.
 *
 * The page is finished in CSS. An inline script in the document head adds
 * `.motion` only when motion is welcome, which is the single thing that
 * un-finishes it — and it un-does itself after three seconds if this file
 * never arrives. No visitor is ever left looking at an empty wall.
 */
export function Motion() {
  useEffect(() => {
    document.documentElement.dataset.fired = 'true';
  }, []);

  /**
   * Anchor navigation, taken off the browser.
   *
   * Native smooth scrolling covers the whole distance at its own pace, so a
   * jump from the top to Visit crawls past every section on the way. This
   * tweens the window over a fixed duration instead, so every jump takes the
   * same second whatever lies between here and there.
   */
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.style.scrollBehavior;
    root.style.scrollBehavior = 'auto';

    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]') as HTMLAnchorElement | null;
      if (!link) return;

      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      const target = document.querySelector<HTMLElement>(hash);
      if (!target) return;

      e.preventDefault();

      /* the same room the browser leaves on a native jump: the page's
         scroll-padding (the nav) plus the target's own scroll-margin (e.g. a
         menu category under the sticky food / bar switch) */
      const padding = parseFloat(getComputedStyle(root).scrollPaddingTop) || 88;
      const margin = parseFloat(getComputedStyle(target).scrollMarginTop) || 0;
      const offsetY = hash === '#top' ? 0 : padding + margin;
      const destination = () => (hash === '#top' ? 0 : target.getBoundingClientRect().top + window.scrollY - offsetY);
      const settle = () => {
        history.replaceState(null, '', hash);
        target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      };

      if (!window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
        window.scrollTo(0, destination());
        settle();
        return;
      }

      /* A phone's toolbar shrinks as the page starts to move, resizing the
         viewport mid-jump. GSAP's autoKill reads that as the visitor scrolling
         and abandons the jump partway — on an iPhone, most drawer links
         stopped short. So autoKill is off: the visitor's own touch or wheel
         stops the jump instead, and if the layout moved under it the jump
         settles exactly on the section at the end. */
      const stop = () => {
        tween.kill();
        release();
      };
      const release = () => {
        window.removeEventListener('wheel', stop);
        window.removeEventListener('touchstart', stop);
      };
      const tween = gsap.to(window, {
        duration: 1,
        delay: 0.05, /* lets the mobile sheet close first */
        ease: 'power2.inOut',
        scrollTo: { y: destination(), autoKill: false },
        overwrite: true,
        onComplete: () => {
          release();
          const end = destination();
          if (Math.abs(window.scrollY - end) > 2) window.scrollTo(0, end);
          settle();
        },
      });
      window.addEventListener('wheel', stop, { passive: true });
      window.addEventListener('touchstart', stop, { passive: true });
    };

    document.addEventListener('click', onClick);
    return () => {
      document.removeEventListener('click', onClick);
      root.style.scrollBehavior = previous;
    };
  }, []);

  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(
      {
        motion: '(prefers-reduced-motion: no-preference)',
        desktop: '(min-width: 901px)',
      },
      (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        if (!motion) return;

        /* ------------------------------------------------------ the arches */
        gsap.utils.toArray<HTMLElement>('[data-arch]').forEach((arch) => {
          const veil = arch.querySelector('[data-arch-veil]');
          const img = arch.querySelector('[data-arch-img]');
          const rule = arch.querySelector('.arch__rule');
          const isHero = Boolean(arch.closest('.hero'));

          gsap
            .timeline({
              defaults: { ease: EASE },
              ...(isHero
                ? { delay: 0.15 }
                : { scrollTrigger: { trigger: arch, start: 'top 82%', once: true } }),
            })
            .fromTo(
              veil,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.5 },
            )
            .fromTo(img, { scale: 1.2 }, { scale: 1, duration: 1.9 }, 0)
            .fromTo(
              rule,
              { clipPath: 'inset(100% 0% 0% 0%)' },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.15 },
              0.1,
            );

          /* the image drifts slower than its own frame */
          if (img && !isHero) {
            gsap.fromTo(
              img,
              { yPercent: -5 },
              {
                yPercent: 5,
                ease: 'none',
                scrollTrigger: { trigger: arch, start: 'top bottom', end: 'bottom top', scrub: true },
              },
            );
          }
        });

        /* -------------------------------------------------------- the hero */
        const glyphs = gsap.utils.toArray<HTMLElement>('[data-hero-word] .glyph');
        if (glyphs.length) {
          gsap
            .timeline({ defaults: { ease: 'expo.out' }, delay: 0.1 })
            .fromTo(
              glyphs,
              { yPercent: 118, rotate: 4, opacity: 0 },
              { yPercent: 0, rotate: 0, opacity: 1, duration: 1.6, stagger: 0.085 },
            )
            .fromTo('[data-hero-line]', { y: 26, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1 }, '-=1.05')
            .fromTo(
              '[data-hero-foot] > *',
              { y: 18, opacity: 0 },
              { y: 0, opacity: 1, duration: 0.9, stagger: 0.08 },
              '-=0.85',
            );
        }

        if (document.querySelector('.hero__stage')) {
          gsap.to('.hero__stage', {
            yPercent: 12,
            opacity: 0.35,
            ease: 'none',
            scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
          });
        }

        /* dust in the lamplight — hero only, desktop only, and cheap */
        const motes = document.querySelector('[data-motes]');
        if (motes && desktop) {
          for (let m = 0; m < 16; m++) {
            const dot = document.createElement('span');
            dot.className = 'mote';
            motes.appendChild(dot);
            gsap.set(dot, {
              x: gsap.utils.random(0, window.innerWidth),
              y: gsap.utils.random(0, window.innerHeight),
              scale: gsap.utils.random(0.6, 2.1),
            });
            gsap.to(dot, {
              y: `-=${gsap.utils.random(120, 320)}`,
              x: `+=${gsap.utils.random(-70, 70)}`,
              opacity: gsap.utils.random(0.15, 0.55),
              duration: gsap.utils.random(9, 18),
              repeat: -1,
              yoyo: true,
              ease: 'sine.inOut',
              delay: gsap.utils.random(0, 8),
            });
          }
        }

        /* -------------------------------------------------------- the band */
        const track = document.querySelector<HTMLElement>('[data-band]');
        if (track) {
          const half = track.scrollWidth / 2;
          const wrap = gsap.utils.wrap(-half, 0);
          const marquee = gsap.to(track, {
            x: `-=${half}`,
            duration: half / 46,
            ease: 'none',
            repeat: -1,
            modifiers: { x: (x) => `${wrap(parseFloat(x))}px` },
          });

          /* it leans into the scroll, the way a band on a drum would */
          ScrollTrigger.create({
            onUpdate: (self) => {
              const v = gsap.utils.clamp(-2.6, 2.6, self.getVelocity() / 480);
              gsap.to(marquee, { timeScale: 1 + Math.abs(v), duration: 0.35, overwrite: true });
            },
          });
        }

        /* ------------------------------------------------------ split type */
        document.fonts.ready.then(() => {
          gsap.utils.toArray<HTMLElement>('[data-split="lines"]').forEach((el) => {
            const split = SplitText.create(el, { type: 'lines', mask: 'lines' });
            gsap.from(split.lines, {
              yPercent: 128,
              opacity: 0,
              duration: 1.15,
              ease: EASE,
              stagger: 0.09,
              scrollTrigger: { trigger: el, start: 'top 86%', once: true },
            });
          });
          ScrollTrigger.refresh();
        });

        /* --------------------------------------------------- quiet reveals */
        gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((el) => {
          gsap.from(el, {
            y: 26,
            opacity: 0,
            duration: 1,
            ease: EASE,
            scrollTrigger: { trigger: el, start: 'top 88%', once: true },
          });
        });
      },
    );

    return () => mm.revert();
  });

  return null;
}
