import React from 'react';

interface HeroSectionProps {
  groomNameAr?: string;
  groomNameEn?: string;
  brideNameAr?: string;
  brideNameEn?: string;
  eventDateText?: string;
  venueNameAr?: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  groomNameAr = 'أدهم',
  groomNameEn = 'Adham',
  brideNameAr = 'أمل',
  brideNameEn = 'Aml',
}) => {
  return (
    <section id="heroSection" className="min-h-[80vh] flex flex-col items-center justify-center text-center py-6 sm:py-10 relative">
      <div className="w-full max-w-3xl mx-auto celestial-card rounded-t-[130px] sm:rounded-t-[240px] rounded-b-3xl p-5 sm:p-10 md:p-14 border-2 border-amber-400/50 relative overflow-hidden">
        {/* Quranic Verse & Blessing */}
        <div className="reveal-item delay-100">
          <p className="font-arabic text-amber-300 text-lg sm:text-2xl mb-2 tracking-wide">
            بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
          </p>
          <p className="font-arabic text-amber-100/95 text-sm sm:text-lg leading-relaxed max-w-xl mx-auto mb-4">
            ﴿ وَمِنْ آيَاتِهِ أَنْ خَلَقَ لَكُم مِّنْ أَنفُسِكُمْ أَزْوَاجًا لِّتَسْكُنُوا إِلَيْهَا وَجَعَلَ بَيْنَكُم مَّوَدَّةً وَرَحْمَةً ﴾
          </p>
          <div className="flex items-center justify-center gap-3 my-3">
            <span className="h-px w-10 sm:w-20 bg-gradient-to-l from-transparent to-amber-400" />
            <span className="text-amber-300 text-xs sm:text-sm font-ui-ar font-semibold tracking-wider">
              دعوة زفاف مباركة
            </span>
            <span className="h-px w-10 sm:w-20 bg-gradient-to-r from-transparent to-amber-400" />
          </div>
        </div>

        {/* THE TWO NAMES LOCKED IN CALLIGRAPHIC SCRIPT ITALIC ("Adham" & "Aml") */}
        <div className="reveal-item delay-200 my-4 sm:my-8 py-2 relative">
          {/* Name 1: Adham */}
          <h1
            id="groomNameDisplay"
            className="name-italic-script gold-foil-text text-6xl sm:text-8xl md:text-9xl leading-none select-all py-1"
            dir="ltr"
          >
            {groomNameEn}
          </h1>

          {/* Ornate Divider */}
          <div className="flex items-center justify-center gap-3 sm:gap-4 my-1 sm:my-2" dir="ltr">
            <svg className="w-14 sm:w-28 h-5 text-amber-400/60" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 C30 2, 60 18, 90 10 C105 6, 115 10, 120 10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
            <span className="name-italic-script text-4xl sm:text-6xl text-amber-300 px-2 drop-shadow">
              &amp;
            </span>
            <svg
              className="w-14 sm:w-28 h-5 text-amber-400/60 transform scale-x-[-1]"
              viewBox="0 0 120 20"
              fill="none"
            >
              <path d="M0 10 C30 2, 60 18, 90 10 C105 6, 115 10, 120 10" stroke="currentColor" strokeWidth="1.5" />
            </svg>
          </div>

          {/* Name 2: Aml */}
          <h1
            id="brideNameDisplay"
            className="name-italic-script gold-foil-text text-6xl sm:text-8xl md:text-9xl leading-none select-all py-1"
            dir="ltr"
          >
            {brideNameEn}
          </h1>

          {/* Arabic Calligraphic Names */}
          <p className="font-ruqaa text-2xl sm:text-4xl text-amber-200 mt-3 tracking-wide">
            {groomNameAr} <span className="text-amber-400 mx-2">♡</span> {brideNameAr}
          </p>

          {/* Lowercase Calligraphic Script Preview ("adham & aml") */}
          <p className="name-italic-script text-amber-300/95 text-2xl sm:text-3xl mt-1" dir="ltr">
            {groomNameEn.toLowerCase()} &amp; {brideNameEn.toLowerCase()}
          </p>
        </div>

        {/* Arabic Invitation Wording */}
        <div className="reveal-item delay-300 max-w-xl mx-auto space-y-2.5 px-2">
          <p className="font-arabic text-xl sm:text-2xl text-amber-100 leading-relaxed">
            تتعالى الأصوات وتمتزج العبارات وتتحرك الأنامل لتخط كلمات الحب والفرح..
            يتشرف <strong className="text-amber-300">{groomNameAr}</strong> و <strong className="text-amber-300">{brideNameAr}</strong> بدعوتكم لحضور حفل زفافهما المبارك ومشاركتهما أجمل ليالي العمر
          </p>
        </div>

        {/* Quick Event Summary Badges in Arabic */}
        <div className="reveal-item delay-400 mt-7 pt-7 border-t border-amber-500/25 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 text-center">
          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-400/25">
            <p className="text-xs font-ui-ar text-amber-300/90">الموعد</p>
            <p className="font-arabic text-xl sm:text-2xl font-bold text-amber-100 mt-0.5">يوم الإثنين • ٨:٠٠ مساءً</p>
            <p className="text-xs font-ui-ar text-amber-200/75 mt-0.5">الساعة الثامنة مساءً</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/15 border border-amber-400/45">
            <p className="text-xs font-ui-ar text-amber-300/90">القاعة</p>
            <p className="font-arabic text-xl sm:text-2xl font-bold text-amber-200 mt-0.5">قاعة جراند ستار 2</p>
            <p className="text-xs font-ui-ar text-amber-200/85 mt-0.5" dir="ltr">
              Grand Star 2
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-400/25">
            <p className="text-xs font-ui-ar text-amber-300/90">المكان والطريق</p>
            <p className="font-arabic text-xl sm:text-2xl font-bold text-amber-100 mt-0.5">طريق منقباد ← بني غالب</p>
            <p className="text-xs font-ui-ar text-amber-200/75 mt-0.5">أسيوط — محافظة أسيوط</p>
          </div>
        </div>
      </div>
    </section>
  );
};
