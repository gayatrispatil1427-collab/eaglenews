import React from 'react';
import { MapPin } from 'lucide-react';

export default function MaharashtraMap({ selectedDistrict, onSelectDistrict }) {
  // District nodes representing their geographical positions in Maharashtra
  const districts = [
    { id: "mumbai", name: "मुंबई", cx: 60, cy: 220, count: 3, color: "#D60000" },
    { id: "pune", name: "पुणे", cx: 120, cy: 270, count: 2, color: "#D60000" },
    { id: "nashik", name: "नाशिक", cx: 110, cy: 150, count: 1, color: "#D60000" },
    { id: "kolhapur", name: "कोल्हापूर", cx: 130, cy: 370, count: 1, color: "#D60000" },
    { id: "nagpur", name: "नागपूर", cx: 480, cy: 110, count: 1, color: "#D60000" },
    { id: "aurangabad", name: "छत्रपती संभाजीनगर", cx: 220, cy: 190, count: 0, color: "#888888" },
    { id: "solapur", name: "सोलापूर", cx: 220, cy: 330, count: 0, color: "#888888" },
    { id: "amravati", name: "अमरावती", cx: 380, cy: 110, count: 0, color: "#888888" },
    { id: "thane", name: "ठाणे", cx: 65, cy: 180, count: 0, color: "#888888" },
    { id: "jalgaon", name: "जळगाव", cx: 210, cy: 100, count: 0, color: "#888888" }
  ];

  return (
    <div className="bg-white dark:bg-brandCard-dark border border-gray-100 dark:border-neutral-800 rounded-xl p-5 shadow-premium dark:shadow-premiumDark relative">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="w-5 h-5 text-primary" />
        <h3 className="font-heading font-black text-lg text-secondary dark:text-white">जिल्ह्यानुसार बातम्या शोधा</h3>
      </div>
      <p className="text-xs text-gray-500 mb-6">
        खालील नकाशातील जिल्ह्यांवर क्लिक करून त्या भागातील महत्त्वाच्या बातम्या जाणून घ्या.
      </p>

      {/* Styled Simplified Geographic Diagram */}
      <div className="relative w-full aspect-[16/10] bg-gray-50 dark:bg-neutral-900 rounded-lg overflow-hidden border border-gray-100 dark:border-neutral-800 flex items-center justify-center p-2">
        <svg viewBox="0 0 540 440" className="w-full h-full max-h-[300px]">
          {/* Abstract land boundaries for stylized Maharashtra */}
          <path 
            d="M 40,240 Q 60,110 160,80 T 260,70 T 360,90 T 480,70 T 520,120 T 480,220 T 440,240 T 340,300 T 240,360 T 150,420 T 90,360 Z" 
            className="fill-gray-100 dark:fill-neutral-800 stroke-gray-200 dark:stroke-neutral-700 stroke-2 transition-all duration-300"
          />

          {/* District Link Lines (connecting regions conceptually) */}
          <line x1="60" y1="220" x2="120" y2="270" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="120" y1="270" x2="130" y2="370" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="110" y1="150" x2="120" y2="270" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="110" y1="150" x2="220" y2="190" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="220" y1="190" x2="220" y2="330" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="220" y1="190" x2="380" y2="110" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />
          <line x1="380" y1="110" x2="480" y2="110" className="stroke-gray-300 dark:stroke-neutral-700 stroke-1 stroke-dasharray-[3,3]" />

          {/* District Interactive Nodes */}
          {districts.map(dist => {
            const isSelected = selectedDistrict === dist.id;
            return (
              <g 
                key={dist.id}
                onClick={() => onSelectDistrict(dist.id === selectedDistrict ? null : dist.id)}
                className="cursor-pointer group"
              >
                {/* Glow ring on hover / selected */}
                <circle 
                  cx={dist.cx} 
                  cy={dist.cy} 
                  r={isSelected ? 16 : 10} 
                  className={`transition-all duration-300 ${isSelected ? 'fill-primary/20 stroke-primary animate-pulse' : 'fill-transparent group-hover:fill-primary/10 stroke-transparent group-hover:stroke-primary/45'}`}
                  strokeWidth="2"
                />

                {/* Inner solid node */}
                <circle 
                  cx={dist.cx} 
                  cy={dist.cy} 
                  r={isSelected ? 7 : 5} 
                  className={`transition-all duration-300 ${isSelected ? 'fill-primary' : dist.count > 0 ? 'fill-primary/80 group-hover:fill-primary' : 'fill-gray-400 dark:fill-neutral-600'}`}
                />

                {/* District Label Text */}
                <text 
                  x={dist.cx} 
                  y={dist.cy - (isSelected ? 18 : 12)}
                  textAnchor="middle"
                  className={`font-heading text-[10px] font-bold transition-all duration-300 ${isSelected ? 'fill-primary scale-110' : 'fill-gray-700 dark:fill-gray-300 group-hover:fill-primary'}`}
                >
                  {dist.name}
                  {dist.count > 0 && ` (${dist.count})`}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Reset Filter Button */}
      {selectedDistrict && (
        <button
          onClick={() => onSelectDistrict(null)}
          className="mt-4 w-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-secondary dark:text-gray-200 font-bold py-1.5 rounded text-xs transition-colors duration-200"
        >
          फिल्टर काढा (सर्व जिल्हे पहा)
        </button>
      )}
    </div>
  );
}
