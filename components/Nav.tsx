'use client';

import { useEffect, useState } from 'react';
import { content, t } from '@/content';
import { Instagram, Phone } from './Icons';

export function Nav() {
  const [lifted, setLifted] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string>('');

  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > window.innerHeight * 0.6);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* the nav says where you are, which is the whole point of an anchored page */
  useEffect(() => {
    const targets = content.nav
      .map((n) => document.querySelector(n.hash))
      .filter((el): el is Element => Boolean(el));
    if (!targets.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(`#${e.target.id}`);
        });
      },
      { rootMargin: '-45% 0px -50% 0px' },
    );
    targets.forEach((target) => io.observe(target));
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
      <header className="nav" data-lifted={lifted}>
        <a className="nav__mark" href="#top" aria-label={t('a11y.navHome')}>
          {t('brand.name')}
        </a>

        <nav aria-label={t('a11y.navSections')}>
          <ul className="nav__links">
            {content.nav.map((item) => (
              <li key={item.key}>
                <a className="nav__link" href={item.hash} aria-current={active === item.hash ? 'true' : undefined}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {content.tel && (
          <a className="gilt nav__book" href={content.tel}>
            <Phone />
            {t('nav.book')}
          </a>
        )}

        <div className="nav__phone">
          {content.tel && (
            <a className="nav__call" href={content.tel} aria-label={`${t('nav.book')} — ${content.phone}`}>
              <Phone />
            </a>
          )}
          <button
            className="nav__burger"
            type="button"
            aria-expanded={open}
            aria-controls="kera-menu"
            aria-label={open ? t('a11y.menuClose') : t('a11y.menuOpen')}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="sheet" id="kera-menu" data-open={open} inert={!open ? true : undefined}>
        {content.nav.map((item) => (
          <a key={item.key} href={item.hash} onClick={() => setOpen(false)}>
            {item.label}
          </a>
        ))}
        {content.tel && (
          <a className="sheet__book" href={content.tel} onClick={() => setOpen(false)}>
            <Phone />
            {t('nav.book')}
          </a>
        )}
        <a href={content.instagramUrl} target="_blank" rel="noreferrer noopener" onClick={() => setOpen(false)}>
          <Instagram />@{content.instagram}
        </a>
      </div>
    </>
  );
}
