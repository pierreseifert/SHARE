/* Map background tiles + zone visuals — generated SVG.
   These create a believable abstract street map with zone overlays. */

(function(){
  /* Generate a tile-based map background once and inject as data URL. */
  function makeStreetMapSvg(w, h, opts={}) {
    const dark = opts.dark;
    const bgCol = dark ? '#2a2a2a' : '#e8eaed';
    const blockCol = dark ? '#3a3a3a' : '#dadcdf';
    const roadCol = dark ? '#1a1a1a' : '#ffffff';
    const parkCol = dark ? '#2d3a2d' : '#cfe5cb';

    let s = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">`;
    s += `<rect width="${w}" height="${h}" fill="${bgCol}"/>`;

    /* Pseudo-random blocks */
    const seed = (x,y) => {
      const n = Math.sin(x*12.9898 + y*78.233) * 43758.5453;
      return n - Math.floor(n);
    };

    /* Street grid with rotation */
    const rot = -18;
    s += `<g transform="rotate(${rot} ${w/2} ${h/2})">`;

    /* Big blocks */
    const blockW = 90, blockH = 60;
    const cols = Math.ceil(w * 1.6 / blockW);
    const rows = Math.ceil(h * 1.6 / blockH);
    const startX = -w*0.3, startY = -h*0.3;
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * blockW;
        const y = startY + r * blockH;
        const r1 = seed(c, r);
        const r2 = seed(c+1, r+2);
        if (r1 < 0.07) continue; /* gap */
        const inset = 6;
        const fill = r1 > 0.85 ? parkCol : blockCol;
        const ww = blockW - inset - r2 * 8;
        const hh = blockH - inset - r2 * 6;
        s += `<rect x="${x+inset/2}" y="${y+inset/2}" width="${ww}" height="${hh}" fill="${fill}" rx="2"/>`;
      }
    }

    /* Roads (horizontal across rotated grid) */
    s += `<g stroke="${roadCol}" stroke-width="6" fill="none">`;
    for (let r = 0; r < rows + 1; r++) {
      const y = startY + r * blockH;
      s += `<line x1="${-w*0.3}" y1="${y}" x2="${w*1.4}" y2="${y}"/>`;
    }
    for (let c = 0; c < cols + 1; c++) {
      const x = startX + c * blockW;
      s += `<line x1="${x}" y1="${-h*0.3}" x2="${x}" y2="${h*1.4}"/>`;
    }
    s += `</g>`;

    /* A diagonal big road */
    s += `<line x1="${-50}" y1="${h*0.65}" x2="${w+50}" y2="${h*0.45}" stroke="${roadCol}" stroke-width="14"/>`;

    s += `</g></svg>`;
    return s;
  }

  function svgToUrl(s) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent(s);
  }

  window.makeMapBg = function(w, h, opts) {
    return svgToUrl(makeStreetMapSvg(w, h, opts || {}));
  };
})();
