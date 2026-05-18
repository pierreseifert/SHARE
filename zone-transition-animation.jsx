/* Zone Transition Animation
   Demonstrates how the UI adapts when the user crosses zone boundaries during driving.
   The user pin stays at the center of the screen; the map pans underneath it across
   four polygons (standard → charge → reward → no-park) on a continuous loop.

   The driving-screen UI re-skins live: top status pill, sheet edge, sheet callout,
   alternative-banner appearance/disappearance — all driven by the current zone
   inferred from the user's position-in-scene.

   Includes a thin scrubber + play/pause for studio-style review.
*/

const ZTA_DURATION = 24; /* seconds for one full loop */

/* A custom 4-zone scene laid out as a horizontal strip in scene-space (0..1).
   The user moves left to right (and loops) at scene.y = 0.55. We mark each
   "true" zone band along x and infer the active zone from the user x. */
const ZTA_SCENE = {
  /* x ranges along scene */
  bands: [
    { type:'normal',  from: 0.00, to: 0.22, label:'Standard zone' },
    { type:'charge',  from: 0.22, to: 0.46, label:'Charge zone'   },
    { type:'normal',  from: 0.46, to: 0.58, label:'Standard zone' },
    { type:'reward',  from: 0.58, to: 0.82, label:'Reward zone'   },
    { type:'noPark',  from: 0.82, to: 1.00, label:'No-park zone'  },
  ],
  /* Polygon shapes drawn on the map (scene coords). Slightly varied y for organic look. */
  polys: [
    { type:'charge', poly:[[0.22,0.20],[0.46,0.18],[0.46,0.92],[0.22,0.90]] },
    { type:'reward', poly:[[0.58,0.18],[0.82,0.20],[0.82,0.92],[0.58,0.92]] },
    { type:'noPark', poly:[[0.82,0.18],[1.10,0.16],[1.10,0.94],[0.82,0.94]] },
  ],
  cars: [
    { x:0.10, y:0.32 },
    { x:0.34, y:0.78 },
    { x:0.66, y:0.30 },
    { x:0.92, y:0.70 },
  ],
  stations: [
    { x:0.50, y:0.08 },
    { x:0.92, y:0.10 },
  ],
};

function zoneAtX(x) {
  const wrapped = ((x % 1) + 1) % 1;
  for (const b of ZTA_SCENE.bands) {
    if (wrapped >= b.from && wrapped < b.to) return b.type;
  }
  return 'normal';
}

/* The map for the animation — wider than viewport, scrolls with userX */
function ZTAMap({ width, height, userX, rewardColor, chargeColor }) {
  /* Scene total width is 1.4× the viewport so we can scroll. We render the
     whole strip and translate it so userX is centered on screen. */
  const sceneW = width * 4; /* horizontal scene 4× the viewport width */
  const sceneH = height;
  const tx = -(userX * sceneW) + width / 2;

  const bgUrl = window.makeMapBg(Math.round(sceneW), Math.round(sceneH), { dark:false });

  const fillFor = (type) => {
    if (type === 'charge')  return _hexA(chargeColor, 0.22);
    if (type === 'reward')  return _hexA(rewardColor, 0.22);
    if (type === 'noPark')  return 'rgba(141,146,153,0.22)';
    return 'transparent';
  };
  const strokeFor = (type) => {
    if (type === 'charge')  return chargeColor;
    if (type === 'reward')  return rewardColor;
    if (type === 'noPark')  return '#5B6066';
    return 'transparent';
  };

  return (
    <div style={{ position:'absolute', inset:0, overflow:'hidden', background:'#e8eaed' }}>
      <div style={{ position:'absolute', top:0, left:tx, width:sceneW, height:sceneH,
        backgroundImage:`url("${bgUrl}")`, backgroundSize:'100% 100%', transition:'none' }}/>
      <svg width={sceneW} height={sceneH} viewBox={`0 0 ${sceneW} ${sceneH}`}
        style={{ position:'absolute', top:0, left:tx, pointerEvents:'none' }}>
        <defs>
          <pattern id="zta-hatch" width="6" height="6" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="6" stroke="rgba(215,0,21,0.30)" strokeWidth="1"/>
          </pattern>
        </defs>
        {ZTA_SCENE.polys.map((p,i)=> (
          <path key={i}
            d={p.poly.map(([x,y],i)=> (i?'L':'M')+(x*sceneW).toFixed(1)+','+(y*sceneH).toFixed(1)).join(' ')+'Z'}
            fill={p.type==='noPark' ? 'url(#zta-hatch)' : fillFor(p.type)}
            stroke={strokeFor(p.type)}
            strokeWidth="2.5"/>
        ))}
        {/* Zone label tags floating in each band */}
        {ZTA_SCENE.bands.filter(b => b.type !== 'normal').map((b,i) => {
          const cx = ((b.from + b.to)/2) * sceneW;
          const fee = b.type==='charge' ? '+1 €' : b.type==='reward' ? '−1 €' : 'No park';
          const stroke = strokeFor(b.type);
          return (
            <g key={i} transform={`translate(${cx}, ${sceneH*0.55})`}>
              <rect x={-32} y={-13} width={64} height={26} rx={13}
                fill="#fff" stroke={stroke} strokeWidth="2"/>
              <text x={0} y={5} textAnchor="middle" fontSize="12" fontWeight="700"
                fill={stroke}>{fee}</text>
            </g>
          );
        })}
      </svg>
      {/* Stations & cars positioned in scene coords */}
      {ZTA_SCENE.cars.map((c,i)=>(
        <div key={'c'+i} style={{ position:'absolute', top: c.y * sceneH - 18,
          left: tx + c.x * sceneW - 16, display:'flex', flexDirection:'column', alignItems:'center',
          filter:'drop-shadow(0 2px 4px rgba(0,0,0,.3))' }}>
          <div style={{ width:32, height:24, background:'#1A1A1A', borderRadius:6, display:'flex',
            alignItems:'center', justifyContent:'center' }}>
            <CarIconSmall color="#fff"/>
          </div>
          <div style={{ width:0, height:0, borderLeft:'4px solid transparent', borderRight:'4px solid transparent',
            borderTop:'5px solid #1A1A1A', marginTop:-1 }}/>
        </div>
      ))}
      {ZTA_SCENE.stations.map((s,i)=>(
        <div key={'s'+i} style={{ position:'absolute', top: s.y * sceneH - 14,
          left: tx + s.x * sceneW - 14, width:28, height:28, borderRadius:'50%', background:'#1A1A1A',
          display:'flex', alignItems:'center', justifyContent:'center', boxShadow:'0 2px 6px rgba(0,0,0,.3)' }}>
          <span style={{ color:'#fff', fontSize:9, fontWeight:900, letterSpacing:0.3 }}>SIXT</span>
        </div>
      ))}
      {/* User dot fixed at center */}
      <div style={{ position:'absolute', left: width/2 - 30, top: height*0.55 - 30,
        width:60, height:60, pointerEvents:'none' }}>
        <div style={{ position:'absolute', inset:0, borderRadius:'50%',
          background:'rgba(255,80,0,0.18)', animation:'zta-pulse 2.2s ease-out infinite' }}/>
        <div style={{ position:'absolute', left:30-9, top:30-9, width:18, height:18, borderRadius:'50%',
          background:'#FF5000', boxShadow:'0 0 0 3px #fff, 0 2px 6px rgba(0,0,0,.4)' }}/>
      </div>
      <style>{`@keyframes zta-pulse {0%{transform:scale(0.6);opacity:1} 100%{transform:scale(1.6);opacity:0}}`}</style>
    </div>
  );
}

function _hexA(hex, a) {
  const h = hex.replace('#','');
  const r=parseInt(h.slice(0,2),16), g=parseInt(h.slice(2,4),16), b=parseInt(h.slice(4,6),16);
  return `rgba(${r},${g},${b},${a})`;
}

/* Crossing-the-border banner: a slim chip that flies in for ~1.5s when zone changes. */
function CrossingBanner({ from, to, accent }) {
  const labels = {
    normal:'Standard zone', reward:'Reward zone', charge:'Charge zone',
    noPark:'No-park zone', outside:'Outside business',
  };
  const fees  = {
    normal:'0 €', reward:'−1 €', charge:'+1 €', noPark:'No park', outside:'Return at station'
  };
  return (
    <div style={{ position:'absolute', top:96, left:'50%', transform:'translateX(-50%)',
      zIndex:24, display:'flex', alignItems:'center', gap:10,
      background:'#fff', borderRadius:999, padding:'8px 14px 8px 10px',
      boxShadow:'0 10px 30px rgba(0,0,0,.22), 0 0 0 1px rgba(0,0,0,.05)',
      animation:'zta-fly .55s cubic-bezier(.2,.7,.3,1)' }}>
      <span style={{ fontSize:11, fontWeight:600, color:'#8D9299' }}>{labels[from]}</span>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
        <span style={{ width:8, height:8, borderRadius:'50%', background:accent }}/>
        <span style={{ fontSize:12, fontWeight:700, color:'#1A1A1A' }}>{labels[to]}</span>
        <span style={{ fontSize:11, fontWeight:700, color:accent }}>· {fees[to]}</span>
      </span>
      <style>{`@keyframes zta-fly {from{opacity:0; transform:translate(-50%, -8px)} to{opacity:1; transform:translate(-50%, 0)}}`}</style>
    </div>
  );
}

/* Compact bottom sheet that re-skins per zone — same DNA as the live driving sheet
   but tuned for animation legibility (slightly bigger callout). */
function AnimatedSheet({ zone, rewardColor, chargeColor }) {
  const isFee = zone === 'charge';
  const isReward = zone === 'reward';
  const isNoPark = zone === 'noPark';
  const edge = isFee ? chargeColor : isReward ? rewardColor : isNoPark ? '#8D9299' : null;

  return (
    <div style={{ background: SIXT_DARK, borderTopLeftRadius:24, borderTopRightRadius:24,
      color:'#fff', boxShadow:'0 -8px 30px rgba(0,0,0,.35)', overflow:'hidden' }}>
      {edge && <div style={{ height:3, background: edge, transition:'background .35s' }}/>}
      <SheetHandle/>
      <div style={{ padding:'4px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6"/>
            <path d="M12 7v5l3 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/>
          </svg>
          <div>
            <div style={{ fontSize:14, fontWeight:700 }}>06:26</div>
            <div style={{ fontSize:11, color:'#8D9299' }}>Polestar 2 · M-UC 2711</div>
          </div>
        </div>
        <div style={{ width:90, height:36 }}><PolestarMini/></div>
      </div>

      <ZoneCalloutAnim zone={zone} rewardColor={rewardColor} chargeColor={chargeColor}/>

      <div style={{ padding:'14px 16px 18px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <ActionBtn primary disabled={isNoPark} icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8"/><path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}>End Trip</ActionBtn>
        <ActionBtn icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="11" width="12" height="9" rx="1.5" stroke="#fff" strokeWidth="1.7"/><path d="M9 11V7a3 3 0 016 0v4" stroke="#fff" strokeWidth="1.7"/></svg>}>Lock / Unlock</ActionBtn>
      </div>
    </div>
  );
}

function ZoneCalloutAnim({ zone, rewardColor, chargeColor }) {
  const isFee = zone === 'charge', isReward = zone === 'reward', isNoPark = zone === 'noPark';
  if (!isFee && !isReward && !isNoPark) {
    return (
      <div style={{ margin:'12px 20px 0', borderRadius:12, padding:'12px 14px',
        background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.10)',
        display:'flex', alignItems:'flex-start', gap:12 }}>
        <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
          background:'#3A3B3D', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <div style={{ flex:1, fontSize:12, lineHeight:1.4 }}>
          <div style={{ fontWeight:700, color:'#fff', fontSize:13, marginBottom:2 }}>Standard zone</div>
          <div style={{ color:'#C7CACE' }}>End your trip anywhere here at no extra cost.</div>
        </div>
      </div>
    );
  }
  const accent = isFee ? chargeColor : isReward ? rewardColor : '#5B6066';
  const title = isFee ? 'Charge drop-off zone' : isReward ? 'Reward drop-off zone' : 'No-park zone';
  const sub = isFee
    ? 'Ending your trip here adds +1 € to your fare.'
    : isReward
    ? 'End your trip here and we\'ll credit −1 € to your fare.'
    : 'You can drive through but can\'t end your trip here.';
  return (
    <div style={{ margin:'12px 20px 0', borderRadius:12, padding:'12px 14px',
      background: _hexA(accent, 0.12), border:`1px solid ${_hexA(accent, 0.35)}`,
      display:'flex', alignItems:'flex-start', gap:12,
      transition:'background .35s, border-color .35s' }}>
      <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
        background: accent, display:'flex', alignItems:'center', justifyContent:'center' }}>
        {isFee && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 2v20M5 9h14M5 15h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}
        {isReward && <svg width="16" height="16" viewBox="0 0 24 24"><path d="M12 2l2.6 6.5 7 .6-5.3 4.6 1.6 6.8L12 16.8 6.1 20.5l1.6-6.8L2.4 9.1l7-.6L12 2z" fill="#fff"/></svg>}
        {isNoPark && <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 7v6m0 3v0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>}
      </div>
      <div style={{ flex:1, fontSize:12, lineHeight:1.4 }}>
        <div style={{ fontWeight:700, color:'#fff', fontSize:13, marginBottom:2 }}>{title}</div>
        <div style={{ color:'#C7CACE' }}>{sub}</div>
      </div>
    </div>
  );
}

/* Main component: a phone showing the running animation. */
function ZoneTransitionAnimation({ rewardColor = '#22C55E', chargeColor = '#0088FF' }) {
  const [time, setTime] = React.useState(0);
  const [playing, setPlaying] = React.useState(true);
  const rafRef = React.useRef(0);
  const lastRef = React.useRef(performance.now());

  React.useEffect(() => {
    function tick(now) {
      const dt = Math.min(0.1, (now - lastRef.current) / 1000);
      lastRef.current = now;
      if (playing) setTime(t => (t + dt) % ZTA_DURATION);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing]);

  /* userX cycles 0..1 over the duration with a soft ease — pause briefly at each zone center */
  const progress = time / ZTA_DURATION; /* 0..1 */
  /* Use 5 dwell points (centers of normal, charge, normal2, reward, noPark) with smooth easing */
  const dwell = [0.10, 0.34, 0.52, 0.70, 0.91];
  const seg = Math.floor(progress * dwell.length);
  const segP = (progress * dwell.length) % 1;
  const eased = segP < 0.5
    ? 2 * segP * segP
    : 1 - Math.pow(-2 * segP + 2, 2) / 2;
  /* travel from dwell[seg] toward next, but spend ~30% of segment dwelling at end */
  const next = dwell[(seg + 1) % dwell.length];
  const cur = dwell[seg];
  /* Make travel happen in the first 70% of segment, dwell in last 30% */
  const travelP = Math.min(1, eased / 0.7);
  const userX = cur + (next - cur) * (segP < 0.7 ? travelP : 1);

  const zone = zoneAtX(userX);
  const accent = zone === 'charge' ? chargeColor : zone === 'reward' ? rewardColor : zone === 'noPark' ? '#D70015' : '#1A1A1A';

  /* Track previous zone to fire a crossing banner */
  const prevZoneRef = React.useRef(zone);
  const [crossing, setCrossing] = React.useState(null);
  React.useEffect(() => {
    if (zone !== prevZoneRef.current) {
      setCrossing({ from: prevZoneRef.current, to: zone, ts: Date.now() });
      prevZoneRef.current = zone;
      const id = setTimeout(() => setCrossing(c => (c && c.ts === id) ? null : c), 1800);
    }
  }, [zone]);
  /* Auto-clear crossing banner after 1.6s based on time */
  React.useEffect(() => {
    if (!crossing) return;
    const id = setTimeout(() => setCrossing(null), 1800);
    return () => clearTimeout(id);
  }, [crossing]);

  const W = 390, H = 844;

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:12 }}>
      <div style={{
        width: W, height: H, borderRadius: 44, overflow:'hidden', position:'relative',
        background:'#000', boxShadow:'0 0 0 10px #1a1a1a, 0 30px 60px rgba(0,0,0,.25)',
        fontFamily:'"Helvetica Now Text", system-ui, sans-serif',
      }}>
        {/* Dynamic island */}
        <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
          width:120, height:34, borderRadius:20, background:'#000', zIndex:80 }}/>
        {/* Map (animated) */}
        <ZTAMap width={W} height={H-340} userX={userX}
          rewardColor={rewardColor} chargeColor={chargeColor}/>

        {/* Status bar */}
        <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:25 }}>
          <StatusBar dark={false} time="19:12"/>
        </div>

        {/* Top chips with live zone pill */}
        <TopChips
          topZoneChip={
            <div style={{ marginTop:2, transition:'transform .2s' }}>
              <ZoneStatusPill type={zone} accent={accent}/>
            </div>
          }
          onMenu={()=>{}}
        />

        {/* Crossing flying banner */}
        {crossing && <CrossingBanner from={crossing.from} to={crossing.to} accent={accent}/>}

        {/* Bottom sheet (animated) */}
        <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:10 }}>
          <AnimatedSheet zone={zone} rewardColor={rewardColor} chargeColor={chargeColor}/>
        </div>

        {/* Home indicator */}
        <div style={{ position:'absolute', bottom:6, left:0, right:0, display:'flex', justifyContent:'center', zIndex:90, pointerEvents:'none' }}>
          <div style={{ width:130, height:5, borderRadius:3, background:'rgba(0,0,0,0.5)' }}/>
        </div>
      </div>

      {/* Scrubber */}
      <div style={{ width: W, background:'#fff', borderRadius:14, padding:'10px 12px',
        boxShadow:'0 6px 24px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)',
        display:'flex', flexDirection:'column', gap:8 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <button onClick={()=>setPlaying(p=>!p)} style={{
            width:32, height:32, borderRadius:'50%', background:'#1A1A1A',
            border:'none', color:'#fff', cursor:'pointer',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            {playing
              ? <svg width="12" height="12" viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" fill="#fff"/><rect x="14" y="5" width="4" height="14" fill="#fff"/></svg>
              : <svg width="12" height="12" viewBox="0 0 24 24"><path d="M6 4l14 8-14 8z" fill="#fff"/></svg>}
          </button>
          <div style={{ flex:1, position:'relative', height:26, display:'flex', alignItems:'center' }}>
            {/* Track with band coloring */}
            <div style={{ position:'absolute', left:0, right:0, top:11, height:6, borderRadius:3, overflow:'hidden', display:'flex' }}>
              {ZTA_SCENE.bands.map((b,i)=>{
                const bg = b.type==='charge' ? chargeColor : b.type==='reward' ? rewardColor : b.type==='noPark' ? '#D70015' : '#E9EBEE';
                return <div key={i} style={{ flex: b.to - b.from, background: bg }}/>;
              })}
            </div>
            {/* Scrub input */}
            <input type="range" min="0" max="1000" step="1"
              value={Math.round((time/ZTA_DURATION)*1000)}
              onChange={e=>{ setPlaying(false); setTime((+e.target.value/1000)*ZTA_DURATION); }}
              style={{ position:'absolute', left:0, right:0, width:'100%', appearance:'none',
                background:'transparent', height:26, cursor:'pointer', margin:0 }}/>
            {/* Thumb pos overlay */}
            <div style={{ position:'absolute', left:`calc(${(userX*100).toFixed(2)}% - 7px)`, top:6,
              width:14, height:14, borderRadius:'50%', background:'#fff',
              border:'2px solid #1A1A1A', boxShadow:'0 2px 6px rgba(0,0,0,.25)', pointerEvents:'none' }}/>
          </div>
          <div style={{ fontSize:11, fontWeight:700, color:'#656A6F', minWidth:60, textAlign:'right' }}>
            {time.toFixed(1)} / {ZTA_DURATION}s
          </div>
        </div>
        <div style={{ fontSize:11, color:'#656A6F', display:'flex', justifyContent:'space-between', padding:'0 4px' }}>
          <span style={{ display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ width:8, height:8, borderRadius:2, background: accent }}/>
            <b style={{ color:'#1A1A1A' }}>{zone === 'normal' ? 'Standard' : zone === 'charge' ? 'Charge' : zone === 'reward' ? 'Reward' : 'No-park'} zone</b>
          </span>
          <span>Drag to scrub · click to play/pause</span>
        </div>
      </div>
    </div>
  );
}

Object.assign(window, { ZoneTransitionAnimation });

/* Hide native range thumb (we draw our own) */
(function injectStyle(){
  if (document.getElementById('zta-style')) return;
  const s = document.createElement('style');
  s.id = 'zta-style';
  s.textContent = `
    input[type=range]::-webkit-slider-thumb { appearance:none; width:0; height:0; }
    input[type=range]::-moz-range-thumb { width:0; height:0; border:0; }
    input[type=range]::-webkit-slider-runnable-track { background:transparent; height:6px; }
  `;
  document.head.appendChild(s);
})();
