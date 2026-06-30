import React, { useState, useEffect } from 'react';
import {
  Award, MapPin, Phone, Mail, MessageSquare, ExternalLink,
  Users, CheckCircle, Globe, ChevronDown, ChevronUp, Quote,
  Trophy, BookOpen, Clock, Activity, ShieldAlert, Sparkles, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Mock values for stats counters
const initialStats = {
  readers: 4850200,
  published: 44890,
  visitors: 153090,
  active: 1420
};

export default function PremiumSidebar() {
  const [stats, setStats] = useState(initialStats);
  const [isMobile, setIsMobile] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [activeFounderTab, setActiveFounderTab] = useState('message');

  // Accordion open states for mobile view
  const [openSections, setOpenSections] = useState({
    founder: true,
    leadership: false,
    stats: false,
    contact: false,
    follow: false,
    quote: false,
    awards: false,
    liveStats: false,
    ads: false
  });

  // Check window width to adjust layouts
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Fluctuating counters to simulate active readers and real-time news stats
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        readers: prev.readers + Math.floor(Math.random() * 5),
        published: prev.published + (Math.random() > 0.8 ? 1 : 0),
        visitors: prev.visitors + Math.floor(Math.random() * 8),
        active: prev.active + Math.floor(Math.random() * (10 - (-10)) + (-10))
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const toggleSection = (sectionName) => {
    if (!isMobile) return; // Keep all open on desktop
    setOpenSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  // Helper to render Section Wrapper based on Device type (collapsible on mobile)
  const SectionWrapper = ({ id, title, icon: Icon, children }) => {
    const isOpen = !isMobile || openSections[id];
    return (
      <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl overflow-hidden shadow-premium dark:shadow-premiumDark transition-all duration-300 hover:shadow-md text-left">

        {/* Header (clickable on mobile) */}
        <button
          onClick={() => toggleSection(id)}
          disabled={!isMobile}
          className="w-full flex items-center justify-between p-4 border-b border-gray-50 dark:border-neutral-800/80 font-heading font-black text-secondary dark:text-white bg-gray-50/30 dark:bg-neutral-900/10 cursor-pointer lg:cursor-default select-none"
        >
          <span className="flex items-center gap-2 text-sm md:text-base">
            {Icon && <Icon className="w-4.5 h-4.5 text-primary shrink-0" />}
            {title}
          </span>
          {isMobile && (
            <span>
              {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </span>
          )}
        </button>

        {/* Body content */}
        <AnimatePresence initial={false}>
          {isOpen && (
            <motion.div
              initial={isMobile ? { height: 0, opacity: 0 } : false}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-4 flex flex-col gap-4 text-xs md:text-sm">
                {children}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  // Custom Social Button
  const SocialButton = ({ name, colorClass, iconSvg, link }) => (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center justify-between p-2.5 rounded-lg border border-gray-100 dark:border-neutral-800/80 bg-gray-50/50 dark:bg-neutral-900/30 hover:scale-[1.02] hover:-translate-y-0.5 transition-all duration-300 font-bold ${colorClass}`}
    >
      <span className="flex items-center gap-2">
        <span className="w-5 h-5 shrink-0 flex items-center justify-center">
          {iconSvg}
        </span>
        <span className="text-[11px] text-secondary dark:text-gray-300">{name}</span>
      </span>
      <ExternalLink className="w-3.5 h-3.5 text-gray-400 shrink-0" />
    </a>
  );

  return (
    <div className="flex flex-col gap-6 lg:w-[350px] w-full shrink-0 select-none">

      {/* ================= SECTION 1: CHAIRMAN CARD ================= */}
      <SectionWrapper id="founder" title="संस्थापकांचा प्रवास व संदेश" icon={Sparkles}>
        <div className="flex flex-col items-center p-1 text-center">
          {/* Avatar with golden gradient ring */}
          <div className="relative mb-3 flex gap-3 items-center w-full justify-start text-left">
            <div className="relative shrink-0">
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-600 p-[2.5px] shadow-md">
                <img
                  src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=300"
                  alt="मा. डॉ. रावसाहेब सावंत"
                  className="w-full h-full object-cover rounded-full border border-white dark:border-neutral-900"
                />
              </div>
              <span className="absolute bottom-0 right-0 bg-green-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full border border-white">
                LIVE
              </span>
            </div>
            <div>
              <h4 className="font-heading font-black text-sm text-secondary dark:text-white leading-tight">मा. डॉ. रावसाहेब सावंत</h4>
              <span className="text-[10px] text-primary font-bold block">संस्थापक व मुख्य संपादक</span>
              <span className="text-[9px] text-gray-400 font-semibold block mt-0.5">माजी सदस्य, प्रेस कौन्सिल</span>
            </div>
          </div>

          {/* Interactive Navigation Tabs */}
          <div className="flex w-full justify-between border-b border-gray-100 dark:border-neutral-800 text-[10px] font-bold mb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'message', name: 'संदेश' },
              { id: 'journey', name: 'प्रवास' },
              { id: 'social', name: 'कार्य' },
              { id: 'awards', name: 'सन्मान' },
              { id: 'gallery', name: 'गॅलरी' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveFounderTab(tab.id)}
                className={`pb-1.5 px-1 transition-colors relative cursor-pointer ${activeFounderTab === tab.id
                    ? 'text-primary border-b-2 border-primary font-black'
                    : 'text-gray-400 hover:text-secondary'
                  }`}
              >
                {tab.name}
              </button>
            ))}
          </div>

          {/* Tab Contents */}
          <div className="w-full text-left min-h-[140px]">
            {activeFounderTab === 'message' && (
              <div className="flex flex-col gap-3">
                <div className="relative bg-neutral-50 dark:bg-neutral-900/50 p-3 rounded-lg border border-gray-100 dark:border-neutral-800 text-justify text-[11px] leading-relaxed text-gray-600 dark:text-gray-400 font-medium">
                  <Quote className="w-5 h-5 text-primary/10 absolute -top-1 -left-1" />
                  "ईगल न्यूजच्या माध्यमातून आमचे उद्दिष्ट महाराष्ट्राच्या शेवटच्या माणसाचा आवाज बुलंद करणे आहे. निर्भीड आणि निष्पक्ष पत्रकारिता हेच आमचे ब्रीद आहे."
                </div>
                {/* Embedded Video Message placeholder */}
                <div className="relative rounded overflow-hidden aspect-[16/9] bg-black border border-gray-200 dark:border-neutral-800">
                  <img
                    src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=400"
                    alt="Video message preview"
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => setProfileModalOpen(true)}
                      className="bg-primary/95 text-white text-[9px] font-black py-1.5 px-3 rounded-full flex items-center gap-1 hover:scale-105 hover:bg-primary transition-all shadow-md cursor-pointer animate-pulse"
                    >
                      <Play className="w-3.5 h-3.5 fill-white shrink-0" /> व्हिडिओ संदेश पहा
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeFounderTab === 'journey' && (
              <div className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed text-justify flex flex-col gap-2">
                <p>
                  <strong>प्रवास व स्थापना:</strong> पुणे जिल्ह्यातील शेतकरी कुटुंबात जन्मलेल्या डॉ. रावसाहेब सावंतांनी प्रतिकूल परिस्थितीवर मात करत पत्रकारितेचे उच्च शिक्षण पूर्ण केले.
                </p>
                <p>
                  ग्रामीण महाराष्ट्राचा आवाज मुख्य प्रवाहात आणण्यासाठी त्यांनी २०१८ मध्ये <strong>ईगल न्यूज नेटवर्क</strong> ची स्थापना केली. आज हे नेटवर्क ३६ जिल्ह्यांत पसरले आहे.
                </p>
                <button
                  onClick={() => setProfileModalOpen(true)}
                  className="text-[10px] font-bold text-primary hover:underline cursor-pointer"
                >
                  सविस्तर यशोगाथा वाचा →
                </button>
              </div>
            )}

            {activeFounderTab === 'social' && (
              <div className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed flex flex-col gap-2">
                <h5 className="font-bold text-secondary dark:text-white">सामाजिक योगदान:</h5>
                <ul className="list-disc list-inside flex flex-col gap-1.5">
                  <li>दुष्काळग्रस्त भागात पाणी पुरवठा व बंधारे उभारणी.</li>
                  <li>ग्रामीण भागातील १०+ शाळांमध्ये डिजिटल लायब्ररी.</li>
                  <li>दरवर्षी गरजू आणि होतकरू विद्यार्थ्यांना शैक्षणिक शिष्यवृत्ती वितरण.</li>
                  <li>पूरग्रस्तांसाठी 'ईगल न्यूज मदत निधी' द्वारे विशेष मदत.</li>
                </ul>
              </div>
            )}

            {activeFounderTab === 'awards' && (
              <div className="flex flex-col gap-2">
                {[
                  { title: "उत्कृष्ट डिजिटल माध्यम पुरस्कार २०२४", awarder: "महाराष्ट्र शासन" },
                  { title: "निर्भीड पत्रकारिता सुवर्ण सन्मान", awarder: "डिजिटल न्यूज..." }
                ].map((aw, i) => (
                  <div key={i} className="flex gap-2 items-center p-2 bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-800 rounded">
                    <Award className="w-5 h-5 text-accent shrink-0" />
                    <div>
                      <h6 className="font-bold text-[10px] text-secondary dark:text-white leading-tight">{aw.title}</h6>
                      <span className="text-[9px] text-gray-400">{aw.awarder}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeFounderTab === 'gallery' && (
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=150",
                  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=150"
                ].map((src, i) => (
                  <a key={i} href="#" onClick={(e) => { e.preventDefault(); setProfileModalOpen(true); }} className="block overflow-hidden rounded border border-gray-100 dark:border-neutral-800 hover:scale-105 transition-transform duration-300">
                    <img src={src} className="w-full aspect-square object-cover" alt="Founder Action Photo" />
                  </a>
                ))}
              </div>
            )}
          </div>

          <div className="w-full flex gap-2 mt-4 pt-3 border-t border-gray-50 dark:border-neutral-800/80">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded text-center text-xs flex items-center justify-center gap-1 shadow cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white shrink-0" /> WhatsApp संपर्क
            </a>
            <button
              onClick={() => setProfileModalOpen(true)}
              className="flex-1 bg-primary hover:bg-primary-hover text-white font-bold py-2 rounded text-xs hover:shadow transition cursor-pointer"
            >
              यशोगाथा (Story)
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* ================= SECTION 2: EAGLE LEADERSHIP ================= */}
      <SectionWrapper id="leadership" title="ईगल न्यूज नेतृत्व" icon={Users}>
        <div className="flex flex-col gap-3">
          {[
            { role: "संस्थापक", name: "रावसाहेब सावंत", desc: "माजी सदस्य, प्रेस कौन्सिल" },
            { role: "मुख्य संपादक", name: "आनंदराव मोहिते", desc: "२५ वर्षे पत्रकारिता अनुभव" },
            { role: "व्यवस्थापकीय संचालक", name: "स्मिता पाटील", desc: "एमबीए (माध्यम व्यवस्थापन)" },
            { role: "ब्युरो चीफ", name: "विजय कदम", desc: "राजकीय विश्लेषक" }
          ].map((lead, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2.5 bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-800/80 rounded-lg hover:translate-x-1 transition-transform"
            >
              <div className="text-left">
                <span className="text-[9px] uppercase font-bold text-primary block">{lead.role}</span>
                <span className="font-heading font-bold text-xs text-secondary dark:text-white block mt-0.5">{lead.name}</span>
              </div>
              <span className="text-[9px] text-gray-400 font-medium">{lead.desc}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================= SECTION 3: EAGLE NEWS INFO ================= */}
      <SectionWrapper id="stats" title="अधिकृत माहिती" icon={BookOpen}>
        <div className="grid grid-cols-2 gap-3 text-center">
          {[
            { label: "स्थापना वर्ष", value: "२०१८" },
            { label: "रजिस्ट्रेशन आयडी", value: "EN-MAH-99" },
            { label: "एकूण वाचक संख्या", value: `${(stats.readers / 1000000).toFixed(2)} M+` },
            { label: "प्रकाशित बातम्या", value: stats.published.toLocaleString() },
            { label: "जिल्हा कव्हरेज", value: "३६/३६ जिल्हे" },
            { label: "राज्य व्याप्ती", value: "महाराष्ट्र" }
          ].map((item, idx) => (
            <div key={idx} className="bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-850 p-2.5 rounded-lg">
              <span className="text-[9px] text-gray-400 block mb-1 font-bold">{item.label}</span>
              <span className="font-heading font-black text-xs text-secondary dark:text-white block">{item.value}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================= SECTION 4: CONTACT INFO ================= */}
      <SectionWrapper id="contact" title="संपर्क साधा" icon={MapPin}>
        <div className="flex flex-col gap-3 text-left">
          <div className="flex items-start gap-2 text-[11px] text-gray-600 dark:text-gray-400">
            <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <span>२रा मजला, ईगल पॅलेस, सेनापती बापट मार्ग, शिवाजीनगर, पुणे - ४११००५</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
            <Phone className="w-4 h-4 text-primary shrink-0" />
            <span>+९१ ९८७६५ ४३२१०</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 text-primary shrink-0" />
            <span>contact@eaglenews.com</span>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            <a
              href="https://wa.me/919876543210"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 rounded text-center flex items-center justify-center gap-1.5 shadow-md"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" /> WhatsApp
            </a>
            <button
              onClick={() => setMapModalOpen(true)}
              className="bg-primary hover:bg-primary-hover text-white font-bold text-xs py-2 rounded text-center flex items-center justify-center gap-1.5 shadow-md"
            >
              <Globe className="w-3.5 h-3.5" /> Google Map
            </button>
          </div>
        </div>
      </SectionWrapper>

      {/* ================= SECTION 5: FOLLOW CHANNELS ================= */}
      <SectionWrapper id="follow" title="सोशल मीडिया कनेक्ट" icon={Activity}>
        <div className="grid grid-cols-2 gap-2">
          <SocialButton
            name="Facebook"
            colorClass="hover:text-blue-600"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-blue-600">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            }
            link="https://facebook.com/eaglenews"
          />
          <SocialButton
            name="Instagram"
            colorClass="hover:text-pink-600"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-pink-600">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
              </svg>
            }
            link="https://instagram.com/eaglenews"
          />
          <SocialButton
            name="YouTube"
            colorClass="hover:text-red-600"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-red-600">
                <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z" />
                <polygon points="10 15 15 12 10 9" />
              </svg>
            }
            link="https://youtube.com/eaglenews"
          />
          <SocialButton
            name="X (Twitter)"
            colorClass="hover:text-neutral-800 dark:hover:text-white"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-neutral-800 dark:text-white">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
              </svg>
            }
            link="https://x.com/eaglenews"
          />
          <SocialButton
            name="Telegram"
            colorClass="hover:text-sky-500"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-sky-500">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9" />
              </svg>
            }
            link="https://t.me/eaglenews"
          />
          <SocialButton
            name="WhatsApp"
            colorClass="hover:text-green-600"
            iconSvg={
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 text-green-600">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            }
            link="https://whatsapp.com/channel/eaglenews"
          />
        </div>
      </SectionWrapper>

      {/* ================= SECTION 6: EDITORS QUOTE ================= */}
      <SectionWrapper id="quote" title="आजचे संपादकीय मत" icon={Quote}>
        <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-xl p-4 text-justify relative overflow-hidden backdrop-blur-md">
          <Quote className="w-12 h-12 text-primary/5 absolute top-1 left-1" />
          <p className="font-heading font-semibold text-xs md:text-sm text-secondary dark:text-gray-300 leading-relaxed relative z-10 italic">
            "महाराष्ट्राच्या हिताशी तडजोड न करणे, हीच आमची ताकद आहे. लोकशाही बळकट होण्यासाठी जनतेचा आवाज थेट सत्तेपर्यंत पोहोचलाच पाहिजे."
          </p>
          <span className="block text-right text-[10px] text-gray-500 font-bold mt-3">— संपादकीय विभाग, ईगल न्यूज</span>
        </div>
      </SectionWrapper>

      {/* ================= SECTION 7: AWARDS ================= */}
      <SectionWrapper id="awards" title="पुरस्कार व सन्मान" icon={Trophy}>
        <div className="flex flex-col gap-3">
          {[
            { title: "उत्कृष्ट डिजिटल माध्यम पुरस्कार २०२४", awarder: "महाराष्ट्र शासन", year: "२०२४" },
            { title: "निर्भीड पत्रकारिता सुवर्ण सन्मान", awarder: "डिजिटल न्यूज प्रेस असोसिएशन", year: "२०२३" },
            { title: "सर्वोत्कृष्ट मराठी न्यूज चॅनल (वेब)", awarder: "मीडिया वॉच फोरम", year: "२०२२" }
          ].map((aw, idx) => (
            <div key={idx} className="flex gap-3 items-start p-2 border-b border-gray-50 dark:border-neutral-850/50 last:border-0 pb-3 last:pb-0">
              <Trophy className="w-7 h-7 text-accent shrink-0 mt-0.5" />
              <div className="text-left">
                <h5 className="font-bold text-xs text-secondary dark:text-white leading-tight">{aw.title}</h5>
                <span className="text-[10px] text-gray-400 block mt-0.5">{aw.awarder} ({aw.year})</span>
              </div>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================= SECTION 8: LIVE STATISTICS ================= */}
      <SectionWrapper id="liveStats" title="थेट आकडेवारी (Live Stats)" icon={Activity}>
        <div className="flex flex-col gap-3">
          {[
            { label: "सध्याचे वाचक (Active)", value: stats.active.toLocaleString(), color: "text-green-500", highlight: true },
            { label: "आजच्या ताज्या बातम्या", value: "४८", color: "text-secondary dark:text-white", highlight: false },
            { label: "एकूण अभ्यागत (Today)", value: stats.visitors.toLocaleString(), color: "text-primary", highlight: false }
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center p-2 bg-gray-50/50 dark:bg-neutral-900/30 border border-gray-100 dark:border-neutral-800 rounded"
            >
              <span className="text-[10px] text-gray-500 font-bold flex items-center gap-1.5">
                {item.highlight && <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping shrink-0" />}
                {item.label}
              </span>
              <span className={`font-black text-xs ${item.color}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </SectionWrapper>

      {/* ================= SECTION 9: ADVERTISEMENTS ================= */}
      <SectionWrapper id="ads" title="प्रायोजित जाहिरात (Ads)" icon={ShieldAlert}>
        <div className="flex flex-col gap-3">
          <div className="rounded overflow-hidden aspect-[4/3] bg-neutral-900 relative group cursor-pointer border border-neutral-800">
            <img
              src="https://images.unsplash.com/photo-1540910419892-4a36d2c3266c?auto=format&fit=crop&q=80&w=400"
              alt="Premium Ad Banner"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-3 text-left">
              <span className="text-[8px] uppercase tracking-widest text-accent font-bold mb-0.5">Special Promo</span>
              <h5 className="font-heading font-bold text-white text-xs leading-tight">तुमच्या व्यवसायाची जाहिरात आजच करा!</h5>
            </div>
            <span className="absolute top-1 right-1 bg-black/60 text-white text-[7px] font-black px-1 py-0.5 rounded">AD</span>
          </div>
        </div>
      </SectionWrapper>

      {/* Profile Modal */}
      {profileModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-lg w-full relative animate-scaleIn text-left">
            <button
              onClick={() => setProfileModalOpen(false)}
              className="absolute top-4 right-4 bg-primary text-white text-xs font-bold p-2.5 rounded-full"
            >
              बंद करा
            </button>
            <div className="flex gap-4 items-center mb-6">
              <img
                src="https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=150"
                alt="मा. रावसाहेब सावंत"
                className="w-16 h-16 object-cover rounded-full border-2 border-primary"
              />
              <div>
                <h3 className="font-heading font-black text-lg text-secondary dark:text-white">मा. रावसाहेब सावंत</h3>
                <span className="text-xs text-gray-500 font-bold block">Founder & Editor-in-Chief, Eagle News</span>
              </div>
            </div>
            <div className="text-xs md:text-sm text-gray-600 dark:text-gray-300 leading-relaxed flex flex-col gap-3">
              <p>
                रावसाहेब सावंत हे महाराष्ट्रातील पत्रकारिता क्षेत्रातील एक अग्रगण्य आणि आदरणीय व्यक्तिमत्त्व आहेत. गेल्या २५ वर्षांपासून त्यांनी विविध वर्तमानपत्रे, टीव्ही चॅनेल्स आणि डिजिटल माध्यमांमध्ये महत्त्वाचे योगदान दिले आहे.
              </p>
              <p>
                त्यांचा जन्म पुणे जिल्ह्यातील एका शेतकऱ्याच्या घरात झाला. प्रतिकूल परिस्थितीवर मात करत त्यांनी पत्रकारितेचे उच्च शिक्षण पूर्ण केले. पत्रकारितेचा उद्देश केवळ बातम्या देणे नसून लोकशाहीच्या संरक्षणासाठी सत्य बाहेर आणणे आणि शेवटच्या घटकाला न्याय देणे आहे, या विचारावर त्यांचा दृढ विश्वास आहे.
              </p>
              <p>
                २०१८ मध्ये त्यांनी 'ईगल न्यूज नेटवर्क' ची स्थापना केली, ज्याचा उद्देश संपूर्ण महाराष्ट्रात निष्पक्ष आणि गतिमान बातम्यांचे व्यासपीठ निर्माण करणे आहे.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Google Map Modal */}
      {mapModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white dark:bg-neutral-900 border border-gray-100 dark:border-neutral-800 rounded-xl shadow-2xl p-6 md:p-8 max-w-2xl w-full relative animate-scaleIn">
            <button
              onClick={() => setMapModalOpen(false)}
              className="absolute top-4 right-4 bg-primary text-white text-xs font-bold p-2.5 rounded-full z-10"
            >
              बंद करा
            </button>
            <h4 className="font-heading font-black text-sm md:text-base text-secondary dark:text-white mb-4 text-left">आमचे मुख्य कार्यालय (Location Map)</h4>
            <div className="relative aspect-[16/9] w-full bg-neutral-100 dark:bg-neutral-800 rounded overflow-hidden">
              {/* Google Map Mock Embed URL */}
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.9774643797683!2d73.8315206153683!3d18.52988188740417!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2bf9af19d19a7%3A0xe4a199859f5b61e2!2sSenapati%20Bapat%20Rd%2C%20Shivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1685958000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
