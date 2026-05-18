/* SIXT Share screen components — built to match the existing app pattern
   shown in the reference screenshots: dark bottom sheet, orange accents,
   white pills/buttons, glass top chips. */

const SIXT_ORANGE = '#FF5000';
const SIXT_DARK = '#1A1A1A';
const SIXT_DARK2 = '#272829';
const SIXT_DARK3 = '#313234';

/* ─── Status bar (iOS-ish, dark glyphs over light or white over dark) ─── */
function StatusBar({ dark = false, time = '19:12' }) {
  const c = dark ? '#fff' : '#000';
  return (
    <div style={{ height:44, padding:'0 24px', display:'flex', alignItems:'center', justifyContent:'space-between',
      fontFamily:'-apple-system, system-ui', fontWeight:600, fontSize:15, color:c, position:'relative', zIndex:30 }}>
      <span>{time}</span>
      <div style={{ width:120, height:24 }}/>
      <div style={{ display:'flex', gap:5, alignItems:'center' }}>
        <svg width="17" height="11" viewBox="0 0 17 11"><path d="M1 9.5h2v1.5H1zm3-2h2v3.5H4zm3-2h2v5.5H7zm3-2h2v7.5h-2zm3-2h2v9.5h-2z" fill={c}/></svg>
        <svg width="15" height="11" viewBox="0 0 15 11"><path d="M7.5 2C9.6 2 11.5 2.7 13 4l1-1C12.3 1.5 10 0.5 7.5 0.5S2.7 1.5 1 3l1 1c1.5-1.3 3.4-2 5.5-2zM7.5 5c1.3 0 2.5.4 3.5 1.2l1-1C10.7 4.4 9.2 4 7.5 4S4.3 4.4 3 5.2l1 1C5 5.4 6.2 5 7.5 5zM7.5 8.5l1.5 1.5L7.5 11.5 6 10z" fill={c}/></svg>
        <div style={{ width:24, height:11, border:`1px solid ${c}`, borderRadius:2.5, position:'relative', opacity:0.6 }}>
          <div style={{ position:'absolute', inset:1.5, background:c, borderRadius:1 }}/>
        </div>
      </div>
    </div>
  );
}

/* ─── Top "Points" chip + small action chips ─── */
function TopChips({ topZoneChip = null, onMenu, onProfile }) {
  return (
    <div style={{ position:'absolute', top:48, left:16, right:16, display:'flex', justifyContent:'space-between',
      alignItems:'flex-start', zIndex:20, pointerEvents:'none' }}>
      <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-start', pointerEvents:'auto' }}>
        <div style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 12px',
          borderRadius:999, background:'#fff', boxShadow:'0 2px 8px rgba(0,0,0,.15)',
          fontSize:13, fontWeight:700, color:SIXT_DARK }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <path d="M21 12l-9 9-9-9 9-9 9 9z" fill={SIXT_ORANGE}/>
            <circle cx="7.5" cy="7.5" r="1.2" fill="#fff"/>
          </svg>
          500 Points
        </div>
        {topZoneChip}
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:8, alignItems:'flex-end', pointerEvents:'auto' }}>
        <button onClick={onMenu} style={chipBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="5" r="1.7" fill={SIXT_DARK}/><circle cx="12" cy="12" r="1.7" fill={SIXT_DARK}/><circle cx="12" cy="19" r="1.7" fill={SIXT_DARK}/></svg>
        </button>
        <button onClick={onProfile} style={chipBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.5" stroke={SIXT_DARK} strokeWidth="1.6"/><path d="M5 20c1.5-3.5 4-5 7-5s5.5 1.5 7 5" stroke={SIXT_DARK} strokeWidth="1.6" strokeLinecap="round"/></svg>
        </button>
      </div>
    </div>
  );
}
const chipBtn = { width:36, height:36, borderRadius:18, background:'#fff', border:'none',
  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
  boxShadow:'0 2px 8px rgba(0,0,0,.15)' };

/* ─── Floating right rail (QR + locate) ─── */
function RightRail({ onZonesToggle, zonesOn, onLocate, onHelp }) {
  return (
    <div style={{ position:'absolute', right:14, bottom:240, display:'flex', flexDirection:'column', gap:10, zIndex:8 }}>
      <button onClick={onHelp} style={railBtn} title="Know your zones">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M19 4H5c-1 0-2 1-2 2v12l4-3h12c1 0 2-1 2-2V6c0-1-1-2-2-2z" stroke={SIXT_DARK} strokeWidth="1.7" strokeLinejoin="round"/>
          <text x="12" y="13" textAnchor="middle" fontSize="9" fontWeight="700" fill={SIXT_DARK}>?</text>
        </svg>
      </button>
      <button onClick={onZonesToggle} style={{...railBtn, background: zonesOn? SIXT_DARK : '#fff' }} title="Toggle zones">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2V6z" stroke={zonesOn?'#fff':SIXT_DARK} strokeWidth="1.6" strokeLinejoin="round"/>
          <path d="M9 4v16M15 6v16" stroke={zonesOn?'#fff':SIXT_DARK} strokeWidth="1.6" strokeLinejoin="round"/>
        </svg>
      </button>
      <button onClick={()=>{}} style={railBtn} title="QR">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7" height="7" stroke={SIXT_DARK} strokeWidth="1.7"/>
          <rect x="14" y="3" width="7" height="7" stroke={SIXT_DARK} strokeWidth="1.7"/>
          <rect x="3" y="14" width="7" height="7" stroke={SIXT_DARK} strokeWidth="1.7"/>
          <rect x="14" y="14" width="3" height="3" fill={SIXT_DARK}/>
          <rect x="18" y="18" width="3" height="3" fill={SIXT_DARK}/>
        </svg>
      </button>
      <button onClick={onLocate} style={railBtn}>
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="3.5" stroke={SIXT_DARK} strokeWidth="1.7"/>
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" stroke={SIXT_DARK} strokeWidth="1.7" strokeLinecap="round"/>
        </svg>
      </button>
    </div>
  );
}
const railBtn = { width:42, height:42, borderRadius:21, background:'#fff', border:'none',
  display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer',
  boxShadow:'0 2px 10px rgba(0,0,0,.18)' };

/* ─── Bottom tab bar ─── */
function TabBar({ active = 'Share' }) {
  const tabs = [
    { id:'Rent', icon: (c)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M2 11l3-7h14l3 7v8H2v-8z" stroke={c} strokeWidth="1.7"/></svg>) },
    { id:'Share', icon: (c)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 3h8v2H8zM6 7h12v14H6z" stroke={c} strokeWidth="1.7"/><path d="M9 11h6M9 15h6" stroke={c} strokeWidth="1.5" strokeLinecap="round"/></svg>) },
    { id:'Ride', icon: (c)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="6" r="2.5" stroke={c} strokeWidth="1.7"/><path d="M9 9v5l3 3-2 5M14 13l3-2 4 1" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>) },
    { id:'Subscribe', icon: (c)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke={c} strokeWidth="1.7"/><path d="M12 7v5l3 3" stroke={c} strokeWidth="1.7" strokeLinecap="round"/></svg>) },
    { id:'Charge', icon: (c)=>(<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M13 2L4 14h7l-2 8 9-12h-7l2-8z" stroke={c} strokeWidth="1.7" strokeLinejoin="round"/></svg>) },
  ];
  return (
    <div style={{ display:'flex', justifyContent:'space-around', alignItems:'center', height:64,
      background:'#fff', borderTop:'1px solid #f0f0f0', padding:'4px 8px 0' }}>
      {tabs.map(t => {
        const isActive = t.id === active;
        const c = isActive ? SIXT_ORANGE : SIXT_DARK;
        return (
          <div key={t.id} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:2, cursor:'pointer' }}>
            {t.icon(c)}
            <span style={{ fontSize:10, fontWeight: isActive?700:500, color:c }}>{t.id}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Drag handle for sheets ─── */
function SheetHandle({ light = false }) {
  return (
    <div style={{ display:'flex', justifyContent:'center', padding:'7px 0 4px' }}>
      <div style={{ width:36, height:4, borderRadius:2, background: light? 'rgba(0,0,0,0.18)' : 'rgba(255,255,255,0.3)' }}/>
    </div>
  );
}

Object.assign(window, {
  StatusBar, TopChips, RightRail, TabBar, SheetHandle,
  SIXT_ORANGE, SIXT_DARK, SIXT_DARK2, SIXT_DARK3,
});
