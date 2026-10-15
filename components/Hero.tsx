import { content, t, picture } from '@/content';
import { Arch } from './Arch';
import { ArrowDown } from './Icons';

export function Hero() {
  const hero = picture('hero');

  return (
    <section className="hero" id="top">
      <div className="hero__stage">
        <div className="motes" data-motes aria-hidden />

        {hero && (
          <div className="hero__arch">
            <Arch picture={hero} sizes="(max-width: 720px) 78vw, 27rem" priority />
          </div>
        )}

        <p className="hero__inscription" aria-hidden>
          <span className="ka">{t('brand.nameGeorgian')}</span>
          <span>{t('hero.inscription')}</span>
        </p>

        <div>
          {/* the wordmark is the brand, not the page's heading — that is the
              h1 below, which says what this place is in words Google reads */}
          <p className="hero__word" data-hero-word aria-label={t('brand.name')}>
            {t('brand.name')
              .split('')
              .map((c, i) => (
                <span className="glyph" key={i} aria-hidden>
                  {c === ' ' ? ' ' : c}
                </span>
              ))}
          </p>
          <p className="hero__line" data-hero-line>
            {t('brand.tagline')}
          </p>
        </div>
      </div>

      <div className="hero__foot" data-hero-foot>
        <div>
          <h1 className="micro hero__h1">{t('hero.h1')}</h1>
          <p className="micro">
            {t('address.street')}, {t('address.city')}
          </p>
        </div>

        <a className="hero__cue" href="#about">
          <ArrowDown />
          {t('hero.scrollLabel')}
        </a>

        {content.tel ? (
          <a className="micro hero__book" href={content.tel}>
            {t('nav.book')}
            <br />
            <span>{content.phone}</span>
          </a>
        ) : (
          <span />
        )}
      </div>
    </section>
  );
}
