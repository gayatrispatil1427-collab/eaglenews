import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Flame } from 'lucide-react';

export default function BreakingNewsTicker() {
  const [tickerItems, setTickerItems] = useState([]);

  useEffect(() => {
    const fetchTicker = async () => {
      const live = await db.getLiveTv();
      if (live && live.latestUpdates) {
        setTickerItems(live.latestUpdates);
      }
    };
    fetchTicker();
    
    // Refresh ticker items from database occasionally
    const interval = setInterval(fetchTicker, 10000);
    return () => clearInterval(interval);
  }, []);

  if (tickerItems.length === 0) return null;

  // Duplicate items to ensure smooth continuous marquee effect
  const displayItems = [...tickerItems, ...tickerItems];

  return (
    <div className="bg-secondary text-white border-b border-neutral-800 text-sm overflow-hidden flex items-center relative z-40 h-10">
      {/* Live Badge */}
      <div className="bg-primary px-4 h-full flex items-center gap-1.5 font-bold uppercase text-xs tracking-wider z-10 shadow-[4px_0_15px_rgba(0,0,0,0.5)] relative shrink-0">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
        </span>
        <Flame className="w-3.5 h-3.5 text-accent" />
        <span>ब्रेकिंग न्यूज</span>
      </div>

      {/* Marquee Content */}
      <div className="marquee-container w-full h-full flex items-center">
        <div className="marquee-content flex gap-12 select-none">
          {displayItems.map((item, index) => (
            <span key={index} className="flex items-center gap-2 font-medium hover:text-accent transition-colors duration-200 cursor-pointer text-xs md:text-sm">
              <span className="text-primary font-bold">•</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
