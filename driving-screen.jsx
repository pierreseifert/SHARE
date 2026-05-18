/* Driving screen — main "in-rental" view.
   Uses ZoneMap as background and a dark bottom sheet that adapts based on the current zone.
   Props:
     zone: 'normal' | 'reward' | 'charge' | 'noPark' | 'outside'
     zonesVisible: bool — whether map zone overlays are drawn
     onEndTrip, onZonesToggle, onShowZonesInfo, onShowAlternative
     showAlternativeBanner: bool — show the "−1 € spot 200m away" suggestion
*/

function DrivingScreen({
  zone = 'normal',
  zonesVisible = true,
  warningIntensity = 'adaptive',  /* 'subtle' | 'adaptive' | 'prominent' */
  showAlternativeBanner = true,
  rewardColor = '#22C55E',
  chargeColor = '#0088FF',
  onEndTrip = ()=>{},
  onZonesToggle = ()=>{},
  onShowZonesInfo = ()=>{},
  onShowAlternative = ()=>{},
  onMenu = ()=>{},
  showSheet = true,
  width = 402,
  height = 844,
  userPos,
}){
  const t = ZONE_TYPES[zone];

  /* Charge-zone banner can be dismissed by tapping it; resets when zone changes. */
  const [chargeBannerDismissed, setChargeBannerDismissed] = React.useState(false);
  React.useEffect(() => { setChargeBannerDismissed(false); }, [zone]);

  /* Decide how prominent the chip is. */
  const isFee = zone === 'charge';
  const isReward = zone === 'reward';
  const isWarn = zone === 'noPark' || zone === 'outside';
  const isProminent = warningIntensity === 'prominent';
  const elevated = isProminent || (warningIntensity === 'adaptive' && (isFee || isWarn || isReward));
  const accent = isFee ? chargeColor : isReward ? rewardColor : isWarn ? '#8D9299' : '#1A1A1A';

  const userPosResolved = userPos || { x: 0.5, y: 0.5 };

  return (
    <div style={{ position:'relative', width, height, overflow:'hidden', background:'#000', fontFamily:'"Helvetica Now Text", system-ui, sans-serif' }}>
      {/* Map */}
      <div style={{ position:'absolute', inset:0 }}>
        <ZoneMap width={width} height={height} userPos={userPosResolved} showZones={zonesVisible} />
      </div>

      {/* Top status bar */}
      <div style={{ position:'absolute', top:0, left:0, right:0, zIndex:25 }}>
        <StatusBar dark={false} time="19:12"/>
      </div>

      {/* Top chips with optional zone status pill below the points chip.
          In prominent mode the top zone chip becomes a full-width banner instead. */}
      <TopChips
        topZoneChip={!isProminent ? <div style={{ marginTop:2 }}><ZoneStatusPill type={zone} accent={accent}/></div> : null}
        onMenu={onMenu}
      />

      {/* Prominent mode: full-width zone banner under status bar */}
      {isProminent && (
        <ProminentZoneBanner zone={zone} accent={accent}/>
      )}

      {/* Right rail */}
      <RightRail zonesOn={zonesVisible} onZonesToggle={onZonesToggle} onHelp={onShowZonesInfo}/>

      {/* Alternative-zone suggestion — visible whenever in a charge zone & user opts in.
          Sits above the bottom sheet. White card with green check + arrow. */}
      {isFee && showAlternativeBanner && !chargeBannerDismissed && (
        <button onClick={isFee ? () => setChargeBannerDismissed(true) : onShowAlternative} style={{
          position:'absolute', left:14, right:14,
          bottom: showSheet ? (isProminent ? 290 : elevated ? 350 : 270) : 60,
          zIndex:15,
          background:'#fff', border:'none', borderRadius:14, padding:'12px 14px',
          display:'flex', alignItems:'center', gap:12, textAlign:'left',
          cursor: 'pointer',
          boxShadow:'0 10px 28px rgba(0,0,0,.28), 0 0 0 1px rgba(0,0,0,.06)',
          animation:'slidein .35s cubic-bezier(.2,.7,.3,1)',
        }}>
          <div style={{ width:38, height:38, borderRadius:'50%',
            background: `${rewardColor}22`,
            display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
            border: `2px solid ${rewardColor}` }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 21s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z" stroke={rewardColor} strokeWidth="2"/>
              <circle cx="12" cy="9" r="2.6" fill={rewardColor}/>
            </svg>
          </div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:13, fontWeight:700, color:SIXT_DARK, lineHeight:1.25 }}>
              {isFee ? 'Free drop-off · 200 m away' : 'Reward zone · 350 m away'}
            </div>
            <div style={{ fontSize:11, color:'#656A6F', marginTop:2, lineHeight:1.3 }}>
              {isFee ? '3 min walk · skip the +1 € fee' : '4 min walk · earn −1 € credit'}
            </div>
          </div>
          {isFee ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke={SIXT_DARK} strokeWidth="2" strokeLinecap="round"/></svg>
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke={SIXT_DARK} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          )}
        </button>
      )}

      {/* Bottom sheet */}
      {showSheet && (
        <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:10 }}>
          <DrivingBottomSheet zone={zone} onEndTrip={onEndTrip} elevated={elevated} isProminent={isProminent}
            rewardColor={rewardColor} chargeColor={chargeColor}/>
        </div>
      )}

      <style>{`@keyframes slidein {from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}}`}</style>
    </div>
  );
}

/* Full-width banner shown at the top in 'prominent' mode — zone surfacing is loud. */
function ProminentZoneBanner({ zone, accent }) {
  const titles = {
    normal:  'Standard zone · no extra charge',
    reward:  'Reward drop-off zone · −1 €',
    charge:  'Charge drop-off zone · +1 €',
    noPark:  'No-park zone · cannot end here',
    outside: 'Outside business area',
  };
  const subs = {
    normal:  'Park anywhere here at no cost.',
    reward:  'End your trip here, save €1.',
    charge:  'Ending your trip here adds €1.',
    noPark:  'Drive on to a standard zone.',
    outside: 'Return to the area or a SIXT station.',
  };
  const isLight = zone === 'noPark' || zone === 'charge' || zone === 'reward' || zone === 'normal' || zone === 'outside';
  const fg = '#fff';
  return (
    <div style={{ position:'absolute', top:88, left:14, right:14, zIndex:22,
      background: accent, color: fg, borderRadius:14, padding:'12px 14px',
      display:'flex', alignItems:'center', gap:12,
      boxShadow:'0 6px 20px rgba(0,0,0,.20)',
      animation:'slidein .35s cubic-bezier(.2,.7,.3,1)' }}>
      <div style={{ width:34, height:34, borderRadius:'50%', background:'rgba(255,255,255,.22)',
        display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
        {zone === 'reward' && (
          <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l2.6 6.5 7 .6-5.3 4.6 1.6 6.8L12 16.8 6.1 20.5l1.6-6.8L2.4 9.1l7-.6L12 2z" fill="#fff"/></svg>
        )}
        {zone === 'charge' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 1v22M5 8h11a3 3 0 010 6H8a3 3 0 000 6h11" stroke="#fff" strokeWidth="2.2" strokeLinecap="round"/></svg>
        )}
        {zone === 'noPark' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3L2 21h20L12 3zM12 10v5M12 17.5v.5" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none"/></svg>
        )}
        {zone === 'normal' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5 9-11" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
        {zone === 'outside' && (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2"/><path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" stroke="#fff" strokeWidth="1.6" fill="none"/></svg>
        )}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:13, fontWeight:700, lineHeight:1.25 }}>{titles[zone]}</div>
        <div style={{ fontSize:11, opacity:0.92, marginTop:2, lineHeight:1.3 }}>{subs[zone]}</div>
      </div>
    </div>
  );
}

function DrivingBottomSheet({ zone, onEndTrip, elevated, isProminent, rewardColor = '#22C55E', chargeColor = '#0088FF' }) {
  const t = ZONE_TYPES[zone];
  const isFee = zone === 'charge';
  const isReward = zone === 'reward';

  /* Tinted edge based on zone */
  const edgeColor = isFee ? chargeColor : isReward ? rewardColor : zone==='noPark'? '#8D9299' : null;

  return (
    <div style={{ background: SIXT_DARK, borderTopLeftRadius:24, borderTopRightRadius:24,
      color:'#fff', boxShadow:'0 -8px 30px rgba(0,0,0,.35)', overflow:'hidden' }}>
      {/* Tinted top edge */}
      {edgeColor && elevated && (
        <div style={{ height:3, background:edgeColor }}/>
      )}
      <SheetHandle/>

      {/* Timer + car */}
      <div style={{ padding:'4px 20px 0', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.6"/><path d="M12 7v5l3 3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round"/></svg>
          <div>
            <div style={{ fontSize:14, fontWeight:700 }}>06:26</div>
            <div style={{ fontSize:11, color:'#8D9299' }}>Polestar 2 · M-UC 2711</div>
          </div>
        </div>
        <div style={{ width:90, height:36 }}>
          <PolestarMini/>
        </div>
      </div>

      {/* Adaptive zone callout */}
      {elevated && !isProminent && (isFee || isReward) && (
        <div style={{ margin:'12px 20px 0', borderRadius:12, padding:'12px 14px',
          background: isFee? `${chargeColor}1F` : `${rewardColor}1F`,
          border: `1px solid ${isFee? chargeColor : rewardColor}55`,
          display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0,
            background: isFee? chargeColor : rewardColor, display:'flex', alignItems:'center', justifyContent:'center' }}>
            {isFee ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2v20M5 9h14M5 15h14" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M12 2l2.6 6.5 7 .6-5.3 4.6 1.6 6.8L12 16.8 6.1 20.5l1.6-6.8L2.4 9.1l7-.6L12 2z" fill="#fff"/>
              </svg>
            )}
          </div>
          <div style={{ flex:1, fontSize:12, lineHeight:1.4 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:13, marginBottom:2 }}>
              {isFee ? 'Charge drop-off zone' : 'Reward drop-off zone'}
            </div>
            <div style={{ color:'#C7CACE' }}>
              {isFee
                ? 'Ending your trip here adds +1 € to your fare.'
                : 'End your trip here and we\'ll credit −1 € to your fare.'}
            </div>
          </div>
        </div>
      )}

      {elevated && !isProminent && zone === 'noPark' && (
        <div style={{ margin:'12px 20px 0', borderRadius:12, padding:'12px 14px',
          background:'rgba(141,146,153,0.14)', border:'1px solid rgba(141,146,153,0.30)',
          display:'flex', alignItems:'flex-start', gap:12 }}>
          <div style={{ width:32, height:32, borderRadius:'50%', flexShrink:0, background:'#5B6066',
            display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 7v6m0 3v0" stroke="#fff" strokeWidth="2" strokeLinecap="round" fill="none"/></svg>
          </div>
          <div style={{ flex:1, fontSize:12, lineHeight:1.4 }}>
            <div style={{ fontWeight:700, color:'#fff', fontSize:13, marginBottom:2 }}>No-park zone</div>
            <div style={{ color:'#C7CACE' }}>You can drive through but can't end your trip here.</div>
          </div>
        </div>
      )}

      {/* Action grid */}
      <div style={{ padding:'14px 16px 12px', display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
        <ActionBtn primary disabled={zone==='noPark'} onClick={onEndTrip}
          icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="1.8"/><path d="M9 9l6 6M15 9l-6 6" stroke="#fff" strokeWidth="2" strokeLinecap="round"/></svg>}>
          End Trip
        </ActionBtn>
        <ActionBtn icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><rect x="6" y="11" width="12" height="9" rx="1.5" stroke="#fff" strokeWidth="1.7"/><path d="M9 11V7a3 3 0 016 0v4" stroke="#fff" strokeWidth="1.7"/></svg>}>
          Lock / Unlock
        </ActionBtn>
        <ActionBtn icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z" stroke="#fff" strokeWidth="1.7"/><circle cx="12" cy="9" r="2.5" stroke="#fff" strokeWidth="1.7"/></svg>} dot>
          Report problem
        </ActionBtn>
        <ActionBtn icon={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 21V8h14v13M9 21v-6h6v6" stroke="#fff" strokeWidth="1.7"/></svg>}>
          Park
        </ActionBtn>
      </div>

      <TabBar active="Share"/>
    </div>
  );
}

function ActionBtn({ icon, children, primary, disabled, dot, onClick }) {
  const bg = primary ? (disabled? '#3E4146' : SIXT_ORANGE) : SIXT_DARK2;
  const fg = disabled ? '#8D9299' : '#fff';
  return (
    <button onClick={disabled? undefined : onClick} style={{ background:bg, border:'none', borderRadius:12,
      padding:'14px 14px', display:'flex', alignItems:'center', gap:8, cursor: disabled? 'not-allowed' : 'pointer',
      color:fg, textAlign:'left', position:'relative', opacity: disabled? 0.65 : 1 }}>
      <div style={{ position:'relative' }}>
        {icon}
        {dot && <div style={{ position:'absolute', top:-2, right:-3, width:8, height:8, borderRadius:'50%', background:SIXT_ORANGE, border:'1.5px solid #272829' }}/>}
      </div>
      <span style={{ fontSize:13, fontWeight:700 }}>{children}</span>
    </button>
  );
}

/* Stylized tiny Polestar silhouette */
function PolestarMini(){
  return (
    <svg viewBox="0 0 100 40" width="100%" height="100%">
      <defs>
        <linearGradient id="cargrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e8e8e8"/>
          <stop offset="1" stopColor="#888"/>
        </linearGradient>
      </defs>
      <path d="M10,28 Q12,18 28,16 L40,12 Q60,10 78,15 Q92,17 94,28 L86,29 Q84,33 78,33 Q72,33 70,29 L30,29 Q28,33 22,33 Q16,33 14,29 Z" fill="url(#cargrad)"/>
      <circle cx="22" cy="30" r="4" fill="#1a1a1a"/>
      <circle cx="78" cy="30" r="4" fill="#1a1a1a"/>
    </svg>
  );
}

Object.assign(window, { DrivingScreen, DrivingBottomSheet, ActionBtn, PolestarMini });
