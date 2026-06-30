import React, { useState, useEffect, useRef } from 'react';
import { useQuery } from '@tanstack/react-query';
import { db } from '../services/db';
import { Tv, Flame, MessageSquare, Send, Users, Wifi } from 'lucide-react';
import AdBanner from '../components/AdBanner';

export default function LiveTvPage() {
  const { data: liveTv } = useQuery({
    queryKey: ['liveTv'],
    queryFn: db.getLiveTv
  });

  const [activeViewers, setActiveViewers] = useState(15420);
  const [chatMessages, setChatMessages] = useState([
    { id: 1, user: "राहुल पाटील", text: "मुंबईत पाऊस कुठे सुरू झालाय?", time: "दुपारी १:३०" },
    { id: 2, user: "वैभव गायकवाड", text: "पुणे पोलीस आयुक्तांचे मनःपूर्वक अभिनंदन!", time: "दुपारी १:३१" },
    { id: 3, user: "शीतल चव्हाण", text: "स्नेहा पाटील, तुझा अभिमान वाटतो महाराष्ट्राला. खूप मोठे यश आहे हे.", time: "दुपारी १:३२" },
  ]);

  const [newMessage, setNewMessage] = useState('');
  const chatEndRef = useRef(null);

  // Fluctuating viewers count
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveViewers(prev => prev + Math.floor(Math.random() * (50 - (-50)) + (-50)));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Simulating live incoming messages
  useEffect(() => {
    const mockMessages = [
      "पुण्यात पाऊस कधी पडेल?",
      "ईगल न्यूज रिपोर्टिंग खूप वेगवान आहे. अभिनंदन!",
      "शेतकऱ्यांसाठी यंदा समाधानकारक मान्सूनचा अंदाज खूप चांगला आहे.",
      "एसएससी बोर्ड निकालाची लिंक पाठवा प्लीज.",
      "पुण्यातील ड्रग्ज प्रकरणात राजकीय हात आहे का?",
      "महाराष्ट्र राजकारणात आता काय नवीन घडेल?",
      "पॉवरफुल रिपोर्टिंग! २४ तास थेट बातम्या.",
      "जय महाराष्ट्र! थेट प्रक्षेपण खूप छान सुरू आहे.",
      "कोल्हापूर सुवर्णकन्या स्नेहा पाटीलचे स्वागत करायला पाहिजे."
    ];

    const mockUsers = [
      "ज्ञानोबा माने", "सुनीता देशमुख", "अभिजित साळवी", "सतीश कदम", 
      "मीनाक्षी थोरात", "योगेश जोशी", "दीपक निकम", "प्रियांका काळे"
    ];

    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const randomText = mockMessages[Math.floor(Math.random() * mockMessages.length)];
      
      const newMsg = {
        id: Date.now(),
        user: randomUser,
        text: randomText,
        time: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
      };
      
      setChatMessages(prev => [...prev.slice(-30), newMsg]); // Keep last 30 messages
    }, 3500);

    return () => clearInterval(interval);
  }, []);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      const userMsg = {
        id: Date.now(),
        user: "मी (वाचक)",
        text: newMessage,
        time: new Date().toLocaleTimeString('mr-IN', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, userMsg]);
      setNewMessage('');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      
      {/* Top Banner Ad */}
      <AdBanner placement="header_top" />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Video Player & Updates (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6 text-left">
          
          {/* Header Title bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b-2 border-primary pb-3">
            <h1 className="font-heading font-black text-2xl md:text-3xl text-secondary dark:text-white flex items-center gap-2">
              <Tv className="w-7 h-7 text-primary fill-primary animate-pulse" /> ईगल न्यूज थेट प्रक्षेपण (Live TV)
            </h1>
            
            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <span className="flex items-center gap-1.5 bg-red-100 dark:bg-red-950/30 text-primary px-3 py-1.5 rounded-full uppercase tracking-wider animate-pulse-slow">
                <Wifi className="w-3.5 h-3.5" /> थेट प्रक्षेपण (Live)
              </span>
              <span className="flex items-center gap-1.5 text-gray-500 bg-gray-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5" /> {activeViewers.toLocaleString('mr-IN')} वाचक सध्या पाहत आहेत
              </span>
            </div>
          </div>

          {/* Youtube Live Player Container */}
          <div className="relative aspect-[16/9] w-full bg-black rounded-xl overflow-hidden shadow-2xl border border-neutral-800">
            {liveTv ? (
              <iframe
                src={liveTv.youtubeUrl}
                title={liveTv.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-neutral-500">
                <Wifi className="w-12 h-12 animate-ping text-primary mb-4" />
                <span>थेट प्रक्षेपण जोडत आहे...</span>
              </div>
            )}
          </div>

          {/* Scrolling updates under the player */}
          <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium">
            <h3 className="font-heading font-black text-lg mb-4 text-secondary dark:text-white flex items-center gap-2">
              <Flame className="w-4.5 h-4.5 text-primary animate-bounce" /> थेट घडामोडी (Live Bulletins)
            </h3>
            <div className="flex flex-col gap-4 text-sm">
              {liveTv?.latestUpdates?.map((update, index) => (
                <div key={index} className="flex gap-3 items-start border-b border-gray-50 dark:border-neutral-800/50 pb-3 last:border-0 last:pb-0">
                  <span className="bg-primary text-white font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider shrink-0 mt-0.5">
                    अपडेट
                  </span>
                  <p className="text-gray-700 dark:text-gray-300 font-medium leading-relaxed">{update}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Video Native Advertisement block */}
          <AdBanner placement="in_article" />

        </div>

        {/* RIGHT COLUMN: Chat box Panel (4 cols) */}
        <div className="lg:col-span-4 bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium flex flex-col h-[580px] text-left">
          
          {/* Chat Header */}
          <div className="flex items-center gap-2 pb-3 border-b border-gray-100 dark:border-neutral-800 mb-4">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h3 className="font-heading font-black text-lg text-secondary dark:text-white">थेट संवाद (Live Chat)</h3>
          </div>

          {/* Chat Body messages */}
          <div className="flex-1 overflow-y-auto pr-1 flex flex-col gap-3.5 mb-4">
            {chatMessages.map(msg => (
              <div key={msg.id} className="text-xs bg-gray-50/50 dark:bg-neutral-900/30 p-2.5 rounded-lg border border-gray-100 dark:border-neutral-800/50">
                <div className="flex justify-between items-center mb-0.5">
                  <span className="font-bold text-primary">{msg.user}</span>
                  <span className="text-[9px] text-gray-400 font-medium">{msg.time}</span>
                </div>
                <p className="text-gray-600 dark:text-gray-300 leading-normal text-left">{msg.text}</p>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Form submission */}
          <form onSubmit={handleSendMessage} className="flex gap-2 border-t border-gray-100 dark:border-neutral-800 pt-3">
            <input
              type="text"
              required
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="मराठीत संदेश लिहा..."
              className="w-full px-3 py-2 border border-gray-200 dark:border-neutral-800 bg-transparent rounded text-xs dark:text-white focus:outline-none focus:border-primary"
            />
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white px-4 rounded text-xs font-bold transition-colors">
              पाठवा
            </button>
          </form>

        </div>

      </div>

    </div>
  );
}
