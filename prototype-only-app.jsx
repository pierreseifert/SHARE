/* Standalone prototype-only app — section 02 only.
   Fixed tweaks, no DesignCanvas / no Tweaks panel.
   Phone is centered in viewport. */

const DEFAULT_TWEAKS = {
  warningIntensity: 'adaptive',
  showAlternatives: true,
  zonesVisibleByDefault: true,
  rewardColor: '#22C55E',
  chargeColor: '#0088FF',
  ctaCopy: 'fee-explicit',
};

/* URL params let the walkthrough doc deep-link a specific state:
   ?intensity=subtle|adaptive|prominent
   ?scenario=normal|reward|charge|noPark|outside
   ?step=driving|endtrip|summary|info
   ?zonesVisible=1|0
   ?alt=1|0   (show alternative banner)
   ?sim=0     (hide the zone-simulator card)
*/
function parseParams() {
  const p = new URLSearchParams(window.location.search);
  const tweaks = { ...DEFAULT_TWEAKS };
  if (['subtle','adaptive','prominent'].includes(p.get('intensity'))) tweaks.warningIntensity = p.get('intensity');
  if (p.get('alt') === '0') tweaks.showAlternatives = false;
  if (p.get('alt') === '1') tweaks.showAlternatives = true;
  if (p.get('zonesVisible') === '0') tweaks.zonesVisibleByDefault = false;
  if (p.get('zonesVisible') === '1') tweaks.zonesVisibleByDefault = true;
  const valid = ['normal','reward','charge','noPark','outside'];
  const initialZone = valid.includes(p.get('scenario')) ? p.get('scenario') : 'normal';
  const validStep = ['driving','endtrip','summary','info'];
  const initialStep = validStep.includes(p.get('step')) ? p.get('step') : 'driving';
  const showSim = p.get('sim') !== '0';
  return { tweaks, initialZone, initialStep, showSim };
}
const PARAMS = parseParams();
const TWEAKS = PARAMS.tweaks;

const PHONE_W = 390, PHONE_H = 844;

/* Per-zone target point so the user pin lands visibly INSIDE the chosen zone.
   Coordinates are in 0..1 of the map viewport — see ZONE_SCENE in zone-system.jsx. */
const ZONE_USER_POS = {
  normal:  { x: 0.55, y: 0.50 },  /* between zones */
  reward:  { x: 0.18, y: 0.78 },  /* centroid of reward zone z1 */
  charge:  { x: 0.48, y: 0.25 },  /* centroid of charge zone z3 */
  noPark:  { x: 1.12, y: 0.76 },  /* tuned so pin renders inside no-park zone z4 (map is drawn 1.6× scale) */
  outside: { x: -0.06, y: -0.26 }, /* tuned so pin renders inside outside-business zone z5 (map is drawn 1.6× scale) */
};

function PhoneFrame({ children }) {
  return (
    <div style={{
      width: PHONE_W, height: PHONE_H, borderRadius: 44, overflow:'hidden',
      position:'relative', background:'#000',
      boxShadow:'0 0 0 10px #1a1a1a, 0 30px 60px rgba(0,0,0,.25)',
      fontFamily:'"Helvetica Now Text", system-ui, sans-serif',
    }}>
      <div style={{ position:'absolute', top:11, left:'50%', transform:'translateX(-50%)',
        width:120, height:34, borderRadius:20, background:'#000', zIndex:80 }}/>
      {children}
      <div style={{ position:'absolute', bottom:6, left:0, right:0, display:'flex', justifyContent:'center', zIndex:90, pointerEvents:'none' }}>
        <div style={{ width:130, height:5, borderRadius:3, background:'rgba(0,0,0,0.5)' }}/>
      </div>
    </div>
  );
}

function PrototypePhone({ tweaks, initialZone='normal', initialStep='driving', showSim=true }) {
  const [step, setStep] = React.useState(initialStep);
  const [zone, setZone] = React.useState(initialZone);
  const [zonesVisible, setZonesVisible] = React.useState(tweaks.zonesVisibleByDefault);
  const [touched, setTouched] = React.useState(false);

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
      {showSim && <div style={{ background:'#fff', borderRadius:14, padding:'10px 12px',
        boxShadow:'0 6px 24px rgba(0,0,0,.10), 0 0 0 1px rgba(0,0,0,.04)',
        display:'flex', flexDirection:'column', gap:8, width: PHONE_W }}>
        <div style={{ fontSize:11, fontWeight:700, color:'#656A6F', textTransform:'uppercase', letterSpacing:0.5, padding:'2px 4px' }}>
          Simulate driving into a zone
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6 }}>
          {['normal','reward','charge','noPark','outside'].map(z => {
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
      </div>}
    </div>
  );
}

/* ─── App root: scale to viewport, center ─── */
function App() {
  const STAGE_W = PHONE_W + 24;
  const STAGE_H = PHONE_H + (PARAMS.showSim ? 200 : 40); // phone + simulator card + gap
  const [scale, setScale] = React.useState(1);

  React.useEffect(() => {
    const compute = () => {
      const vw = window.innerWidth - 48;
      const vh = window.innerHeight - 48;
      const s = Math.min(1, vw / STAGE_W, vh / STAGE_H);
      setScale(s);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  return (
    <div style={{
      width:'100vw', height:'100vh', display:'flex', alignItems:'center', justifyContent:'center',
      background:'#f0eee9', padding:24, boxSizing:'border-box', overflow:'hidden',
    }}>
      <div style={{
        width: STAGE_W, height: STAGE_H,
        transform:`scale(${scale})`, transformOrigin:'center center',
      }}>
        <PrototypePhone tweaks={TWEAKS} initialZone={PARAMS.initialZone} initialStep={PARAMS.initialStep} showSim={PARAMS.showSim}/>
      </div>
    </div>
  );
}

/* Capture helper: set state for screenshot scripts.
   Mutates TWEAKS/PARAMS then re-renders. Example:
     __protoSet({intensity:'subtle', scenario:'charge', step:'driving', sim:false, alt:true});
*/
let _PROTO_ROOT = ReactDOM.createRoot(document.getElementById('root'));
window.__protoSet = function(cfg) {
  if (cfg) {
    if (cfg.intensity) TWEAKS.warningIntensity = cfg.intensity;
    if ('alt' in cfg) TWEAKS.showAlternatives = !!cfg.alt;
    if ('zonesVisible' in cfg) TWEAKS.zonesVisibleByDefault = !!cfg.zonesVisible;
    if (cfg.scenario) PARAMS.initialZone = cfg.scenario;
    if (cfg.step) PARAMS.initialStep = cfg.step;
    if ('sim' in cfg) PARAMS.showSim = !!cfg.sim;
  }
  _PROTO_ROOT.render(<App key={Math.random()}/>);
};

/* Read state from URL hash too — used by screenshot tooling that can only set hash, not search.
   Format: #intensity=adaptive&scenario=charge&step=driving&sim=0&alt=1&zonesVisible=1 */
function applyHashConfig() {
  const h = location.hash.replace(/^#/, '');
  if (!h) return;
  const p = new URLSearchParams(h);
  const cfg = {};
  if (p.get('intensity')) cfg.intensity = p.get('intensity');
  if (p.get('scenario')) cfg.scenario = p.get('scenario');
  if (p.get('step')) cfg.step = p.get('step');
  if (p.get('sim') !== null) cfg.sim = p.get('sim') === '1';
  if (p.get('alt') !== null) cfg.alt = p.get('alt') === '1';
  if (p.get('zonesVisible') !== null) cfg.zonesVisible = p.get('zonesVisible') === '1';
  window.__protoSet(cfg);
}
window.addEventListener('hashchange', applyHashConfig);
_PROTO_ROOT.render(<App/>);
