import { initialArticles, liveStreamData, podcasts } from './mockData';

// Initialize localStorage with initial data if not present
const INIT_KEY_ARTICLES = 'eagle_news_articles';
const INIT_KEY_LIVE = 'eagle_news_live';
const INIT_KEY_PODCASTS = 'eagle_news_podcasts';
const INIT_KEY_LOGS = 'eagle_news_logs';
const INIT_KEY_ADS = 'eagle_news_ads';

if (!localStorage.getItem(INIT_KEY_ARTICLES)) {
  localStorage.setItem(INIT_KEY_ARTICLES, JSON.stringify(initialArticles));
}
if (!localStorage.getItem(INIT_KEY_LIVE)) {
  localStorage.setItem(INIT_KEY_LIVE, JSON.stringify(liveStreamData));
}
if (!localStorage.getItem(INIT_KEY_PODCASTS)) {
  localStorage.setItem(INIT_KEY_PODCASTS, JSON.stringify(podcasts));
}
if (!localStorage.getItem(INIT_KEY_LOGS)) {
  const initialLogs = [
    { id: "log-1", user: "प्रमोद पाटील (संपादक)", action: "नवीन लेख जोडला: 'महाराष्ट्रात राजकीय घडामोडींना वेग'", timestamp: new Date(Date.now() - 3600000).toISOString() },
    { id: "log-2", user: "विकास काळे (उपसंपादक)", action: "लेख अपडेट केला: 'पुण्यात मोठी अंमली पदार्थ विरोधी कारवाई'", timestamp: new Date(Date.now() - 7200000).toISOString() },
    { id: "log-3", user: "सिस्टम", action: "सुरक्षा तपासणी यशस्वी", timestamp: new Date(Date.now() - 86400000).toISOString() }
  ];
  localStorage.setItem(INIT_KEY_LOGS, JSON.stringify(initialLogs));
}
if (!localStorage.getItem(INIT_KEY_ADS)) {
  const initialAds = [
    { id: "ad-top", name: "Top Header Banner", placement: "header_top", type: "image", imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=728&h=90", link: "https://www.nike.com", clicks: 124, impressions: 3200, revenue: 320 },
    { id: "ad-sidebar", name: "Sidebar Square Ad", placement: "sidebar", type: "image", imageUrl: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=300&h=250", link: "https://www.sony.com", clicks: 87, impressions: 1800, revenue: 180 },
    { id: "ad-in-article", name: "Article Native Ad", placement: "in_article", type: "image", imageUrl: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=600&h=150", link: "https://www.apple.com", clicks: 215, impressions: 4500, revenue: 540 }
  ];
  localStorage.setItem(INIT_KEY_ADS, JSON.stringify(initialAds));
}

// Helpers
const getStored = (key) => JSON.parse(localStorage.getItem(key));
const setStored = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export const db = {
  // Articles
  getArticles: async () => {
    return getStored(INIT_KEY_ARTICLES);
  },

  getArticleById: async (id) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    return articles.find(art => art.id === id);
  },

  addArticle: async (article) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const newArticle = {
      ...article,
      id: `art-${Date.now()}`,
      createdAt: new Date().toISOString(),
      views: 0,
      likes: 0,
      bookmarksCount: 0,
      reactions: { like: 0, love: 0, angry: 0, wow: 0 },
      comments: []
    };
    articles.unshift(newArticle);
    setStored(INIT_KEY_ARTICLES, articles);
    
    // Log action
    db.addLog(`नवीन बातमी जोडली: '${newArticle.title}'`);
    return newArticle;
  },

  updateArticle: async (id, updatedFields) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const index = articles.findIndex(art => art.id === id);
    if (index === -1) throw new Error("बातमी सापडली नाही.");
    
    articles[index] = { ...articles[index], ...updatedFields };
    setStored(INIT_KEY_ARTICLES, articles);

    db.addLog(`बातमी सुधारली: '${articles[index].title}'`);
    return articles[index];
  },

  deleteArticle: async (id) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const index = articles.findIndex(art => art.id === id);
    if (index === -1) throw new Error("बातमी सापडली नाही.");
    
    const title = articles[index].title;
    articles.splice(index, 1);
    setStored(INIT_KEY_ARTICLES, articles);

    db.addLog(`बातमी काढून टाकली: '${title}'`);
    return true;
  },

  incrementViews: async (id) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const index = articles.findIndex(art => art.id === id);
    if (index !== -1) {
      articles[index].views = (articles[index].views || 0) + 1;
      setStored(INIT_KEY_ARTICLES, articles);
      return articles[index].views;
    }
    return 0;
  },

  addReaction: async (id, reactionType) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const index = articles.findIndex(art => art.id === id);
    if (index !== -1) {
      const art = articles[index];
      if (!art.reactions) {
        art.reactions = { like: 0, love: 0, angry: 0, wow: 0 };
      }
      art.reactions[reactionType] = (art.reactions[reactionType] || 0) + 1;
      art.likes = (art.likes || 0) + 1; // Increase total likes count too
      setStored(INIT_KEY_ARTICLES, articles);
      return art.reactions;
    }
    return null;
  },

  addComment: async (id, commentUser, commentText) => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const index = articles.findIndex(art => art.id === id);
    if (index !== -1) {
      const newComment = {
        id: `c-${Date.now()}`,
        user: commentUser || "अनामिक वाचक",
        text: commentText,
        createdAt: new Date().toISOString()
      };
      articles[index].comments = articles[index].comments || [];
      articles[index].comments.push(newComment);
      setStored(INIT_KEY_ARTICLES, articles);
      return newComment;
    }
    return null;
  },

  // Live TV & Updates
  getLiveTv: async () => {
    return getStored(INIT_KEY_LIVE);
  },

  updateLiveTicker: async (tickerArray) => {
    const live = getStored(INIT_KEY_LIVE);
    live.latestUpdates = tickerArray;
    setStored(INIT_KEY_LIVE, live);
    db.addLog("थेट प्रक्षेपणाच्या हेडलाईन्स सुधारल्या");
    return live;
  },

  // Podcasts
  getPodcasts: async () => {
    return getStored(INIT_KEY_PODCASTS);
  },

  // User Logs
  getLogs: async () => {
    return getStored(INIT_KEY_LOGS);
  },

  addLog: (action) => {
    const logs = getStored(INIT_KEY_LOGS) || [];
    logs.unshift({
      id: `log-${Date.now()}`,
      user: "प्रशासक (Admin)",
      action,
      timestamp: new Date().toISOString()
    });
    setStored(INIT_KEY_LOGS, logs.slice(0, 50)); // Keep last 50 logs
  },

  // Advertisement Management
  getAds: async () => {
    return getStored(INIT_KEY_ADS);
  },

  recordAdClick: async (adId) => {
    const ads = getStored(INIT_KEY_ADS);
    const index = ads.findIndex(ad => ad.id === adId);
    if (index !== -1) {
      ads[index].clicks += 1;
      ads[index].revenue += 1.5; // $1.5 per click simulation
      setStored(INIT_KEY_ADS, ads);
    }
  },

  recordAdImpression: async (adId) => {
    const ads = getStored(INIT_KEY_ADS);
    const index = ads.findIndex(ad => ad.id === adId);
    if (index !== -1) {
      ads[index].impressions += 1;
      setStored(INIT_KEY_ADS, ads);
    }
  },

  updateAd: async (id, updatedFields) => {
    const ads = getStored(INIT_KEY_ADS);
    const index = ads.findIndex(ad => ad.id === id);
    if (index !== -1) {
      ads[index] = { ...ads[index], ...updatedFields };
      setStored(INIT_KEY_ADS, ads);
      db.addLog(`जाहिरात अपडेट केली: ${ads[index].name}`);
      return ads[index];
    }
    return null;
  },

  // Analytics Stats
  getStats: async () => {
    const articles = getStored(INIT_KEY_ARTICLES);
    const ads = getStored(INIT_KEY_ADS);
    
    const totalViews = articles.reduce((acc, art) => acc + (art.views || 0), 0);
    const totalLikes = articles.reduce((acc, art) => acc + (art.likes || 0), 0);
    const totalComments = articles.reduce((acc, art) => acc + (art.comments?.length || 0), 0);
    
    // Calculate category counts
    const categoryCounts = {};
    articles.forEach(art => {
      categoryCounts[art.category] = (categoryCounts[art.category] || 0) + 1;
    });

    // Calculate revenue
    const totalAdRevenue = ads.reduce((acc, ad) => acc + (ad.revenue || 0), 0);
    
    return {
      totalArticles: articles.length,
      totalViews,
      totalLikes,
      totalComments,
      totalAdRevenue,
      categoryCounts,
      activeReadersOnline: Math.floor(Math.random() * (1200 - 800) + 800) // Simulated active online count
    };
  }
};
