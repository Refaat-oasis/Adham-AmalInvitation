import React, { useEffect, useRef } from 'react';

export const SketchSection: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const createSeededRandom = (seed: number) => {
    let s = seed % 2147483647;
    if (s <= 0) s += 2147483646;
    return () => {
      s = (s * 16807) % 2147483647;
      return (s - 1) / 2147483646;
    };
  };

  const renderPhotorealisticGrandStarSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;
    const rand = createSeededRandom(81915);

    // Helper: Hand-drawn metallic gold & charcoal pencil line
    const pencilLine = (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
      weight = 1.2,
      alpha = 0.75,
      color = '#e6c875',
      passes = 2
    ) => {
      ctx.save();
      ctx.strokeStyle = color;
      for (let p = 0; p < passes; p++) {
        ctx.beginPath();
        ctx.lineWidth = weight * (0.85 + rand() * 0.35);
        ctx.globalAlpha = (alpha / passes) * (0.85 + rand() * 0.3);
        const jx1 = x1 + (rand() - 0.5) * 1.5;
        const jy1 = y1 + (rand() - 0.5) * 1.5;
        const jx2 = x2 + (rand() - 0.5) * 1.5;
        const jy2 = y2 + (rand() - 0.5) * 1.5;
        const mx = (jx1 + jx2) / 2 + (rand() - 0.5) * 2.0;
        const my = (jy1 + jy2) / 2 + (rand() - 0.5) * 2.0;
        ctx.moveTo(jx1, jy1);
        ctx.quadraticCurveTo(mx, my, jx2, jy2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Helper: Realistic Golden-Night Pencil Hatching Region
    const pencilHatchRect = (
      x: number,
      y: number,
      w: number,
      h: number,
      spacing = 5,
      angleDeg = 35,
      alpha = 0.22,
      color = '#d4af37'
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.clip();
      ctx.strokeStyle = color;
      ctx.lineWidth = 0.85;
      const rad = (angleDeg * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const diag = Math.hypot(w, h);
      const cx = x + w / 2;
      const cy = y + h / 2;
      for (let d = -diag; d <= diag; d += spacing) {
        ctx.globalAlpha = alpha * (0.7 + rand() * 0.5);
        const px1 = cx + d * cos - diag * sin;
        const py1 = cy + d * sin + diag * cos;
        const px2 = cx + d * cos + diag * sin;
        const py2 = cy + d * sin - diag * cos;
        ctx.beginPath();
        ctx.moveTo(px1, py1);
        ctx.lineTo(px2, py2);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Helper: Realistic Golden-Illuminated Botanical Leaf with Veins
    const drawRealisticLeaf = (
      x: number,
      y: number,
      length: number,
      angle: number,
      tone: 'light' | 'mid' | 'dark' = 'light'
    ) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      const w = length * 0.44;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.bezierCurveTo(length * 0.3, -w, length * 0.72, -w * 0.85, length, 0);
      ctx.bezierCurveTo(length * 0.72, w * 0.85, length * 0.3, w, 0, 0);
      ctx.closePath();

      if (tone === 'light') {
        const grad = ctx.createLinearGradient(0, -w, length, w);
        grad.addColorStop(0, '#fffdf5');
        grad.addColorStop(0.55, '#f6e3ba');
        grad.addColorStop(1, '#c89d3c');
        ctx.fillStyle = grad;
      } else if (tone === 'mid') {
        const grad = ctx.createLinearGradient(0, -w, length, w);
        grad.addColorStop(0, '#b59448');
        grad.addColorStop(0.6, '#6e5b31');
        grad.addColorStop(1, '#3a301c');
        ctx.fillStyle = grad;
      } else {
        ctx.fillStyle = '#232018';
      }
      ctx.globalAlpha = 0.94;
      ctx.fill();

      // Fine Gold Pencil Outline & Midrib Vein
      ctx.strokeStyle = tone === 'light' ? '#7a5916' : '#d4af37';
      ctx.lineWidth = 1.15;
      ctx.globalAlpha = 0.85;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(2, 0);
      ctx.quadraticCurveTo(length * 0.5, -1.5, length * 0.92, 0);
      ctx.lineWidth = 0.8;
      ctx.stroke();

      for (let v = 0.25; v <= 0.75; v += 0.22) {
        const vx = length * v;
        ctx.beginPath();
        ctx.moveTo(vx, 0);
        ctx.lineTo(vx + length * 0.14, -w * 0.48);
        ctx.moveTo(vx, 0);
        ctx.lineTo(vx + length * 0.14, w * 0.48);
        ctx.lineWidth = 0.55;
        ctx.globalAlpha = 0.5;
        ctx.stroke();
      }
      ctx.restore();
    };

    // Helper: Realistic Golden-Ivory Blossom Cluster with Petals
    const drawFloralCluster = (cx: number, cy: number, radius: number) => {
      ctx.save();
      const shadowGrad = ctx.createRadialGradient(cx, cy + 4, radius * 0.2, cx, cy, radius * 1.35);
      shadowGrad.addColorStop(0, 'rgba(5, 8, 17, 0.75)');
      shadowGrad.addColorStop(1, 'rgba(5, 8, 17, 0)');
      ctx.fillStyle = shadowGrad;
      ctx.beginPath();
      ctx.arc(cx, cy + 4, radius * 1.35, 0, Math.PI * 2);
      ctx.fill();

      const floretCount = Math.floor(radius * 1.15);
      for (let i = 0; i < floretCount; i++) {
        const ang = rand() * Math.PI * 2;
        const dist = Math.sqrt(rand()) * radius * 0.88;
        const fx = cx + Math.cos(ang) * dist;
        const fy = cy + Math.sin(ang) * dist;
        const pr = 4 + rand() * 5.5;

        for (let pet = 0; pet < 4; pet++) {
          const pAng = (pet * Math.PI) / 2 + rand() * 0.4;
          const px = fx + Math.cos(pAng) * (pr * 0.55);
          const py = fy + Math.sin(pAng) * (pr * 0.55);
          ctx.beginPath();
          ctx.arc(px, py, pr * 0.62, 0, Math.PI * 2);
          ctx.fillStyle = dist < radius * 0.45 ? '#fffdf7' : '#f3dca6';
          ctx.globalAlpha = 0.92;
          ctx.fill();
          ctx.strokeStyle = '#8b691e';
          ctx.lineWidth = 0.65;
          ctx.globalAlpha = 0.55;
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(fx, fy, 1.2, 0, Math.PI * 2);
        ctx.fillStyle = '#b48625';
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }
      ctx.restore();
    };

    // ==========================================================
    // STEP 1: DEEP ROYAL NIGHT SKY & GOLDEN CHARCOAL HATCHING
    // ==========================================================
    ctx.clearRect(0, 0, W, H);
    const nightPaperGrad = ctx.createRadialGradient(W * 0.5, H * 0.42, 60, W * 0.5, H * 0.5, W * 0.78);
    nightPaperGrad.addColorStop(0, '#131d33');
    nightPaperGrad.addColorStop(0.6, '#0a101e');
    nightPaperGrad.addColorStop(1, '#050811');
    ctx.fillStyle = nightPaperGrad;
    ctx.fillRect(0, 0, W, H);

    // Deep Starry Night Sky Above the Facade
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(25, 22);
    ctx.lineTo(W - 25, 22);
    ctx.lineTo(W - 25, 452);
    ctx.lineTo(758, 464);
    ctx.lineTo(758, 372);
    ctx.lineTo(342, 372);
    ctx.lineTo(342, 464);
    ctx.lineTo(25, 476);
    ctx.closePath();

    const skyGrad = ctx.createLinearGradient(0, 20, 0, 465);
    skyGrad.addColorStop(0, '#04070f');
    skyGrad.addColorStop(0.6, '#080e1c');
    skyGrad.addColorStop(1, '#121c31');
    ctx.fillStyle = skyGrad;
    ctx.fill();
    ctx.restore();

    // Subtle Golden-Charcoal Cross-Hatching in the Night Sky
    pencilHatchRect(25, 22, W - 50, 445, 7, 34, 0.12, '#d4af37');
    pencilHatchRect(25, 22, W - 50, 445, 8, -42, 0.1, '#94762c');

    // ==========================================================
    // STEP 2: NEOCLASSICAL FACADE OF "GRAND STAR 2" IN NIGHT GOLD
    // ==========================================================
    ctx.save();
    const wallGrad = ctx.createLinearGradient(0, 450, 0, 940);
    wallGrad.addColorStop(0, '#2a2623');
    wallGrad.addColorStop(0.35, '#1d1c21');
    wallGrad.addColorStop(1, '#11131c');
    ctx.fillStyle = wallGrad;
    ctx.fillRect(25, 464, 318, 476);
    ctx.fillRect(757, 450, 318, 490);

    // Central Tower Pediment Body
    const towerGrad = ctx.createLinearGradient(0, 372, 0, 940);
    towerGrad.addColorStop(0, '#332d26');
    towerGrad.addColorStop(0.5, '#222024');
    towerGrad.addColorStop(1, '#13151f');
    ctx.fillStyle = towerGrad;
    ctx.fillRect(334, 372, 432, 568);
    ctx.restore();

    // Architectural Gold Pencil Hatching on Facade Walls
    pencilHatchRect(25, 464, 318, 476, 6, 28, 0.18, '#d4af37');
    pencilHatchRect(757, 450, 318, 490, 6, 28, 0.18, '#d4af37');
    pencilHatchRect(334, 372, 432, 568, 5, -25, 0.22, '#e6c567');

    // Warm Golden Architectural Up-Lights Along Roofline & Cornice
    const spotlightPositions = [
      [110, 472, 85],
      [270, 465, 80],
      [405, 448, 95],
      [695, 448, 95],
      [845, 458, 85],
      [995, 455, 85],
      [205, 555, 75],
      [965, 540, 75],
    ];
    spotlightPositions.forEach(([lx, ly, lr]) => {
      const glow = ctx.createRadialGradient(lx, ly, 4, lx, ly, lr);
      glow.addColorStop(0, 'rgba(255, 248, 210, 0.92)');
      glow.addColorStop(0.4, 'rgba(234, 189, 78, 0.42)');
      glow.addColorStop(1, 'rgba(212, 175, 55, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lx, ly, lr, 0, Math.PI * 2);
      ctx.fill();
    });

    // Central Stepped Entablature / Fluted Cornice Below "GRAND STAR 2"
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(306, 366);
    ctx.lineTo(794, 366);
    ctx.lineTo(768, 444);
    ctx.lineTo(332, 444);
    ctx.closePath();
    const corniceGrad = ctx.createLinearGradient(0, 366, 0, 444);
    corniceGrad.addColorStop(0, '#fff7db');
    corniceGrad.addColorStop(0.22, '#635336');
    corniceGrad.addColorStop(0.6, '#3e3528');
    corniceGrad.addColorStop(1, '#231e19');
    ctx.fillStyle = corniceGrad;
    ctx.fill();
    ctx.restore();

    // Dense Vertical Golden Fluting Grooves Across the Entablature Cornice
    for (let fx = 338; fx <= 762; fx += 8.5) {
      pencilLine(fx, 384, fx, 441, 1.3, 0.72, '#d4af37', 2);
      pencilLine(fx + 2.5, 384, fx + 2.5, 441, 0.8, 0.45, '#110e0b', 1);
    }

    // Crisp Top LED-Lit Golden Cornice Lip & Moulding Lines
    pencilLine(302, 365, 798, 365, 4.0, 0.98, '#fffbeb', 2);
    pencilLine(304, 369, 796, 369, 2.4, 0.9, '#eab308', 2);
    pencilLine(314, 382, 786, 382, 1.6, 0.78, '#d4af37', 2);
    pencilLine(330, 444, 770, 444, 2.6, 0.9, '#facc15', 2);

    // Left & Right Wing Perspective Roof Cornices
    pencilLine(20, 474, 340, 460, 3.6, 0.96, '#fffbeb', 2);
    pencilLine(20, 478, 340, 464, 2.2, 0.85, '#eab308', 2);
    pencilLine(20, 494, 338, 482, 1.5, 0.7, '#d4af37', 2);

    pencilLine(760, 460, W - 20, 446, 3.6, 0.96, '#fffbeb', 2);
    pencilLine(760, 464, W - 20, 450, 2.2, 0.85, '#eab308', 2);
    pencilLine(762, 480, W - 20, 468, 1.5, 0.7, '#d4af37', 2);

    // ==========================================================
    // STEP 3: 3D ILLUMINATED ROOFTOP SIGN "GRAND STAR 2"
    // ==========================================================
    ctx.save();
    ctx.font = "700 68px 'Playfair Display', 'Cormorant Garamond', Georgia, serif";
    ctx.textAlign = 'center';

    // Radiant Golden Halo Glow Around the Illuminated Letters
    ctx.shadowColor = 'rgba(253, 224, 71, 0.95)';
    ctx.shadowBlur = 26;
    ctx.fillStyle = '#fffdf7';
    ctx.fillText('GRAND STAR 2', W * 0.5 - 4, 353);

    // 3D Extruded Side Depth of Letters in Deep Bronze
    ctx.shadowBlur = 0;
    for (let d = 5; d >= 1; d--) {
      ctx.fillStyle = '#5c4314';
      ctx.fillText('GRAND STAR 2', W * 0.5 - 4 + d * 1.1, 353 + d * 0.8);
    }

    // Crisp Glowing Ivory-Gold Face of "GRAND STAR 2"
    ctx.fillStyle = '#fffef7';
    ctx.fillText('GRAND STAR 2', W * 0.5 - 4, 353);
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 1.4;
    ctx.strokeText('GRAND STAR 2', W * 0.5 - 4, 353);
    ctx.restore();

    // ==========================================================
    // STEP 4: CLASSICAL FLUTED CORINTHIAN COLUMNS & WALL MOULDINGS
    // ==========================================================
    const drawCorinthianColumn = (cx: number, topY: number, bottomY: number, colW: number) => {
      const leftX = cx - colW / 2;
      ctx.save();
      const cylGrad = ctx.createLinearGradient(leftX, 0, leftX + colW, 0);
      cylGrad.addColorStop(0, '#1e1a16');
      cylGrad.addColorStop(0.32, '#8b7344');
      cylGrad.addColorStop(0.55, '#d1b571');
      cylGrad.addColorStop(1, '#191613');
      ctx.fillStyle = cylGrad;
      ctx.fillRect(leftX, topY + 34, colW, bottomY - (topY + 34));

      const flutes = 5;
      for (let f = 0; f <= flutes; f++) {
        const fx = leftX + (colW / flutes) * f;
        pencilLine(fx, topY + 34, fx, bottomY, f === 0 || f === flutes ? 1.8 : 1.0, 0.8, '#f6e09e', 2);
      }

      // Ornate Corinthian Capital
      ctx.beginPath();
      ctx.moveTo(leftX - 10, topY);
      ctx.lineTo(leftX + colW + 10, topY);
      ctx.lineTo(leftX + colW, topY + 34);
      ctx.lineTo(leftX, topY + 34);
      ctx.closePath();
      ctx.fillStyle = '#5e4c2c';
      ctx.fill();
      pencilLine(leftX - 10, topY, leftX + colW + 10, topY, 2.2, 0.9, '#fde047', 2);
      pencilLine(leftX, topY + 34, leftX + colW, topY + 34, 1.8, 0.85, '#eab308', 2);

      for (let s = 0; s < 3; s++) {
        const sx = leftX + 6 + s * (colW / 3);
        ctx.beginPath();
        ctx.arc(sx + 4, topY + 14, 6, 0, Math.PI * 1.6);
        ctx.strokeStyle = '#fef08a';
        ctx.lineWidth = 1.3;
        ctx.stroke();
      }
      ctx.restore();
    };

    drawCorinthianColumn(68, 495, 935, 44);
    drawCorinthianColumn(302, 484, 935, 42);
    drawCorinthianColumn(862, 474, 935, 46);
    drawCorinthianColumn(1045, 468, 935, 42);

    // Arched Neoclassical Wall Moulding Frames on Left & Right Wings
    const drawWingArchPanel = (cx: number, topY: number, w: number, bottomY: number) => {
      ctx.save();
      ctx.strokeStyle = '#d4af37';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2, bottomY);
      ctx.lineTo(cx - w / 2, topY + w / 2);
      ctx.arc(cx, topY + w / 2, w / 2, Math.PI, 0, false);
      ctx.lineTo(cx + w / 2, bottomY);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(254, 240, 138, 0.55)';
      ctx.lineWidth = 1.1;
      ctx.beginPath();
      ctx.moveTo(cx - w / 2 + 8, bottomY);
      ctx.lineTo(cx - w / 2 + 8, topY + w / 2);
      ctx.arc(cx, topY + w / 2, w / 2 - 8, Math.PI, 0, false);
      ctx.lineTo(cx + w / 2 - 8, bottomY);
      ctx.stroke();
      ctx.restore();
    };
    drawWingArchPanel(188, 560, 128, 920);
    drawWingArchPanel(955, 548, 128, 920);

    // ==========================================================
    // STEP 5: CENTRAL GRAND ARCHWAY, SPANDREL RELIEFS & ENTRANCE DOORS
    // ==========================================================
    const archCX = W * 0.5;
    const archCY = 635;
    const archR = 176;

    const drawSpandrelRelief = (sign: number) => {
      ctx.save();
      const cornerX = archCX + sign * 184;
      const cornerY = 460;
      ctx.fillStyle = '#473922';
      ctx.strokeStyle = '#facc15';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cornerX, cornerY);
      ctx.lineTo(cornerX - sign * 74, cornerY);
      ctx.quadraticCurveTo(cornerX - sign * 32, cornerY + 32, cornerX, cornerY + 78);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      for (let r = 8; r <= 24; r += 8) {
        ctx.beginPath();
        ctx.arc(cornerX - sign * 24, cornerY + 24, r, 0, Math.PI * 1.4);
        ctx.stroke();
      }
      ctx.restore();
    };
    drawSpandrelRelief(-1);
    drawSpandrelRelief(1);

    // Coffered Recessed Archway Interior (Illuminated Warm Gold)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(archCX - archR, 945);
    ctx.lineTo(archCX - archR, archCY);
    ctx.arc(archCX, archCY, archR, Math.PI, 0, false);
    ctx.lineTo(archCX + archR, 945);
    ctx.closePath();

    const archIntGrad = ctx.createRadialGradient(archCX, archCY - 45, 25, archCX, archCY + 40, archR * 1.3);
    archIntGrad.addColorStop(0, '#fff9e6');
    archIntGrad.addColorStop(0.5, '#8c6f39');
    archIntGrad.addColorStop(1, '#262017');
    ctx.fillStyle = archIntGrad;
    ctx.fill();
    ctx.clip();

    // Recessed Arch Ceiling Spotlights
    for (let a = Math.PI * 1.12; a <= Math.PI * 1.88; a += 0.25) {
      const lx = archCX + Math.cos(a) * (archR - 26);
      const ly = archCY + Math.sin(a) * (archR - 26);
      const lGlow = ctx.createRadialGradient(lx, ly, 2, lx, ly, 28);
      lGlow.addColorStop(0, '#ffffff');
      lGlow.addColorStop(0.5, 'rgba(253, 224, 71, 0.75)');
      lGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
      ctx.fillStyle = lGlow;
      ctx.beginPath();
      ctx.arc(lx, ly, 28, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
      ctx.fillStyle = '#fffdf9';
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.1;
      ctx.stroke();
    }

    // Grand Double Entrance Doors Inside the Archway
    const doorW = 205;
    const doorLeft = archCX - doorW / 2;
    const doorTop = 710;
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(doorLeft, doorTop, doorW, 240);
    pencilHatchRect(doorLeft, doorTop, doorW, 240, 4, 45, 0.35, '#b48625');
    pencilLine(archCX, doorTop, archCX, 945, 2.5, 0.9, '#eab308', 2);

    // Circular Decorative Medallion Above the Entrance Doors
    const medY = 665;
    ctx.beginPath();
    ctx.arc(archCX, medY, 33, 0, Math.PI * 2);
    ctx.fillStyle = '#14110e';
    ctx.fill();
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#facc15';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(archCX, medY, 24, 0, Math.PI * 2);
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.setLineDash([]);

    ctx.beginPath();
    ctx.arc(archCX, medY, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#fef08a';
    ctx.fill();
    ctx.restore();

    // Golden Archway Moulding Rings
    ctx.save();
    [0, 14, 28].forEach((offset, idx) => {
      ctx.beginPath();
      ctx.moveTo(archCX - (archR - offset), 945);
      ctx.lineTo(archCX - (archR - offset), archCY);
      ctx.arc(archCX, archCY, archR - offset, Math.PI, 0, false);
      ctx.lineTo(archCX + (archR - offset), 945);
      ctx.strokeStyle = idx === 0 ? '#fde047' : '#d4af37';
      ctx.lineWidth = idx === 0 ? 3.6 : 1.7;
      ctx.stroke();
    });
    ctx.restore();

    // ==========================================================
    // STEP 6: THREE CASCADING LAYERS OF ILLUMINATED FLORAL WEDDING ARCHES
    // ==========================================================
    const drawFloralArchLayer = (
      archPoints: { x: number; y: number }[],
      thickness: number,
      leafCount: number,
      flowerClusters: [number, number, number][],
      fairyLightCount: number
    ) => {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(archPoints[0].x, archPoints[0].y);
      for (let i = 1; i < archPoints.length; i++) {
        ctx.lineTo(archPoints[i].x, archPoints[i].y);
      }
      ctx.strokeStyle = 'rgba(10, 14, 24, 0.7)';
      ctx.lineWidth = thickness * 1.15;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();

      ctx.strokeStyle = '#fef9c3';
      ctx.lineWidth = 5;
      ctx.shadowColor = '#facc15';
      ctx.shadowBlur = 16;
      ctx.stroke();
      ctx.restore();

      for (let i = 0; i < leafCount; i++) {
        const t = i / leafCount;
        const segIdx = Math.min(archPoints.length - 2, Math.floor(t * (archPoints.length - 1)));
        const segT = t * (archPoints.length - 1) - segIdx;
        const px = archPoints[segIdx].x + (archPoints[segIdx + 1].x - archPoints[segIdx].x) * segT;
        const py = archPoints[segIdx].y + (archPoints[segIdx + 1].y - archPoints[segIdx].y) * segT;

        const spreadX = (rand() - 0.5) * thickness * 1.5;
        const spreadY = (rand() - 0.35) * thickness * 1.4;
        const leafLen = 18 + rand() * 26;
        const leafAng = (rand() - 0.5) * Math.PI * 1.6 + Math.PI * 0.5;
        const tones: ('dark' | 'mid' | 'light' | 'mid')[] = ['dark', 'mid', 'light', 'mid'];
        drawRealisticLeaf(px + spreadX, py + spreadY, leafLen, leafAng, tones[i % 4]);
      }

      flowerClusters.forEach(([fx, fy, fr]) => {
        drawFloralCluster(fx, fy, fr);
      });

      ctx.save();
      for (let i = 0; i < fairyLightCount; i++) {
        const t = rand();
        const segIdx = Math.min(archPoints.length - 2, Math.floor(t * (archPoints.length - 1)));
        const segT = t * (archPoints.length - 1) - segIdx;
        const lx =
          archPoints[segIdx].x +
          (archPoints[segIdx + 1].x - archPoints[segIdx].x) * segT +
          (rand() - 0.5) * thickness * 0.7;
        const ly =
          archPoints[segIdx].y +
          (archPoints[segIdx + 1].y - archPoints[segIdx].y) * segT +
          (rand() - 0.5) * thickness * 0.7;

        const glow = ctx.createRadialGradient(lx, ly, 1, lx, ly, 12);
        glow.addColorStop(0, '#ffffff');
        glow.addColorStop(0.45, 'rgba(254, 240, 138, 0.85)');
        glow.addColorStop(1, 'rgba(250, 204, 21, 0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(lx, ly, 12, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    };

    const innerArchPts = [
      { x: 385, y: 955 },
      { x: 405, y: 845 },
      { x: 550, y: 838 },
      { x: 695, y: 845 },
      { x: 715, y: 955 },
    ];
    drawFloralArchLayer(
      innerArchPts,
      34,
      95,
      [
        [415, 855, 24],
        [550, 840, 28],
        [685, 855, 24],
      ],
      28
    );

    const midArchPts = [
      { x: 235, y: 955 },
      { x: 295, y: 820 },
      { x: 345, y: 745 },
      { x: 550, y: 738 },
      { x: 755, y: 745 },
      { x: 805, y: 820 },
      { x: 865, y: 955 },
    ];
    drawFloralArchLayer(
      midArchPts,
      52,
      180,
      [
        [275, 865, 32],
        [355, 750, 38],
        [465, 742, 34],
        [565, 745, 40],
        [665, 742, 34],
        [755, 752, 38],
        [825, 865, 32],
      ],
      52
    );

    const frontArchPts = [
      { x: 42, y: 850 },
      { x: 135, y: 705 },
      { x: 245, y: 590 },
      { x: 385, y: 556 },
      { x: 550, y: 545 },
      { x: 725, y: 556 },
      { x: 865, y: 592 },
      { x: 975, y: 715 },
      { x: 1058, y: 860 },
    ];
    drawFloralArchLayer(
      frontArchPts,
      78,
      340,
      [
        [95, 765, 36],
        [185, 645, 44],
        [255, 582, 52],
        [375, 558, 48],
        [485, 552, 46],
        [605, 535, 62],
        [725, 558, 48],
        [855, 588, 50],
        [955, 658, 46],
        [1015, 780, 38],
      ],
      82
    );

    // ==========================================================
    // STEP 7: OVERHANGING GOLDEN-ILLUMINATED TREE LEAVES AT THE TOP SKY
    // ==========================================================
    const topBranches = [
      [
        [18, 55],
        [95, 98],
        [182, 148],
      ],
      [
        [285, 18],
        [335, 95],
        [385, 175],
      ],
      [
        [465, 15],
        [495, 120],
        [525, 255],
      ],
      [
        [590, 15],
        [560, 130],
        [538, 285],
      ],
      [
        [725, 15],
        [705, 85],
        [685, 150],
      ],
      [
        [885, 15],
        [935, 68],
        [1025, 108],
      ],
    ];
    topBranches.forEach((pts) => {
      pencilLine(pts[0][0], pts[0][1], pts[1][0], pts[1][1], 2.6, 0.85, '#f6e09e', 2);
      pencilLine(pts[1][0], pts[1][1], pts[2][0], pts[2][1], 1.8, 0.8, '#d4af37', 2);
    });

    const leftTwigLeaves: [number, number, number, number, 'light' | 'mid' | 'dark'][] = [
      [28, 65, 42, 0.45, 'light'],
      [58, 82, 46, 0.65, 'light'],
      [92, 102, 44, 0.35, 'light'],
      [124, 122, 40, 0.55, 'light'],
      [156, 138, 36, 0.4, 'light'],
    ];
    leftTwigLeaves.forEach(([lx, ly, len, ang, tone]) => drawRealisticLeaf(lx, ly, len, ang, tone));

    for (let i = 0; i < 115; i++) {
      const clusterChoice = i % 3;
      let lx: number, ly: number;
      let tone: 'light' | 'mid' | 'dark';
      if (clusterChoice === 0) {
        lx = 240 + rand() * 240;
        ly = 18 + rand() * 155;
        tone = rand() > 0.22 ? 'light' : 'mid';
      } else if (clusterChoice === 1) {
        lx = 435 + rand() * 195;
        ly = 35 + rand() * 245;
        tone = ly > 140 ? (rand() > 0.3 ? 'mid' : 'dark') : 'light';
      } else {
        lx = 640 + rand() * 390;
        ly = 16 + rand() * 115;
        tone = rand() > 0.2 ? 'light' : 'mid';
      }
      const len = 32 + rand() * 26;
      const ang = Math.PI * 0.25 + (rand() - 0.5) * Math.PI * 0.85;
      drawRealisticLeaf(lx, ly, len, ang, tone);
    }

    // ==========================================================
    // STEP 8: GOLDEN BORDER & CALLIGRAPHIC CAPTION
    // ==========================================================
    ctx.save();
    ctx.strokeStyle = 'rgba(212, 175, 55, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.strokeRect(22, 20, W - 44, H - 72);

    ctx.fillStyle = '#fde68a';
    ctx.font = "bold 24px 'Amiri', serif";
    ctx.textAlign = 'center';
    ctx.fillText(
      'قاعة جراند ستار 2 (Grand Star 2) — طريق منقباد، بني غالب، أسيوط • حفل زفاف أدهم و أمل',
      W * 0.5,
      H - 22
    );
    ctx.restore();
  };

  useEffect(() => {
    renderPhotorealisticGrandStarSketch();
  }, []);

  return (
    <section id="sketchSection" className="py-6 sm:py-10">
      <div className="celestial-card rounded-3xl p-4 sm:p-8 md:p-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 text-center md:text-right">
          <div>
            <span className="text-xs font-ui-ar text-amber-300/85 block">لوحة فنية بتظليل ليلي مذهب</span>
            <h2 className="font-arabic text-2xl sm:text-4xl font-bold text-amber-100 mt-0.5">
              اسكتش قاعة الزفاف — «جراند ستار 2»
            </h2>
            <p className="font-arabic text-base sm:text-lg text-amber-200/80 mt-1">
              رسم معماري واقعي بتظليل ليلي مذهب لواجهة قاعة{' '}
              <span dir="ltr" className="font-semibold text-amber-300">
                Grand Star 2
              </span>{' '}
              وأقواس الزهور المضيئة
            </p>
          </div>
        </div>

        {/* GOLDEN NIGHT SHADED ARCHITECTURAL SKETCH CANVAS */}
        <div
          id="venueSketchFrame"
          className="sketch-night-paper rounded-2xl p-2 sm:p-5 relative overflow-hidden transition-all duration-500"
        >
          <div className="border border-amber-400/35 rounded-xl p-1.5 sm:p-3 relative bg-[#070c18]/90">
            <canvas
              ref={canvasRef}
              id="realisticPencilCanvas"
              width={1100}
              height={1020}
              className="w-full h-auto max-h-[720px] mx-auto block rounded-lg shadow-inner"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
