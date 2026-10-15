import { content, t, has, picture, type Dish } from '@/content';
import { Arch } from './Arch';
import { dishIcons, Flame } from './Icons';
import { Title } from './Title';

function Strand({ title, items, align }: { title: string; items: Dish[]; align: boolean }) {
  if (!items.length) return null;
  return (
    <div className="strand">
      {title ? (
        <h3 className="strand__title" data-reveal>
          {title}
        </h3>
      ) : (
        /* one heading over both lists: this side keeps its line so the dishes
           still start level with the other side's */
        align && (
          <div className="strand__title strand__spacer" aria-hidden>
            {'\u00a0'}
          </div>
        )
      )}
      {items.map((d) => {
        const Icon = dishIcons[d.icon as keyof typeof dishIcons] ?? Flame;
        return (
          <article className="dish" key={`${d.latin}-${d.text.slice(0, 12)}`} data-reveal>
            <Icon className="dish__icon" />
            <div>
              <h4 className="dish__name">
                {d.ka && <span className="dish__ka ka">{d.ka}</span>}
                <span className="dish__latin">{d.latin}</span>
              </h4>
              <p className="dish__text">{d.text}</p>
            </div>
          </article>
        );
      })}
    </div>
  );
}

export function Kitchen() {
  const pic = picture('kitchen');
  const titled = has('kitchen.fireTitle') || has('kitchen.tableTitle');

  return (
    <section className="section" id="cuisine">
      <div className="shell">
        <div className="kitchen__head">
          <Title text={t('kitchen.title')} />
          <div>
            <p className="lead" data-split="lines" style={{ maxWidth: '34ch', marginBottom: '1.5rem' }}>
              {t('kitchen.lead')}
            </p>
            {has('kitchen.note') && (
              <p className="note" data-reveal>
                {t('kitchen.note')}
              </p>
            )}
          </div>
        </div>

        <div className="kitchen__grid">
          <Strand title={t('kitchen.fireTitle')} items={content.kitchen.fire} align={titled} />

          {pic && (
            <div className="kitchen__arch">
              <Arch picture={pic} sizes="(max-width: 1040px) min(90vw, 20rem), 24vw" />
            </div>
          )}

          <Strand title={t('kitchen.tableTitle')} items={content.kitchen.table} align={titled} />
        </div>
      </div>
    </section>
  );
}
