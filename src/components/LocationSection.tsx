import React from 'react';

interface LocationSectionProps {
  onToast: (msg: string) => void;
  venueNameAr?: string;
  venueAddress?: string;
  venueMapUrl?: string;
}

export const LocationSection: React.FC<LocationSectionProps> = ({
  onToast,
  venueNameAr = 'قاعة جراند ستار 2',
  venueAddress = 'طريق منقباد — قاعة جراند ستار 2 (52PV+MP)، بني غالب، أسيوط، محافظة أسيوط',
  venueMapUrl = 'https://www.google.com/maps/search/?api=1&query=52PV%2BMP%2C+Bani+Ghaleb%2C+Asyut%2C+Assiut+Governorate',
}) => {
  const handleCopyAddress = () => {
    const fullText = `${venueNameAr} (Grand Star 2) — ${venueAddress}`;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(fullText).then(() => {
        onToast('تم نسخ العنوان: طريق منقباد — قاعة جراند ستار 2 (52PV+MP)');
      }).catch(() => {
        onToast(`العنوان: ${venueAddress}`);
      });
    } else {
      onToast(`العنوان: ${venueAddress}`);
    }
  };

  return (
    <section id="locationSection" className="py-6 sm:py-10">
      <div className="celestial-card side-from-left rounded-3xl p-5 sm:p-10 md:p-12 relative overflow-hidden">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-ui-ar text-amber-300/85 block">عنوان وموقع القاعة بالتفصيل</span>
          <h2 className="font-arabic text-3xl sm:text-5xl font-bold text-amber-100 mt-1">
            طريق منقباد ← {venueNameAr}
          </h2>
          <p className="text-base sm:text-xl text-amber-300 mt-2 font-ui-ar" dir="ltr">
            Manqabad Road → Grand Star 2
          </p>
        </div>

        {/* Visual Route Flow Diagram */}
        <div className="my-6 sm:my-8 p-4 sm:p-7 rounded-2xl bg-slate-950/85 border border-amber-400/35 side-from-right">
          <p className="text-xs sm:text-sm font-ui-ar text-amber-300 text-center mb-5 font-semibold">
            خط السير المباشر للقاعة (حوالي ١٨ دقيقة من وسط مدينة أسيوط)
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Step 1 */}
            <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-400/30 text-center">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-ui-ar font-semibold mb-1">
                الخطوة الأولى
              </span>
              <h3 className="font-arabic text-xl sm:text-2xl font-bold text-amber-100">طريق منقباد</h3>
              <p className="text-xs font-ui-ar text-amber-200/85 mt-1" dir="ltr">
                Manqabad Road
              </p>
              <p className="text-xs font-ui-ar text-slate-300 mt-1">الانطلاق من أسيوط عبر طريق منقباد</p>
            </div>

            {/* Arrow Indicator */}
            <div className="flex flex-col items-center justify-center py-1">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/45 text-xs font-ui-ar text-amber-100 font-semibold">
                  مروراً بطريق منقباد - بني غالب ⬅
                </span>
              </div>
              <p className="font-arabic text-sm text-amber-300/85 mt-1.5">باتجاه بني غالب</p>
            </div>

            {/* Step 2 Destination */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-amber-500/25 to-amber-600/10 border-2 border-amber-400/65 text-center shadow-lg">
              <span className="inline-block px-3 py-0.5 rounded-full bg-amber-400 text-slate-950 font-bold text-xs font-ui-ar mb-1">
                وجهة الفرح
              </span>
              <h3 className="font-arabic text-2xl font-bold text-amber-200">{venueNameAr}</h3>
              <p className="text-xs font-ui-ar text-amber-100 font-semibold mt-0.5" dir="ltr">
                Grand Star 2
              </p>
              <p className="text-xs font-ui-ar text-amber-200/90 mt-1">بني غالب، أسيوط، محافظة أسيوط</p>
            </div>
          </div>
        </div>

        {/* Address and Route Details */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 items-stretch">
          <div className="lg:col-span-7 p-5 sm:p-6 rounded-2xl bg-[#0a0f1d] border border-amber-400/50 flex flex-col justify-between space-y-4 shadow-xl text-right">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-ui-ar font-semibold mb-3">
                <svg className="w-3.5 h-3.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                <span>موقع القاعة على خرائط جوجل</span>
              </div>

              <h3 className="font-arabic text-2xl sm:text-3xl font-bold text-amber-300 leading-snug">
                {venueNameAr} — {venueAddress}
              </h3>

              <p className="text-base sm:text-xl font-semibold text-[#FFFDF9] mt-2 font-ui-ar" dir="ltr">
                52PV+MP, Bani Ghaleb, Asyut, Assiut Governorate
              </p>

              <p className="text-sm font-ui-ar text-amber-50/90 mt-3 leading-relaxed">
                تقع <strong className="text-amber-300">{venueNameAr} (Grand Star 2)</strong> على{' '}
                <strong className="text-white">طريق منقباد</strong> في منطقة{' '}
                <strong className="text-white">بني غالب</strong> بمحافظة أسيوط. يمكنك الضغط على الزر بالأسفل لفتح الموقع مباشرة عبر خرائط جوجل (Google Maps).
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 pt-3">
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto justify-center px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-ui-ar font-bold text-xs sm:text-sm shadow-lg hover:brightness-110 transition flex items-center gap-2"
              >
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>فتح الموقع في خرائط جوجل</span>
              </a>

              <button
                type="button"
                onClick={handleCopyAddress}
                className="w-full sm:w-auto justify-center px-4 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-200 border border-amber-400/50 font-ui-ar font-semibold text-xs sm:text-sm transition flex items-center gap-2"
              >
                <svg className="w-4 h-4 text-amber-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>نسخ العنوان ورمز الموقع</span>
              </button>
            </div>
          </div>

          {/* Route Map SVG */}
          <div className="lg:col-span-5 p-5 rounded-2xl bg-[#0a0f1d] border border-amber-400/50 flex flex-col justify-between relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-ui-ar font-bold text-amber-300 mb-2">
              <span>محافظة أسيوط — بني غالب</span>
              <span className="font-mono text-amber-400" dir="ltr">52PV+MP</span>
            </div>

            <svg viewBox="0 0 320 200" className="w-full h-44 rounded-xl bg-slate-900/95 border border-amber-500/25">
              <g stroke="rgba(212,175,55,0.1)" strokeWidth="1">
                <line x1="0" y1="40" x2="320" y2="40" /><line x1="0" y1="80" x2="320" y2="80" />
                <line x1="0" y1="120" x2="320" y2="120" /><line x1="0" y1="160" x2="320" y2="160" />
                <line x1="60" y1="0" x2="60" y2="200" /><line x1="120" y1="0" x2="120" y2="200" />
                <line x1="180" y1="0" x2="180" y2="200" /><line x1="240" y1="0" x2="240" y2="200" />
              </g>
              <path d="M 290 200 C 260 140, 250 80, 210 0" stroke="rgba(56, 189, 248, 0.22)" strokeWidth="14" fill="none" />
              <path d="M 255 162 Q 185 130 155 105 T 72 48" stroke="#d4af37" strokeWidth="3.5" strokeDasharray="6 4" fill="none" />

              <circle cx="255" cy="162" r="5" fill="#94a3b8" />
              <text x="255" y="184" textAnchor="middle" fill="#cbd5e1" fontSize="11" fontFamily="'Cairo', sans-serif">مدينة أسيوط</text>

              <circle cx="155" cy="105" r="5" fill="#f59e0b" />
              <text x="160" y="90" textAnchor="middle" fill="#fde68a" fontSize="11" fontFamily="'Cairo', sans-serif">طريق منقباد</text>

              <circle cx="72" cy="48" r="14" fill="rgba(212, 175, 55, 0.28)" className="animate-ping" />
              <circle cx="72" cy="48" r="7" fill="#fbbf24" stroke="#ffffff" strokeWidth="2" />
              <text x="135" y="32" textAnchor="middle" fill="#fef08a" fontWeight="bold" fontSize="12" fontFamily="'Cairo', sans-serif">★ قاعة جراند ستار 2</text>
              <text x="135" y="46" textAnchor="middle" fill="#cbd5e1" fontSize="10" fontFamily="sans-serif">52PV+MP Bani Ghaleb</text>
            </svg>

            <div className="mt-3 flex items-center justify-between text-xs font-ui-ar text-slate-300">
              <span>طريق منقباد ← بني غالب، أسيوط</span>
              <a
                href={venueMapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline font-semibold"
              >
                فتح الخريطة ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

