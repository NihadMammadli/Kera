import { content, t, has } from '@/content';
import { Braid, Instagram } from './Icons';
import { Title } from './Title';

export function Work() {
  const stages = content.progress;
  const nowIndex = stages.findIndex((s) => s.status === 'now');
  /* the gold line stops exactly where the work has actually got to */
  const fill = stages.length ? `${((Math.max(nowIndex, 0) + 0.5) / stages.length) * 100}%` : '0%';

  return (
    <section className="section" id="work">
      <div className="shell">
        <div className="work__head">
          <Title text={t('work.title')} />
          <p className="lead" data-split="lines" style={{ maxWidth: '38ch' }}>
            {t('work.lead')}
          </p>
        </div>

        {/* the stage count goes in as a variable, not grid-template-columns: an
            inline track list would beat the stylesheet and keep phones on one
            squeezed row */}
        {stages.length > 0 && (
          <ol className="ladder" data-ladder style={{ ['--stages' as string]: stages.length }}>
            <div className="ladder__line" aria-hidden>
              <span data-ladder-fill style={{ ['--fill' as string]: nowIndex >= 0 ? fill : '0%' }} />
            </div>
            {stages.map((s) => (
              <li className="stage" key={s.name} data-state={s.status} data-reveal>
                <span className="stage__dot" aria-hidden />
                <h3 className="stage__name">{s.name}</h3>
                <p className="stage__state">{s.label}</p>
                <p className="stage__text">{s.text}</p>
              </li>
            ))}
          </ol>
        )}

        <Braid className="braid" />

        <div className="work__close" data-reveal>
          {has('work.close') && <p>{t('work.close')}</p>}
          <a className="gilt" href={content.instagramUrl} target="_blank" rel="noreferrer noopener">
            <Instagram />
            {t('work.ctaLabel')}
          </a>
        </div>
      </div>
    </section>
  );
}
