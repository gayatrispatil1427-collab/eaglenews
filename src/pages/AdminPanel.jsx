import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { db } from '../services/db';
import { useApp } from '../context/AppContext';
import { categoriesList, districtsList } from '../services/mockData';
import { 
  TrendingUp, Edit3, Trash2, Plus, CheckCircle, Shield, 
  DollarSign, Activity, FileText, Settings, Image as ImageIcon, Send, AlertTriangle, Eye, EyeOff 
} from 'lucide-react';

export default function AdminPanel() {
  const { user } = useApp();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Redirect if not logged in as Admin or Super Admin
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
      navigate('/');
    }
  }, [user, navigate]);

  // Tab State
  const [activeTab, setActiveTab] = useState('dashboard');

  // Stats query
  const { data: stats, refetch: refetchStats } = useQuery({
    queryKey: ['adminStats'],
    queryFn: db.getStats
  });

  // Articles query
  const { data: articles = [], refetch: refetchArticles } = useQuery({
    queryKey: ['adminArticles'],
    queryFn: db.getArticles
  });

  // Ads query
  const { data: ads = [], refetch: refetchAds } = useQuery({
    queryKey: ['adminAds'],
    queryFn: db.getAds
  });

  // Logs query
  const { data: logs = [] } = useQuery({
    queryKey: ['adminLogs'],
    queryFn: db.getLogs
  });

  // News Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formTitle, setFormTitle] = useState('');
  const [formSummary, setFormSummary] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategory, setFormCategory] = useState('politics');
  const [formDistrict, setFormDistrict] = useState('mumbai');
  const [formImage, setFormImage] = useState('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800');
  const [formStatus, setFormStatus] = useState('published'); // Draft, Pending, Published
  const [formReadTime, setFormReadTime] = useState(4);
  const [formIsTrending, setFormIsTrending] = useState(false);
  const [formIsBreaking, setFormIsBreaking] = useState(false);
  const [formIsEditorsPick, setFormIsEditorsPick] = useState(false);

  // Ad Form State
  const [editingAdId, setEditingAdId] = useState(null);
  const [adFormLink, setAdFormLink] = useState('');
  const [adFormImage, setAdFormImage] = useState('');

  // SEO Form State
  const [seoTitle, setSeoTitle] = useState('ईगल न्यूज | २४x७ डिजिटल महाराष्ट्र');
  const [seoDesc, setSeoDesc] = useState('महाराष्ट्रातील घडामोडी, राजकारण, कृषी व क्रीडा क्षेत्रातील ताज्या बातम्यांचे दालन.');
  const [seoKeywords, setSeoKeywords] = useState('Eagle News, Marathi news, Politics, Pune news, Maharashtra news');
  const [seoStatusMsg, setSeoStatusMsg] = useState(null);

  // Notification Form State
  const [notTitle, setNotTitle] = useState('');
  const [notMessage, setNotMessage] = useState('');
  const [notStatusMsg, setNotStatusMsg] = useState(null);

  // CRUD Mutations
  const addMutation = useMutation({
    mutationFn: (newArt) => db.addArticle(newArt),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries(['articles']);
      refetchArticles();
      refetchStats();
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updated }) => db.updateArticle(id, updated),
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries(['articles']);
      refetchArticles();
      refetchStats();
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => db.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['articles']);
      refetchArticles();
      refetchStats();
    }
  });

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormTitle('');
    setFormSummary('');
    setFormContent('');
    setFormCategory('politics');
    setFormDistrict('mumbai');
    setFormImage('https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800');
    setFormStatus('published');
    setFormReadTime(4);
    setFormIsTrending(false);
    setFormIsBreaking(false);
    setFormIsEditorsPick(false);
  };

  const handleEditClick = (art) => {
    setIsEditing(true);
    setEditingId(art.id);
    setFormTitle(art.title);
    setFormSummary(art.summary);
    setFormContent(art.content);
    setFormCategory(art.category);
    setFormDistrict(art.district || 'mumbai');
    setFormImage(art.image);
    setFormStatus(art.status || 'published');
    setFormReadTime(art.readTime || 4);
    setFormIsTrending(art.isTrending || false);
    setFormIsBreaking(art.isBreaking || false);
    setFormIsEditorsPick(art.isEditorsPick || false);
  };

  const handleSaveArticle = (e) => {
    e.preventDefault();
    const categoryM = categoriesList.find(c => c.id === formCategory)?.name || 'सर्व';
    const payload = {
      title: formTitle,
      summary: formSummary,
      content: formContent,
      category: formCategory,
      categoryMarathi: categoryM,
      district: formDistrict,
      image: formImage,
      status: formStatus,
      readTime: parseInt(formReadTime),
      isTrending: formIsTrending,
      isBreaking: formIsBreaking,
      isEditorsPick: formIsEditorsPick,
      author: {
        name: user.name,
        role: user.role === 'superadmin' ? 'मुख्य संपादक' : 'वरिष्ठ संपादक/वार्ताहर',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=150'
      }
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, updated: payload });
    } else {
      addMutation.mutate(payload);
    }
  };

  const handleSaveAd = (e) => {
    e.preventDefault();
    if (editingAdId) {
      db.updateAd(editingAdId, {
        link: adFormLink,
        imageUrl: adFormImage
      }).then(() => {
        setEditingAdId(null);
        setAdFormLink('');
        setAdFormImage('');
        refetchAds();
        refetchStats();
      });
    }
  };

  const handleSaveSeo = (e) => {
    e.preventDefault();
    setSeoStatusMsg("SEO सेटिंग्स यशस्वीरीत्या जतन केल्या गेल्या!");
    db.addLog("SEO मेटा टॅग्ज सुधारले");
    setTimeout(() => setSeoStatusMsg(null), 3000);
  };

  const handleSendNotification = (e) => {
    e.preventDefault();
    if (notTitle.trim() && notMessage.trim()) {
      setNotStatusMsg("पुश नोटिफिकेशन सर्व वाचक उपकरणांवर पाठवले गेले!");
      db.addLog(`पुश नोटिफिकेशन पाठवले: '${notTitle}'`);
      setNotTitle('');
      setNotMessage('');
      setTimeout(() => setNotStatusMsg(null), 4000);
    }
  };

  // Super Admin Action: Approve news workflow
  const handleApproveArticle = (id) => {
    db.updateArticle(id, { status: 'published' }).then(() => {
      refetchArticles();
      refetchStats();
      queryClient.invalidateQueries(['articles']);
    });
  };

  if (!user) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 text-left">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8 border-b-2 border-primary pb-3">
        <div>
          <h1 className="font-heading font-black text-2xl md:text-3xl text-secondary dark:text-white flex items-center gap-2">
            <Shield className="w-7 h-7 text-primary" /> ईगल न्यूज व्यवस्थापन केंद्र
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            नाव: <strong>{user.name}</strong> ({user.roleLabel})
          </p>
        </div>

        {/* Action Tabs row */}
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'dashboard', label: 'डॅशबोर्ड', icon: TrendingUp },
            { id: 'articles', label: 'बातम्या व्यवस्थापन', icon: FileText },
            { id: 'ads', label: 'जाहिराती (Ads)', icon: DollarSign },
            { id: 'logs', label: 'वापरकर्ता नोंदी', icon: Activity, superOnly: true },
            { id: 'settings', label: 'सिस्टीम व SEO', icon: Settings },
          ].map(tab => {
            if (tab.superOnly && user.role !== 'superadmin') return null;
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  resetForm();
                }}
                className={`flex items-center gap-1.5 px-4 py-2 rounded text-xs font-bold transition-colors ${
                  isActive 
                    ? 'bg-primary text-white shadow-glow' 
                    : 'bg-white dark:bg-brandCard-dark border border-gray-200 dark:border-neutral-800 text-secondary dark:text-gray-300 hover:border-primary/50'
                }`}
              >
                <IconComp className="w-3.5 h-3.5" /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= TAB 1: ANALYTICS DASHBOARD ================= */}
      {activeTab === 'dashboard' && stats && (
        <div className="flex flex-col gap-8">
          
          {/* Card counter widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">एकूण बातम्या (Articles)</span>
              <span className="font-heading font-black text-3xl text-secondary dark:text-white block">
                {stats.totalArticles}
              </span>
            </div>

            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">एकूण व्ह्यूज (Total Views)</span>
              <span className="font-heading font-black text-3xl text-secondary dark:text-white block">
                {stats.totalViews?.toLocaleString('mr-IN')}
              </span>
            </div>

            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">प्रतिक्रिया / लाईक्स</span>
              <span className="font-heading font-black text-3xl text-secondary dark:text-white block">
                {stats.totalLikes?.toLocaleString('mr-IN')}
              </span>
            </div>

            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium flex flex-col justify-between">
              <div>
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mb-1">जाहिरात महसूल (Ad Revenue)</span>
                <span className="font-heading font-black text-3xl text-green-600 block">
                  ${stats.totalAdRevenue?.toLocaleString('en-US')}
                </span>
              </div>
              <span className="text-[9px] text-gray-400 block mt-1">* CPC जाहिरात मोबदला</span>
            </div>

          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Category counts chart mockup */}
            <div className="lg:col-span-8 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-6 shadow-premium">
              <h3 className="font-heading font-black text-lg mb-6 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
                श्रेणीनिहाय बातमी वर्गीकरण (Category Share)
              </h3>
              <div className="flex flex-col gap-4">
                {Object.keys(stats.categoryCounts || {}).map(catId => {
                  const count = stats.categoryCounts[catId];
                  const label = categoriesList.find(c => c.id === catId)?.name || catId;
                  const pct = stats.totalArticles > 0 ? `${(count / stats.totalArticles * 100).toFixed(1)}%` : '0%';
                  return (
                    <div key={catId} className="text-xs">
                      <div className="flex justify-between font-semibold mb-1 dark:text-gray-300">
                        <span>{label}</span>
                        <span>{count} बातम्या ({pct})</span>
                      </div>
                      <div className="w-full bg-gray-100 dark:bg-neutral-800 rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: pct }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* System Performance Status */}
            <div className="lg:col-span-4 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-6 shadow-premium">
              <h3 className="font-heading font-black text-lg mb-6 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
                सिस्टीम आरोग्य (System Monitoring)
              </h3>
              <div className="flex flex-col gap-5">
                {[
                  { name: "CPU लोड", value: "२४%", color: "text-green-500" },
                  { name: "डेटाबेस जोडणी (API)", value: "९९.९% क्रियाशील", color: "text-green-500" },
                  { name: "लोड गती (Avg. Latency)", value: "०.३२ सेकंद", color: "text-green-500" },
                  { name: "कॅश हिट दर (Vite cache)", value: "९४.१%", color: "text-green-500" }
                ].map((sys, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-gray-500">{sys.name}</span>
                    <span className={`font-black ${sys.color}`}>{sys.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= TAB 2: ARTICLES MANAGEMENT ================= */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* News Write / Edit Form (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              {isEditing ? 'बातमी सुधारा (Edit Article)' : 'नवीन बातमी जोडा (Create Article)'}
            </h3>
            
            <form onSubmit={handleSaveArticle} className="flex flex-col gap-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">बातमीचे शीर्षक</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="शीर्षक लिहा..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary font-bold text-sm"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">थोडक्यात सारांश</label>
                <textarea
                  required
                  rows="2"
                  value={formSummary}
                  onChange={(e) => setFormSummary(e.target.value)}
                  placeholder="बातमीचा गोषवारा/सारांश लिहा..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">मुख्य बातमी मजकूर (Markdown/HTML)</label>
                <textarea
                  required
                  rows="6"
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="मुख्य बातमीचा सविस्तर मजकूर येथे लिहा..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">मुख्य श्रेणी (Category)</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-white dark:bg-neutral-900 dark:text-white focus:outline-none focus:border-primary"
                  >
                    {categoriesList.filter(c => c.id !== 'all').map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">संबंधित जिल्हा (District)</label>
                  <select
                    value={formDistrict}
                    onChange={(e) => setFormDistrict(e.target.value)}
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-white dark:bg-neutral-900 dark:text-white focus:outline-none focus:border-primary"
                  >
                    {districtsList.map(dist => (
                      <option key={dist.id} value={dist.id}>{dist.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">फोटो लिंक (Unsplash Image URL)</label>
                <input
                  type="url"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">वाचन वेळ (Minutes)</label>
                  <input
                    type="number"
                    min="1"
                    value={formReadTime}
                    onChange={(e) => setFormReadTime(e.target.value)}
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">स्थिती (Status)</label>
                  <select
                    value={formStatus}
                    onChange={(e) => setFormStatus(e.target.value)}
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-white dark:bg-neutral-900 dark:text-white focus:outline-none focus:border-primary"
                  >
                    {/* Super admin publishes immediately, admin drafts or requests approval */}
                    {user.role === 'superadmin' ? (
                      <>
                        <option value="published">थेट प्रकाशित (Published)</option>
                        <option value="draft">मसुदा (Draft)</option>
                      </>
                    ) : (
                      <>
                        <option value="pending_approval">मंजुरीसाठी प्रलंबित (Pending Approval)</option>
                        <option value="draft">मसुदा (Draft)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Special options checkboxes */}
              <div className="flex flex-wrap gap-4 py-2 border-y border-gray-50 dark:border-neutral-800/80">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsBreaking}
                    onChange={(e) => setFormIsBreaking(e.target.checked)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span>ब्रेकिंग न्यूज</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsTrending}
                    onChange={(e) => setFormIsTrending(e.target.checked)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span>ट्रेंडिंग</span>
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={formIsEditorsPick}
                    onChange={(e) => setFormIsEditorsPick(e.target.checked)}
                    className="accent-primary h-3.5 w-3.5"
                  />
                  <span>संपादकीय निवड</span>
                </label>
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-primary hover:bg-primary-hover text-white px-5 py-2 rounded text-xs font-bold shadow-glow"
                >
                  {isEditing ? 'बदल जतन करा' : 'बातमी जोडा'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-secondary dark:text-gray-300 px-5 py-2 rounded text-xs font-bold"
                >
                  रद्द करा
                </button>
              </div>
            </form>
          </div>

          {/* List of articles & Approval Queue (7 cols) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Super Admin Approval Queue */}
            {user.role === 'superadmin' && articles.some(art => art.status === 'pending_approval') && (
              <div className="bg-red-50/20 dark:bg-red-950/10 border-l-4 border-accent rounded-xl p-5 shadow-premium">
                <h3 className="font-heading font-black text-base text-accent-hover mb-4 flex items-center gap-1.5">
                  <AlertTriangle className="w-5 h-5 text-accent" /> बातमी मंजुरी रांग (Approval Queue)
                </h3>
                <div className="flex flex-col gap-4 text-xs">
                  {articles.filter(art => art.status === 'pending_approval').map(art => (
                    <div key={art.id} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 p-4 rounded shadow-sm flex flex-col md:flex-row justify-between gap-3 text-left">
                      <div className="flex-1">
                        <span className="bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded text-[9px] font-bold block w-fit mb-1">{art.categoryMarathi}</span>
                        <h5 className="font-heading font-bold text-sm text-secondary dark:text-white leading-snug">{art.title}</h5>
                        <p className="text-[10px] text-gray-500 mt-1">लेखक: {art.author.name} | वाचन वेळ: {art.readTime} मि.</p>
                      </div>
                      <div className="flex gap-2 shrink-0 self-center">
                        <button
                          onClick={() => handleApproveArticle(art.id)}
                          className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded"
                        >
                          मंजूर करा
                        </button>
                        <button
                          onClick={() => handleEditClick(art)}
                          className="bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-secondary dark:text-white font-bold px-3 py-1.5 rounded"
                        >
                          तपासा
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard list of articles */}
            <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium overflow-x-auto">
              <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
                सर्व बातम्यांची यादी
              </h3>
              
              <table className="w-full text-xs text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-neutral-800 text-gray-400 font-bold uppercase text-[10px]">
                    <th className="py-2.5">श्रेणी</th>
                    <th className="py-2.5">शीर्षक</th>
                    <th className="py-2.5">व्ह्यूज</th>
                    <th className="py-2.5">स्थिती</th>
                    <th className="py-2.5 text-right">कृती</th>
                  </tr>
                </thead>
                <tbody>
                  {articles.map(art => (
                    <tr key={art.id} className="border-b border-gray-50 dark:border-neutral-850 hover:bg-gray-50/50 dark:hover:bg-neutral-800/20">
                      <td className="py-3 font-bold text-gray-500">
                        {art.categoryMarathi}
                      </td>
                      <td className="py-3 pr-4 font-bold text-secondary dark:text-gray-200 max-w-[240px] truncate">
                        {art.title}
                      </td>
                      <td className="py-3">
                        {art.views?.toLocaleString('mr-IN')}
                      </td>
                      <td className="py-3">
                        {art.status === 'draft' ? (
                          <span className="bg-neutral-100 dark:bg-neutral-800 text-gray-500 px-2 py-0.5 rounded font-bold text-[9px]">मसुदा</span>
                        ) : art.status === 'pending_approval' ? (
                          <span className="bg-accent/20 text-accent-hover px-2 py-0.5 rounded font-bold text-[9px] animate-pulse">मंजुरी प्रलंबित</span>
                        ) : (
                          <span className="bg-green-100 dark:bg-green-950/20 text-green-600 dark:text-green-400 px-2 py-0.5 rounded font-bold text-[9px]">प्रकाशित</span>
                        )}
                      </td>
                      <td className="py-3 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => handleEditClick(art)}
                            className="p-1 hover:bg-gray-100 dark:hover:bg-neutral-800 text-secondary dark:text-gray-300 rounded"
                            title="सुधारा"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm("ही बातमी कायमची काढून टाकायची आहे का?")) {
                                deleteMutation.mutate(art.id);
                              }
                            }}
                            className="p-1 hover:bg-red-50 dark:hover:bg-red-950/20 text-red-600 rounded"
                            title="काढून टाका"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 3: ADVERTISEMENTS TRACKER ================= */}
      {activeTab === 'ads' && ads && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Ad Edit Form (4 cols) */}
          <div className="lg:col-span-4 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              जाहिरात सुधारक
            </h3>
            
            {editingAdId ? (
              <form onSubmit={handleSaveAd} className="flex flex-col gap-4 text-xs font-semibold">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">जाहिरात टार्गेट लिंक</label>
                  <input
                    type="url"
                    required
                    value={adFormLink}
                    onChange={(e) => setAdFormLink(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-400 block mb-1">जाहिरात बॅनर फोटो (Image URL)</label>
                  <input
                    type="url"
                    required
                    value={adFormImage}
                    onChange={(e) => setAdFormImage(e.target.value)}
                    placeholder="https://..."
                    className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-4 py-2 rounded">
                    जतन करा
                  </button>
                  <button 
                    type="button" 
                    onClick={() => {
                      setEditingAdId(null);
                      setAdFormLink('');
                      setAdFormImage('');
                    }}
                    className="bg-gray-100 dark:bg-neutral-800 text-secondary dark:text-white font-bold px-4 py-2 rounded"
                  >
                    रद्द करा
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-gray-400 text-xs py-4 text-center">
                जाहिरात सुधारण्यासाठी खालील तक्त्यातील 'सुधारा (Edit)' बटनावर क्लिक करा.
              </p>
            )}
          </div>

          {/* Ad Tracker Analytics list (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium overflow-x-auto">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              जाहिरात कामगिरी आणि महसूल ट्रॅकर
            </h3>
            
            <table className="w-full text-xs text-left border-collapse min-w-[500px]">
              <thead>
                <tr className="border-b border-gray-100 dark:border-neutral-800 text-gray-400 font-bold uppercase text-[10px]">
                  <th className="py-2.5">जाहिरात नाव</th>
                  <th className="py-2.5">इम्प्रेशन्स</th>
                  <th className="py-2.5">क्लिक्स</th>
                  <th className="py-2.5">CTR (%)</th>
                  <th className="py-2.5">कमावलेला महसूल</th>
                  <th className="py-2.5 text-right">कृती</th>
                </tr>
              </thead>
              <tbody>
                {ads.map(ad => {
                  const ctr = ad.impressions > 0 ? ((ad.clicks / ad.impressions) * 100).toFixed(2) : '0.00';
                  return (
                    <tr key={ad.id} className="border-b border-gray-50 dark:border-neutral-850">
                      <td className="py-3 font-bold text-secondary dark:text-white">
                        {ad.name}
                        <span className="block text-[10px] text-gray-400 font-normal">स्थान: {ad.placement}</span>
                      </td>
                      <td className="py-3">
                        {ad.impressions?.toLocaleString()}
                      </td>
                      <td className="py-3">
                        {ad.clicks?.toLocaleString()}
                      </td>
                      <td className="py-3 font-bold text-primary">
                        {ctr}%
                      </td>
                      <td className="py-3 font-bold text-green-600">
                        ${ad.revenue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="py-3 text-right">
                        <button
                          onClick={() => {
                            setEditingAdId(ad.id);
                            setAdFormLink(ad.link);
                            setAdFormImage(ad.imageUrl);
                          }}
                          className="text-primary font-bold hover:underline"
                        >
                          सुधारा (Edit)
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

        </div>
      )}

      {/* ================= TAB 4: SYSTEM & USER ACTIVITY LOGS (SUPER ADMIN ONLY) ================= */}
      {activeTab === 'logs' && user.role === 'superadmin' && (
        <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-6 shadow-premium overflow-x-auto">
          <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
            Super Admin ऑडिट लॉग्स (System Activity Logs)
          </h3>
          
          <table className="w-full text-xs text-left border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-gray-100 dark:border-neutral-800 text-gray-400 font-bold uppercase text-[10px]">
                <th className="py-2.5">वापरकर्ता (User)</th>
                <th className="py-2.5">केलेली कृती (Action)</th>
                <th className="py-2.5 text-right">वेळ (Timestamp)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map(log => (
                <tr key={log.id} className="border-b border-gray-50 dark:border-neutral-850">
                  <td className="py-3 font-bold text-secondary dark:text-gray-200">
                    {log.user}
                  </td>
                  <td className="py-3 text-gray-600 dark:text-gray-400">
                    {log.action}
                  </td>
                  <td className="py-3 text-right text-gray-400 font-medium">
                    {new Date(log.timestamp).toLocaleString('mr-IN')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= TAB 5: SYSTEM CONFIGS & SEO & NOTIFICATIONS ================= */}
      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* SEO Meta Form (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              SEO व्यवस्थापन (Meta Tag Configs)
            </h3>
            
            {seoStatusMsg && (
              <div className="bg-green-500 text-white font-bold p-2 text-xs rounded mb-4">
                {seoStatusMsg}
              </div>
            )}

            <form onSubmit={handleSaveSeo} className="flex flex-col gap-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">पोर्टल डीफॉल्ट शीर्षक (Meta Title)</label>
                <input
                  type="text"
                  required
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">मेटा वर्णन (Meta Description)</label>
                <textarea
                  required
                  rows="3"
                  value={seoDesc}
                  onChange={(e) => setSeoDesc(e.target.value)}
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">महत्त्वाचे कीवर्ड्स (Keywords List)</label>
                <input
                  type="text"
                  required
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2 rounded self-start shadow-glow">
                SEO बदल जतन करा
              </button>
            </form>
          </div>

          {/* Push Notification Manager (6 cols) */}
          <div className="lg:col-span-6 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white border-b border-gray-50 dark:border-neutral-800/80 pb-2">
              पुश नोटिफिकेशन प्रेषक (Send Push Alerts)
            </h3>
            
            {notStatusMsg && (
              <div className="bg-green-500 text-white font-bold p-2 text-xs rounded mb-4 animate-bounce">
                {notStatusMsg}
              </div>
            )}

            <form onSubmit={handleSendNotification} className="flex flex-col gap-4 text-xs font-semibold">
              <div>
                <label className="text-[10px] text-gray-400 block mb-1">नोटिफिकेशन शीर्षक (Alert Title)</label>
                <input
                  type="text"
                  required
                  value={notTitle}
                  onChange={(e) => setNotTitle(e.target.value)}
                  placeholder="उदा. ब्रेकिंग न्यूज..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-1">संदेश (Alert Message)</label>
                <textarea
                  required
                  rows="3"
                  value={notMessage}
                  onChange={(e) => setNotMessage(e.target.value)}
                  placeholder="वाचकांना पाठवायचा संदेश येथे लिहा..."
                  className="w-full border border-gray-200 dark:border-neutral-800 rounded px-3 py-2 bg-transparent dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <button type="submit" className="bg-primary hover:bg-primary-hover text-white font-bold px-5 py-2 rounded flex items-center gap-1.5 self-start shadow-glow">
                <Send className="w-3.5 h-3.5" /> नोटिफिकेशन पाठवा
              </button>
            </form>
            
            {/* Media Gallery Section inline */}
            <div className="mt-8 pt-6 border-t border-gray-50 dark:border-neutral-800/80 text-left">
              <h4 className="font-heading font-black text-base text-secondary dark:text-white mb-3 flex items-center gap-1.5">
                <ImageIcon className="w-4.5 h-4.5 text-primary" /> क्विक मीडिया गॅलरी (Stock Photos)
              </h4>
              <p className="text-[10px] text-gray-400 mb-3">लेखामध्ये जोडण्यासाठी खालील फोटो लिंक वापरू शकता (क्लिक करून कॉपी करा):</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { name: "राजकारण", url: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=800" },
                  { name: "शेती / कृषी", url: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&q=80&w=800" },
                  { name: "क्रीडा", url: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=800" }
                ].map((ph, idx) => (
                  <div 
                    key={idx} 
                    onClick={() => {
                      navigator.clipboard.writeText(ph.url);
                      alert(`${ph.name} फोटो लिंक कॉपी झाली!`);
                    }}
                    className="relative rounded overflow-hidden aspect-[4/3] cursor-pointer border border-gray-200 dark:border-neutral-800 hover:scale-105 transition-transform"
                    title="क्लिक करा व लिंक कॉपी करा"
                  >
                    <img src={ph.url} alt={ph.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[9px] px-1.5 py-0.5 rounded font-bold">{ph.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}
