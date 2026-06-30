import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { db } from '../services/db';
import { useApp } from '../context/AppContext';
import { 
  Clock, Calendar, Eye, Bookmark, Share2, Heart, MessageSquare, 
  Send, ThumbsUp, AlertCircle, Award, Check, Link as LinkIcon 
} from 'lucide-react';
import { motion, useScroll } from 'framer-motion';
import AdBanner from '../components/AdBanner';
import PremiumSidebar from '../components/PremiumSidebar';

export default function ArticlePage() {
  const { id } = useParams();
  const { scrollYProgress } = useScroll();
  const queryClient = useQueryClient();
  const { user, bookmarks, toggleBookmark } = useApp();

  const [commentName, setCommentName] = useState(user ? user.name : '');
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [reactionMsg, setReactionMsg] = useState(null);

  // Sync comment field with logged in user
  useEffect(() => {
    if (user) {
      setCommentName(user.name);
    }
  }, [user]);

  // Fetch article details
  const { data: article, isLoading, error } = useQuery({
    queryKey: ['article', id],
    queryFn: () => db.getArticleById(id)
  });

  // Fetch related articles
  const { data: allArticles = [] } = useQuery({
    queryKey: ['articles'],
    queryFn: db.getArticles
  });

  // Track views on load
  useEffect(() => {
    if (id) {
      db.incrementViews(id).then(() => {
        // Invalidate query to refresh views count
        queryClient.invalidateQueries(['article', id]);
      });
    }
  }, [id, queryClient]);

  // Mutation for reactions
  const reactMutation = useMutation({
    mutationFn: ({ type }) => db.addReaction(id, type),
    onSuccess: () => {
      queryClient.invalidateQueries(['article', id]);
      setReactionMsg("तुमची प्रतिक्रिया नोंदवली गेली!");
      setTimeout(() => setReactionMsg(null), 3000);
    }
  });

  // Mutation for comments
  const commentMutation = useMutation({
    mutationFn: ({ name, text }) => db.addComment(id, name, text),
    onSuccess: () => {
      queryClient.invalidateQueries(['article', id]);
      setCommentText('');
      if (!user) setCommentName('');
    }
  });

  const handleSendComment = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      commentMutation.mutate({
        name: commentName || "अनामिक वाचक",
        text: commentText
      });
    }
  };

  const handleShareClick = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <div className="h-10 w-10 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-500 font-bold text-sm">बातमी लोड होत आहे...</p>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <AlertCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h4 className="font-bold text-xl mb-2 dark:text-white">बातमी उघडता आली नाही</h4>
        <p className="text-gray-500 text-sm mb-6">आम्ही दिलगीर आहोत. बातमी अस्तित्वात नाही किंवा काढून टाकली गेली आहे.</p>
        <Link to="/" className="bg-primary text-white font-bold px-6 py-2.5 rounded-full text-sm">मुख्य पानावर जा</Link>
      </div>
    );
  }

  const isBookmarked = bookmarks.includes(article.id);
  const relatedArticles = allArticles
    .filter(art => art.category === article.category && art.id !== article.id)
    .slice(0, 3);

  // Markdown parsing simulation
  const renderContentHtml = (markdownText) => {
    if (!markdownText) return '';
    return markdownText.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return <h2 key={index} className="font-heading font-black text-2xl text-secondary dark:text-white mt-6 mb-3">{paragraph.replace('## ', '')}</h2>;
      }
      if (paragraph.startsWith('### ')) {
        return <h3 key={index} className="font-heading font-black text-xl text-secondary dark:text-white mt-4 mb-2">{paragraph.replace('### ', '')}</h3>;
      }
      if (paragraph.startsWith('* ')) {
        const bulletPoints = paragraph.split('\n');
        return (
          <ul key={index} className="list-disc pl-5 my-3 flex flex-col gap-1.5 text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed">
            {bulletPoints.map((bp, bpIdx) => (
              <li key={bpIdx}>{bp.replace('* ', '')}</li>
            ))}
          </ul>
        );
      }
      return (
        <p key={index} className="text-gray-700 dark:text-gray-300 text-sm md:text-base leading-relaxed mb-4 text-justify">
          {paragraph}
        </p>
      );
    });
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-50 origin-left"
        style={{ scaleX: scrollYProgress }}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Ad Block top */}
        <AdBanner placement="header_top" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Article Content (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 md:p-8 shadow-premium text-left">
            
            {/* Category tag */}
            <span className="bg-primary text-white font-heading font-black text-xs px-3 py-1 rounded inline-block mb-3 uppercase tracking-wider">
              {article.categoryMarathi}
            </span>

            {/* Title */}
            <h1 className="font-heading font-black text-xl md:text-3xl lg:text-4xl leading-tight text-secondary dark:text-white mb-4">
              {article.title}
            </h1>

            {/* Author Profile and Details metadata */}
            <div className="flex flex-wrap justify-between items-center gap-4 bg-gray-50 dark:bg-neutral-900/50 p-4 rounded-lg mb-6 border border-gray-100 dark:border-neutral-800">
              <div className="flex items-center gap-3">
                <img 
                  src={article.author.avatar} 
                  alt={article.author.name} 
                  className="w-10 h-10 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <span className="font-bold text-xs md:text-sm text-secondary dark:text-white block">{article.author.name}</span>
                  <span className="text-[10px] text-gray-500 block">{article.author.role}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 text-[10px] md:text-xs text-gray-500 font-medium">
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(article.createdAt).toLocaleDateString('mr-IN')}</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {article.readTime} मि. वाचन</span>
                <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {article.views?.toLocaleString('mr-IN')} व्ह्यूज</span>
              </div>
            </div>

            {/* Big Hero Image */}
            {article.image && (
              <div className="relative rounded-lg overflow-hidden aspect-[16/9] mb-6 shadow-md border border-gray-100 dark:border-neutral-800">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Floating Quick Action Row */}
            <div className="flex justify-between items-center border-y border-gray-100 dark:border-neutral-800 py-3 mb-6">
              
              {/* Bookmark Toggle */}
              <button 
                onClick={() => toggleBookmark(article.id)}
                className={`flex items-center gap-1.5 font-bold text-xs ${isBookmarked ? 'text-primary' : 'text-gray-400 hover:text-primary'} transition-colors duration-200`}
              >
                <Bookmark className={`w-4 h-4 ${isBookmarked ? 'fill-primary' : ''}`} />
                {isBookmarked ? 'जतन केले' : 'जतन करा'}
              </button>

              {/* Reactions Bar */}
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-gray-400">प्रतिक्रिया:</span>
                <div className="flex gap-2">
                  {[
                    { type: 'like', emoji: '👍', label: 'लाईक' },
                    { type: 'love', emoji: '❤️', label: 'प्रेम' },
                    { type: 'wow', emoji: '😲', label: 'आश्चर्य' },
                    { type: 'angry', emoji: '😡', label: 'राग' }
                  ].map(react => (
                    <button
                      key={react.type}
                      onClick={() => reactMutation.mutate({ type: react.type })}
                      className="hover:scale-125 transition-transform duration-200 flex items-center gap-0.5 bg-gray-50 dark:bg-neutral-800 border border-gray-100 dark:border-neutral-800 px-2 py-1 rounded text-xs"
                      title={react.label}
                    >
                      <span>{react.emoji}</span>
                      <span className="text-[10px] font-bold text-gray-500">{article.reactions?.[react.type] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Share Trigger */}
              <button 
                onClick={handleShareClick}
                className="flex items-center gap-1.5 font-bold text-xs text-gray-500 hover:text-primary transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4" />}
                {copiedLink ? 'लिंक कॉपी केली!' : 'शेअर करा'}
              </button>
            </div>

            {/* Reaction alert toast */}
            {reactionMsg && (
              <div className="bg-green-500 text-white text-xs font-bold px-4 py-2 rounded-md mb-6 shadow-md animate-fadeIn">
                {reactionMsg}
              </div>
            )}

            {/* Article Main Text Rendered */}
            <div className="article-body-content mb-8">
              {renderContentHtml(article.content)}
            </div>

            {/* Author BIO Card */}
            <div className="bg-neutral-50 dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 p-5 rounded-xl flex gap-4 items-start mb-8">
              <img 
                src={article.author.avatar} 
                alt={article.author.name} 
                className="w-12 h-12 rounded-full object-cover border border-primary/20"
              />
              <div>
                <h4 className="font-heading font-black text-sm text-secondary dark:text-white flex items-center gap-1 mb-1">
                  {article.author.name} <Award className="w-3.5 h-3.5 text-accent" />
                </h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                  हा लेख ईगल न्यूजचे ज्येष्ठ वार्ताहर {article.author.name} यांच्याद्वारे विशेष विश्लेषणासह सादर केला गेला आहे. राज्यातील राजकीय घडामोडींवर सातत्याने लेख लिहिणे हे त्यांचे वैशिष्ट्य आहे.
                </p>
              </div>
            </div>

            {/* Inline Advertisement */}
            <AdBanner placement="in_article" />

            {/* Comments Section */}
            <div className="border-t border-gray-100 dark:border-neutral-800 pt-8">
              <h3 className="font-heading font-black text-xl mb-6 text-secondary dark:text-white flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-primary" /> प्रतिक्रिया द्या (Comments)
              </h3>

              {/* Comment Submission Form */}
              <form onSubmit={handleSendComment} className="flex flex-col gap-4 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 block mb-1">नाव</label>
                    <input
                      type="text"
                      required
                      disabled={!!user}
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                      placeholder="तुमचे नाव प्रविष्ट करा..."
                      className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 text-xs bg-transparent dark:text-white focus:outline-none focus:border-primary disabled:bg-gray-100 dark:disabled:bg-neutral-800"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 block mb-1">प्रतिक्रिया</label>
                  <textarea
                    required
                    rows="4"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="बातमीबद्दल तुमचे मत व्यक्त करा..."
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 text-xs bg-transparent dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={commentMutation.isLoading}
                  className="bg-primary hover:bg-primary-hover text-white font-bold text-xs px-6 py-2.5 rounded-full flex items-center gap-1.5 self-start shadow-glow transition-all"
                >
                  <Send className="w-3.5 h-3.5" /> प्रतिक्रिया नोंदवा
                </button>
              </form>

              {/* Comments Feed List */}
              <div className="flex flex-col gap-4">
                {article.comments && article.comments.length > 0 ? (
                  article.comments.map(comment => (
                    <div key={comment.id} className="bg-gray-50/50 dark:bg-neutral-900/30 p-4 border border-gray-100 dark:border-neutral-800 rounded-lg">
                      <div className="flex justify-between items-center mb-1 text-[10px] md:text-xs">
                        <span className="font-bold text-secondary dark:text-white">{comment.user}</span>
                        <span className="text-gray-400">{new Date(comment.createdAt).toLocaleDateString('mr-IN', { hour: '2-digit', minute: '2-digit' })}</span>
                      </div>
                      <p className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-normal">{comment.text}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6">या बातमीवर अजून कोणतीही प्रतिक्रिया नाही. पहिली प्रतिक्रिया नोंदवा!</p>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6 lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto lg:pr-2 no-scrollbar">
            
            {/* Sticky Table of Contents Mock */}
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
              <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b-2 border-primary pb-1">
                या बातमीमध्ये:
              </h3>
              <ul className="flex flex-col gap-2.5 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <li className="flex items-center gap-2 text-primary font-bold">
                  <span className="w-1.5 h-1.5 bg-primary rounded-full" /> प्रस्तावना व मुख्य घटना
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> विषयाचे मुख्य कंगोरे व तपशील
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> तज्ज्ञांचे व प्रमुख नेत्यांचे मत
                </li>
                <li className="flex items-center gap-2 hover:text-primary transition-colors cursor-pointer">
                  <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" /> निष्कर्ष व जनतेचे प्रश्न
                </li>
              </ul>
            </div>

            {/* Premium Right Sidebar */}
            <PremiumSidebar />

            {/* Related News list widget */}
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium text-left">
              <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b-2 border-primary pb-1">
                संबंधित बातम्या
              </h3>
              <div className="flex flex-col gap-4">
                {relatedArticles.length > 0 ? (
                  relatedArticles.map(art => (
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
                  ))
                ) : (
                  <p className="text-xs text-gray-400">या श्रेणीमध्ये इतर कोणतीही बातमी उपलब्ध नाही.</p>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </>
  );
}
