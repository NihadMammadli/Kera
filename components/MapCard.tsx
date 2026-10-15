'use client';

import { useState } from 'react';
import { t, has } from '@/content';
import { Pin } from './Icons';

/**
 * Where to find the door. Google Maps sets its own cookies, which in Belgium
 * wants a visitor's say-so, so the map only loads when they ask for it — until
 * then this is the address in a niche with a button.
 */
export function MapCard() {
  const [shown, setShown] = useState(false);
  const address = [t('address.street'), t('address.city'), t('address.country')].filter(Boolean).join(', ');
  const src = `https://www.google.com/maps?q=${encodeURIComponent(`${t('brand.name')}, ${address}`)}&output=embed`;

  return (
    <div className="mapcard" data-reveal>
      {shown ? (
        <iframe
          className="mapcard__frame"
          src={src}
          title={`${t('visit.label.address')}: ${address}`}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="mapcard__cover">
          <Pin className="mapcard__pin" />
          <p className="mapcard__address">
            {t('address.street')}
            <br />
            {t('address.city')}, {t('address.country')}
          </p>
          <button className="ghost" type="button" onClick={() => setShown(true)}>
            {t('visit.mapButton')}
          </button>
          {has('visit.mapNote') && <p className="mapcard__note">{t('visit.mapNote')}</p>}
        </div>
      )}
    </div>
  );
}
