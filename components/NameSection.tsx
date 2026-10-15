import { t, has, picture } from '@/content';
import { Arch } from './Arch';
import { Paragraphs } from './Rich';
import { Title } from './Title';

export function NameSection() {
  const pic = picture('story');

  return (
    <section className="section" id="about">
      <div className="shell name">
        {pic && (
          <div className="name__arch">
            <Arch picture={pic} sizes="(max-width: 860px) min(90vw, 22rem), 32vw" />
          </div>
        )}

        <div className="name__body">
          <Title text={t('story.title')} />

          <p className="name__lead" data-split="lines">
            {t('story.lead')}
          </p>

          <Paragraphs className="prose" text={t('story.body')} />

          {(has('story.proverb.gloss') || has('story.proverb.ka')) && (
            <figure className="plaque" data-reveal>
              <div className="plaque__word">
                {has('story.proverb.ka') && <span className="plaque__ka ka">{t('story.proverb.ka')}</span>}
                {has('story.proverb.latin') && <span className="plaque__latin">{t('story.proverb.latin')}</span>}
              </div>
              <p className="plaque__gloss">{t('story.proverb.gloss')}</p>
              {has('story.proverb.note') && (
                <figcaption className="plaque__note">{t('story.proverb.note')}</figcaption>
              )}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}
