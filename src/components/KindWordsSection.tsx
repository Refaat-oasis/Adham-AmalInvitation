import React, { useState, useEffect } from 'react';
import { GuestMessage } from '../types';
import { fetchGuestMessages, submitGuestMessage } from '../services/api';

interface KindWordsSectionProps {
  slug?: string;
  onToast: (msg: string) => void;
  groomNameAr?: string;
  brideNameAr?: string;
  groomNameEn?: string;
  brideNameEn?: string;
}

const INITIAL_FALLBACK_MESSAGES: GuestMessage[] = [];

export const KindWordsSection: React.FC<KindWordsSectionProps> = ({
  slug = 'adham-amal',
  onToast,
  groomNameAr = 'أدهم',
  brideNameAr = 'أمل',
  groomNameEn = 'Adham',
  brideNameEn = 'Aml',
}) => {
  const [messages, setMessages] = useState<GuestMessage[]>(INITIAL_FALLBACK_MESSAGES);
  const [guestName, setGuestName] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState('سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const NAME_MAX_LENGTH = 60;
  const MESSAGE_MAX_LENGTH = 500;

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);

    fetchGuestMessages(slug)
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setMessages(data);
          }
          setIsLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = guestName.trim();
    const trimmedMsg = message.trim();

    if (!trimmedName) {
      onToast('يرجى إدخال اسمك الكريم');
      return;
    }
    if (!trimmedMsg) {
      onToast('يرجى كتابة رسالة التهنئة للعروسين');
      return;
    }

    // Save previous state for potential rollback
    const previousMessages = [...messages];

    // Optimistic message creation
    const tempId = Date.now();
    const optimisticMessage: GuestMessage = {
      id: tempId,
      invitationId: 1,
      guestName: trimmedName,
      attendanceStatus,
      message: trimmedMsg,
      isApproved: true,
      createdAt: new Date().toISOString(),
    };

    // Optimistic UI update: immediately prepend to state
    setMessages([optimisticMessage, ...previousMessages]);
    setIsSubmitting(true);

    try {
      const result = await submitGuestMessage(slug, {
        guestName: trimmedName,
        attendanceStatus,
        message: trimmedMsg,
      });

      setIsSubmitting(false);

      if (result.success && result.data) {
        // Replace optimistic entry with server response data
        setMessages((curr) =>
          curr.map((m) => (m.id === tempId ? result.data! : m))
        );
        // Clear form only on success
        setGuestName('');
        setMessage('');
        onToast(`شكراً لك يا ${trimmedName}! تم تسجيل تهنئتك للعروسين ${groomNameAr} و ${brideNameAr} ✨`);
      } else {
        // Error rollback: restore previous messages
        setMessages(previousMessages);
        // Preserve form content so guest doesn't lose their message
        onToast(result.error || 'تعذر إرسال التهنئة إلى الخادم، يرجى المحاولة مرة أخرى.');
      }
    } catch {
      setIsSubmitting(false);
      // Error rollback
      setMessages(previousMessages);
      onToast('حدث خطأ أثناء الاتصال بالخادم، لم يتم حفظ الرسالة.');
    }
  };

  const formatTimestamp = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('ar-EG', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <section id="rsvpSection" className="py-6 sm:py-10">
      <div className="celestial-card rounded-3xl p-5 sm:p-10 md:p-12">
        <div className="text-center max-w-xl mx-auto mb-8">
          <span className="text-xs font-ui-ar text-amber-300/85 block">سجل التهاني والمباركات</span>
          <h2 className="font-arabic text-2xl sm:text-4xl font-bold text-amber-100 mt-1">
            اترك تهنئة للعروسين{' '}
            <span className="name-italic-script text-amber-300 text-3xl sm:text-4xl mx-1" dir="ltr">
              {groomNameEn} &amp; {brideNameEn}
            </span>
          </h2>
          <p className="font-arabic text-base sm:text-lg text-amber-200/80 mt-1">
            يسعدنا استقبال كلماتكم الطيبة وتأكيد حضوركم يوم الإثنين الساعة ٨:٠٠ مساءً
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Wishes Form */}
          <form onSubmit={handleSubmit} className="md:col-span-6 space-y-4 font-ui-ar text-right">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-amber-200/90 font-semibold">الاسم الكريم</label>
                <span className="text-[10px] text-amber-400/60 font-mono">
                  {guestName.length}/{NAME_MAX_LENGTH}
                </span>
              </div>
              <input
                type="text"
                required
                maxLength={NAME_MAX_LENGTH}
                value={guestName}
                onChange={(e) => setGuestName(e.target.value)}
                placeholder="مثال: المهندس محمود والعائلة"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-amber-400/40 text-amber-100 text-sm focus:outline-none focus:border-amber-400 transition"
              />
            </div>

            <div>
              <label className="block text-xs text-amber-200/90 mb-1 font-semibold">تأكيد الحضور</label>
              <select
                value={attendanceStatus}
                onChange={(e) => setAttendanceStatus(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-amber-400/40 text-amber-100 text-sm focus:outline-none focus:border-amber-400 transition cursor-pointer"
              >
                <option value="سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨">
                  سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨
                </option>
                <option value="أرسل أجمل التهاني 🤍">
                  أرسل أجمل التهاني والمباركات 🤍
                </option>
              </select>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-amber-200/90 font-semibold">
                  رسالة التهنئة للعروسين {groomNameAr} و{brideNameAr}
                </label>
                <span className="text-[10px] text-amber-400/60 font-mono">
                  {message.length}/{MESSAGE_MAX_LENGTH}
                </span>
              </div>
              <textarea
                rows={3}
                required
                maxLength={MESSAGE_MAX_LENGTH}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="بارك الله لكما وبارك عليكما وجمع بينكما في خير..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950/90 border border-amber-400/40 text-amber-100 text-sm focus:outline-none focus:border-amber-400 transition resize-none leading-relaxed"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-bold text-sm shadow-lg hover:brightness-110 active:scale-[0.99] transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-slate-950" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>جاري تسجيل التهنئة...</span>
                </>
              ) : (
                <span>إرسال التهنئة للعروسين</span>
              )}
            </button>
          </form>

          {/* Live Wishes Feed */}
          <div className="md:col-span-6 flex flex-col justify-between">
            <div id="wishesWall" className="space-y-3 max-h-80 overflow-y-auto pl-1 text-right">
              {isLoading && messages.length === 0 ? (
                <div className="text-center py-12 text-amber-200/70 font-ui-ar text-xs flex flex-col items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-amber-400" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                  </svg>
                  <span>جاري تحميل المباركات...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-12 text-amber-200/60 font-ui-ar text-xs">
                  لا توجد تهاني مسجلة بعد، كن أول المهنئين للعروسين ✨
                </div>
              ) : (
                messages.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950/85 border border-amber-400/30 transition-all duration-500 hover:border-amber-400/50"
                  >
                    <div className="flex items-center justify-between text-xs font-ui-ar text-amber-300">
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{item.guestName}</span>
                        {item.createdAt && (
                          <span className="text-[10px] text-amber-200/50">
                            • {formatTimestamp(item.createdAt)}
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-amber-500/15 border border-amber-400/30 text-amber-200">
                        {item.attendanceStatus || 'سأتشرف بالحضور يوم الإثنين ٨ مساءً ✨'}
                      </span>
                    </div>
                    <p className="font-arabic text-amber-100 text-lg mt-2 leading-relaxed">
                      «{item.message}»
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
