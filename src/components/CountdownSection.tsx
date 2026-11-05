import React, { useState, useEffect } from 'react';

interface CountdownSectionProps {
  initialDate?: string;
  onToast: (msg: string) => void;
}

function getNextMondayAt8PM(): Date {
  const now = new Date();
  const result = new Date(now);
  const currentDay = now.getDay(); // 0 = Sun, 1 = Mon
  let daysUntilMonday = (1 - currentDay + 7) % 7;

  if (daysUntilMonday === 0 && (now.getHours() > 20 || (now.getHours() === 20 && now.getMinutes() > 0))) {
    daysUntilMonday = 7;
  }

  result.setDate(now.getDate() + daysUntilMonday);
  result.setHours(20, 0, 0, 0);
  return result;
}

function formatArabicTargetDate(dateObj: Date): string {
  try {
    const formatted = dateObj.toLocaleDateString('ar-EG', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
    return `${formatted} • ٨:٠٠ مساءً`;
  } catch {
    return 'يوم الإثنين • ٨:٠٠ مساءً';
  }
}

export const CountdownSection: React.FC<CountdownSectionProps> = ({ initialDate, onToast }) => {
  const [targetDate, setTargetDate] = useState<Date>(() => {
    if (initialDate) {
      const parsed = new Date(initialDate);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return getNextMondayAt8PM();
  });

  const [showAdjuster, setShowAdjuster] = useState(false);
  const [customInput, setCustomInput] = useState('');
  const [timeLeft, setTimeLeft] = useState({ days: '00', hours: '00', minutes: '00', seconds: '00', isOver: false });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: '00', hours: '00', minutes: '00', seconds: '00', isOver: true });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / 1000 / 60) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0'),
        isOver: false,
      });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const handleApplyCustomDate = () => {
    if (!customInput) {
      onToast('يرجى اختيار التاريخ أولاً');
      return;
    }
    const newDate = new Date(customInput);
    if (isNaN(newDate.getTime())) {
      onToast('تاريخ غير صالح');
      return;
    }
    setTargetDate(newDate);
    setShowAdjuster(false);
    onToast('تم تحديث موعد العد التنازلي بنجاح');
  };

  const handleResetToMonday = () => {
    setTargetDate(getNextMondayAt8PM());
    setShowAdjuster(false);
    onToast('تم ضبط العداد على يوم الإثنين القادم الساعة ٨:٠٠ مساءً');
  };

  return (
    <section id="countdownSection" className="py-6 sm:py-10">
      <div className="celestial-card rounded-3xl p-5 sm:p-10 md:p-12 text-center relative overflow-hidden">
        <span className="text-xs font-ui-ar text-amber-300/85 block mb-1">العد التنازلي لليلة العمر</span>
        <h2 className="font-arabic text-2xl sm:text-4xl font-bold text-amber-100">
          موعدنا يوم الإثنين القادم • الساعة ٨:٠٠ مساءً
        </h2>
        <p className="font-arabic text-base sm:text-lg text-amber-200/80 mt-1 max-w-xl mx-auto">
          ننتظر تشريفكم ومشاركتكم فرحتنا بحضوركم الكريم
        </p>

        <p className="text-xs font-ui-ar text-amber-400 font-semibold mt-2">
          الموعد المضبوط: <span id="targetDateLabel">{formatArabicTargetDate(targetDate)}</span>
        </p>

        {/* Date Adjuster Toggle */}
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setShowAdjuster(!showAdjuster)}
            className="text-xs font-ui-ar text-amber-300/75 hover:text-amber-200 underline cursor-pointer"
          >
            {showAdjuster ? 'إخفاء ضبط الموعد' : '⚙ تخصيص تاريخ الزفاف'}
          </button>
        </div>

        {/* Collapsible Adjuster Box */}
        {showAdjuster && (
          <div className="mt-4 mb-6 p-4 rounded-2xl bg-slate-900/95 border border-amber-400/40 text-right font-ui-ar text-xs sm:text-sm max-w-md mx-auto">
            <p className="text-amber-200 font-bold mb-2">تعديل موعد حفل الزفاف:</p>
            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="datetime-local"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-400/50 text-amber-100 text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="button"
                onClick={handleApplyCustomDate}
                className="px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition text-xs shrink-0"
              >
                تطبيق
              </button>
              <button
                type="button"
                onClick={handleResetToMonday}
                className="px-3 py-2 rounded-xl bg-slate-800 text-amber-200 hover:bg-slate-700 transition text-xs shrink-0"
              >
                إعادة ضبط
              </button>
            </div>
          </div>
        )}

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mt-6" dir="ltr">
          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-400/35 shadow-inner">
            <div className="gold-foil-text text-3xl sm:text-6xl font-bold font-ui-ar tracking-tight">
              {timeLeft.days}
            </div>
            <span className="text-xs sm:text-sm font-ui-ar text-amber-300/85 font-semibold mt-1 block">أيام</span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-400/35 shadow-inner">
            <div className="gold-foil-text text-3xl sm:text-6xl font-bold font-ui-ar tracking-tight">
              {timeLeft.hours}
            </div>
            <span className="text-xs sm:text-sm font-ui-ar text-amber-300/85 font-semibold mt-1 block">ساعات</span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-400/35 shadow-inner">
            <div className="gold-foil-text text-3xl sm:text-6xl font-bold font-ui-ar tracking-tight">
              {timeLeft.minutes}
            </div>
            <span className="text-xs sm:text-sm font-ui-ar text-amber-300/85 font-semibold mt-1 block">دقائق</span>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl bg-slate-950/80 border border-amber-400/35 shadow-inner">
            <div className="gold-foil-text text-3xl sm:text-6xl font-bold font-ui-ar tracking-tight">
              {timeLeft.seconds}
            </div>
            <span className="text-xs sm:text-sm font-ui-ar text-amber-300/85 font-semibold mt-1 block">ثواني</span>
          </div>
        </div>

        <p className="font-arabic text-amber-300/90 text-sm sm:text-base mt-6">
          {timeLeft.isOver
            ? '✨ الليلة ليلة العمر! نحتفل بزفاف أدهم و أمل في قاعة جراند ستار 2 ✨'
            : 'نعد الساعات واللحظات بشوق لنسعد بلقائكم ومشاركتكم فرحتنا الغالية'}
        </p>
      </div>
    </section>
  );
};

