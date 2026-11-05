import React, { useEffect, useRef } from 'react';

interface CelestialCanvasProps {
  isUnlocked?: boolean;
}

interface Particle {
  x: number;
  y: number;
  size: number;
  vy: number;
  vx: number;
  rotation: number;
  vRot: number;
  alpha: number;
  baseAlpha: number;
  swaySpeed: number;
  swayWidth: number;
  swayOffset: number;
  isLetterA: boolean;
  char: string;
  font: string;
  color: string;
  glow: boolean;
}

export const CelestialCanvas: React.FC<CelestialCanvasProps> = ({ isUnlocked = false }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const isUnlockedRef = useRef(isUnlocked);

  useEffect(() => {
    isUnlockedRef.current = isUnlocked;
  }, [isUnlocked]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const fonts = [
      'italic 400 Great Vibes, cursive',
      'italic 400 Alex Brush, cursive',
      'italic 600 Playfair Display, serif',
      'italic 700 Cormorant Garamond, serif'
    ];

    const goldColors = [
      '#fbe6a2',
      '#ffd700',
      '#f59e0b',
      '#fef08a',
      '#d4af37',
      '#ffffff'
    ];

    const createParticle = (spawnFromTop = false, forceLetterA = false): Particle => {
      const isLetter = forceLetterA || (isUnlockedRef.current ? Math.random() < 0.72 : Math.random() < 0.18);
      const font = fonts[Math.floor(Math.random() * fonts.length)];
      const color = goldColors[Math.floor(Math.random() * goldColors.length)];
      const size = isLetter ? Math.random() * 22 + 14 : Math.random() * 2.8 + 0.8;

      return {
        x: Math.random() * width,
        y: spawnFromTop ? -Math.random() * 120 - 20 : Math.random() * height,
        size,
        vy: isLetter ? Math.random() * 1.8 + 0.85 : Math.random() * 0.6 + 0.25,
        vx: (Math.random() - 0.5) * 0.4,
        rotation: (Math.random() - 0.5) * 0.6,
        vRot: (Math.random() - 0.5) * 0.025,
        alpha: Math.random() * 0.5 + 0.4,
        baseAlpha: Math.random() * 0.4 + 0.45,
        swaySpeed: Math.random() * 0.02 + 0.008,
        swayWidth: Math.random() * 1.8 + 0.6,
        swayOffset: Math.random() * Math.PI * 2,
        isLetterA: isLetter,
        char: isLetter ? (Math.random() < 0.88 ? 'A' : '✦') : '•',
        font,
        color,
        glow: Math.random() < 0.45,
      };
    };

    // Initial population
    const totalCount = isUnlocked ? 95 : 45;
    particlesRef.current = Array.from({ length: totalCount }, (_, i) =>
      createParticle(false, isUnlocked && i < 60)
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const targetCount = isUnlockedRef.current ? 95 : 45;

      // Expand particle count dynamically when unlocked
      while (particles.length < targetCount) {
        particles.push(createParticle(true, isUnlockedRef.current));
      }

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.swayOffset += p.swaySpeed;
        p.x += p.vx + Math.sin(p.swayOffset) * p.swayWidth;
        p.y += p.vy;
        p.rotation += p.vRot;

        // Twinkle effect
        p.alpha = Math.max(0.15, Math.min(1, p.baseAlpha + Math.sin(p.swayOffset * 2) * 0.22));

        // Recycle particle when it goes off screen bottom or sides
        if (p.y > height + 40) {
          particles[i] = createParticle(true, isUnlockedRef.current);
          continue;
        }
        if (p.x < -30) p.x = width + 20;
        if (p.x > width + 30) p.x = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.isLetterA) {
          ctx.font = `${p.size}px ${p.font}`;
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;

          if (p.glow) {
            ctx.shadowColor = 'rgba(251, 191, 36, 0.85)';
            ctx.shadowBlur = 12;
          }

          ctx.fillText(p.char, 0, 0);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = p.alpha;
          if (p.glow) {
            ctx.shadowColor = 'rgba(251, 191, 36, 0.6)';
            ctx.shadowBlur = 6;
          }
          ctx.fill();
        }

        ctx.restore();
      }

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isUnlocked]);

  return <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0" />;
};
