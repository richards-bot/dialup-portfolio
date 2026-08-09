const CONFIG = window.SITE_CONFIG;
if(!CONFIG) throw new Error('site.config.js must load before assets/app.js');

/* ================================================================
   AUDIO — stylised handshake placeholder + bass easter egg
   ================================================================ */
let AC = null;
function ctx(){ if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)(); return AC; }
 
function tone(freqs, t0, dur, gain=0.08, type='sine'){
  const c = ctx(); const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+0.01);
  g.gain.setValueAtTime(gain, t0+dur-0.015);
  g.gain.linearRampToValueAtTime(0, t0+dur);
  g.connect(c.destination);
  freqs.forEach(f=>{
    const o = c.createOscillator();
    o.type = type; o.frequency.value = f;
    o.connect(g); o.start(t0); o.stop(t0+dur);
  });
}
function noise(t0, dur, gain=0.05, low=600, high=3400){
  const c = ctx();
  const len = Math.ceil(c.sampleRate*dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type='bandpass';
  bp.frequency.value = (low+high)/2; bp.Q.value = 0.7;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+0.05);
  g.gain.setValueAtTime(gain, t0+dur-0.2);
  g.gain.linearRampToValueAtTime(0, t0+dur);
  src.connect(bp); bp.connect(g); g.connect(c.destination);
  src.start(t0); src.stop(t0+dur);
}
 
const DTMF = { '0':[941,1336],'1':[697,1209],'2':[697,1336],'3':[697,1477],
               '4':[770,1209],'5':[770,1336],'6':[770,1477],'7':[852,1209],
               '8':[852,1336],'9':[852,1477] };
 
/* --- deliberately approximate V.32bis-inspired placeholder pieces --- */
 
/* ANSam: 2100Hz answer tone, amplitude-wobbled at 15Hz, with phase-reversal
   clicks every 450ms — the "eeeeee..tk..eeeee..tk" bit */
function ansam(t0, dur, gain=0.07){
  const c = ctx();
  const o = c.createOscillator(); o.frequency.value = 2100;
  const g = c.createGain();
  const lfo = c.createOscillator(); lfo.frequency.value = 15;
  const lfoG = c.createGain(); lfoG.gain.value = gain*0.25;
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+0.03);
  g.gain.setValueAtTime(gain, t0+dur-0.03);
  g.gain.linearRampToValueAtTime(0, t0+dur);
  lfo.connect(lfoG); lfoG.connect(g.gain);
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0+dur); lfo.start(t0); lfo.stop(t0+dur);
  // phase-reversal clicks
  for(let tt = t0+0.45; tt < t0+dur; tt += 0.45){
    noise(tt, 0.018, 0.09, 200, 6000);
  }
}
 
/* FSK data warble: one carrier hopping between mark/space freqs with
   pseudo-random bits — the "dee-doo-dee-doo" negotiation chatter */
function fskWarble(f0, f1, t0, dur, gain=0.05, rate=110){
  const c = ctx();
  const o = c.createOscillator(); o.type='sine';
  const g = c.createGain();
g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+0.02);
  g.gain.setValueAtTime(gain, t0+dur-0.03);
  g.gain.linearRampToValueAtTime(0, t0+dur);
  const step = 1/rate;
  for(let tt=0; tt<dur; tt+=step){
    o.frequency.setValueAtTime(Math.random()<0.5? f0:f1, t0+tt);
  }
  o.connect(g); g.connect(c.destination);
  o.start(t0); o.stop(t0+dur);
}
 
/* line-probe "twang": a bent multi-tone chord, played twice — the boioing */
function probeTwang(t0){
  const c = ctx();
  [0, 0.55].forEach(off=>{
    [650, 1300, 1950, 2600].forEach((f,i)=>{
      const o = c.createOscillator();
      o.frequency.setValueAtTime(f*0.82, t0+off);
      o.frequency.exponentialRampToValueAtTime(f, t0+off+0.09);
      const g = c.createGain();
      const amp = 0.045/(i+1);
      g.gain.setValueAtTime(0, t0+off);
      g.gain.linearRampToValueAtTime(amp, t0+off+0.015);
      g.gain.exponentialRampToValueAtTime(0.0005, t0+off+0.42);
      o.connect(g); g.connect(c.destination);
      o.start(t0+off); o.stop(t0+off+0.45);
    });
  });
}
 
/* training static with a slow amplitude ripple — the sustained KSHHHH */
function trainingHiss(t0, dur, gain=0.07){
  const c = ctx();
  const len = Math.ceil(c.sampleRate*dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const d = buf.getChannelData(0);
  for(let i=0;i<len;i++) d[i] = Math.random()*2-1;
  const src = c.createBufferSource(); src.buffer = buf;
  const bp = c.createBiquadFilter(); bp.type='bandpass';
  bp.frequency.value = 1700; bp.Q.value = 0.35;
  const g = c.createGain();
  g.gain.setValueAtTime(0, t0);
  g.gain.linearRampToValueAtTime(gain, t0+0.02);
  // 9Hz ripple gives it that "data-y" churn rather than flat static
  const lfo = c.createOscillator(); lfo.frequency.value = 9;
  const lfoG = c.createGain(); lfoG.gain.value = gain*0.3;
  lfo.connect(lfoG); lfoG.connect(g.gain);
  g.gain.setValueAtTime(gain, t0+dur-0.35);
  g.gain.linearRampToValueAtTime(0, t0+dur);
  src.connect(bp); bp.connect(g); g.connect(c.destination);
  src.start(t0); src.stop(t0+dur);
  lfo.start(t0); lfo.stop(t0+dur);
}
 
/* returns total duration (s) of the handshake audio, scheduled from now */
function playHandshake(){
  const c = ctx(); let t = c.currentTime + 0.1;
  const start = t;
  // dial tone
  tone([350,440], t, 1.0, 0.07); t += 1.15;
  // dial the number: 14400
  for(const digit of '14400'){
    tone(DTMF[digit], t, 0.14, 0.09); t += 0.22;
  }
  t += 0.5;
  // ringback
  tone([440,480], t, 1.4, 0.06); t += 1.9;
  // answer: ANSam with phase-reversal clicks
  ansam(t, 2.7); t += 2.75;
  // V.22 style binary chirps
  for(let i=0;i<10;i++){
    tone([i%2? 1200:2250], t, 0.09, 0.07, 'square'); t += 0.1;
  }
  t += 0.1;
  // dual carriers wobble
  tone([980], t, 0.9, 0.05, 'sawtooth');
  tone([1650], t, 0.9, 0.04, 'sawtooth'); t += 1.0;
  // full-spectrum training hiss
  noise(t, 2.4, 0.06);
  tone([1800], t+0.3, 0.5, 0.02, 'triangle');
  t += 2.5;
  // second data burst — covers the trace/geolocate theatre
  for(let i=0;i<8;i++){
    tone([i%2? 1400:2500], t, 0.07, 0.055, 'square'); t += 0.09;
  }
  noise(t, 3.6, 0.045);
  tone([1200], t+0.8, 0.4, 0.018, 'triangle');
  tone([2100], t+2.0, 0.3, 0.015, 'triangle');
  t += 3.7;
  return t - start;
}
 
/* walking bass easter egg — 12-bar-ish line, plus a habanera tag */
function playBass(){
  const c = ctx(); let t = c.currentTime + 0.05;
  const bpm = 132, beat = 60/bpm;
  // F blues walking line (MIDI numbers)
  const line = [41,45,48,51, 46,50,53,56, 41,45,48,51, 41,48,46,45,
                46,50,53,50, 41,45,48,51, 43,47,50,47, 41,36,38,40, 41];
  line.forEach((m,i)=>{
    const f = 440*Math.pow(2,(m-69)/12);
    const o = c.createOscillator(); o.type='triangle'; o.frequency.value=f;
    const o2 = c.createOscillator(); o2.type='sine'; o2.frequency.value=f/2;
    const g = c.createGain();
    const t0 = t + i*beat;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.22, t0+0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0+beat*0.95);
o.connect(g); o2.connect(g); g.connect(c.destination);
    o.start(t0); o.stop(t0+beat); o2.start(t0); o2.stop(t0+beat);
  });
  return line.length*beat;
}
 
/* ================================================================
   HANDSHAKE SEQUENCE (visual log synced to audio)
   ================================================================ */
const $ = s => document.querySelector(s);
const dialScreen = $('#dial-screen'), hsScreen = $('#hs-screen'),
      termScreen = $('#terminal'), hsLog = $('#hs-log');

function applySiteConfig(){
  const {identity, node, hero, work, about, contact} = CONFIG;
  document.title = `${identity.domain} — NO CARRIER`;
  $('#dial-title').textContent = identity.domain.toUpperCase();
  $('#dial-sub').textContent = `PRIVATE NODE · EST. ${node.established} · ${node.speed} LINE`;
  $('#site-domain').textContent = identity.domain;
  $('#hero-eyebrow').textContent = hero.eyebrow;
  $('#hero-headline').innerHTML = hero.headlineHTML;
  $('#hero-introduction').textContent = hero.introduction;
  work.slice(0,3).forEach((item,index)=>{
    $(`#work-title-${index}`).textContent = item.title;
    $(`#work-meta-${index}`).textContent = item.meta;
    $(`#work-description-${index}`).textContent = item.description;
  });
  about.slice(0,2).forEach((paragraph,index)=>{
    $(`#about-${index}`).textContent = paragraph;
  });
  $('#contact-email').textContent = identity.email;
  $('#contact-email').href = `mailto:${identity.email}`;
  $('#contact-note').textContent = contact.note;
  $('#copyright').textContent = `© ${identity.copyrightYear} ${identity.name}`;
}
applySiteConfig();
 
/* fictional remote signature: unsettling theatre without collecting an IP */
const remoteSignature = 'NODE-' + crypto.getRandomValues(new Uint16Array(1))[0]
  .toString(16).toUpperCase().padStart(4,'0');
 
const GEO_GUESSES = [
  'GEOSTATIONARY ORBIT',
  'A BRANCH OF GREGGS',
  'THE BOTTOM OF THE NORTH SEA',
  'SHED (UNSPECIFIED)',
  'THE YEAR 1986',
  'BEHIND YOU',
];
const geoPick = GEO_GUESSES[Math.floor(Math.random()*GEO_GUESSES.length)];
 
const HS_LINES = [
  [0.0,  'ATDT 0-1-4-4-0-0'],
  [1.2,  'DIALING...'],
  [3.0,  'RING'],
  [4.6,  '<span class="amber">CARRIER DETECTED</span>'],
  [5.3,  'CALLER ID: WITHHELD'],
  [6.1,  '<span class="dim">fingerprinting remote terminal...</span>'],
  [7.1,  `REMOTE SIGNATURE: <span class="amber">${remoteSignature}</span>`],
  [7.9,  'TRACING ROUTE...'],
  [8.5,  '<span class="dim">  1    2ms   192.168.0.1          (that one\'s on you)</span>'],
  [9.1,  `<span class="dim">  2   14ms   core-04.${CONFIG.node.host}.invalid</span>`],
  [9.7,  '<span class="dim">  3   96ms   transatlantic.cable.actual.fish</span>'],
  [10.3, '<span class="dim">  4    *     [REDACTED]</span>'],
  [10.9, 'GEOLOCATING...'],
  [12.0, `LOCATION: <span class="amber">${geoPick}</span>`],
  [12.6, '<span class="dim">confidence: 12%. good enough.</span>'],
  [13.4, 'NEGOTIATING PROTOCOL... V.32bis'],
  [14.1, 'TRAINING EQUALIZER... ########________'],
  [14.8, 'TRAINING EQUALIZER... ################'],
  [15.5, '<span class="bright">CONNECT 14400/ARQ</span>'],
  [16.0, ''],
  [16.2, `Welcome to <span class="bright">${CONFIG.node.systemName}</span>. Handshake complete.`],
];
 
let hsTimers = [], skipped = false;
 
function startDial(){
  skipped = false;
  hsTimers = [];
  hsLog.innerHTML = '';
  dialScreen.classList.remove('active');
  hsScreen.classList.add('active');
  let audioDur = 0;
  if(CONFIG.features.modemAudio){
    try{ audioDur = playHandshake(); }catch(e){ /* no audio, fine */ }
  }
  HS_LINES.forEach(([at, html])=>{
    hsTimers.push(setTimeout(()=>{
      hsLog.innerHTML += (typeof html === 'function' ? html() : html) + '\n';
    }, at*1000));
  });
  hsTimers.push(setTimeout(bootTerminal, Math.max(audioDur, 16.7)*1000 + 500));
}
 
function skipHandshake(){
  if(skipped) return; skipped = true;
  hsTimers.forEach(clearTimeout);
  try{ if(AC){ AC.close(); AC = null; } }catch(e){}
  bootTerminal();
}
 
$('#dial-btn').addEventListener('click', startDial);
$('#skip-btn').addEventListener('click', skipHandshake);
 
/* ================================================================
   TERMINAL
   ================================================================ */
const out = $('#term-out'), promptLine = $('#prompt-line'),
      input = $('#term-input'), caret = $('#fake-caret'), ps1 = $('#ps1');

const session = {
  handle: 'guest', started: null, connected: false,
  badCommands: 0, secretUnlocked: false, sysopSpoke: false
};
const escapeHTML = value => String(value)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#039;');
function updatePrompt(){ ps1.innerHTML = `${escapeHTML(session.handle)}@${escapeHTML(CONFIG.node.host)}:~$&nbsp;`; }
 
function bootBanner(){
  const now = new Date();
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const pad = n => String(n).padStart(2,'0');
  const stamp = `${days[now.getDay()]} ${months[now.getMonth()]} ${now.getDate()} ` +
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ${now.getFullYear()}`;
  return `<span class="dim">SunOS Release 4.1.1 (${escapeHTML(CONFIG.node.systemName)}) #1: ${stamp}
Copyright (c) 1986 Sun Microsystems, Inc.  (allegedly)
mem = 65536K
checking phosphor... OK
mounting /home/guest... OK</span>
<span class="bright">╔══════════════════════════════════════╗
║              ${escapeHTML(CONFIG.node.systemName)}
╚══════════════════════════════════════╝</span>
 
<span class="dim">Login: ${stamp}. Last login: never. first time?</span>
Type <span class="bright">help</span> to see available commands.
 
`;
}
 
const FILES = {
  'about.txt': CONFIG.terminal.aboutFile.join('\n'),
  'contact.txt': `mail:  ${CONFIG.identity.email}\nweb:   you're already here`,
  'projects.txt': CONFIG.terminal.projectsFile.join('\n'),
};

const SECRET_FILE =
`╔══════════════════════════════════════════════════════════╗
║                    YOUR SYSTEM — NFO                    ║
╚══════════════════════════════════════════════════════════╝

${CONFIG.terminal.manifesto.join('\n')}

If you came for the respectable version, run: startx`;
 
const HELP =
`<span class="bright">AVAILABLE COMMANDS</span>
  help          this screen
  handle &lt;name&gt; choose a BBS handle
  whoami        who are you?
  about         who is he?
  finger &lt;user&gt; inspect a user
  uptime        connection age
  ls            list files
  cat &lt;file&gt;    read a file
  contact       reach the sysop
  mail          compose transmission
  play          ♩ = 132
  startx        boot the 2026 version
  clear         wipe phosphor
  exit          hang up
 
<span class="dim">undocumented commands exist. obviously.</span>`;
 
function print(html){ out.innerHTML += html + '\n'; scroll(); }
function scroll(){ termScreen.scrollTop = termScreen.scrollHeight; }
 
function bootTerminal(){
  hsScreen.classList.remove('active');
  termScreen.classList.add('active');
  $('#flash').classList.add('do-flash');
  out.innerHTML = bootBanner();
  session.connected = true;
  session.started ||= Date.now();
  input.disabled = false;
  updatePrompt();
  promptLine.style.display = 'flex';
  focusInput();
  scroll();
  if(!session.sysopSpoke){
    session.sysopSpoke = true;
    setTimeout(()=>{
      if(termScreen.classList.contains('active') && !modern.classList.contains('active')){
        print(`\n<span class="amber">SYSOP:</span> anonymous callers get one chance at a handle.
try <span class="bright">handle &lt;name&gt;</span>.`);
      }
    }, 2600);
  }
}
function focusInput(){ input.focus({preventScroll:true}); }
termScreen.addEventListener('click', focusInput);
 
/* size the input to its content so the block caret sits right after the text */
function syncWidth(){
  input.style.width = (input.value.length * 1 || 0.001) + 'ch';
}
input.addEventListener('input', syncWidth);
 
let history = [], histIdx = -1;
const COMPLETIONS = ['about','cat','clear','contact','date','exit','finger','fortune',
  'hack','handle','help','history','ls','mail','man','ping','play','pwd',
  'startx','sudo','telnet','uname','uptime','whoami'];

function completeInput(){
  const value = input.value;
  const parts = value.trimStart().split(/\s+/);
  const prefix = (parts[0] || '').toLowerCase();
  let matches;
  if(parts.length > 1 && parts[0].toLowerCase() === 'cat'){
    const filePrefix = parts.at(-1).toLowerCase();
    const files = [...Object.keys(FILES), '.secrets/manifesto.nfo'];
    matches = files.filter(f => f.startsWith(filePrefix));
    if(matches.length === 1) input.value = `cat ${matches[0]}`;
  } else {
    matches = COMPLETIONS.filter(c => c.startsWith(prefix));
    if(matches.length === 1) input.value = matches[0];
  }
  if(matches.length > 1) print(`<span class="dim">${matches.join('   ')}</span>`);
  syncWidth();
}
 
input.addEventListener('keydown', e=>{
  if(e.key === 'Enter'){
    const raw = input.value;
    input.value = '';
    syncWidth();
    run(raw);
  } else if(e.key === 'ArrowUp'){
    e.preventDefault();
    if(history.length){ histIdx = Math.max(0, histIdx-1); input.value = history[histIdx]; syncWidth(); }
  } else if(e.key === 'ArrowDown'){
    e.preventDefault();
    if(history.length){ histIdx = Math.min(history.length, histIdx+1); input.value = history[histIdx] ?? ''; syncWidth(); }
  } else if(e.key === 'Tab'){
    e.preventDefault(); completeInput();
  }
});
 
function formatUptime(){
  const seconds = Math.max(0, Math.floor((Date.now() - (session.started || Date.now())) / 1000));
  const mins = Math.floor(seconds / 60);
  return `${String(mins).padStart(2,'0')}:${String(seconds % 60).padStart(2,'0')}`;
}

function hangUp(){
  input.disabled = true;
  print('+++ATH0');
  setTimeout(()=> print('<span class="amber">NO CARRIER</span>'), 500);
  setTimeout(()=>{
    try{ if(AC){ AC.close(); AC = null; } }catch(e){}
    session.connected = false;
    session.started = null;
    session.handle = 'guest';
    session.badCommands = 0;
    session.secretUnlocked = false;
    session.sysopSpoke = false;
    termScreen.classList.remove('active');
    dialScreen.classList.add('active');
    promptLine.style.display = 'none';
    out.innerHTML = '';
    input.disabled = false;
    updatePrompt();
  }, 1350);
}

function run(raw){
  const trimmed = raw.trim();
  const echo = escapeHTML(raw);
  print(`<span class="dim">${escapeHTML(session.handle)}@${escapeHTML(CONFIG.node.host)}:~$</span> ${echo}`);
  const cmd = trimmed.toLowerCase();
  const [name, ...args] = cmd.split(/\s+/);
  const rawArgs = trimmed.split(/\s+/).slice(1);
  if(trimmed){ history.push(raw); }
  histIdx = history.length;
 
  switch(name){
    case '': break;
    case 'help': print(HELP); break;
    case 'handle': {
      const proposed = rawArgs.join('_').replace(/[^a-z0-9_-]/gi,'').slice(0,16);
      if(proposed.length < 2){ print('usage: handle &lt;2-16 letters, numbers, _ or -&gt;'); break; }
      session.handle = proposed;
      updatePrompt();
      print(`<span class="amber">HANDLE ACCEPTED:</span> ${escapeHTML(proposed)}. try not to embarrass it.`);
      break;
    }
    case 'whoami':
      print(`${escapeHTML(session.handle)}. remote signature <span class="amber">${remoteSignature}</span>.\naccess: GUEST / beautifully limited.`); break;
    case 'about': print(FILES['about.txt']); break;
    case 'contact': print(FILES['contact.txt']); break;
    case 'finger': {
      const user = args[0];
      if(!user){ print('finger: usage: finger &lt;user&gt;'); break; }
      if(user === CONFIG.terminal.profileUser.toLowerCase() || user === 'sysop'){
        session.secretUnlocked = true;
        print(`<span class="bright">Login:</span> ${escapeHTML(CONFIG.terminal.profileUser)}        <span class="bright">Name:</span> ${escapeHTML(CONFIG.terminal.profileName)}
<span class="bright">Directory:</span> /home/${escapeHTML(CONFIG.terminal.profileUser)}   <span class="bright">Shell:</span> ${escapeHTML(CONFIG.terminal.shell)}
<span class="bright">On since:</span> ${escapeHTML(CONFIG.node.established)}            <span class="bright">Idle:</span> unlikely
<span class="bright">Plan:</span>
  ${CONFIG.terminal.profilePlan.map(escapeHTML).join('\n  ')}`);
      } else print(`finger: ${escapeHTML(user)}: no such user. possibly wise.`);
      break;
    }
    case 'uptime':
      print(` 22:06  up 40 years, 1 user, load averages: 0.14 0.40 14.40\nconnection: ${formatUptime()} at 14400 baud`); break;
    case 'ls': {
      const base = Object.keys(FILES).join('   ');
      if(args.includes('-a') || args.includes('-la') || args.includes('-al')){
        const secret = session.secretUnlocked ? '.secrets/manifesto.nfo' : '.secrets/';
        print(`.   ..   ${base}   <span class="dim">${secret}</span>`);
      } else print(base);
      break;
    }
    case 'cat': {
      const f = args[0];
      if(!f) print('cat: what file?');
      else if(FILES[f]) print(FILES[f]);
      else if(f === '.secrets/manifesto.nfo'){
        if(session.secretUnlocked) print(`<span class="bright">${SECRET_FILE}</span>`);
        else print('cat: .secrets/manifesto.nfo: permission denied. the sysop has a plan.');
      }
      else if(f === '.secrets' || f === '.secrets/') print('cat: .secrets/: is a directory. nice try.');
      else print(`cat: ${escapeHTML(f)}: no such file`);
      break;
    }
    case 'fortune': {
      const fortunes = [
        'The quieter the deploy, the louder the planning.',
        'A production system is a promise wearing a pager.',
        'You will find what you seek in a file beginning with a dot.',
        'Never trust a computer you cannot lift. — old Sun proverb'
      ];
      print(fortunes[Math.floor(Math.random()*fortunes.length)]); break;
    }
    case 'history':
      print(history.map((h,i)=>`${String(i+1).padStart(3,' ')}  ${escapeHTML(h)}`).join('\n')); break;
    case 'man':
      print(args[0] === 'node'
        ? `${escapeHTML(CONFIG.node.host.toUpperCase())}(1)  serves a portfolio, answers mail, and distrusts daylight.\nSEE ALSO: finger(1), startx(1), uptime(1)`
        : `No manual entry for ${escapeHTML(args[0] || 'nothing')}. try: man node`); break;
    case 'mail':
      print(`opening transmission channel to <a href="mailto:${escapeHTML(CONFIG.identity.email)}">${escapeHTML(CONFIG.identity.email)}</a>...`);
      setTimeout(()=>{ location.href = `mailto:${CONFIG.identity.email}`; }, 600);
      break;
    case 'play': {
      try{
        playBass();
        print(`<span class="amber">♩ = 132</span>  walking in F. thank you, I'm here all week.`);
      }catch(e){ print('audio device not found. imagine a really good bassline.'); }
      break;
    }
    case 'clear':
      out.innerHTML = '<span class="dim">[ phosphor afterimage: barely legible, definitely haunted ]</span>\n'; break;
    case 'exit': case 'logout': case 'logoff': hangUp(); break;
    case 'startx': case 'gui': case 'x': {
      print('starting X server...');
      setTimeout(()=> print('<span class="dim">loading window manager... this may take 40 years</span>'), 500);
      setTimeout(()=> { $('#flash').classList.remove('do-flash'); void $('#flash').offsetWidth; $('#flash').classList.add('do-flash'); showModern(); }, 1400);
      break;
    }
    case 'telnet':
      print('Trying 127.0.0.1...\nConnected to yourself.\nEscape character is \'^]\'.\n<span class="dim">There is no place like 127.0.0.1.</span>'); break;
    case 'sudo':
      print(`${escapeHTML(session.handle)} is not in the sudoers file.\nthis incident will be reported to absolutely no one.`); break;
    case 'rm':
      if(cmd.includes('-rf') && cmd.includes('/'))
        print(`nice try. this filesystem is write-protected by a\nsmall daemon with trust issues.`);
      else print(`rm: permission denied`);
      break;
    case 'hack':
      print(`<span class="amber">HACK THE PLANET! HACK THE PLANET!</span>`); break;
    case 'phrack':
      print('<span class="bright">Phrack Magazine, Volume One, Issue One.</span>\nKnowledge is not a crime. Bad CSS may be.'); break;

    case 'vim': case 'emacs':
      print(`${name}: not installed. ed is the standard text editor.`); break;
    case 'pwd': print('/home/guest'); break;
    case 'uname': print(`SunOS ${escapeHTML(CONFIG.node.host)} 4.1.1 sun4c (upgraded irresponsibly through 1996)`); break;
    case 'date': print(new Date().toString()); break;
    case 'ping': print('PONG. 14400 baud and feeling fine.'); break;
    default:
      session.badCommands++;
      print(`${escapeHTML(name)}: command not found. type <span class="bright">help</span>.`);
      if(session.badCommands === 3){
        print(`<span class="amber">*** INTRUSION DETECTION NOTICE ***</span>\nThree invalid commands. Threat classification: enthusiastic.`);
      }
  }
  scroll();
}
 
/* ================================================================
   MODE SWITCHING — 1996 <-> 2026
   ================================================================ */
const modern = document.getElementById('modern');
const linkStatus = document.getElementById('link-status');

function updateLinkStatus(){
  linkStatus.textContent = session.connected
    ? `LINK: 14.4K · SESSION ${formatUptime()} · ${session.handle.toUpperCase()}`
    : 'LINK: STANDBY · TTY AVAILABLE';
}
setInterval(updateLinkStatus, 1000);
updateLinkStatus();
 
function showModern(){
  modern.classList.add('active');
  document.body.style.overflow = 'auto';
  updateLinkStatus();
}
function showTerminalFromModern(){
  modern.classList.remove('active');
  document.body.style.overflow = 'hidden';
  // if they've never been through the terminal, boot it directly (no handshake)
  if(!termScreen.classList.contains('active')){
    dialScreen.classList.remove('active');
    hsScreen.classList.remove('active');
    bootTerminal();
  } else {
    focusInput();
  }
}
document.getElementById('pro-skip').addEventListener('click', e=>{
  e.preventDefault();
  showModern();
  modern.scrollTop = 0;
});
document.getElementById('tty-btn').addEventListener('click', showTerminalFromModern);
document.getElementById('to-tty').addEventListener('click', showTerminalFromModern);
 
/* keyboard shortcut: any key on dial screen also dials */
document.addEventListener('keydown', e=>{
  if(dialScreen.classList.contains('active') && (e.key==='Enter'||e.key===' ')){
    startDial();
  }
});
