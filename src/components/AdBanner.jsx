import React, { useEffect, useState } from 'react';
import { db } from '../services/db';

export default function AdBanner({ placement }) {
  const [ad, setAd] = useState(null);

  useEffect(() => {
    const fetchAd = async () => {
      const allAds = await db.getAds();
      const matched = allAds.find(a => a.placement === placement);
      if (matched) {
        setAd(matched);
        // Record Impression
        db.recordAdImpression(matched.id);
      }
    };
    fetchAd();
  }, [placement]);

  const handleAdClick = () => {
    if (ad) {
      db.recordAdClick(ad.id);
    }
  };

  if (!ad) return null;

  return (
    <div className="w-full flex flex-col items-center justify-center my-6">
      <span className="text-[9px] uppercase tracking-widest text-gray-400 dark:text-neutral-600 font-bold mb-1">
        जाहिरात (Advertisement)
      </span>
      <a
        href={ad.link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleAdClick}
        className="block overflow-hidden rounded-md border border-gray-200 dark:border-neutral-800 shadow-sm hover:opacity-95 transition-opacity"
      >
        <img
          src={ad.imageUrl}
          alt={ad.name}
          className="object-cover max-w-full"
          style={{
            width: placement === 'header_top' ? '728px' : placement === 'sidebar' ? '300px' : '600px',
            height: placement === 'header_top' ? '90px' : placement === 'sidebar' ? '250px' : '150px',
          }}
        />
      </a>
    </div>
  );
}
