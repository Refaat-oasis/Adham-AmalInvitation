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

export const CountdownSection: React.FC<CountdownSectionProps> = ({ initialDate }) => {
  const [targetDate] = useState<Date>(() => {
    if (initialDate) {
      const parsed = new Date(initialDate);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return getNextMondayAt8PM();
  });

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

  return (
    <section id="countdownSection" className="py-6 sm:py-10">
      <div className="celestial-card side-from-right rounded-3xl p-5 sm:p-10 md:p-12 text-center relative overflow-hidden">
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

        {/* 4 Counter Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 max-w-2xl mx-auto mt-6 side-from-left" dir="ltr">
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

