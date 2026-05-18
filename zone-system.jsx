/* Zone tokens, mini-map renderer + scene data shared by prototype + canvas. */

const ZONE_TYPES_BASE = {
  normal:   { id:'normal',   label:'Standard zone',     short:'Standard',  fee: 0,  fill:'transparent',           stroke:'transparent',     dot:'#1A1A1A', badge:null,   tone:'#1A1A1A' },
  reward:   { id:'reward',   label:'Reward drop-off',   short:'Reward',    fee:-1,  fill:'rgba(34,197,94,0.18)',  stroke:'#22C55E',         dot:'#17783C', badge:'−1 €', tone:'#17783C' },
  charge:   { id:'charge',   label:'Charge drop-off',   short:'Charge',    fee: 1,  fill:'rgba(0,136,255,0.18)',  stroke:'#0088FF',         dot:'#1658C7', badge:'+1 €', tone:'#1658C7' },
  noPark:   { id:'noPark',   label:'No-park zone',      short:'No park',   fee:null,fill:'rgba(141,146,153,0.22)', stroke:'#5B6066',       dot:'#3E4146', badge:'No park', tone:'#3E4146' },
  outside:  { id:'outside',  label:'Outside business',  short:'Outside',   fee:null,fill:'rgba(0,0,0,0.0)',       stroke:'#1A1A1A',         dot:'#1A1A1A', badge:'Outside', tone:'#1A1A1A' },
};
let ZONE_TYPES = { ...ZONE_TYPES_BASE };

/* Hex → rgba helper */
function _hexToRgba(hex, a) {
  const h = hex.replace('#','');
  const r = parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* Apply tweak overrides to ZONE_TYPES (called whenever palette changes). */
function applyZoneColors({ rewardColor, chargeColor }) {
  ZONE_TYPES.reward = { ...ZONE_TYPES_BASE.reward,
    fill:_hexToRgba(rewardColor,0.18), stroke:rewardColor };
  ZONE_TYPES.charge = { ...ZONE_TYPES_BASE.charge,
    fill:_hexToRgba(chargeColor,0.18), stroke:chargeColor };
  window.ZONE_TYPES = ZONE_TYPES;
}

/* Scene: zones in the area around the user. Coordinates in 0..1 of the visible map (which we render at any pixel size). Polygons are arrays of [x,y] in 0..1. */
const ZONE_SCENE = {
  zones: [
    { id:'z1', type:'reward',  poly:[[-0.1,0.62],[0.42,0.55],[0.45,0.95],[-0.1,1.05]] },
    { id:'z2', type:'reward',  poly:[[0.62,-0.1],[1.1,-0.05],[1.12,0.32],[0.66,0.30]] },
    { id:'z3', type:'charge',  poly:[[0.30,0.05],[0.58,0.05],[0.58,0.45],[0.30,0.45]] },
    { id:'z4', type:'noPark',  poly:[[0.78,0.55],[1.35,0.58],[1.35,0.78],[0.80,0.76]] },
    { id:'z5', type:'outside', poly:[[-0.6,-0.6],[0.30,-0.6],[0.30,0.05],[-0.6,0.05]] },
  ],
  /* SIXT stations marked on the map */
  stations: [
    { x:0.22, y:0.78 },
    { x:0.85, y:0.10 },
  ],
  /* Other shared cars in area */
  cars: [
    { x:0.18, y:0.20 },
    { x:0.75, y:0.40 },
    { x:0.55, y:0.85 },
  ],
};

/* SVG polygon path from poly */
function polyPath(poly, w, h){
  return poly.map(([x,y],i)=> (i?'L':'M')+(x*w).toFixed(1)+','+(y*h).toFixed(1)).join(' ')+' Z';
}

/* The main map renderer — draws background tiles, zone overlays, dots etc.
   props: width, height, userPos {x,y}, showZones, focus (zoneId | null) */
function ZoneMap({ width, height, userPos = {x:0.5, y:0.5}, showZones = true, focus = null, dimNonZone = false, dark = false, showCars = true, showStations = true, panTo = null, mapBgUrl = null, hatchOutside = true }) {
  const w = width, h = height;
  /* Compute pan offset so the userPos is centered when panTo is null,
     otherwise center on panTo. We'll just translate the inner svg. */
  const target = panTo || userPos;
  const dx = (0.5 - target.x) * w;
  const dy = (0.5 - target.y) * h;

  return (
    <div style={{ position:'relative', width:w, height:h, overflow:'hidden', background: dark? '#1a1a1a':'#e8eaed' }}>
      {/* Map background image — sized 3× so it always covers the screen even when
          userPos lands near the edges of the scene (e.g. zones 3 and 4). */}
      <div style={{ position:'absolute', left:dx-w*1.0, top:dy-h*1.0, width:w*3, height:h*3,
        backgroundImage:`url("${mapBgUrl || window.makeMapBg(Math.round(w*3), Math.round(h*3), {dark})}")`,
        backgroundSize:'100% 100%' }}/>
      {/* Zone polygons SVG, also translated */}
      {showZones && (
        <svg width={w*3} height={h*3} viewBox={`${-w*0.5} ${-h*0.5} ${w*1.875} ${h*1.875}`} preserveAspectRatio="none"
          style={{ position:'absolute', left:dx-w*1.1, top:dy-h*1.1, width:w*3, height:h*3, pointerEvents:'none' }}>
          <defs>
            <pattern id="hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
              <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(0,0,0,0.35)" strokeWidth="1"/>
            </pattern>
          </defs>
          {ZONE_SCENE.zones.map(z => {
            const t = ZONE_TYPES[z.type];
            const dimmed = focus && focus !== z.id;
            return (
              <g key={z.id} opacity={dimmed?0.35:1}>
                <path d={polyPath(z.poly, w, h)}
                  fill={z.type==='outside' ? (hatchOutside?'url(#hatch)':'rgba(0,0,0,0.18)') : t.fill}
                  stroke={t.stroke} strokeWidth="2" strokeDasharray={z.type==='outside'?'6 4':'0'}/>
              </g>
            );
          })}
        </svg>
      )}
      {/* SIXT stations */}
      {showStations && ZONE_SCENE.stations.map((p,i)=> (
        <div key={'s'+i} style={{ position:'absolute', left:dx + p.x*w - 14, top:dy + p.y*h - 14,
          width:28, height:28, borderRadius:'50%', background:'#1A1A1A', display:'flex',
          alignItems:'center', justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,.3)' }}>
          <span style={{ color:'#fff', fontSize:9, fontWeight:900, letterSpacing:0.3 }}>SIXT</span>
        </div>
      ))}
      {/* Other cars */}
      {showCars && ZONE_SCENE.cars.map((p,i)=> (
        <div key={'c'+i} style={{ position:'absolute', left:dx + p.x*w - 16, top:dy + p.y*h - 18,
          display:'flex', flexDirection:'column', alignItems:'center', filter:'drop-shadow(0 2px 4px rgba(0,0,0,.3))' }}>
          <div style={{ width:32, height:24, background:'#1A1A1A', borderRadius:6, display:'flex',
            alignItems:'center', justifyContent:'center' }}>
            <CarIconSmall color="#fff"/>
          </div>
          <div style={{ width:0, height:0, borderLeft:'4px solid transparent', borderRight:'4px solid transparent',
            borderTop:'5px solid #1A1A1A', marginTop:-1 }}/>
        </div>
      ))}
      {/* Zone summary badges (count or fee) — show at the centroid of each zone */}
      {showZones && ZONE_SCENE.zones.filter(z => ZONE_TYPES[z.type].badge).map(z => {
        const cx = z.poly.reduce((a,p)=>a+p[0],0) / z.poly.length;
        const cy = z.poly.reduce((a,p)=>a+p[1],0) / z.poly.length;
        const t = ZONE_TYPES[z.type];
        const dimmed = focus && focus !== z.id;
        return (
          <div key={'b'+z.id} style={{ position:'absolute', left:dx + cx*w, top:dy + cy*h, transform:'translate(-50%,-50%)',
            opacity: dimmed?0.4:1, pointerEvents:'none' }}>
            <ZoneBadge type={z.type} small/>
          </div>
        );
      })}
      {/* User location pin — orange dot with pulsing halo */}
      <div style={{ position:'absolute', left:w/2-30, top:h/2-60, width:60, height:60, pointerEvents:'none' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:'rgba(255,80,0,0.18)', animation:'zonepulse 2.2s ease-out infinite' }}/>
        <div style={{ position:'absolute', left:30-9, top:30-9, width:18, height:18, borderRadius:'50%',
          background:'#FF5000', boxShadow:'0 0 0 3px #fff, 0 2px 6px rgba(0,0,0,.4)' }}/>
      </div>
      <style>{`@keyframes zonepulse {0%{transform:scale(0.6);opacity:1} 100%{transform:scale(1.6);opacity:0}}`}</style>
    </div>
  );
}

function CarIconSmall({ color = '#1A1A1A', size = 14 }){
  return (
    <svg width={size} height={size*0.7} viewBox="0 0 24 16" fill="none">
      <path d="M2 11V7l2-4h16l2 4v4M2 11h20M5 11v2H3v-2M21 11v2h-2v-2" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function ZoneBadge({ type, small = false }) {
  const t = ZONE_TYPES[type];
  if (!t.badge) return null;
  const isMoney = t.badge.includes('€');
  const bg = type==='reward' ? '#22C55E' : type==='charge' ? '#0088FF' : type==='noPark' ? '#5B6066' : '#1A1A1A';
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:4,
      height: small?20:24, padding:`0 ${small?7:10}px`, borderRadius:999,
      background:bg, color:'#fff', fontWeight:700, fontSize:small?11:13, letterSpacing:0.1,
      boxShadow:'0 2px 6px rgba(0,0,0,.25), 0 0 0 2px #fff' }}>
      {isMoney && <span style={{ opacity:0.9, fontSize: small?9:10 }}>{type==='reward'?'★':'P'}</span>}
      <span>{t.badge}</span>
    </div>
  );
}

/* Compact zone status pill used inside the bottom sheet header. */
function ZoneStatusPill({ type, prominent = false, accent: accentOverride }) {
  const t = ZONE_TYPES[type];
  const defaults = {
    normal:  { accent:'#8D9299' },
    reward:  { accent:'#22C55E' },
    charge:  { accent:'#0088FF' },
    noPark:  { accent:'#A8ADB2' },
    outside: { accent:'#8D9299' },
  }[type];
  const accent = accentOverride || defaults.accent;
  const colors = type === 'normal' || type === 'outside'
    ? { bg:'rgba(255,255,255,0.95)', fg:'#1A1A1A', accent }
    : { bg:'#fff', fg:'#1A1A1A', accent };
  return (
    <div style={{ display:'inline-flex', alignItems:'center', gap:8,
      height:30, padding:'0 12px 0 10px', borderRadius:999, background:colors.bg,
      color:colors.fg, fontSize:12, fontWeight:700, letterSpacing:0.1,
      boxShadow:'0 2px 8px rgba(0,0,0,.15)' }}>
      <span style={{ width:8, height:8, borderRadius:'50%', background:accent }}/>
      <span>{type==='reward'?'Reward zone · −1 €' : type==='charge'?'Charge zone · +1 €' : type==='noPark'?'No-park zone' : type==='outside'?'Outside business area' : 'Standard zone · 0 €'}</span>
    </div>
  );
}

Object.assign(window, { ZONE_TYPES, ZONE_TYPES_BASE, applyZoneColors, ZONE_SCENE, ZoneMap, ZoneBadge, ZoneStatusPill, CarIconSmall });
