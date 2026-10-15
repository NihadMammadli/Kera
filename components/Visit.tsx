import { content, t, has, picture } from '@/content';
import { Arch } from './Arch';
import { MapCard } from './MapCard';
import { Calendar, Clock, Envelope, Instagram, Phone, Pin } from './Icons';
import { Em, Lines } from './Rich';
import { Title } from './Title';

type Fact = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: React.ReactNode;
  pending?: boolean;
};

export function Visit() {
  const pic = picture('close');

  const facts: Fact[] = [
    {
      label: t('visit.label.address'),
      icon: Pin,
      value: (
        <a href={content.mapsUrl} target="_blank" rel="noreferrer noopener">
          {t('address.street')}
          <br />
          {t('address.city')}, {t('address.country')}
        </a>
      ),
    },
    {
      label: t('visit.label.hours'),
      icon: Clock,
      /* "18:00–00:00" stays on one line: the dash is joined to its times */
      value: has('contact.hours') ? (
        <Lines text={t('contact.hours').replace(/(\d)\s*[–-]\s*(\d)/g, '$1\u2060–\u2060$2')} />
      ) : (
        t('visit.pending.hours')
      ),
      pending: !has('contact.hours'),
    },
    {
      label: t('visit.label.phone'),
      icon: Phone,
      value: has('contact.phone') ? (
        <a href={content.tel}>{t('contact.phone')}</a>
      ) : (
        t('visit.pending.phone')
      ),
      pending: !has('contact.phone'),
    },
    {
      label: t('visit.label.email'),
      icon: Envelope,
      value: has('contact.email') ? (
        <a href={`mailto:${t('contact.email')}`}>{t('contact.email')}</a>
      ) : (
        t('visit.pending.email')
      ),
      pending: !has('contact.email'),
    },
  ];

  return (
    <section className="section visit" id="visit">
      <div className="shell">
        <Title text={t('visit.title')} className="title visit__title" />

        <div className="visit__grid">
          <div className="facts">
            {/* a fact with nothing to say, not even its fallback line, is left out */}
            {facts.filter((f) => !f.pending || f.value).map(({ label, icon: Icon, value, pending }) => (
              <div className="fact" key={label} data-pending={pending ? 'true' : undefined} data-reveal>
                <Icon className="fact__icon" />
                <div>
                  <p className="fact__label">{label}</p>
                  <p className="fact__value">{value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="visit__act">
            <div className="actions" data-reveal>
              {content.book && (
                <a className="gilt" {...content.book}>
                  <Calendar />
                  {t('nav.book')}
                </a>
              )}
              <a className="ghost" href={content.mapsUrl} target="_blank" rel="noreferrer noopener">
                <Pin />
                {t('visit.mapsLabel')}
              </a>
              <a className="ghost" href={content.instagramUrl} target="_blank" rel="noreferrer noopener">
                <Instagram />
                {t('visit.followLabel')}
              </a>
            </div>

            <MapCard />
          </div>
        </div>

        <div className="visit__close">
          {pic && (
            <div className="visit__closeArch">
              <Arch picture={pic} sizes="(max-width: 860px) 13rem, 20rem" />
            </div>
          )}
          <p className="visit__statement" data-split="lines">
            <Em text={t('visit.statement')} />
          </p>
          <p className="micro" data-reveal>
            {t('brand.cuisine')}
          </p>
        </div>
      </div>
    </section>
  );
}
