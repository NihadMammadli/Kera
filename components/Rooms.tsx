import { content, t, has } from '@/content';
import { Arch } from './Arch';
import { Title } from './Title';

/**
 * The spaces, one arch each. A space the client has not given a photograph is
 * left out rather than drawn — the drawings belonged to the building site.
 * Three across on a computer; on a phone they sit in a row you swipe.
 */
export function Rooms() {
  const rooms = content.rooms;
  if (!rooms.length) return null;

  return (
    <section className="section spaces" id="spaces">
      <div className="shell">
        <div className="spaces__head">
          <Title text={t('rooms.title')} />
          <div>
            <p className="lead" data-split="lines" style={{ maxWidth: '38ch' }}>
              {t('rooms.lead')}
            </p>
            {has('rooms.note') && (
              <p className="note" data-reveal style={{ marginTop: '1.5rem' }}>
                {t('rooms.note')}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="spaces__viewport">
        <ul className="spaces__track">
          {rooms.map((room) => (
            <li className="space" key={room.name} data-reveal>
              <div className="space__arch">
                <Arch picture={{ file: room.image, alt: room.imageAlt }} sizes="(max-width: 900px) min(74vw, 20rem), 28vw" />
              </div>
              {room.meta && <p className="space__meta">{room.meta}</p>}
              <h3 className="space__name">{room.name}</h3>
              <p className="space__text">{room.text}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
