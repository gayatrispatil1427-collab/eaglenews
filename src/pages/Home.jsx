import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams, Link } from 'react-router-dom';
import { db } from '../services/db';
import { categoriesList, districtsList } from '../services/mockData';
import { 
  Flame, TrendingUp, Calendar, Clock, Eye, AlertCircle, Play, 
  MapPin, CheckCircle, HelpCircle, ArrowRight, Share2, Award, ChevronLeft, ChevronRight, X,
  Activity, ShieldCheck, Heart, Users, Map, Video, Newspaper, MessageSquare, BookOpen, Quote, Sparkles, Star, DollarSign, CloudSun, Trophy
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import MaharashtraMap from '../components/MaharashtraMap';
import AdBanner from '../components/AdBanner';
import PremiumSidebar from '../components/PremiumSidebar';

export default function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category') || 'all';
  const selectedDistrict = searchParams.get('district') || '';
  const searchQuery = searchParams.get('search') || '';

  // Load articles
  const { data: articles = [], refetch } = useQuery({
    queryKey: ['articles'],
    queryFn: db.getArticles
  });

  // Load stats (for active readers)
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: db.getStats,
    refetchInterval: 10000 // Refresh active online readers
  });

  // Hero Slider Index
  const [heroIndex, setHeroIndex] = useState(0);

  // Load More Simulation
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Play Video Modal
  const [videoModalUrl, setVideoModalUrl] = useState(null);

  // Breaking Alert Toast
  const [showBreakingToast, setShowBreakingToast] = useState(true);

  // Additional Digital Media States
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTimelineYear, setActiveTimelineYear] = useState(2018);
  const [showSuccessStoryModal, setShowSuccessStoryModal] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [marketRates, setMarketRates] = useState({
    gold: 72450,
    sensex: 74210,
    nifty: 22530,
    usd: 83.42
  });

  // Filter logic
  const filteredArticles = articles.filter(art => {
    // Category check
    const matchesCategory = selectedCategory === 'all' || art.category === selectedCategory;
    // District check
    const matchesDistrict = !selectedDistrict || art.district === selectedDistrict;
    // Search check
    const matchesSearch = !searchQuery || 
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
      
    return matchesCategory && matchesDistrict && matchesSearch;
  });

  const breakingArticles = articles.filter(art => art.isBreaking);
  const trendingArticles = articles.filter(art => art.isTrending).slice(0, 4);
  const editorsPicks = articles.filter(art => art.isEditorsPick).slice(0, 3);
  const factChecks = articles.filter(art => art.category === 'factcheck').slice(0, 3);

  // Hero news rotating timer
  const featuredNews = articles.filter(art => art.image && art.category !== 'factcheck').slice(0, 4);

  useEffect(() => {
    if (featuredNews.length === 0) return;
    const interval = setInterval(() => {
      setHeroIndex(prev => (prev + 1) % featuredNews.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [featuredNews.length]);

  // Ticking Clock and Live Updates Effect
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Fluctuating Stock and Gold Prices to mimic real market activity
  useEffect(() => {
    const marketTimer = setInterval(() => {
      setMarketRates(prev => ({
        gold: prev.gold + Math.floor(Math.random() * 30 - 15),
        sensex: prev.sensex + Math.floor(Math.random() * 40 - 20),
        nifty: prev.nifty + Math.floor(Math.random() * 12 - 6),
        usd: parseFloat((prev.usd + (Math.random() * 0.04 - 0.02)).toFixed(2))
      }));
    }, 4000);
    return () => clearInterval(marketTimer);
  }, []);

  const handleNextHero = () => {
    setHeroIndex(prev => (prev + 1) % featuredNews.length);
  };

  const handlePrevHero = () => {
    setHeroIndex(prev => (prev - 1 + featuredNews.length) % featuredNews.length);
  };

  // Load more trigger
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(prev => prev + 4);
      setIsLoadingMore(false);
    }, 1200);
  };

  const handleSelectDistrict = (districtId) => {
    if (districtId) {
      setSearchParams({ district: districtId });
    } else {
      searchParams.delete('district');
      setSearchParams(searchParams);
    }
  };

  const handleSelectCategory = (catId) => {
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      
      {/* Search Result Banner */}
      {searchQuery && (
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex justify-between items-center text-sm">
          <span>
            शोध परिणाम: <strong>"{searchQuery}"</strong> साठी <strong>{filteredArticles.length}</strong> बातम्या सापडल्या.
          </span>
          <button 
            onClick={() => {
              searchParams.delete('search');
              setSearchParams(searchParams);
            }} 
            className="text-primary font-bold hover:underline"
          >
            फिल्टर काढा
          </button>
        </div>
      )}

      {/* District Filter Banner */}
      {selectedDistrict && (
        <div className="bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg p-4 mb-6 flex justify-between items-center text-sm">
          <span>
            जिल्हा: <strong>{districtsList.find(d => d.id === selectedDistrict)?.name}</strong> मधील बातम्या दाखवत आहे.
          </span>
          <button 
            onClick={() => handleSelectDistrict(null)} 
            className="text-primary font-bold hover:underline"
          >
            सर्व जिल्हे दाखवा
          </button>
        </div>
      )}

      {/* Breaking Toast PopUp (Bottom Right) */}
      <AnimatePresence>
        {showBreakingToast && breakingArticles.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full bg-white dark:bg-brandCard-dark border-l-4 border-primary rounded-lg shadow-2xl p-4 flex gap-3 text-left"
          >
            <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5 animate-bounce" />
            <div className="flex-1">
              <span className="text-[10px] text-primary uppercase font-bold tracking-widest block mb-1">ताजी अपडेट (Breaking)</span>
              <Link 
                to={`/article/${breakingArticles[0].id}`} 
                onClick={() => setShowBreakingToast(false)}
                className="font-bold text-xs md:text-sm text-secondary dark:text-white hover:text-primary transition-colors block leading-snug"
              >
                {breakingArticles[0].title}
              </Link>
            </div>
            <button 
              onClick={() => setShowBreakingToast(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xs font-bold"
            >
              बंद करा
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Selection Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-4 mb-6 no-scrollbar">
        {categoriesList.map(cat => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => handleSelectCategory(cat.id)}
              className={`px-4 py-2 rounded-full font-heading font-bold text-xs md:text-sm shrink-0 transition-all duration-300 border ${
                isActive 
                  ? 'bg-primary border-primary text-white shadow-glow' 
                  : 'bg-white dark:bg-brandCard-dark border-gray-200 dark:border-neutral-800 text-secondary dark:text-gray-300 hover:border-primary/50'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Main News Feed & Hero Slider (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-8">
          
          {/* Top Ad banner */}
          <AdBanner placement="header_top" />

          {/* ================= HERO & BROADCAST CENTRE ================= */}
          {selectedCategory === 'all' && !selectedDistrict && !searchQuery && featuredNews.length > 0 && (
            <div className="relative w-full bg-secondary text-white rounded-2xl overflow-hidden shadow-2xl border border-neutral-800 p-4 md:p-6 flex flex-col lg:flex-row gap-6 min-h-[460px]">
              
              <style>{`
                @keyframes flyEagle {
                  0% { transform: translate(-50px, 80px) scale(0.6); opacity: 0; }
                  10% { opacity: 0.7; }
                  95% { opacity: 0.7; }
                  100% { transform: translate(850px, -20px) scale(1.3); opacity: 0; }
                }
              `}</style>

              {/* Drone View Video Background overlay */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl opacity-15">
                <video 
                  autoPlay 
                  loop 
                  muted 
                  playsInline 
                  className="w-full h-full object-cover scale-105"
                  src="https://assets.mixkit.co/videos/preview/mixkit-flying-over-hills-and-green-valleys-42858-large.mp4"
                />
              </div>

              {/* Looping Flying Eagle Silhouette */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
                <div 
                  className="absolute w-12 h-12 text-accent fill-accent opacity-0"
                  style={{
                    animation: 'flyEagle 16s linear infinite',
                    animationDelay: '2s'
                  }}
                >
                  <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-[0_2px_8px_rgba(255,215,0,0.5)]">
                    <path d="M12 2L2 9l4 4 6-2 6 2 4-4L12 2zm0 18l-8-6 2-2 6 3 6-3 2 2-8 6z" />
                  </svg>
                </div>
              </div>
              
              {/* Left Column: Premium Interactive Headline Slider (7/12 width on desktop) */}
              <div className="lg:w-7/12 relative min-h-[300px] bg-neutral-950/80 rounded-xl overflow-hidden border border-neutral-800 flex flex-col justify-between p-5 z-10">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={heroIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col justify-between h-full flex-1"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="bg-primary text-white text-[9px] font-black px-2 py-0.5 rounded tracking-widest uppercase">
                          {featuredNews[heroIndex].categoryMarathi}
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-gray-400 font-bold">
                          <Clock className="w-3.5 h-3.5 text-primary" /> {featuredNews[heroIndex].readTime} मि. वाचन
                        </span>
                      </div>
                      
                      <Link 
                        to={`/article/${featuredNews[heroIndex].id}`}
                        className="font-heading font-black text-lg md:text-xl lg:text-2xl text-white hover:text-accent transition-colors leading-tight block mb-3 text-left"
                      >
                        {featuredNews[heroIndex].title}
                      </Link>
                      
                      <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed mb-4 text-left">
                        {featuredNews[heroIndex].summary}
                      </p>
                    </div>

                    <div className="relative rounded overflow-hidden aspect-[16/9] w-full border border-neutral-800 mt-auto bg-neutral-900 group">
                      <img 
                        src={featuredNews[heroIndex].image} 
                        alt={featuredNews[heroIndex].title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-3 left-3 text-[10px] text-accent font-black flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" /> विशेष बातमी (Featured Cover)
                      </span>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* Slider Controls */}
                <div className="flex justify-between items-center mt-4 pt-3 border-t border-neutral-900">
                  <div className="flex gap-1">
                    {featuredNews.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setHeroIndex(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${idx === heroIndex ? 'w-5 bg-accent' : 'w-1.5 bg-neutral-700'}`}
                      />
                    ))}
                  </div>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={handlePrevHero}
                      className="bg-neutral-900 hover:bg-primary border border-neutral-800 p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={handleNextHero}
                      className="bg-neutral-900 hover:bg-primary border border-neutral-800 p-1.5 rounded-lg text-white transition-colors cursor-pointer"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Unique Widgets & Real-time Info Command Center (5/12 width) */}
              <div className="lg:w-5/12 flex flex-col gap-4 z-10">
                
                {/* 1. Live Weather & Dynamic Clock Bar */}
                <div className="bg-neutral-950/80 rounded-xl p-3 border border-neutral-800 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <CloudSun className="w-7 h-7 text-accent" />
                    <div className="text-left">
                      <span className="text-[10px] text-gray-400 font-bold block">मुंबई हवामान</span>
                      <span className="text-xs text-white font-black">३१°C (पाऊस शक्य)</span>
                    </div>
                  </div>
                  
                  <div className="text-right border-l border-neutral-850 pl-3">
                    <span className="text-[10px] text-primary uppercase font-black tracking-wider flex items-center justify-end gap-1 mb-0.5">
                      <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" /> LIVE CLOCK
                    </span>
                    <span className="text-xs font-mono text-white font-black">
                      {currentTime.toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* 2. Today's Quote Widget (आजचा सुविचार) */}
                <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 text-left flex flex-col gap-2 relative overflow-hidden">
                  <div className="flex items-center gap-1.5 text-accent font-black text-[10px] uppercase tracking-wider mb-0.5">
                    <Sparkles className="w-3.5 h-3.5 text-accent" /> आजचा सुविचार (Thought of Day)
                  </div>
                  <p className="text-[11px] italic text-gray-300 leading-relaxed font-semibold">
                    "ध्येय गाठण्यासाठी प्रयत्नांची पराकाष्ठा करा, कारण मेहनत ही यशाची एकमेव गुरुकिल्ली आहे."
                  </p>
                  <span className="text-[9px] text-right text-gray-500 font-bold block">— ईगल संवाद</span>
                </div>

                {/* 3. Real-Time Rates Widget (Gold & Market Stock Updates) */}
                <div className="bg-neutral-950/80 rounded-xl p-4 border border-neutral-800 text-left flex flex-col gap-2.5">
                  <span className="text-[10px] text-gray-400 font-black uppercase tracking-wider border-b border-neutral-900 pb-1.5 block">
                    💰 थेट बाजार भाव (Market Rates)
                  </span>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-neutral-900 p-2 rounded border border-neutral-850">
                      <span className="text-[9px] text-gray-400 font-bold block mb-0.5">सोन्याचा भाव (१० ग्रॅम)</span>
                      <span className="text-xs text-accent font-black">₹ {marketRates.gold.toLocaleString('en-IN')}</span>
                      <span className="text-[8px] text-green-500 font-bold block mt-0.5">▲ +₹ १८० (आज)</span>
                    </div>

                    <div className="bg-neutral-900 p-2 rounded border border-neutral-850">
                      <span className="text-[9px] text-gray-400 font-bold block mb-0.5">USD ते INR (डॉलर)</span>
                      <span className="text-xs text-white font-black">₹ {marketRates.usd}</span>
                      <span className="text-[8px] text-red-500 font-bold block mt-0.5">▼ -₹ ०.०८ (आज)</span>
                    </div>

                    <div className="bg-neutral-900 p-2 rounded border border-neutral-850">
                      <span className="text-[9px] text-gray-400 font-bold block mb-0.5">BSE SENSEX</span>
                      <span className="text-xs text-green-500 font-black">+{marketRates.sensex.toLocaleString()}</span>
                      <span className="text-[8px] text-green-500 font-bold block mt-0.5">▲ +०.३४%</span>
                    </div>

                    <div className="bg-neutral-900 p-2 rounded border border-neutral-850">
                      <span className="text-[9px] text-gray-400 font-bold block mb-0.5">NSE NIFTY 50</span>
                      <span className="text-xs text-green-500 font-black">+{marketRates.nifty.toLocaleString()}</span>
                      <span className="text-[8px] text-green-500 font-bold block mt-0.5">▲ +०.२९%</span>
                    </div>
                  </div>
                </div>

                {/* 4. Maharashtra Today History & Govt Scheme Snippet */}
                <div className="bg-neutral-950/80 rounded-xl p-3.5 border border-neutral-800 text-left text-[11px] leading-relaxed flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5 font-bold text-primary mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>आजचा इतिहास (Today in History)</span>
                  </div>
                  <p className="text-gray-300">
                    ४ जून १६७४: शिवछत्रपतींच्या राज्याभिषेकाच्या पूर्वतयारीची गड-किल्ल्यांवर लगबग सुरू झाली होती.
                  </p>
                  <div className="border-t border-neutral-900 pt-2 mt-1 flex items-center justify-between text-[10px]">
                    <span className="text-accent font-bold">📜 सरकारी योजना:</span>
                    <a href="#schemes" className="text-primary hover:underline font-bold">शेतकरी सन्मान शासन निर्णय वाचा →</a>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* Grid Section for Articles Feed */}
          <div>
            <h2 className="font-heading font-black text-2xl text-secondary dark:text-white border-b-2 border-primary pb-2 mb-6 flex justify-between items-center">
              <span>{selectedCategory === 'all' ? 'महत्त्वाच्या बातम्या' : categoriesList.find(c => c.id === selectedCategory)?.name}</span>
              {stats && (
                <span className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                  {stats.activeReadersOnline} वाचक सध्या ऑनलाइन
                </span>
              )}
            </h2>

            {filteredArticles.length === 0 ? (
              <div className="bg-white dark:bg-brandCard-dark rounded-xl p-12 text-center border border-gray-100 dark:border-neutral-800">
                <HelpCircle className="w-12 h-12 text-gray-300 dark:text-neutral-700 mx-auto mb-4" />
                <h4 className="font-bold text-lg mb-1 dark:text-white">बातम्या उपलब्ध नाहीत</h4>
                <p className="text-sm text-gray-500">निवडलेल्या श्रेणी किंवा जिल्ह्यात सध्या कोणतीही बातमी उपलब्ध नाही.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredArticles.slice(0, visibleCount).map(art => (
                  <article 
                    key={art.id} 
                    className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-premium dark:shadow-premiumDark hover:shadow-lg transition-all duration-300 flex flex-col group"
                  >
                    {/* Article Image container */}
                    {art.image && (
                      <div className="relative overflow-hidden aspect-[16/10] shrink-0">
                        <img 
                          src={art.image} 
                          alt={art.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <span className="absolute top-3 left-3 bg-secondary text-white font-heading font-black text-xs px-2.5 py-1 rounded">
                          {art.categoryMarathi}
                        </span>
                      </div>
                    )}

                    {/* Content text */}
                    <div className="p-4 flex-1 flex flex-col justify-between text-left">
                      <div>
                        <div className="flex gap-3 text-[10px] text-gray-400 font-semibold mb-2">
                          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {art.readTime} मि.</span>
                          <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views?.toLocaleString('mr-IN')} व्ह्यूज</span>
                        </div>
                        <Link 
                          to={`/article/${art.id}`}
                          className="font-heading font-black text-base md:text-lg leading-snug text-secondary dark:text-white hover:text-primary transition-colors block mb-2"
                        >
                          {art.title}
                        </Link>
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
                          {art.summary}
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-gray-50 dark:border-neutral-800/50 flex justify-between items-center">
                        <span className="text-[10px] font-bold text-gray-500">द्वारा: {art.author.name}</span>
                        <Link to={`/article/${art.id}`} className="text-xs font-bold text-primary flex items-center gap-0.5 hover:translate-x-1 transition-transform">
                          अधिक वाचा <ArrowRight className="w-3 h-3" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* Load More Button */}
            {filteredArticles.length > visibleCount && (
              <div className="mt-8 flex justify-center">
                <button
                  disabled={isLoadingMore}
                  onClick={handleLoadMore}
                  className="bg-white dark:bg-brandCard-dark border border-gray-200 dark:border-neutral-800 text-secondary dark:text-gray-300 font-bold px-8 py-3 rounded-full hover:border-primary text-sm flex items-center gap-2 transition-all duration-300 disabled:opacity-70"
                >
                  {isLoadingMore ? (
                    <>
                      <span className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                      लोड होत आहे...
                    </>
                  ) : (
                    "अधिक बातम्या लोड करा"
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Ad Banner inside the Article list */}
          <AdBanner placement="in_article" />

          {/* Video News Gallery */}
          <div className="bg-secondary text-white p-6 rounded-2xl shadow-xl text-left">
            <h3 className="font-heading font-black text-xl mb-4 text-white border-b border-neutral-800 pb-2 flex items-center gap-2">
              <Play className="w-5 h-5 text-primary fill-primary animate-pulse" /> व्हिडिओ बुलेटीन (Video Reports)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { id: "v1", title: "महाराष्ट्राचे नवे सरकार: चर्चा व समीक्षण", views: "४२K व्ह्यूज", duration: "२:४५", thumb: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=300" },
                { id: "v2", title: "कोल्हापूर सुवर्णकन्या स्नेहा पाटील हिची मुलाखत", views: "८९K व्ह्यूज", duration: "५:१२", thumb: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=300" },
                { id: "v3", title: "उन्हाळ्यात उष्माघातापासून सुरक्षित कसे राहावे?", views: "१२K व्ह्यूज", duration: "३:३०", thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=300" }
              ].map(vid => (
                <div 
                  key={vid.id} 
                  onClick={() => setVideoModalUrl("https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC")}
                  className="bg-neutral-900 border border-neutral-800 rounded-lg overflow-hidden cursor-pointer group"
                >
                  <div className="relative aspect-[16/9]">
                    <img src={vid.thumb} alt={vid.title} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300" />
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/50 transition-colors">
                      <div className="bg-primary p-2.5 rounded-full shadow-glow">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </div>
                    {/* Duration badge */}
                    <span className="absolute bottom-2 right-2 bg-black/75 px-1.5 py-0.5 rounded text-[10px] font-bold">{vid.duration}</span>
                  </div>
                  <div className="p-3">
                    <h5 className="font-heading font-bold text-xs text-white line-clamp-2 leading-snug group-hover:text-primary transition-colors">{vid.title}</h5>
                    <span className="text-[10px] text-gray-400 mt-1 block">{vid.views}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fact Check Section */}
          {factChecks.length > 0 && (
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-6 shadow-premium text-left">
              <h3 className="font-heading font-black text-xl mb-4 text-secondary dark:text-white border-b-2 border-primary pb-2 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" /> फॅक्ट चेक (सत्य पडताळणी)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {factChecks.map(check => (
                  <div key={check.id} className="flex flex-col justify-between h-full bg-gray-50/50 dark:bg-neutral-900/40 p-4 border border-gray-100 dark:border-neutral-800 rounded-lg">
                    <div>
                      <span className="inline-block bg-red-100 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-black text-[9px] px-2 py-0.5 rounded uppercase tracking-wider mb-2.5">
                        {check.factCheck?.verdict || 'तपासणी'}
                      </span>
                      <Link to={`/article/${check.id}`} className="font-heading font-bold text-sm text-secondary dark:text-white hover:text-primary transition-colors block leading-snug mb-2">
                        {check.title}
                      </Link>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-3">
                        {check.summary}
                      </p>
                    </div>
                    <Link to={`/article/${check.id}`} className="text-xs font-bold text-primary mt-4 block hover:underline">
                      सत्य वाचा →
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: Sidebar (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 no-scrollbar">
          
          {/* District Map Selector */}
          <MaharashtraMap selectedDistrict={selectedDistrict} onSelectDistrict={handleSelectDistrict} />

          {/* Premium Right Sidebar */}
          <PremiumSidebar />

          {/* Election Dashboard Widget */}
          <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
            <div className="flex items-center justify-between mb-4 border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              <span className="flex items-center gap-1.5 font-heading font-black text-lg text-secondary dark:text-white">
                <Award className="w-5 h-5 text-accent" /> निवडणूक निकाल ट्रॅकर
              </span>
              <span className="bg-accent/20 text-accent-hover font-bold text-[9px] px-2 py-0.5 rounded uppercase">मॉक (Mock)</span>
            </div>
            <p className="text-xs text-gray-500 mb-4 leading-relaxed">
              महाराष्ट्र विधानसभा निवडणुकीचे काल्पनिक सध्याचे पक्षनिहाय बलाबल (एकूण जागा: २८८):
            </p>
            <div className="flex flex-col gap-3">
              {[
                { party: "भाजपा", seats: 105, pct: "36.4%", color: "bg-orange-500" },
                { party: "राष्ट्रवादी (NCP)", seats: 41, pct: "14.2%", color: "bg-green-600" },
                { party: "शिवसेना (SHS)", seats: 40, pct: "13.8%", color: "bg-yellow-500" },
                { party: "काँग्रेस (INC)", seats: 44, pct: "15.2%", color: "bg-blue-500" },
                { party: "इतर / अपक्ष", seats: 58, pct: "20.1%", color: "bg-neutral-400" }
              ].map((item, index) => (
                <div key={index} className="text-xs">
                  <div className="flex justify-between font-bold mb-1 dark:text-gray-300">
                    <span>{item.party}</span>
                    <span>{item.seats} जागा ({item.pct})</span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2">
                    <div className={`${item.color} h-2 rounded-full`} style={{ width: item.pct }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[9px] text-gray-400 mt-4 text-center leading-relaxed">
              * वरील माहिती काल्पनिक निवडणूक आलेखावर आधारित आहे.
            </div>
          </div>

          {/* Trending Articles Sidebar */}
          <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b-2 border-primary pb-1 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-primary" /> ट्रेंडिंग बातम्या
            </h3>
            <div className="flex flex-col gap-4">
              {trendingArticles.map((art, index) => (
                <div key={art.id} className="flex gap-3 items-start border-b border-gray-50 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                  <span className="font-heading font-black text-2xl text-gray-200 dark:text-neutral-700 shrink-0 leading-none mt-1">
                    {`0${index + 1}`}
                  </span>
                  <div>
                    <Link to={`/article/${art.id}`} className="font-heading font-bold text-xs md:text-sm text-secondary dark:text-white hover:text-primary transition-colors leading-snug block mb-1">
                      {art.title}
                    </Link>
                    <span className="text-[9px] text-gray-400 block">{art.views?.toLocaleString('mr-IN')} वाचक</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Editors Picks Sidebar */}
          <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b-2 border-primary pb-1 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-primary" /> संपादकीय निवड
            </h3>
            <div className="flex flex-col gap-4">
              {editorsPicks.map(art => (
                <div key={art.id} className="flex gap-3 items-start border-b border-gray-50 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                  {art.image && (
                    <img src={art.image} alt={art.title} className="w-12 h-12 rounded object-cover shrink-0" />
                  )}
                  <div>
                    <Link to={`/article/${art.id}`} className="font-heading font-bold text-xs text-secondary dark:text-white hover:text-primary transition-colors leading-snug block mb-1">
                      {art.title}
                    </Link>
                    <span className="text-[9px] text-gray-400 block">{art.readTime} मि. वाचन</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= SECTION: EAGLE NEWS IMPACT (Counters) ================= */}
      <div className="mt-12 bg-gradient-to-r from-red-800 via-primary to-amber-600 text-white rounded-2xl p-8 shadow-2xl relative overflow-hidden text-center">
        <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
        <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-yellow-400/20 blur-2xl" />
        
        <h3 className="font-heading font-black text-2xl md:text-3xl mb-8 relative z-10 text-white drop-shadow">
          🎯 आमचा प्रभाव आणि विश्वासार्हता (Impact & Trust)
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 relative z-10">
          {[
            { value: "५० लाख+", label: "मासिक वाचक (Monthly Readers)", desc: "डिजिटल व सोशल प्लॅटफॉर्म्स" },
            { value: "४५,०००+", label: "बातम्या प्रकाशित (Published News)", desc: "२०१८ पासून आजवर" },
            { value: "१००+", label: "सामाजिक उपक्रम (Social Works)", desc: "मदत आणि सामाजिक जनजागृती" },
            { value: "५००+", label: "पत्रकार नेटवर्क (Journalist Network)", desc: "महाराष्ट्र कानाकोपऱ्यात" }
          ].map((stat, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white/10 backdrop-blur-md rounded-xl p-4 md:p-6 border border-white/20 hover:scale-105 transition-transform duration-300">
              <span className="font-heading font-black text-2xl md:text-4xl text-accent mb-2 drop-shadow-sm">{stat.value}</span>
              <span className="text-xs md:text-sm font-black text-white">{stat.label}</span>
              <span className="text-[10px] text-gray-200 mt-1">{stat.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION: VIDEO WALL & SHORTS ================= */}
      <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Video Wall (8 cols) */}
        <div className="lg:col-span-8 bg-secondary text-white p-6 rounded-2xl border border-neutral-800 text-left shadow-xl">
          <h3 className="font-heading font-black text-xl mb-4 text-white border-b border-neutral-800 pb-2.5 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <span className="relative flex h-3.5 w-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-red-600"></span>
              </span>
              थेट प्रक्षेपण भिंत (Live Video Wall Grid)
            </span>
            <span className="text-[9px] bg-red-600/30 text-primary border border-red-500/30 px-2 py-0.5 rounded font-black tracking-wider animate-pulse">
              LIVE BROADCAST
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Main Primary Screen */}
            <div className="relative aspect-[16/10] bg-neutral-900 rounded-lg overflow-hidden border border-neutral-800 group">
              <iframe 
                src="https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC&mute=1&autoplay=1"
                title="Live News Channel Feed 1" 
                className="w-full h-full object-cover opacity-90"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute top-2 left-2 bg-red-600 text-white font-black text-[8px] px-2 py-0.5 rounded flex items-center gap-1 shadow-md">
                <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" /> मुख्य वाहिनी (Live 1)
              </div>
            </div>

            {/* Split Grid Views */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { title: "विधानसभा चर्चा (Live 2)", stream: "https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC&mute=1" },
                { title: "ग्रामीण वार्ता (Live 3)", stream: "https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC&mute=1" },
                { title: "हवामान बातमी (Live 4)", stream: "https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC&mute=1" },
                { title: "क्रीडा मंच (Live 5)", stream: "https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC&mute=1" }
              ].map((live, idx) => (
                <div key={idx} className="relative aspect-[16/10] bg-neutral-900 rounded overflow-hidden border border-neutral-800 group cursor-pointer" onClick={() => setVideoModalUrl(live.stream)}>
                  <img 
                    src={`https://images.unsplash.com/${idx === 0 ? 'photo-1540910419892-4a36d2c3266c' : idx === 1 ? 'photo-1476480862126-209bfaa8edc8' : idx === 2 ? 'photo-1506126613408-eca07ce68773' : 'photo-1524758631624-e2822e304c36'}?auto=format&fit=crop&q=80&w=200`} 
                    alt={live.title}
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/50 transition-colors">
                    <Play className="w-5 h-5 text-white/80 group-hover:text-primary transition-colors fill-white/10" />
                  </div>
                  <div className="absolute bottom-1 left-1 bg-black/60 text-white text-[7px] font-bold px-1 py-0.5 rounded leading-none truncate max-w-[90%]">
                    {live.title}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reels / Shorts Wall (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 p-5 rounded-2xl shadow-premium text-left">
          <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b-2 border-primary pb-2 flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-primary animate-bounce" /> ईगल शॉर्ट्स (Reels / Shorts)
          </h3>
          <div className="flex lg:flex-col gap-4 overflow-x-auto no-scrollbar pb-2 lg:pb-0">
            {[
              { id: "s1", title: "महाराष्ट्रात मान्सूनचे वेळेत आगमन, शेतकऱ्यांमध्ये उत्साह!", views: "१.२M व्ह्यूज", thumb: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=200" },
              { id: "s2", title: "रावसाहेब सावंतांचे विशेष संपादकीय मत - थेट विश्लेषण", views: "४००K व्ह्यूज", thumb: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" }
            ].map(short => (
              <div 
                key={short.id} 
                onClick={() => setVideoModalUrl("https://www.youtube.com/embed/live_stream?channel=UC_aEa8K-EOJ3D6g57uxUnHC")}
                className="min-w-[140px] md:min-w-[180px] lg:w-full bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden cursor-pointer group flex flex-col lg:flex-row gap-3 p-1.5 shrink-0"
              >
                <div className="relative aspect-[9/16] w-24 rounded-lg overflow-hidden shrink-0 mx-auto lg:mx-0">
                  <img src={short.thumb} alt={short.title} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-300" />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/40">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="flex flex-col justify-between py-1 text-left flex-1">
                  <h5 className="font-heading font-black text-xs text-white line-clamp-3 leading-snug group-hover:text-primary transition-colors">{short.title}</h5>
                  <span className="text-[9px] text-gray-400 mt-2 block font-bold">{short.views}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================= SECTION: OWNER SUCCESS EDITORIAL ================= */}
      <div className="mt-12 bg-amber-50/40 dark:bg-neutral-900/20 border-y-2 border-amber-600/30 py-10 px-6 md:px-12 text-left relative overflow-hidden rounded-2xl">
        <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-amber-200/20 blur-xl" />
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          <div className="lg:col-span-4 flex flex-col items-center">
            <div className="relative border-4 border-amber-600/20 p-2.5 bg-white dark:bg-neutral-950 rounded shadow-2xl max-w-sm w-full">
              <img 
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=400" 
                alt="डॉ. रावसाहेब सावंत" 
                className="w-full object-cover filter grayscale hover:grayscale-0 transition-all duration-700 aspect-[4/5] border border-neutral-200"
              />
              <div className="text-center font-heading font-black text-sm text-secondary dark:text-white mt-3 uppercase tracking-wider">
                डॉ. रावसाहेब सावंत
              </div>
              <div className="text-[10px] text-amber-600 font-bold text-center mt-1">
                संस्थापक, ईगल न्यूज नेटवर्क
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-4 text-justify font-serif text-secondary dark:text-gray-300">
            <span className="bg-amber-600/10 text-amber-800 dark:text-amber-400 text-[10px] font-black tracking-widest px-3 py-1 rounded w-fit uppercase">
              विशेष संपादकीय स्तंभ (Editorial Column)
            </span>
            <h3 className="font-heading font-black text-2xl md:text-3xl text-secondary dark:text-white leading-tight font-sans">
              "पत्रकारिता केवळ व्यवसाय नसून, समाजसेवेचे मोठे व्रत आहे..."
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs md:text-sm leading-relaxed text-gray-600 dark:text-gray-400">
              <p>
                ग्रामीण महाराष्ट्राला सशक्त बनवण्यासाठी आणि येथील शेवटच्या माणसाचा आवाज देशासमोर मांडण्यासाठी डॉ. रावसाहेब सावंतांनी २०१८ मध्ये <strong>ईगल न्यूज</strong> ची स्थापना केली. त्यांच्या नेतृत्वाखाली आज संपूर्ण राज्यात ३६ जिल्ह्यांमध्ये एक निष्पक्ष माध्यम क्रांती घडून आली आहे.
              </p>
              <p>
                प्रेस कौन्सिल ऑफ इंडियाचे माजी सदस्य राहिलेल्या सावंतांनी पत्रकारितेमध्ये विश्वासार्हता आणि निडरता टिकवून ठेवण्याचे मोठे ध्येय समोर ठेवले. त्यांच्या याच कार्याची दखल घेऊन त्यांना आजवर अनेक राज्यस्तरीय व राष्ट्रीय पुरस्कारांनी सन्मानित करण्यात आले आहे.
              </p>
            </div>

            <div className="flex gap-3 mt-4 justify-start">
              <button 
                onClick={() => setShowSuccessStoryModal(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold py-2 px-6 rounded-lg text-xs transition duration-200 hover:shadow-glow cursor-pointer"
              >
                संपूर्ण प्रवास कहाणी वाचा
              </button>
              <a 
                href="https://wa.me/919876543210" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white font-sans font-bold py-2 px-6 rounded-lg text-xs flex items-center gap-1.5 transition duration-200 shadow cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" /> WhatsApp चर्चा
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* ================= SECTION: AWARDS GALLERY ================= */}
      <div className="mt-12 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 shadow-premium text-left">
        <h3 className="font-heading font-black text-xl mb-6 text-secondary dark:text-white border-b-2 border-primary pb-2 flex items-center gap-2">
          <Award className="w-5 h-5 text-accent animate-pulse" /> संस्थेला मिळालेले सन्मान व पुरस्कार (Awards & Glories)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { title: "महाराष्ट्र गौरव सुवर्ण पुरस्कार", year: "२०२४", body: "माध्यम क्षेत्रातील उत्कृष्ट व निडर सामाजिक कार्याबद्दल महाराष्ट्र शासनातर्फे गौरव चिन्ह प्रदान." },
            { title: "डिजिटल न्यूज मीडिया लीडर", year: "२०२३", body: "५० लाख+ मासिक वाचकांचा विश्वास संपादन करून डिजिटल विश्वातील सर्वाधिक वेगवान आणि दर्जेदार माध्यम पुरस्कार." },
            { title: "निर्भीड पत्रकारिता राष्ट्रीय सन्मान", year: "२०२२", body: "भ्रष्टाचाराचा पर्दाफाश करणाऱ्या विशेष तपासी वृत्तांकनासाठी मिळालेला मानाचा सुवर्ण पुरस्कार." }
          ].map((aw, idx) => (
            <div key={idx} className="relative bg-gradient-to-br from-neutral-50 to-amber-50/20 dark:from-neutral-900/50 dark:to-neutral-900/10 p-5 rounded-xl border border-gray-200/60 dark:border-neutral-850 flex flex-col justify-between hover:scale-[1.03] transition-all duration-300 shadow-sm group">
              <div className="absolute top-3 right-3 text-accent text-lg">
                <Trophy className="w-6 h-6 text-accent/80 group-hover:scale-110 transition-transform" />
              </div>
              
              <div>
                <span className="bg-amber-600/10 text-amber-800 dark:text-amber-400 text-[9px] font-black px-2 py-0.5 rounded mb-3 inline-block">
                  वर्ष {aw.year}
                </span>
                <h4 className="font-heading font-black text-sm md:text-base text-secondary dark:text-white mb-2 leading-tight">
                  {aw.title}
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed text-justify">
                  {aw.body}
                </p>
              </div>
              
              <div className="border-t border-gray-100 dark:border-neutral-800/80 pt-3 mt-4 flex items-center justify-between text-[10px] text-gray-400">
                <span className="font-bold">प्रमाणित सन्मानपत्र</span>
                <span className="text-amber-600 font-bold group-hover:underline">प्रमाणपत्र पहा →</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION: PUBLIC FEEDBACK & RATINGS ================= */}
      <div className="mt-12 bg-neutral-50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-800 rounded-2xl p-6 md:p-8 text-left shadow-sm">
        
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-8 border-b border-gray-100 dark:border-neutral-800 pb-4">
          <div>
            <h3 className="font-heading font-black text-xl text-secondary dark:text-white mb-1">
              💬 आमच्या वाचकांच्या प्रतिक्रिया (Reader Reviews)
            </h3>
            <p className="text-xs text-gray-500">महाराष्ट्राच्या कानाकोपऱ्यातील वाचकांनी व्यक्त केलेले प्रामाणिक अभिप्राय.</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-850 px-4 py-2 rounded-xl shadow-sm">
            <span className="font-heading font-black text-xl text-accent">४.९</span>
            <div className="flex text-amber-500">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />)}
            </div>
            <span className="text-[10px] text-gray-400 font-bold font-sans">(२४,८००+ मते)</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: "राजेश देशपांडे", role: "शिक्षक, लातूर", rating: 5, comment: "ईगल न्यूजवरील बातम्या नेहमी विश्वासार्ह असतात. पिवळ्या पत्रकारितेला फाटा देऊन केवळ तथ्य मांडणारी ही महाराष्ट्रातील एकमेव अग्रगण्य वेबसाईट आहे." },
            { name: "सुनिता गायकवाड", role: "सामाजिक कार्यकर्त्या, नाशिक", rating: 5, comment: "संस्थापक डॉ. रावसाहेब सावंत यांच्या सामाजिक कार्याने मी भारावून गेले. त्यांनी ग्रामीण भागातील मुलांसाठी शाळा सुरू करून पत्रकारितेचे उद्दिष्ट खऱ्या अर्थाने सिद्ध केले." },
            { name: "डॉ. अमोल शहाणे", role: "लेखक, पुणे", rating: 4, comment: "यांचा लेआउट, मराठी फॉन्ट आणि सर्वात महत्त्वाचे म्हणजे जाहिरातींचा मर्यादित वापर मला खूप आवडतो. मोबाईलवर लोड होण्याचा वेग खूप छान आहे." }
          ].map((feed, idx) => (
            <div key={idx} className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium flex flex-col justify-between text-justify relative">
              <Quote className="w-8 h-8 text-primary/5 absolute -top-1.5 -left-1" />
              <div>
                <div className="flex text-amber-500 mb-3">
                  {[...Array(feed.rating)].map((_, i) => <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />)}
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed font-medium">
                  "{feed.comment}"
                </p>
              </div>
              <div className="border-t border-gray-50 dark:border-neutral-800/80 pt-3 mt-4">
                <h5 className="font-bold text-xs text-secondary dark:text-white">{feed.name}</h5>
                <span className="text-[9px] text-gray-400">{feed.role}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ================= SECTION: INTERACTIVE TIMELINE ================= */}
      <div className="mt-12 bg-white dark:bg-brandCard-dark border border-gray-105 dark:border-neutral-800 rounded-2xl p-6 md:p-8 text-left shadow-premium">
        
        <h3 className="font-heading font-black text-xl mb-6 text-secondary dark:text-white border-b-2 border-primary pb-2.5 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" /> आमची वाटचाल (Eagle News Milestones Timeline)
        </h3>

        {/* Horizontal Timeline Line */}
        <div className="relative flex justify-between items-center w-full mb-8 pt-4 overflow-x-auto no-scrollbar">
          <div className="absolute top-1/2 left-0 w-full h-[3px] bg-gray-200 dark:bg-neutral-800 -translate-y-1/2" />
          
          {[
            { year: 2018, title: "स्थापना" },
            { year: 2019, title: "पहिले सुवर्ण पदक" },
            { year: 2020, title: "जिल्हास्तरीय विस्तार" },
            { year: 2021, title: "राज्यस्तरीय विस्तार" },
            { year: 2022, title: "डिजिटल क्रांती" },
            { year: 2023, title: "वाचक संख्या ५० लाख" },
            { year: 2024, title: "३६ जिल्हे कव्हरेज" }
          ].map(milestone => (
            <button
              key={milestone.year}
              onClick={() => setActiveTimelineYear(milestone.year)}
              className="relative z-10 flex flex-col items-center cursor-pointer shrink-0 px-3"
            >
              <div 
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all duration-300 ${
                  activeTimelineYear === milestone.year
                    ? 'bg-primary text-white scale-125 border-4 border-white shadow-glow'
                    : 'bg-white dark:bg-neutral-900 text-gray-500 border-2 border-gray-300 dark:border-neutral-700 hover:border-primary/50'
                }`}
              >
                {milestone.year}
              </div>
              <span className={`text-[10px] font-bold mt-2 transition-colors ${
                activeTimelineYear === milestone.year ? 'text-primary font-black' : 'text-gray-400'
              }`}>
                {milestone.title}
              </span>
            </button>
          ))}
        </div>

        {/* Selected Year Detail Panel */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTimelineYear}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-neutral-50 dark:bg-neutral-900/60 p-5 rounded-xl border border-gray-200/50 dark:border-neutral-800/80"
          >
            {[
              { 
                year: 2018, 
                title: "२०१८ - गुढीपाडव्याच्या शुभमुहूर्तावर ईगल न्यूजची स्थापना", 
                body: "ग्रामीण भागातील मुख्य बातम्या मुख्य प्रवाहात आणण्याच्या उद्देशाने पुणे शहरात एका लहान कार्यालयातून केवळ ४ लोकांच्या पथकासह ईगल न्यूजची स्थापना झाली. 'निष्पक्ष व निर्भीड मराठी डिजिटल मीडिया' ही भावना मनी धरून सुरुवात करण्यात आली." 
              },
              { 
                year: 2019, 
                title: "२०१९ - उत्कृष्ट पत्रकारितेचा पहिला राज्यस्तरीय पुरस्कार", 
                body: "शेतकऱ्यांच्या गंभीर प्रश्नांवर तयार केलेल्या एका विशेष शोध मोहिमेबद्दल (Investigative Report) महाराष्ट्र पत्रकार परिषदेकडून उत्कृष्ट नवोदित डिजिटल माध्यम म्हणून पहिला पुरस्कार मिळाला." 
              },
              { 
                year: 2020, 
                title: "२०२० - कोव्हिड संकट काळात जिल्हास्तरीय वार्ताहर नियुक्ती", 
                body: "कोव्हिड महामारीच्या कठीण प्रसंगात अचूक व खात्रीशीर माहिती पुरवण्यासाठी संपूर्ण पश्चिम महाराष्ट्रातील ७ प्रमुख जिल्ह्यांत वार्ताहर नेमण्यात आले. लाखो वाचकांनी सत्य माहितीसाठी आमच्यावर विश्वास दर्शवला." 
              },
              { 
                year: 2021, 
                title: "२०२१ - विदर्भ व मराठवाड्यात विशेष कार्यालय व विस्तार", 
                body: "डिजिटल माध्यमांचा वाढता प्रभाव ओळखून आम्ही विदर्भ (नागपूर) आणि मराठवाडा (छत्रपती संभाजीनगर) येथे विभागीय ब्यूरो सुरू केले. यामुळे स्थानिक बातम्या अधिक जलद गतीने पोहोचू लागल्या." 
              },
              { 
                year: 2022, 
                title: "२०२२ - अत्याधुनिक मोबाईल ॲप आणि व्हिडिओ बुलेटिन", 
                body: "मोबाईल युजर्सच्या सुलभतेसाठी आम्ही आमचे अधिकृत ईगल न्यूज ॲप लाँच केले. तसेच दररोज संध्याकाळी ७ वाजता लाइव्ह व्हिडिओ बुलेटिन व फॅक्ट चेक (सत्य पडताळणी) विभाग सुरू केला." 
              },
              { 
                year: 2023, 
                title: "२०२३ - मासिक वाचक संख्या ५० लाखांच्या पार", 
                body: "वाचकांच्या अथांग प्रेमामुळे ईगल न्यूज हे महाराष्ट्रातील सर्वात जलद वाढणारे मराठी न्यूज पोर्टल बनले. याच वर्षात आम्ही आमचे सामाजिक मदत कार्य अभियान देखील सुरू केले." 
              },
              { 
                year: 2024, 
                title: "२०२४ - संपूर्ण ३६ जिल्ह्यांमध्ये न्यूज नेटवर्क विस्तार", 
                body: "आज ईगल न्यूज नेटवर्क महाराष्ट्रातील सर्व ३६ जिल्ह्यांत पसरले असून ५०० हून अधिक पत्रकारांचे जाळे कार्यरत आहे. निर्भीड, निष्पक्ष आणि वेगवान बातम्या हीच आमची ओळख कायम आहे." 
              }
            ].filter(mil => mil.year === activeTimelineYear).map(item => (
              <div key={item.year} className="flex flex-col gap-2">
                <h4 className="font-heading font-black text-base md:text-lg text-primary text-left">
                  {item.title}
                </h4>
                <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400 leading-relaxed text-justify">
                  {item.body}
                </p>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Success Story Details Modal */}
      {showSuccessStoryModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-2xl w-full bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-2xl border border-gray-200 dark:border-neutral-800 flex flex-col text-left">
            <button 
              onClick={() => setShowSuccessStoryModal(false)} 
              className="absolute top-4 right-4 bg-primary text-white font-bold p-1.5 rounded-full hover:bg-primary-hover shadow-lg z-50 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="p-6 overflow-y-auto max-h-[85vh] flex flex-col gap-4 font-serif text-secondary dark:text-gray-300">
              <h3 className="font-heading font-black text-xl text-primary font-sans">
                संस्थापक यशोगाथा: मा. डॉ. रावसाहेब सावंत
              </h3>
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-primary mx-auto mb-2 shrink-0 shadow">
                <img 
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200" 
                  alt="डॉ. रावसाहेब सावंत" 
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-xs md:text-sm leading-relaxed text-justify">
                <strong>प्रारंभिक जीवन:</strong> डॉ. रावसाहेब सावंत यांचा जन्म पुणे जिल्ह्यातील एका दुर्गम ग्रामीण शेतकरी कुटुंबात झाला. अत्यंत बिकट आर्थिक परिस्थितीतही त्यांनी शिक्षण सोडले नाही. वृत्तपत्रे वाटण्याचे काम करत त्यांनी शालेय शिक्षण पूर्ण केले आणि पुढे जाऊन पुणे विद्यापीठातून मराठी पत्रकारितेची सुवर्णपदकासह पदवी मिळवली.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-justify">
                <strong>पत्रकारिता प्रवास:</strong> मुख्य प्रवाहातील दैनिकांमध्ये उपसंपादक म्हणून कारकिर्दीची सुरुवात केली. ग्रामीण भागातील दुष्काळ, शेतकरी आत्महत्या आणि पाणी टंचाईवर त्यांनी केलेले विशेष वृत्तांकन राज्य पातळीवर गाजले. त्यानंतर प्रेस कौन्सिल ऑफ इंडियाचे सदस्य म्हणून त्यांची नियुक्ती करण्यात आली, जिथे त्यांनी माध्यम क्षेत्रातील नैतिकतेसाठी लढा दिला.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-justify">
                <strong>ईगल न्यूजची स्थापना:</strong> २०१८ मध्ये ग्रामीण महाराष्ट्राचा स्वतंत्र, कोणाच्याही दबावाखाली न येणारा आवाज म्हणून 'ईगल न्यूज' ची सुरुवात केली. त्यांचे ब्रीद 'सत्य, निष्पक्ष आणि अंतिम टप्प्यातील नागरिकाचा आवाज' हेच राहिले.
              </p>
              <p className="text-xs md:text-sm leading-relaxed text-justify">
                <strong>सामाजिक कार्य:</strong> दरवर्षी सावंतांच्या वतीने ग्रामीण शाळांमधील गरीब विद्यार्थ्यांना ३ लाखांहून अधिक रुपयांची पुस्तके आणि साहित्य वितरित केले जाते. कोल्हापूर आणि सांगलीत आलेल्या पूरपरिस्थितीमध्ये त्यांनी ईगल न्यूज मदत निधीच्या माध्यमातून ५० हून अधिक कुटुंबांना नव्याने संसार उभा करून दिला.
              </p>
              <button 
                onClick={() => setShowSuccessStoryModal(false)}
                className="bg-primary hover:bg-primary-hover text-white font-sans font-bold py-2.5 rounded-lg text-xs mt-4 w-full text-center transition cursor-pointer"
              >
                खिडकी बंद करा (Close)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Video Modal Popup */}
      {videoModalUrl && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl w-full aspect-[16/9] bg-black rounded-lg overflow-hidden shadow-2xl">
            <button 
              onClick={() => setVideoModalUrl(null)} 
              className="absolute top-4 right-4 bg-primary text-white font-bold p-2 rounded-full hover:bg-primary-hover shadow-lg z-50"
            >
              <X className="w-5 h-5" />
            </button>
            <iframe 
              src={videoModalUrl} 
              title="Video Player" 
              className="w-full h-full"
              allowFullScreen
            />
          </div>
        </div>
      )}

    </div>
  );
}
