import { content, t } from '@/content';
import { Braid, Instagram } from './Icons';
import { withHandleText } from './Rich';

export function Foot() {
  return (
    <footer className="foot">
      <div className="shell">
        <div className="foot__top">
          <p className="foot__mark">{t('brand.name')}</p>
          <ul className="foot__nav">
            {content.nav.map((n) => (
              <li key={n.key}>
                <a href={n.hash}>{n.label}</a>
              </li>
            ))}
            <li>
              <a href="#top">{t('footer.backToTop')}</a>
            </li>
          </ul>
        </div>

        <Braid className="braid" />

        <div className="foot__base">
          <p style={{ margin: 0 }}>
            {t('footer.credit')} · {t('address.street')}, {t('address.city')}
            {content.tel && (
              <>
                {' · '}
                <a href={content.tel}>{content.phone}</a>
              </>
            )}
          </p>
          <div className="foot__social">
            <span className="ka" style={{ color: 'var(--chalk-3)' }}>
              {t('brand.nameGeorgian')}
            </span>
            <a
              href={content.instagramUrl}
              target="_blank"
              rel="noreferrer noopener"
              aria-label={withHandleText(t('a11y.instagram'))}
            >
              <Instagram />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
