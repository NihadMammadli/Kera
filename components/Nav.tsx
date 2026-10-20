'use client';

import { useEffect, useState } from 'react';
import { content, t } from '@/content';
import { Calendar, Envelope, Instagram, Phone } from './Icons';

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

  /* the scroll lock comes off in the tap itself, before the jump to the
     section starts — waiting for React's effect raced it on slower phones */
  const close = () => {
    document.body.style.overflow = '';
    setOpen(false);
  };

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

        <nav className="nav__sections" aria-label={t('a11y.navSections')}>
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

        <div className="nav__end">
          {(content.tel || content.mailto) && (
            <ul className="nav__contact">
              {content.tel && (
                <li>
                  <a href={content.tel}>
                    <Phone />
                    {content.phone}
                  </a>
                </li>
              )}
              {content.mailto && (
                <li>
                  <a href={content.mailto}>
                    <Envelope />
                    {content.email}
                  </a>
                </li>
              )}
            </ul>
          )}

          {content.book && (
            <a className="gilt nav__book" {...content.book}>
              <Calendar />
              {t('nav.book')}
            </a>
          )}

          {/* on a phone the same three fold into round buttons */}
          {content.tel && (
            <a className="nav__call" href={content.tel} aria-label={`${t('visit.label.phone')} ${content.phone}`}>
              <Phone />
            </a>
          )}
          {content.mailto && (
            <a className="nav__call" href={content.mailto} aria-label={`${t('visit.label.email')} ${content.email}`}>
              <Envelope />
            </a>
          )}
          {content.book && (
            <a className="nav__call nav__call--book" {...content.book} aria-label={t('nav.book')}>
              <Calendar />
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
          <a key={item.key} href={item.hash} onClick={close}>
            {item.label}
          </a>
        ))}
        {content.tel && (
          <a className="sheet__social" href={content.tel} onClick={close}>
            <Phone />
            {content.phone}
          </a>
        )}
        {content.mailto && (
          <a className="sheet__social" href={content.mailto} onClick={close}>
            <Envelope />
            {content.email}
          </a>
        )}
        <a className="sheet__social" href={content.instagramUrl} target="_blank" rel="noreferrer noopener" onClick={close}>
          <Instagram />@{content.instagram}
        </a>
      </div>
    </>
  );
}
