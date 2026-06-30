import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

const Facebook = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
  </svg>
);

const Twitter = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const Youtube = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17z"/>
    <polygon points="10 15 15 12 10 9"/>
  </svg>
);

const Instagram = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-950 text-neutral-700 dark:text-neutral-300 border-t-4 border-primary mt-12">
      {/* Top Banner section */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* Column 1: About */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="bg-primary text-white font-black text-xl px-2.5 py-1 rounded">EAGLE</span>
            <span className="font-heading font-black text-xl text-neutral-900 dark:text-white">ईगल न्यूज</span>
          </div>
          <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
            ईगल न्यूज ही महाराष्ट्राची अग्रगण्य २४x७ डिजिटल न्यूज नेटवर्क वाहिनी आहे. राजकारण, क्रीडा, कृषी, गुन्हेगारी आणि स्थानिक जिल्ह्यांतील ताज्या घडामोडींचे निःपक्षपाती आणि सविस्तर विश्लेषण आम्ही तुमच्यापर्यंत पोहोचवतो.
          </p>
          <div className="flex flex-col gap-2 text-xs text-neutral-600 dark:text-neutral-400 mt-2">
            <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-primary shrink-0" /> मुंबई, महाराष्ट्र, भारत</span>
            <span className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-primary shrink-0" /> +९१ ९८७६५ ४३२१०</span>
            <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-primary shrink-0" /> contact@eaglenews.com</span>
          </div>
        </div>

        {/* Column 2: Categories */}
        <div>
          <h4 className="font-heading font-bold text-neutral-900 dark:text-white text-base border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4">
            मुख्य विभाग
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-xs font-semibold">
            <li><Link to="/?category=maharashtra" className="hover:text-primary transition-colors duration-200">महाराष्ट्र</Link></li>
            <li><Link to="/?category=politics" className="hover:text-primary transition-colors duration-200">राजकारण</Link></li>
            <li><Link to="/?category=crime" className="hover:text-primary transition-colors duration-200">गुन्हेगारी</Link></li>
            <li><Link to="/?category=agriculture" className="hover:text-primary transition-colors duration-200">कृषी</Link></li>
            <li><Link to="/?category=sports" className="hover:text-primary transition-colors duration-200">क्रीडा</Link></li>
            <li><Link to="/?category=education" className="hover:text-primary transition-colors duration-200">शिक्षण</Link></li>
            <li><Link to="/?category=business" className="hover:text-primary transition-colors duration-200">व्यापार</Link></li>
            <li><Link to="/?category=entertainment" className="hover:text-primary transition-colors duration-200">मनोरंजन</Link></li>
            <li><Link to="/?category=technology" className="hover:text-primary transition-colors duration-200">तंत्रज्ञान</Link></li>
            <li><Link to="/?category=health" className="hover:text-primary transition-colors duration-200">आरोग्य</Link></li>
          </ul>
        </div>

        {/* Column 3: District hubs */}
        <div>
          <h4 className="font-heading font-bold text-neutral-900 dark:text-white text-base border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-4">
            स्थानिक जिल्हा बातम्या
          </h4>
          <ul className="grid grid-cols-2 gap-2 text-xs">
            <li><Link to="/?district=mumbai" className="hover:text-primary transition-colors">मुंबई</Link></li>
            <li><Link to="/?district=pune" className="hover:text-primary transition-colors">पुणे</Link></li>
            <li><Link to="/?district=nagpur" className="hover:text-primary transition-colors">नागपूर</Link></li>
            <li><Link to="/?district=nashik" className="hover:text-primary transition-colors">नाशिक</Link></li>
            <li><Link to="/?district=kolhapur" className="hover:text-primary transition-colors">कोल्हापूर</Link></li>
            <li><Link to="/?district=aurangabad" className="hover:text-primary transition-colors">छत्रपती संभाजीनगर</Link></li>
            <li><Link to="/?district=solapur" className="hover:text-primary transition-colors">सोलापूर</Link></li>
            <li><Link to="/?district=thane" className="hover:text-primary transition-colors">ठाणे</Link></li>
          </ul>
        </div>

        {/* Column 4: Newsletter & Apps */}
        <div className="flex flex-col gap-4">
          <h4 className="font-heading font-bold text-neutral-900 dark:text-white text-base border-b border-neutral-200 dark:border-neutral-800 pb-2 mb-2">
            साप्ताहिक ई-पत्रक
          </h4>
          <p className="text-xs text-neutral-600 dark:text-neutral-400">
            महत्त्वाच्या घडामोडींचे साप्ताहिक विश्लेषण थेट तुमच्या ई-मेलवर मिळवा.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ई-मेल प्रविष्ट करा..."
              className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded px-3 py-2 text-xs w-full focus:outline-none focus:border-primary text-neutral-800 dark:text-white"
            />
            <button type="submit" className="bg-primary hover:bg-primary-hover text-white rounded p-2 transition-colors duration-200">
              <Send className="w-4 h-4" />
            </button>
          </form>
          {subscribed && <span className="text-[10px] text-green-500 font-bold">नोंदणी यशस्वी! धन्यवाद.</span>}

          {/* App download placeholders */}
          <div className="mt-2 pt-2 border-t border-neutral-200 dark:border-neutral-800">
            <span className="text-xs font-bold text-neutral-900 dark:text-white block mb-2">मोबाईल ॲप डाउनलोड करा</span>
            <div className="flex gap-2">
              <a href="#" className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block leading-none">GET IT ON</span>
                <span className="text-[10px] font-bold text-neutral-900 dark:text-white leading-none block">Google Play</span>
              </a>
              <a href="#" className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 border border-neutral-200 dark:border-neutral-800 px-3 py-1.5 rounded flex items-center gap-1.5 transition-colors">
                <span className="text-[9px] text-neutral-500 dark:text-neutral-400 block leading-none">Download on</span>
                <span className="text-[10px] font-bold text-neutral-900 dark:text-white leading-none block">App Store</span>
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* Copyright */}
      <div className="bg-neutral-200/50 dark:bg-black/40 text-neutral-600 dark:text-neutral-500 text-xs py-6 px-6 text-center border-t border-neutral-300/50 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© २०२६ ईगल न्यूज नेटवर्क प्रा. लि. सर्व हक्क सुरक्षित.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-neutral-800 dark:hover:text-gray-300 transition-colors">नियम आणि अटी</a>
            <a href="#" className="hover:text-neutral-800 dark:hover:text-gray-300 transition-colors">गोपनीयता धोरण</a>
            <a href="#" className="hover:text-neutral-800 dark:hover:text-gray-300 transition-colors">जाहिरात धोरण</a>
          </div>
          <div className="flex gap-3 text-neutral-500 dark:text-neutral-400">
            <a href="#" className="hover:text-primary"><Facebook className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary"><Twitter className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary"><Youtube className="w-4 h-4" /></a>
            <a href="#" className="hover:text-primary"><Instagram className="w-4 h-4" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
