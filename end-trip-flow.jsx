/* End-trip sheets — adaptive to the zone the user is parking in.
   Each sheet is a full bottom-modal that overlays a dimmed driving screen. */

function EndTripSheet({ zone = 'normal', onConfirm, onCancel, onFindAlternative }) {
  const t = ZONE_TYPES[zone];

  /* Variant: normal zone → simple confirm */
  if (zone === 'normal') {
    return (
      <SheetShell>
        <div style={{ padding:'8px 24px 0' }}>
          <ZoneHero type="normal"/>
          <h2 style={titleStyle}>End your rental?</h2>
          <p style={paraStyle}>Park in a publicly accessible spot, take your belongings, and wait next to the car until it locks.</p>
          <ZoneCostRow type="normal"/>
        </div>
        <SheetFooter>
          <PrimaryBtn onClick={onConfirm}>End rental</PrimaryBtn>
          <TextBtn onClick={onCancel}>Continue driving</TextBtn>
        </SheetFooter>
      </SheetShell>
    );
  }

  /* Variant: charge zone → fee confirmation + alternative */
  if (zone === 'charge') {
    return (
      <SheetShell>
        <div style={{ padding:'8px 24px 0' }}>
          <ZoneHero type="charge"/>
          <h2 style={titleStyle}>You're in a charge drop-off zone</h2>
          <p style={paraStyle}>Ending your trip here adds <b style={{color:'#1A1A1A'}}>+1 €</b> to your fare. Park 200&nbsp;m away in a free zone to skip the fee.</p>
          <ZoneCostRow type="charge"/>
          <button onClick={onFindAlternative} style={{
            marginTop:14, width:'100%', display:'flex', alignItems:'center', gap:12,
            background:'#F4F5F6', border:'none', borderRadius:12, padding:'12px 14px',
            cursor:'pointer', textAlign:'left'
          }}>
            <div style={{ width:36, height:36, borderRadius:'50%', background:'#fff',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
              boxShadow:'0 0 0 2px #22C55E' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7-6-7-12a7 7 0 0114 0c0 6-7 12-7 12z" stroke="#22C55E" strokeWidth="2"/><circle cx="12" cy="9" r="2.5" fill="#22C55E"/></svg>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:'#1A1A1A' }}>Free spot 200 m away</div>
              <div style={{ fontSize:11, color:'#656A6F' }}>3 min walk · skip the +1 € fee</div>
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" stroke="#1A1A1A" strokeWidth="2" fill="none" strokeLinecap="round"/></svg>
          </button>
        </div>
        <SheetFooter>
          <PrimaryBtn onClick={onConfirm}>End rental · +1 €</PrimaryBtn>
          <TextBtn onClick={onCancel}>Continue driving</TextBtn>
        </SheetFooter>
      </SheetShell>
    );
  }

  /* Variant: reward zone → celebration */
  if (zone === 'reward') {
    return (
      <SheetShell>
        <div style={{ padding:'8px 24px 0' }}>
          <ZoneHero type="reward"/>
          <h2 style={titleStyle}>Nice spot — you'll save €1</h2>
          <p style={paraStyle}>Reward drop-off zones help keep cars where the next driver needs them. We've credited <b style={{color:'#17783C'}}>−1 €</b> to your fare.</p>
          <ZoneCostRow type="reward"/>
        </div>
        <SheetFooter>
          <PrimaryBtn onClick={onConfirm} variant="success">End rental · −1 €</PrimaryBtn>
          <TextBtn onClick={onCancel}>Continue driving</TextBtn>
        </SheetFooter>
      </SheetShell>
    );
  }

  /* Variant: no-park zone (inside business) — same as existing "End rental not possible" */
  if (zone === 'noPark') {
    return (
      <SheetShell>
        <div style={{ padding:'8px 24px 0' }}>
          <ZoneHero type="noPark"/>
          <h2 style={titleStyle}>End rental not possible</h2>
          <p style={paraStyle}>You're in a no-park zone. You can drive through it but can't end the trip here. Drive to a standard, charge or reward zone to park.</p>
          <ZoneCostRow type="noPark"/>
        </div>
        <SheetFooter>
          <PrimaryBtn onClick={onCancel}>Got it</PrimaryBtn>
        </SheetFooter>
      </SheetShell>
    );
  }

  /* Variant: outside business area — return to station */
  if (zone === 'outside') {
    return (
      <SheetShell>
        <div style={{ padding:'8px 24px 0' }}>
          <ZoneHero type="outside"/>
          <h2 style={titleStyle}>Outside business area</h2>
          <p style={paraStyle}>You're outside the SIXT Share area. End by returning the keys at SIXT Station Pullach (3.2 km), or drive back into the area.</p>
          <ZoneCostRow type="outside"/>
        </div>
        <SheetFooter>
          <PrimaryBtn onClick={onConfirm}>Return key to station</PrimaryBtn>
          <TextBtn onClick={onCancel}>Continue driving</TextBtn>
        </SheetFooter>
      </SheetShell>
    );
  }
}

/* ─── ZoneHero: the hero illustration at the top of each end-trip sheet — a
   tinted mini map with the zone shape and the user dot at center. ─── */
function ZoneHero({ type }) {
  const t = ZONE_TYPES[type];
  const palette = {
    normal:  { bg:'#F4F5F6', accent:'#1A1A1A',                title:'Standard zone',          tag:'0 €' },
    reward:  { bg:'#EAFFEC', accent:'#22C55E',                title:'Reward drop-off zone',   tag:'−1 €' },
    charge:  { bg:'#EAFBFF', accent:'#0088FF',                title:'Charge drop-off zone',   tag:'+1 €' },
    noPark:  { bg:'#F4F5F6', accent:'#656A6F',                title:'No-park zone',           tag:'No park' },
    outside: { bg:'#F4F5F6', accent:'#1A1A1A',                title:'Outside business area',  tag:'Return to station' },
  }[type];
  return (
    <div style={{ position:'relative', width:'100%', height:130, borderRadius:14, overflow:'hidden',
      background: palette.bg, marginTop:8 }}>
      {/* Faint street pattern */}
      <svg width="100%" height="100%" style={{ position:'absolute', inset:0, opacity:0.5 }}>
        <defs>
          <pattern id={`street-${type}`} width="36" height="36" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
            <rect width="36" height="36" fill="rgba(255,255,255,0)"/>
            <rect x="3" y="3" width="14" height="14" fill="rgba(0,0,0,.04)" rx="1"/>
            <rect x="19" y="3" width="14" height="14" fill="rgba(0,0,0,.04)" rx="1"/>
            <rect x="3" y="19" width="14" height="14" fill="rgba(0,0,0,.04)" rx="1"/>
            <rect x="19" y="19" width="14" height="14" fill="rgba(0,0,0,.04)" rx="1"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#street-${type})`}/>
      </svg>
      {/* Zone shape */}
      <svg width="100%" height="100%" viewBox="0 0 200 130" style={{ position:'absolute', inset:0 }}>
        {type !== 'normal' && type !== 'outside' && (
          <path d="M30,22 L150,30 L170,90 L120,110 L40,100 Z"
            fill={t.fill} stroke={palette.accent} strokeWidth="2"
            strokeDasharray={type==='outside' ? '6 4' : '0'}/>
        )}
        {type === 'outside' && (
          <path d="M10,40 L100,30 L120,80 L60,110 L0,90 Z"
            fill="rgba(0,0,0,.05)" stroke={palette.accent} strokeWidth="2" strokeDasharray="6 4"/>
        )}
        {/* User dot */}
        <circle cx="100" cy="65" r="20" fill={palette.accent} fillOpacity="0.18"/>
        <circle cx="100" cy="65" r="9" fill="#FF5000" stroke="#fff" strokeWidth="3"/>
      </svg>
      {/* Zone tag in corner */}
      <div style={{ position:'absolute', top:10, left:10, display:'inline-flex', alignItems:'center', gap:6,
        padding:'4px 10px', borderRadius:999, background:'#fff',
        boxShadow:'0 2px 6px rgba(0,0,0,.08)', fontSize:11, fontWeight:700, color:palette.accent }}>
        <span style={{ width:6, height:6, borderRadius:'50%', background:palette.accent }}/>
        {palette.title}
      </div>
      <div style={{ position:'absolute', top:10, right:10 }}>
        <div style={{ display:'inline-flex', alignItems:'center', height:26, padding:'0 11px',
          borderRadius:999, background: palette.accent, color:'#fff', fontSize:12, fontWeight:700 }}>
          {palette.tag}
        </div>
      </div>
    </div>
  );
}

/* ─── ZoneCostRow: small price-delta line shown above CTA ─── */
function ZoneCostRow({ type }) {
  if (type === 'noPark' || type === 'outside') return null;
  const isReward = type === 'reward';
  const isCharge = type === 'charge';
  const delta = isReward ? '−1.00 €' : isCharge ? '+1.00 €' : '0.00 €';
  const tone = isReward ? '#17783C' : isCharge ? '#1658C7' : '#1A1A1A';
  return (
    <div style={{ marginTop:14, padding:'12px 14px', borderRadius:12, background:'#F4F5F6',
      display:'flex', flexDirection:'column', gap:6 }}>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#656A6F' }}>
        <span>Trip so far</span><span>4.21 €</span>
      </div>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, color:'#656A6F' }}>
        <span>{isReward? 'Drop-off reward' : isCharge? 'Drop-off fee' : 'Drop-off'}</span>
        <span style={{ color:tone, fontWeight:700 }}>{delta}</span>
      </div>
      <div style={{ height:1, background:'#E9EBEE', margin:'2px 0' }}/>
      <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, color:'#1A1A1A', fontWeight:700 }}>
        <span>Estimated total</span>
        <span>{isReward? '3.21 €' : isCharge? '5.21 €' : '4.21 €'}</span>
      </div>
    </div>
  );
}

/* ─── Sheet primitives ─── */
function SheetShell({ children }) {
  return (
    <div style={{ background:'#fff', borderTopLeftRadius:24, borderTopRightRadius:24,
      boxShadow:'0 -10px 30px rgba(0,0,0,.20)', overflow:'hidden',
      animation:'sheetin .35s cubic-bezier(.2,.7,.3,1)' }}>
      <SheetHandle light/>
      {children}
      <style>{`@keyframes sheetin {from{transform:translateY(100%)} to{transform:translateY(0)}}`}</style>
    </div>
  );
}
function SheetFooter({ children }) {
  return <div style={{ padding:'18px 24px 30px', display:'flex', flexDirection:'column', gap:10 }}>{children}</div>;
}
const titleStyle = { fontFamily:'"Helvetica Now Display", system-ui', fontWeight:900, fontSize:26,
  lineHeight:1.05, color:'#1A1A1A', margin:'18px 0 8px', letterSpacing:0.3 };
const paraStyle = { fontSize:14, lineHeight:1.45, color:'#656A6F', margin:'0 0 4px' };

function PrimaryBtn({ children, onClick, variant }) {
  const bg = variant==='success' ? '#22C55E' : variant==='danger' ? '#D70015' : SIXT_ORANGE;
  return (
    <button onClick={onClick} style={{ background:bg, border:'none', borderRadius:12, height:54,
      color:'#fff', fontSize:15, fontWeight:700, cursor:'pointer', boxShadow:'0 4px 14px rgba(255,80,0,.20)' }}>
      {children}
    </button>
  );
}
function TextBtn({ children, onClick }) {
  return (
    <button onClick={onClick} style={{ background:'#F4F5F6', border:'none', borderRadius:12, height:54,
      color:'#1A1A1A', fontSize:15, fontWeight:700, cursor:'pointer' }}>
      {children}
    </button>
  );
}

/* ─── Post-trip Summary — based on the SIXT "Share Done" Figma summary page,
       adapted to surface the zone outcome inside Session Details + (for rewards)
       a small celebration band. ─── */
function PostTripSummary({ zone = 'normal', onClose, rated: ratedProp }) {
  const isReward = zone === 'reward';
  const isCharge = zone === 'charge';
  const [rated, setRated] = React.useState(ratedProp || null); /* null | 'up' | 'down' */

  const total = isReward ? '6,21 €' : isCharge ? '8,21 €' : '7,21 €';
  const zoneLineLabel = isReward ? 'Reward drop-off' : isCharge ? 'Drop-off fee' : null;
  const zoneLineValue = isReward ? '−1,00 €' : '+1,00 €';
  const zoneLineTone  = isReward ? '#17783C' : '#1658C7';
  const zoneSummaryValue = isReward ? 'Reward zone' : isCharge ? 'Charge zone' : 'Standard zone';
  const zoneSummaryTone  = isReward ? '#17783C' : isCharge ? '#1658C7' : '#1A1A1A';

  return (
    <div style={{
      position:'absolute', inset:0, background:'#1A1A1A', color:'#1A1A1A', zIndex:50,
      overflowY:'auto', display:'flex', flexDirection:'column', alignItems:'center',
      paddingTop: 54, paddingBottom: 22, fontFamily:'"Helvetica Now Text", system-ui',
    }}>
      {/* Status bar spacer is provided by phone frame */}

      {/* SUCCESS HEADER */}
      <div style={{ width:'100%', padding:'12px 16px 24px', textAlign:'center', color:'#fff' }}>
        <div style={{ width:48, height:48, margin:'0 auto 16px', borderRadius:32, background:'#3CE900',
          display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M5 12.5l4.5 4.5 9.5-11" stroke="#fff" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div style={{ fontSize:22, fontWeight:700, lineHeight:1.3, letterSpacing:0.1 }}>All done</div>
        <div style={{ fontSize:14, lineHeight:1.5, marginTop:4, color:'rgba(255,255,255,.7)' }}>
          We hope you had a good time.
        </div>
        <div style={{ fontSize:14, lineHeight:1.5, color:'rgba(255,255,255,.7)' }}>
          We've sent a confirmation email to marc@mail.com
        </div>
      </div>

      {/* WHITE RESERVATION-SUMMARY CARD */}
      <div style={{ width:'calc(100% - 32px)', background:'#fff', borderRadius:16, padding:'24px 16px',
        display:'flex', flexDirection:'column', gap:24 }}>

        {/* RATE YOUR RIDE */}
        <SummarySection>
          <SectionTitle>Rate your ride</SectionTitle>
          {rated ? (
            <div style={{ fontSize:14, fontWeight:700, textAlign:'center', color:'#17783C', padding:'10px 0' }}>
              Thank you for your rating
            </div>
          ) : (
            <>
              <div style={{ fontSize:14, color:'#1A1A1A', lineHeight:1.5, marginTop:4 }}>
                How was your trip{isReward ? ' and the drop-off spot' : ''}?
              </div>
              <div style={{ display:'flex', flexDirection:'row', gap:8, marginTop:14 }}>
                <ThumbBtn onClick={()=>setRated('up')} dir="up"/>
                <ThumbBtn onClick={()=>setRated('down')} dir="down"/>
              </div>
            </>
          )}
        </SummarySection>

        <Divider/>

        {/* LOYALTY */}
        <SummarySection>
          <SectionTitle>Loyalty</SectionTitle>

          {/* Stamps card */}
          <div style={{ background:'#F4F4F9', borderRadius:16, padding:16, display:'flex', flexDirection:'column', gap:12 }}>
            <div style={{ display:'flex', flexDirection:'row', justifyContent:'space-between', alignItems:'center' }}>
              {[true, true, true, false].map((stamped, i) => (
                <LoyaltyStamp key={i} stamped={stamped}/>
              ))}
            </div>
            <div>
              <div style={{ fontSize:16, fontWeight:700, color:'#1A1A1A', lineHeight:'24px' }}>3 of 4 trips done</div>
              <div style={{ fontSize:12, color:'#1A1A1A', lineHeight:'18px' }}>1 trip remaining within the next 12 days.</div>
            </div>
            <div style={{ fontSize:12, color:'#828287', lineHeight:'18px' }}>
              No unlock fee will be charged after 4 trips within 30 days.
            </div>
          </div>

          {/* Points info card — InfoCard from Figma */}
          <div style={{ marginTop:12, background:'#F4F4F9', borderRadius:16, padding:'24px 24px 16px 24px',
            display:'flex', flexDirection:'column', gap:8 }}>
            <div style={{ display:'flex', flexDirection:'row', gap:8, alignItems:'center' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 4l1.6 4 4-1.6L5 4zM3 16l3.5 3.5 5.5-5.5-3.5-3.5L3 16zm15-3l-2 2 3 3 2-2-3-3zm-3-9l3 3-3 3-3-3 3-3z" stroke="#1A1A1A" strokeWidth="1.6" strokeLinejoin="round" fill="none"/>
                <path d="M14 8l3 3M11 11l3 3" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round"/>
              </svg>
              <span style={{ fontFamily:'inherit', fontWeight:700, fontSize:14, lineHeight:1.5, color:'#1A1A1A' }}>
                You earned 5 Loyalty Points with this Rental
              </span>
            </div>
            <span style={{ fontFamily:'inherit', fontSize:14, lineHeight:1.5, color:'#1A1A1A' }}>
              Good News! As soon as you hit 50 Loyalty-Points we will send you a 5 € Voucher for your next SIXT Journey.
            </span>
            <button style={{
              alignSelf:'flex-start', background:'transparent', border:'none', padding:'12px 0 0',
              fontFamily:'inherit', fontSize:14, fontWeight:700, color:'#1A1A1A',
              textDecoration:'underline', textUnderlineOffset:3, cursor:'pointer',
            }}>See my Loyalty-Status</button>
          </div>
        </SummarySection>

        <Divider/>

        {/* ITINERARY */}
        <SummarySection>
          <SectionTitle>Your itinerary</SectionTitle>
          <ItineraryRow icon="dot"  label="Pick-up"     place="Elisabeth-Mara-Str. 9" time="8:32 am"/>
          <div style={{ marginLeft:11, width:1, height:14, background:'#C9C9CF' }}/>
          <ItineraryRow icon="pin"  label="Drop-off"    place="Ella-Kay-Str. 50"      time="9:04 am"/>
        </SummarySection>

        <Divider/>

        {/* SESSION DETAILS — receipt with simple zone line */}
        <SummarySection>
          <SectionTitle>Session details</SectionTitle>
          <DetailRow icon="time"   label="Duration" value="00:26:43"/>
          <DetailRow icon="route"  label="Distance" value="2,4 km"/>
          <DetailRow icon="zone"   label="Drop-off zone" value={zoneSummaryValue} tone={zoneSummaryTone}/>
          <div style={{ height:0.5, background:'#E9EBEE', margin:'10px 0' }}/>
          <DetailRow label="Driving (6 min)"      value="4,04 €" muted/>
          <DetailRow label="Unlock"               value="1,00 €" muted/>
          <DetailRow label="Reservation hold"     value="1,17 €" muted/>
          {zoneLineLabel && (
            <DetailRow label={zoneLineLabel} value={zoneLineValue} tone={zoneLineTone} bold/>
          )}
          <div style={{ height:0.5, background:'#E9EBEE', margin:'10px 0' }}/>
          <DetailRow label="Total" value={total} bold large/>
        </SummarySection>

        {/* REWARD CELEBRATION (only for reward zone) */}
        {isReward && (
          <div style={{ marginTop:-6, padding:'12px 14px', borderRadius:12, background:'#EAFFEC',
            display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:32, height:32, borderRadius:'50%', background:'#3CE900',
              display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="18" height="18" viewBox="0 0 24 24"><path d="M12 2l2.6 6.5 7 .6-5.3 4.6 1.6 6.8L12 16.8 6.1 20.5l1.6-6.8L2.4 9.1l7-.6L12 2z" fill="#0E5B23"/></svg>
            </div>
            <div>
              <div style={{ fontSize:13, fontWeight:700, color:'#0E5B23' }}>Thanks for parking smart</div>
              <div style={{ fontSize:12, color:'#17783C', lineHeight:1.4 }}>You saved 1 € and helped the next driver.</div>
            </div>
          </div>
        )}

        <Divider/>

        {/* HELP */}
        <SummarySection>
          <SectionTitle>Got questions?</SectionTitle>
          <div style={{ fontSize:14, color:'#1A1A1A', marginTop:4 }}>
            Rental ID: <span style={{ fontWeight:700 }}>9925653183</span>
          </div>
          <div style={{ fontSize:14, color:'#1A1A1A', lineHeight:1.5, marginTop:8 }}>
            Our dedicated team is here for you. 24 hours per day, 7 days per week.
          </div>
          <div style={{ display:'flex', flexDirection:'column', marginTop:8 }}>
            <LinkRow icon="headset" label="Help & contact"/>
            <LinkRow icon="list"    label="See all your sessions"/>
          </div>
        </SummarySection>
      </div>

      {/* DONE BUTTON */}
      <div style={{ width:'calc(100% - 32px)', marginTop:16 }}>
        <button onClick={onClose} style={{
          width:'100%', height:52, border:'none', borderRadius:12, cursor:'pointer',
          background:'#FF5000', color:'#FFFFFF', fontFamily:'inherit', fontSize:16, fontWeight:700,
        }}>Done</button>
      </div>
    </div>
  );
}

/* ─── Summary support pieces ─── */
function SummarySection({ children }) {
  return <div style={{ display:'flex', flexDirection:'column' }}>{children}</div>;
}
function SectionTitle({ children }) {
  return <div style={{ fontSize:18, fontWeight:700, color:'#1A1A1A', marginBottom:10, letterSpacing:0.1 }}>{children}</div>;
}
function Divider() {
  return <div style={{ height:0.5, background:'#C9C9CF' }}/>;
}
function LoyaltyStamp({ stamped }) {
  return (
    <div style={{
      width:48, height:48, borderRadius:'50%',
      border: stamped ? '3px solid #3CC60C' : '2px dashed #C9C9CF',
      background: stamped ? '#fff' : 'transparent',
      boxShadow: stamped ? '0 3px 12px rgba(0,0,0,.12)' : 'none',
      display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0,
    }}>
      {stamped ? (
        /* car silhouette with check — all green per Figma intent */
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path d="M3 13l1.5-4.5A2 2 0 016.4 7h7.7a2 2 0 011.9 1.4L17.5 13M3 13v4a1 1 0 001 1h1.5a1 1 0 001-1v-1h7v1a1 1 0 001 1h1.5a1 1 0 001-1v-4M3 13h14.5"
            stroke="#3CC60C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          <circle cx="6.5" cy="15" r="1.1" fill="#3CC60C"/>
          <circle cx="14" cy="15" r="1.1" fill="#3CC60C"/>
          <path d="M16 6.5l1.6 1.6 3-3" stroke="#3CC60C" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ) : (
        <span style={{ fontSize:18, fontWeight:700, color:'#C9C9CF' }}>4</span>
      )}
    </div>
  );
}

function ThumbBtn({ dir, onClick }) {
  const up = dir === 'up';
  return (
    <button onClick={onClick} style={{
      flex:1, height:52, borderRadius:12, border:'1px solid #E1E2E6', background:'#fff',
      display:'flex', alignItems:'center', justifyContent:'center', gap:8, cursor:'pointer',
      fontFamily:'inherit', fontSize:14, fontWeight:600, color:'#1A1A1A',
    }}>
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        style={{ transform: up ? 'none' : 'scaleY(-1)' }}>
        <path d="M7 22V11M2 13v7a2 2 0 002 2h2V11H4a2 2 0 00-2 2zm15-7l-1-3.5a2 2 0 00-3.6-.6L8 9v13h9.7a2 2 0 002-1.6l1.7-7A2 2 0 0019.4 11H14V7a2 2 0 00-1-2z"
          stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      {up ? 'Yes' : 'No'}
    </button>
  );
}

function ZoneOutcomeRow({ zone }) {
  const config = {
    normal:  { dot:'#8D9299', label:'Standard zone',  detail:'No extra cost.',                         tag:'0,00 €',  tagBg:'#F4F5F6', tagFg:'#1A1A1A' },
    reward:  { dot:'#22C55E', label:'Reward zone',    detail:'Helped reposition the car for the next driver.', tag:'−1,00 €', tagBg:'#EAFFEC', tagFg:'#0E5B23' },
    charge:  { dot:'#0088FF', label:'Charge zone',    detail:'This area costs us to relocate from.',   tag:'+1,00 €', tagBg:'#E5F1FF', tagFg:'#1658C7' },
  }[zone] || {};
  return (
    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
      <span style={{ width:10, height:10, borderRadius:'50%', background:config.dot, flexShrink:0 }}/>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:14, fontWeight:700, color:'#1A1A1A' }}>{config.label}</div>
        <div style={{ fontSize:12, color:'#656A6F', lineHeight:1.4 }}>{config.detail}</div>
      </div>
      <div style={{ padding:'4px 10px', borderRadius:999, background:config.tagBg, color:config.tagFg,
        fontSize:13, fontWeight:700, flexShrink:0 }}>{config.tag}</div>
    </div>
  );
}

function ItineraryRow({ icon, label, place, time }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:22, display:'flex', justifyContent:'center', flexShrink:0 }}>
        {icon === 'dot' ? (
          <span style={{ width:10, height:10, borderRadius:'50%', background:'#1A1A1A', border:'2px solid #1A1A1A' }}/>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8 2 5 5 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" fill="#1A1A1A"/>
          </svg>
        )}
      </div>
      <div style={{ flex:1, minWidth:0 }}>
        <div style={{ fontSize:12, color:'#656A6F' }}>{label}</div>
        <div style={{ fontSize:14, color:'#1A1A1A', fontWeight:600, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{place}</div>
      </div>
      <div style={{ fontSize:14, color:'#1A1A1A', fontWeight:600, flexShrink:0 }}>{time}</div>
    </div>
  );
}

function DetailRow({ icon, label, value, tone, bold, large, muted }) {
  const color = tone || (muted ? '#656A6F' : '#1A1A1A');
  const fs = large ? 16 : 14;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, padding:'4px 0' }}>
      {icon && (
        <div style={{ width:22, display:'flex', justifyContent:'center', flexShrink:0 }}>
          {icon === 'time' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#1A1A1A" strokeWidth="1.6"/><path d="M12 7v5l3 2" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round"/></svg>}
          {icon === 'route' && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M6 4h6a4 4 0 010 8H8a4 4 0 000 8h10" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round"/></svg>}
          {icon === 'zone'  && <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 5 5 5 9c0 5.3 7 13 7 13s7-7.7 7-13c0-4-3-7-7-7zm0 9.5A2.5 2.5 0 1112 6.5a2.5 2.5 0 010 5z" stroke="#1A1A1A" strokeWidth="1.6"/></svg>}
        </div>
      )}
      <div style={{ flex:1, fontSize:fs, fontWeight: bold?700:400, color }}>{label}</div>
      <div style={{ fontSize:fs, fontWeight: bold?700:500, color, fontVariantNumeric:'tabular-nums' }}>{value}</div>
    </div>
  );
}

function LinkRow({ icon, label }) {
  return (
    <button style={{ height:48, display:'flex', alignItems:'center', gap:12, padding:'0 0',
      background:'transparent', border:'none', borderTop:'0.5px solid #E9EBEE', cursor:'pointer',
      fontFamily:'inherit', textAlign:'left' }}>
      <div style={{ width:22, display:'flex', justifyContent:'center' }}>
        {icon === 'headset' && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 13a8 8 0 1116 0v3a3 3 0 01-3 3h-1v-7h4M4 13v3a3 3 0 003 3h1v-7H4" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        {icon === 'list'    && <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="#1A1A1A" strokeWidth="1.6" strokeLinecap="round"/></svg>}
      </div>
      <div style={{ flex:1, fontSize:14, fontWeight:600, color:'#1A1A1A' }}>{label}</div>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="#1A1A1A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
    </button>
  );
}

function Row({ label, value, tone, bold, large }) {
  return (
    <div style={{ display:'flex', justifyContent:'space-between',
      fontSize: large?15:13, fontWeight: bold?700:400, color: tone || (bold?'#1A1A1A':'#656A6F') }}>
      <span>{label}</span><span>{value}</span>
    </div>
  );
}

/* ─── "Know your zones" info screen — full screen overlay ─── */
function ZonesInfoScreen({ onClose }) {
  return (
    <div style={{ position:'absolute', inset:0, background: SIXT_DARK, color:'#fff', zIndex:60,
      overflowY:'auto', display:'flex', flexDirection:'column' }}>
      <StatusBar dark/>
      <div style={{ padding:'12px 20px 0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <button onClick={onClose} style={{ background:'rgba(255,255,255,.1)', border:'none', borderRadius:'50%',
          width:36, height:36, color:'#fff', fontSize:18, cursor:'pointer' }}>×</button>
      </div>
      <div style={{ padding:'12px 24px 32px', flex:1 }}>
        <h1 style={{ fontFamily:'"Helvetica Now Display", system-ui', fontWeight:900, fontSize:32,
          lineHeight:1, margin:'18px 0 26px', textTransform:'uppercase', letterSpacing:0.5 }}>
          Know your<br/>drop-off zones
        </h1>
        <ZoneRow type="normal"
          desc="Most of the business area. End your trip anywhere here at no extra cost."/>
        <ZoneRow type="reward"
          desc="Help us keep cars where the next driver needs them. End your trip here and we credit −1 €."/>
        <ZoneRow type="charge"
          desc="Cars left here cost us to relocate. Ending your trip here adds +1 € to your fare."/>
        <ZoneRow type="noPark"
          desc="Inside the business area, but ending your trip here isn't allowed. Drive to a standard zone."/>
        <ZoneRow type="outside"
          desc="Outside our business area. Drive back in, or end at a SIXT station to return the key."/>
        <p style={{ fontSize:11, color:'#8D9299', marginTop:24, lineHeight:1.5 }}>
          Where you start your trip doesn't matter — only where you end it. Standard traffic and parking rules always apply.
        </p>
      </div>
      <div style={{ padding:'14px 24px 30px', background:SIXT_DARK }}>
        <PrimaryBtn onClick={onClose}>Got it</PrimaryBtn>
      </div>
    </div>
  );
}

function ZoneRow({ type, desc }) {
  const t = ZONE_TYPES[type];
  const palette = {
    normal:  { bg:'#272829', accent:'#8D9299', tag:'0 €' },
    reward:  { bg:'#02270D', accent:'#22C55E', tag:'−1 €' },
    charge:  { bg:'#031D4B', accent:'#0088FF', tag:'+1 €' },
    noPark:  { bg:'#272829', accent:'#A8ADB2', tag:'No park' },
    outside: { bg:'#272829', accent:'#fff',    tag:'Outside' },
  }[type];
  const titles = {
    normal:'Standard zone', reward:'Reward zone', charge:'Charge zone',
    noPark:'No-park zone', outside:'Outside business area',
  };
  return (
    <div style={{ display:'flex', gap:14, alignItems:'flex-start', padding:'12px 0',
      borderTop:'1px solid rgba(255,255,255,0.08)' }}>
      <div style={{ width:64, height:64, borderRadius:10, background:palette.bg, position:'relative',
        flexShrink:0, overflow:'hidden' }}>
        <svg viewBox="0 0 64 64" width="64" height="64">
          <defs>
            <pattern id={`zr-${type}`} width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(-15)">
              <rect x="1" y="1" width="3" height="3" fill="rgba(255,255,255,0.07)"/>
              <rect x="6" y="1" width="3" height="3" fill="rgba(255,255,255,0.07)"/>
              <rect x="1" y="6" width="3" height="3" fill="rgba(255,255,255,0.07)"/>
              <rect x="6" y="6" width="3" height="3" fill="rgba(255,255,255,0.07)"/>
            </pattern>
          </defs>
          <rect width="64" height="64" fill={`url(#zr-${type})`}/>
          {type !== 'normal' && (
            <path d={type==='outside'? 'M5,28 L42,15 L58,40 L36,55 L8,48 Z' : 'M10,18 L50,12 L56,42 L40,56 L8,48 Z'}
              fill={type==='outside'? 'rgba(255,255,255,0.05)' : t.fill.replace('0.18','0.35')}
              stroke={palette.accent} strokeWidth="2" strokeDasharray={type==='outside'?'4 3':'0'}/>
          )}
        </svg>
      </div>
      <div style={{ flex:1 }}>
        <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:4 }}>
          <div style={{ fontSize:15, fontWeight:700, color:'#fff' }}>{titles[type]}</div>
          <div style={{ display:'inline-flex', height:20, padding:'0 8px', borderRadius:999,
            background: palette.accent, color:'#000', fontSize:10, fontWeight:700, alignItems:'center' }}>
            {palette.tag}
          </div>
        </div>
        <div style={{ fontSize:12, color:'#C7CACE', lineHeight:1.4 }}>{desc}</div>
      </div>
    </div>
  );
}

Object.assign(window, {
  EndTripSheet, ZoneHero, ZoneCostRow, SheetShell, SheetFooter,
  PrimaryBtn, TextBtn, PostTripSummary, ZonesInfoScreen, Row, ZoneRow
});
