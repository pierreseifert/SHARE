/* Main app — DesignCanvas hosting:
     1. The interactive prototype (full driving + end-trip flow) in one big artboard.
     2. A series of state cards (driving in each zone, end-trip sheet for each zone, post-trip, info screen)
     3. A map-layer card showing the city-wide view with zones.
   Tweaks panel exposes color, copy, intensity controls.
*/

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "warningIntensity": "adaptive",
  "showAlternatives": true,
  "ctaCopy": "fee-explicit",
  "rewardColor": "#22C55E",
  "chargeColor": "#0088FF",
  "zonesVisibleByDefault": true,
  "pinchZoomEnabled": false
}/*EDITMODE-END*/;

/* ─── Shared phone shell ─────────────────────────────────────── */
const PHONE_W = 390, PHONE_H = 844;

/* Per-zone target so the user pin lands visibly INSIDE the chosen zone. */
const ZONE_USER_POS = {
  normal:  { x: 0.55, y: 0.50 },
  reward:  { x: 0.18, y: 0.78 },
  charge:  { x: 0.48, y: 0.25 },
  noPark:  { x: 1.12, y: 0.76 },
  outside: { x: -0.06, y: -0.26 },
};

function PhoneFrame({ children, label }) {
  return (
    <div style={{
      width: PHONE_W, height: PHONE_H, borderRadius: 44, overflow:'hidden',
      position:'relative', background:'#000',
      boxShadow:'0 0 0 10px #1a1a1a, 0 30px 60px rgba(0,0,0,.25)',
      fontFamily:'"Helvetica Now Text", system-ui, sans-serif',
    }}>
      {/* Dynamic island */}
      <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
        width:120, height:34, borderRadius:20, background:'#000', zIndex:80 }}/>
      {children}
      {/* Home indicator */}
      <div style={{ position:'absolute', bottom:6, left:0, right:0, display:'flex', justifyContent:'center', zIndex:90, pointerEvents:'none' }}>
        <div style={{ width:130, height:5, borderRadius:3, background:'rgba(0,0,0,0.5)' }}/>
      </div>
    </div>
  );
}

/* ─── Static state card: a phone frame in any state ─── */
function StateCard({ zone, mode = 'driving', warningIntensity = 'adaptive', showAlt = true,
  zonesVisible = true, rewardColor = '#22C55E', chargeColor = '#0088FF' }) {
  if (mode === 'driving') {
    return (
      <PhoneFrame>
        <DrivingScreen zone={zone} width={PHONE_W} height={PHONE_H}
          warningIntensity={warningIntensity} showAlternativeBanner={showAlt}
          rewardColor={rewardColor} chargeColor={chargeColor}
          zonesVisible={zonesVisible}/>
      </PhoneFrame>
    );
  }
  if (mode === 'endtrip') {
    return (
      <PhoneFrame>
        <DrivingScreen zone={zone} width={PHONE_W} height={PHONE_H}
          warningIntensity={warningIntensity} showAlternativeBanner={false}
          rewardColor={rewardColor} chargeColor={chargeColor}
          zonesVisible={zonesVisible} showSheet={false}/>
        {/* Dim layer */}
        <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', zIndex:5 }}/>
        <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:10, maxHeight:'85%', overflowY:'auto' }}>
          <EndTripSheet zone={zone} onConfirm={()=>{}} onCancel={()=>{}} onFindAlternative={()=>{}}/>
        </div>
      </PhoneFrame>
    );
  }
  if (mode === 'summary') {
    return (
      <PhoneFrame>
        <DrivingScreen zone={zone} width={PHONE_W} height={PHONE_H}
          warningIntensity="subtle" showAlternativeBanner={false}
          rewardColor={rewardColor} chargeColor={chargeColor}
          zonesVisible={zonesVisible} showSheet={false}/>
        <PostTripSummary zone={zone} onClose={()=>{}}/>
      </PhoneFrame>
    );
  }
  if (mode === 'info') {
    return (
      <PhoneFrame>
        <ZonesInfoScreen onClose={()=>{}}/>
      </PhoneFrame>
    );
  }
  return null;
}

/* ─── Interactive prototype ─── */
function PrototypePhone({ tweaks }) {
  const [step, setStep] = React.useState('driving'); /* driving | endtrip | summary | info */
  const [zone, setZone] = React.useState('normal');
  const [zonesVisible, setZonesVisible] = React.useState(tweaks.zonesVisibleByDefault);
  const [touched, setTouched] = React.useState(false);

  /* When the default toggle changes in Tweaks AND the user hasn't manually toggled, follow it. */
  React.useEffect(() => {
    if (!touched) setZonesVisible(tweaks.zonesVisibleByDefault);
  }, [tweaks.zonesVisibleByDefault]);

  const goEnd = () => setStep('endtrip');
  const confirmEnd = () => setStep('summary');
  const close = () => { setStep('driving'); setZone('normal'); };

  return (
    <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:14 }}>
      <PhoneFrame>
        <DrivingScreen
          zone={zone}
          userPos={ZONE_USER_POS[zone]}
          width={PHONE_W}
          height={PHONE_H}
          zonesVisible={zonesVisible}
          warningIntensity={tweaks.warningIntensity}
          rewardColor={tweaks.rewardColor}
          chargeColor={tweaks.chargeColor}
          showAlternativeBanner={tweaks.showAlternatives && step==='driving'}
          showSheet={step==='driving'}
          onEndTrip={goEnd}
          onZonesToggle={()=>{ setTouched(true); setZonesVisible(v=>!v); }}
          onShowZonesInfo={()=>setStep('info')}
          onShowAlternative={()=>setZone('reward')}
        />
        {step === 'endtrip' && (
          <div style={{ position:'absolute', inset:0, background:'rgba(0,0,0,.45)', zIndex:5 }}/>
        )}
        {step === 'endtrip' && (
          <div style={{ position:'absolute', left:0, right:0, bottom:0, zIndex:10, maxHeight:'88%', overflowY:'auto' }}>
            <EndTripSheet zone={zone}
              onConfirm={confirmEnd}
              onCancel={()=>setStep('driving')}
              onFindAlternative={()=>{ setZone('reward'); setStep('driving'); }}
            />
          </div>
        )}
        {step === 'summary' && (
          <PostTripSummary zone={zone} onClose={close}/>
        )}
        {step === 'info' && (
          <ZonesInfoScreen onClose={()=>setStep('driving')}/>
        )}
      </PhoneFrame>

      {/* Zone simulator */}
      <div style={{ background:'#fff', borderRadius:14, padding:'10px 12px', boxShadow:'0 6px 24px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)',
        display:'flex', flexDirection:'column', gap:8, width: PHONE_W }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#656A6F', textTransform:'uppercase', letterSpacing:0.5, padding:'2px 4px' }}>
          Simulate driving into a zone
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6 }}>
          {['normal','reward','charge','noPark','outside'].map(z => {
            const t = ZONE_TYPES[z];
            const labels = { normal:'Standard', reward:'1', charge:'2', noPark:'3', outside:'4' };
            const active = z === zone;
            const accent = z==='reward'?'#22C55E':z==='charge'?'#0088FF':z==='noPark'?'#5B6066':'#1A1A1A';
            return (
              <button key={z} onClick={()=>{ setZone(z); setStep('driving'); }} style={{
                padding:'8px 4px', borderRadius:10, cursor:'pointer',
                border: active?`2px solid ${accent}`:'1px solid #E9EBEE',
                background: active? `${accent}14` : '#fff',
                fontSize:11, fontWeight:600, color: active? accent : '#1A1A1A',
                display:'flex', flexDirection:'column', alignItems:'center', gap:4,
              }}>
                <div style={{ width:20, height:20, borderRadius:5,
                  background: z==='reward'?'rgba(34,197,94,0.25)':z==='charge'?'rgba(0,136,255,0.25)':z==='noPark'?'rgba(141,146,153,0.30)':z==='outside'?'rgba(0,0,0,0.10)':'#E9EBEE',
                  border:`1.5px ${z==='outside'?'dashed':'solid'} ${accent}` }}/>
                {labels[z]}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── Map-layer overview card (city scale) ─── */
function MapOverviewCard() {
  const W = 360, H = 540;
  return (
    <div style={{ width:W, height:H, borderRadius:18, overflow:'hidden', background:'#e8eaed',
      boxShadow:'0 0 0 1px rgba(0,0,0,.05)', position:'relative' }}>
      <ZoneMap width={W} height={H} userPos={{x:0.5,y:0.5}} showZones showCars={false} showStations={true} hatchOutside/>
      {/* Legend */}
      <div style={{ position:'absolute', left:12, top:12, background:'rgba(255,255,255,.95)',
        backdropFilter:'blur(8px)', borderRadius:12, padding:'10px 12px', fontSize:11,
        boxShadow:'0 2px 10px rgba(0,0,0,.12)' }}>
        <div style={{ fontWeight:700, color:'#1A1A1A', marginBottom:6, fontSize:11, textTransform:'uppercase', letterSpacing:0.5 }}>Zones</div>
        <LegendRow color="#22C55E" label="Reward · −1 €"/>
        <LegendRow color="#0088FF" label="Charge · +1 €"/>
        <LegendRow color="#5B6066" label="No park"/>
        <LegendRow color="#1A1A1A" label="Outside" dashed/>
      </div>
    </div>
  );
}
function LegendRow({ color, label, dashed }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, padding:'2px 0' }}>
      <div style={{ width:14, height:14, borderRadius:3,
        background: `${color}33`, border:`1.5px ${dashed?'dashed':'solid'} ${color}` }}/>
      <span>{label}</span>
    </div>
  );
}

/* ─── Concept hero card (intro panel) ─── */
function ConceptIntro() {
  return (
    <div style={{ width:540, padding:'28px 30px', background:'#fff', borderRadius:18,
      boxShadow:'0 0 0 1px rgba(0,0,0,.05)', fontFamily:'"Helvetica Now Text", system-ui' }}>
      <div className="p100-eyebrow">SIXT Share · Concept</div>
      <h1 style={{ fontFamily:'"Helvetica Now Display", system-ui', fontWeight:900, fontSize:40,
        lineHeight:0.95, margin:'8px 0 14px', letterSpacing:0.4, textTransform:'uppercase', color:'#1A1A1A' }}>
        Drop-off Zones,<br/>built for the moment that matters
      </h1>
      <p style={{ fontSize:14, lineHeight:1.55, color:'#656A6F', margin:0 }}>
        Drop-off zones only matter <b style={{color:'#1A1A1A'}}>when the trip ends</b>. So we keep them quiet during the drive,
        nudge gently when entering a fee zone, and make the end-trip moment crystal-clear about cost. A discovery
        path is always one tap away — a permanent map icon and the in-trip menu both open the “Know your zones” explainer.
      </p>
      <div style={{ marginTop:20, display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
        <Pillar title="During the drive" desc="Subtle zone chip below the points pill. Adaptive — escalates to a colored callout only when there's a fee, reward or block."/>
        <Pillar title="At end-of-trip" desc="A zone-aware sheet shows the zone, the price delta and — if a free spot is < 500 m away — a one-tap alternative."/>
        <Pillar title="On the map" desc="Toggleable layer in the right rail. Off by default; on automatically the moment you slow to park."/>
        <Pillar title="In the receipt" desc="Reward zones get a quiet celebration. Charge zones get a clean line-item — no surprises."/>
      </div>
    </div>
  );
}
function Pillar({ title, desc }) {
  return (
    <div style={{ padding:'12px 14px', background:'#F4F5F6', borderRadius:12 }}>
      <div style={{ fontSize:13, fontWeight:700, color:'#1A1A1A', marginBottom:4 }}>{title}</div>
      <div style={{ fontSize:11, lineHeight:1.45, color:'#656A6F' }}>{desc}</div>
    </div>
  );
}

/* ─── App root ─── */
function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  /* Sync canvas pinch-zoom setting with the tweak (initial + on change). */
  React.useEffect(() => {
    window.__dc_pinch_initial = t.pinchZoomEnabled;
    window.postMessage({type:'__dc_set_pinch', enabled: t.pinchZoomEnabled}, '*');
  }, [t.pinchZoomEnabled]);

  /* Push current palette into the global ZONE_TYPES so map fills update. */
  React.useEffect(() => {
    window.applyZoneColors({ rewardColor: t.rewardColor, chargeColor: t.chargeColor });
  }, [t.rewardColor, t.chargeColor]);

  const sharedProps = {
    warningIntensity: t.warningIntensity,
    showAlt: t.showAlternatives,
    zonesVisible: t.zonesVisibleByDefault,
    rewardColor: t.rewardColor,
    chargeColor: t.chargeColor,
  };

  return (
    <>
      <DesignCanvas>
        <DCSection id="intro" title="01 — Concept" subtitle="Adaptive zone communication for SIXT Share, built on the existing in-rental flow.">
          <DCArtboard id="intro-card" label="Concept summary" width={540} height={420}>
            <ConceptIntro/>
          </DCArtboard>
          <DCArtboard id="map-overview" label="City-wide map · zones layer" width={360} height={540}>
            <MapOverviewCard/>
          </DCArtboard>
        </DCSection>

        <DCSection id="proto" title="02 — Interactive prototype" subtitle="Tap the End Trip button on the phone, or use the simulator below to drive into different zones.">
          <DCArtboard id="proto" label="Live prototype · use the zone selector" width={PHONE_W + 24} height={PHONE_H + 130}>
            <PrototypePhone tweaks={t}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="driving-states" title="03 — Driving screen, by zone" subtitle="The in-trip view adapts. Standard is quiet; charge & reward zones surface a tinted callout + a one-tap alternative.">
          <DCArtboard id="d-normal" label="Standard zone · quiet state" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="normal" mode="driving" {...sharedProps} showAlt={false}/>
          </DCArtboard>
          <DCArtboard id="d-reward" label="Reward zone · −1 €" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="reward" mode="driving" {...sharedProps} showAlt={false}/>
          </DCArtboard>
          <DCArtboard id="d-charge" label="Charge zone · +1 € · with alternative" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="charge" mode="driving" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="d-noPark" label="No-park zone · drive-through warning" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="noPark" mode="driving" {...sharedProps} showAlt={false}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="endtrip-states" title="04 — End-trip sheet, by zone" subtitle="The same trigger (End Trip button) opens a different sheet depending on where the user is parked.">
          <DCArtboard id="e-normal" label="Standard · simple confirm" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="normal" mode="endtrip" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="e-reward" label="Reward · celebration + −1 €" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="reward" mode="endtrip" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="e-charge" label="Charge · fee + 'free spot 200m'" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="charge" mode="endtrip" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="e-noPark" label="No-park · blocked" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="noPark" mode="endtrip" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="e-outside" label="Outside · return at SIXT station" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="outside" mode="endtrip" {...sharedProps}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="post" title="05 — Post-trip receipt" subtitle="The zone-related line item is explicit. Rewards get a small celebration; charges are matter-of-fact.">
          <DCArtboard id="p-normal" label="Standard zone · receipt" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="normal" mode="summary" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="p-reward" label="Reward zone · receipt + thanks" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="reward" mode="summary" {...sharedProps}/>
          </DCArtboard>
          <DCArtboard id="p-charge" label="Charge zone · receipt + fee" width={PHONE_W} height={PHONE_H}>
            <StateCard zone="charge" mode="summary" {...sharedProps}/>
          </DCArtboard>
        </DCSection>

        <DCSection id="info" title="06 — Discovery: Know your zones" subtitle="Reachable from the in-trip menu (3-dots) and from a permanent help icon in the right rail.">
          <DCArtboard id="info-screen" label="Know your zones · explainer" width={PHONE_W} height={PHONE_H}>
            <StateCard mode="info"/>
          </DCArtboard>
        </DCSection>

        <DCSection id="anim" title="07 — Animation: crossing zone borders" subtitle="The user pin stays centered as the map slides underneath. Watch the top pill, sheet edge & callout re-skin live, with a 'crossing' chip flying in at each border.">
          <DCArtboard id="zone-anim" label="Looping animation · scrub or play/pause" width={PHONE_W + 24} height={PHONE_H + 100}>
            <ZoneTransitionAnimation rewardColor={t.rewardColor} chargeColor={t.chargeColor}/>
          </DCArtboard>
        </DCSection>
      </DesignCanvas>

      <TweaksPanel>
        <TweakSection label="Canvas"/>
        <TweakToggle label="Trackpad pinch-zoom"
          value={t.pinchZoomEnabled}
          onChange={(v)=>{ setTweak('pinchZoomEnabled', v); window.postMessage({type:'__dc_set_pinch', enabled:v}, '*'); }}/>
        <TweakButton label="Recenter view"
          onClick={()=>window.postMessage({type:'__dc_recenter'}, '*')}/>
        <TweakSection label="Driving screen"/>
        <TweakRadio label="Warning intensity"
          value={t.warningIntensity}
          options={['subtle','adaptive','prominent']}
          onChange={(v)=>setTweak('warningIntensity', v)}/>
        <TweakToggle label="Suggest free alternatives"
          value={t.showAlternatives}
          onChange={(v)=>setTweak('showAlternatives', v)}/>
        <TweakToggle label="Zones layer on by default"
          value={t.zonesVisibleByDefault}
          onChange={(v)=>setTweak('zonesVisibleByDefault', v)}/>

        <TweakSection label="Zone palette"/>
        <TweakColor label="Reward color" value={t.rewardColor}
          options={['#22C55E','#FFBC1F','#6B5DFF']}
          onChange={(v)=>setTweak('rewardColor', v)}/>
        <TweakColor label="Charge color" value={t.chargeColor}
          options={['#0088FF','#6B5DFF','#FFBC1F']}
          onChange={(v)=>setTweak('chargeColor', v)}/>

        <TweakSection label="Copy"/>
        <TweakRadio label="End-trip CTA"
          value={t.ctaCopy}
          options={['fee-explicit','neutral']}
          onChange={(v)=>setTweak('ctaCopy', v)}/>
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App/>);
