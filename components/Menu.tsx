'use client';

import { useId, useRef, useState } from 'react';
import { content, t, price } from '@/content';
import { Braid } from './Icons';
import { Title } from './Title';

/**
 * A tabbed menu built entirely from the client's workbook: a new value in the
 * Category column becomes a new tab, and any dish may leave out its Georgian
 * name, its description or its price without leaving a gap.
 */
export function Menu() {
  const categories = content.menu;
  const [active, setActive] = useState(0);
  const uid = useId().replace(/:/g, '');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  if (!categories.length) return null;
  const current = categories[Math.min(active, categories.length - 1)];

  /* arrow keys move between tabs, as a tablist is expected to */
  function onKeyDown(e: React.KeyboardEvent) {
    const last = categories.length - 1;
    let next = active;
    if (e.key === 'ArrowRight') next = active === last ? 0 : active + 1;
    else if (e.key === 'ArrowLeft') next = active === 0 ? last : active - 1;
    else if (e.key === 'Home') next = 0;
    else if (e.key === 'End') next = last;
    else return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  }

  return (
    <section className="section menu" id="menu">
      <div className="shell">
        <div className="menu__head">
          <Title text={t('menu.title')} />
          <div>
            <p className="lead" data-split="lines">
              {t('menu.lead')}
            </p>
            {content.menuIsDraft && t('menu.draftNote') && (
              <p className="note" data-reveal>
                {t('menu.draftNote')}
              </p>
            )}
          </div>
        </div>

        {categories.length > 1 && (
          <div className="menu__tabs" role="tablist" aria-label={t('a11y.menuTabs')} onKeyDown={onKeyDown}>
            {categories.map((c, i) => (
              <button
                key={c.name}
                ref={(el) => {
                  tabs.current[i] = el;
                }}
                className="tab"
                role="tab"
                type="button"
                id={`${uid}-tab-${i}`}
                aria-selected={i === active}
                aria-controls={`${uid}-panel-${i}`}
                tabIndex={i === active ? 0 : -1}
                onClick={() => setActive(i)}
              >
                {c.ka && (
                  <span className="tab__ka ka" aria-hidden>
                    {c.ka}
                  </span>
                )}
                <span className="tab__name">{c.name}</span>
              </button>
            ))}
          </div>
        )}

        <div
          className="menu__panel"
          role={categories.length > 1 ? 'tabpanel' : undefined}
          id={`${uid}-panel-${active}`}
          aria-labelledby={categories.length > 1 ? `${uid}-tab-${active}` : undefined}
          style={{ ['--menu-cols' as string]: content.menuColumns }}
          key={active}
        >
          {current.items.map((item) => (
            <article
              className={`plate${item.price.includes('/') ? ' plate--split' : ''}`}
              key={`${item.name}-${item.price}`}
            >
              <h3 className="plate__head">
                <span className="plate__name">{item.name}</span>
                {item.price && (
                  <>
                    <span className="plate__rule" aria-hidden />
                    <span className="plate__price">{price(item.price)}</span>
                  </>
                )}
              </h3>
              {item.ka && (
                <p className="plate__ka ka" aria-hidden>
                  {item.ka}
                </p>
              )}
              {item.text && <p className="plate__text">{item.text}</p>}
            </article>
          ))}
        </div>

        <Braid className="braid" />
      </div>
    </section>
  );
}
