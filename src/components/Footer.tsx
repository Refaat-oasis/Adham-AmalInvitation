import React from 'react';

interface FooterProps {
  groomNameAr?: string;
  brideNameAr?: string;
  groomNameEn?: string;
  brideNameEn?: string;
  venueNameAr?: string;
}

export const Footer: React.FC<FooterProps> = ({
  groomNameAr = 'أدهم',
  brideNameAr = 'أمل',
  groomNameEn = 'Adham',
  brideNameEn = 'Aml',
  venueNameAr = 'قاعة جراند ستار 2',
}) => {
  return (
    <footer className="text-center pt-10 pb-16 text-amber-200/70">
      <div className="name-italic-script gold-foil-text text-4xl sm:text-5xl mb-2" dir="ltr">
        {groomNameEn} &amp; {brideNameEn}
      </div>
      <p className="font-arabic text-lg text-amber-200 mb-1">
        {groomNameAr} ♡ {brideNameAr}
      </p>
      <p className="text-xs font-ui-ar text-amber-300/75">
        يوم الإثنين • الساعة ٨:٠٠ مساءً • طريق منقباد ← {venueNameAr} • بني غالب، أسيوط
      </p>
    </footer>
  );
};

