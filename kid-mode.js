/* ============================================================
   JUNIOR EXPLORER MODE  —  shared behaviour for the Silent Fleet site
   ------------------------------------------------------------
   Loaded synchronously in <head> so html.kid is set before first paint.
   Nothing is hard-coded into any page's own JS: this layer observes the
   existing DOM, so the quiz engine, comic panels and mobile layout are
   left completely intact.
   ============================================================ */
(function(){
'use strict';

var KEY  = 'ghostAtlasKidMode';
var SKEY = 'ghostAtlasKidStars';
var root = document.documentElement;
var $  = function(s){ return document.querySelector(s); };
var $$ = function(s){ return Array.prototype.slice.call(document.querySelectorAll(s)); };
var byId = function(i){ return document.getElementById(i); };
var esc = function(x){
  return String(x).replace(/[&<>"']/g, function(c){
    return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];
  });
};
var store = {
  get:function(k,d){ try{ var v=localStorage.getItem(k); return v===null?d:v; }catch(e){ return d; } },
  set:function(k,v){ try{ localStorage.setItem(k,v); }catch(e){} }
};

/* ON by default; a page can opt out with <html data-kid-default="off"> */
var defaultOn = root.getAttribute('data-kid-default') !== 'off';
var on     = store.get(KEY, defaultOn ? 'on' : 'off') !== 'off';
var stars  = Math.max(0, parseInt(store.get(SKEY,'0'),10) || 0);
root.classList.toggle('kid', on);
root.setAttribute('data-kid-mode', on ? 'on' : 'off');

/* ---------- Patch's little face (same twin-lens family as the comic) ---------- */
var PATCH = '<svg viewBox="0 0 100 100" aria-hidden="true">' +
  '<rect x="6" y="6" width="88" height="88" rx="22" fill="#ffe4bd" stroke="#12141f" stroke-width="5"/>' +
  '<g transform="rotate(-7 50 44)">' +
    '<rect x="14" y="20" width="34" height="34" rx="13" fill="#efe2c5" stroke="#12141f" stroke-width="4"/>' +
    '<rect x="52" y="20" width="34" height="34" rx="13" fill="#efe2c5" stroke="#12141f" stroke-width="4"/>' +
    '<circle cx="31" cy="37" r="11" fill="#a85c27"/><circle cx="69" cy="37" r="11" fill="#a85c27"/>' +
    '<circle cx="31" cy="37" r="6.5" fill="#130e18"/><circle cx="69" cy="37" r="6.5" fill="#130e18"/>' +
    '<circle cx="27" cy="33" r="3.2" fill="#fffaf0"/><circle cx="65" cy="33" r="3.2" fill="#fffaf0"/>' +
  '</g>' +
  '<path d="M34 72 Q50 84 66 72" fill="none" stroke="#12141f" stroke-width="4" stroke-linecap="round"/>' +
  '<circle cx="20" cy="66" r="4" fill="#e2662d"/><circle cx="80" cy="66" r="4" fill="#e2662d"/>' +
'</svg>';

/* A COMPLETE little face for the edge tab on reading pages. Clipping the big
   face to a 26px sliver looked like a chopped-off head, so the 26px tab gets
   its own artwork: two whole eyes, a smile and a pull-to-open chevron. Its
   narrow footprint stays inside the right-hand gutter, so no word is hidden. */
var PATCH_MINI = '<svg viewBox="0 0 26 64" aria-hidden="true">' +
  '<path d="M9 12 L5 16 L9 20" fill="none" stroke="#12141f" stroke-width="2" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
  '<g transform="rotate(-6 13 30)">' +
    '<rect x="3" y="23" width="9.5" height="13" rx="4.75" fill="#efe2c5" stroke="#12141f" stroke-width="2"/>' +
    '<rect x="13.5" y="23" width="9.5" height="13" rx="4.75" fill="#efe2c5" stroke="#12141f" stroke-width="2"/>' +
    '<circle cx="7.75" cy="29.5" r="3.3" fill="#a85c27"/>' +
    '<circle cx="18.25" cy="29.5" r="3.3" fill="#a85c27"/>' +
    '<circle cx="7.75" cy="29.5" r="2" fill="#130e18"/>' +
    '<circle cx="18.25" cy="29.5" r="2" fill="#130e18"/>' +
    '<circle cx="6.8" cy="28.2" r=".95" fill="#fffaf0"/>' +
    '<circle cx="17.3" cy="28.2" r=".95" fill="#fffaf0"/>' +
  '</g>' +
  '<path d="M7 44 Q13 49.5 19 44" fill="none" stroke="#12141f" stroke-width="2.4" stroke-linecap="round"/>' +
  '<circle cx="3.5" cy="42" r="1.5" fill="#e2662d"/><circle cx="22.5" cy="42" r="1.5" fill="#e2662d"/>' +
'</svg>';

/* ---------- plain-language relabels (element-level, fully reversible) ---------- */
var RELABELS = [
  /* navigation — present on most pages */
  {s:'.mobilenav a[href="#desk"]',        t:'⌨️ Answer desk'},
  {s:'.mobilenav a[href="#map"]',         t:'🗺️ Space map'},
  {s:'.mobilenav a[href*="patchwork"]',   t:'📖 Patch\'s comic'},
  {s:'.mobilenav a[href*="concepts"]',    t:'📚 More pages'},
  {s:'.mobilenav a[href*="05-the-deep-dive"]', t:'🎮 Old quiz'},
  {s:'.hud a.nav[href*="patchwork"]',     t:'📖 Meet Patch'},
  {s:'.hud a.nav[href*="concepts"]',      t:'📚 More pages'},
  {s:'.hud a.nav[href*="05-the-deep-dive"]', t:'🎮 Old quiz'},
  {s:'.sitenav .home',                    t:'◀ Back to the Space Map'},
  {s:'.sitenav a[href*="patchwork"]',     t:'📖 My comic'},
  {s:'.sitenav a[href*="concepts"]',      t:'📚 More pages'},
  {s:'.sitenav a[href*="06-ghost-atlas"]',t:'🗺️ Map only'},
  {s:'.sitenav a[href*="05-the-deep-dive"]', t:'🎮 Old quiz'},
  {s:'.storycta',                         t:'📖 Meet Patch! <span>the comic that starts our whole story</span>'},
  {s:'.playcta',                          t:'▶ Let\'s play the Space Map!'},
  /* the main atlas */
  {s:'.hud .brand',                       t:'⭐ SPACE DETECTIVE CLUB'},
  {s:'.hud .barwrap .lbl',                t:'Clues we found so far'},
  {s:'.mast-side summary span:first-child', t:'▮ How to play — 3 easy steps!'},
  {s:'.mast-side .mix', t:'This game mixes three ideas: a <b>map</b> of space places, '
    + '<b>comic stories</b> with real facts, and a <b>typing game</b> where you guess names. '
    + '<b>Chapter Zero: PATCHWORK</b> is my story — <a href="patchwork.html">read the comic first</a>, '
    + 'then play. Every right answer gives me a new word!'},
  {s:'.col-map .sec-head h2',             t:'🗺️ The Space Map'},
  {s:'.col-map .sec-head .note',          t:'Tap a glowing dot to read its story'},
  {s:'.col-desk .sec-head h2',            t:'⌨️ The Answer Desk'},
  {s:'.col-cards .sec-head h2',           t:'📚 All the space stories'},
  {s:'.col-cards .sec-head .note',        t:'Tap a card to open its comic'},
  {s:'.console .stamp',                   t:'⭐ YOUR DESK'},
  {s:'.console h3',                       t:'What can you name?'},
  {s:'.console .sub',                     t:'Tap a big answer button below — or type it if you like! Every right name earns a star.'},
  {s:'#beginBtn',                         t:'▶ Start playing!'},
  {s:'#againBtn',                         t:'▶ Play again!'},
  {s:'.patchbag b.pb',                    t:'▮ PATCH\'S WORD BAG'},
  {s:'.ledger .sec-head h2',              t:'🔎 What did we find?'},
  {s:'.method h4',                        t:'▮ How the space map works'},
  {s:'.quizlet h4',                       t:'▮ One big question'},
  {s:'.notes h4',                         t:'▮ My discoveries'}
];
var STAT_LABELS = ['How deep ⬇','Stars ⭐','Places found','Tries left'];
/* The three how-to steps get a full plain-language rewrite rather than a
   word-by-word swap, so the sentences still read naturally to an 8-year-old. */
var HOW_STEPS = [
  '<b>1. Look 👀</b> Tap a glowing dot on the map to read its comic story.',
  '<b>2. Answer 👆</b> Tap a big answer button — or type it if you can. Each right name puts a star-clue on the map!',
  '<b>3. Spot the pattern 🔎</b> When clues bunch together, you have found a real space secret.'
];

/* jargon buster — text nodes only, inside quiet prose areas (never questions/art) */
var PHRASES = [
  ['investigation','space detective game'], ['Investigation','Space detective game'],
  ['evidence','clues'],                     ['Evidence','Clues'],
  ['inference','smart guess'],              ['Inference','Smart guess'],
  ['descent','dive'],                       ['Descent','Dive'],
  ['case file','comic story'],              ['Case file','Comic story'],
  ['beacons','glowing dots'],               ['Beacons','Glowing dots'],
  ['beacon','glowing dot'],                 ['Beacon','Glowing dot'],
  ['verify','check'],                       ['Verify','Check'],
  ['zone','place'],                         ['Zone','Place']
];
var PHRASE_SCOPES = '.mapfoot,.method,.objectives,.steps,.ledger-note,' +
                    '.quizlet p,.notes li,.console .sub,.sec-head .note,.panhint,footer,.mobilelegend,' +
                    '.cap,.cdialog,.factbox,.factbox p,.drawer .sub,.endnote';

/* ---------- NEW: age 7-8 layer ----------
   Simple zone names, simple question stems and a tap-to-answer picker,
   because most 7-8 year olds cannot spell "descent stage" yet. */
var KID_ZONES = [
  'Home ground',            /* 0 Surface */
  'Just above Earth',       /* 1 Low Earth Orbit */
  'The radiation rings',    /* 2 Van Allen Belts */
  'Between Earth and the Moon', /* 3 Cislunar Space */
  'The Moon',               /* 4 Lunar Surface */
  'Going around the Sun',   /* 5 Solar Orbit */
  'The road to Mars',       /* 6 Martian Transfer */
  'Mars',                   /* 7 Martian Surface */
  'The rocky belt',         /* 8 Asteroid Belt */
  "Jupiter's neighbourhood",/* 9 Jovian System */
  "Saturn's neighbourhood", /* 10 Saturnian System */
  'The icy edge',           /* 11 Kuiper Belt */
  'Where the Sun\'s wind ends', /* 12 Heliopause */
  'Deep space'              /* 13 Interstellar Space */
];
/* Question stems rewritten as short "what/tell me" questions. Each entry is
   [regex, replacement] applied to the DISPLAYED question only (#qText). */
var KID_Q = [
  [/^Name something NASA left behind on the Moon\.?$/i, 'What did NASA leave on the Moon? 🌙'],
  [/^Name something NASA left behind (on|in|at) (.+?)\.?$/i, 'What did NASA leave $1 $2?'],
  [/^Name a piece of NASA hardware (that|which) (.+?)\.?$/i, 'Which NASA machine $2?'],
  [/^Name a piece of (.+?) hardware\.?$/i, 'What NASA machine is part of $1?'],
  [/^Name one (.+?)\.?$/i, 'Tell me one $1!'],
  [/^Give one (.+?)\.?$/i, 'Tell me one $1!'],
  [/^Name something (.+?)\.?$/i, 'What is something $1?'],
  [/^Name a (.+?)\.?$/i, 'What is a $1?']
];
function kidQuestion(text){
  var out = String(text).trim(), i;
  for(i = 0; i < KID_Q.length; i++){
    if(KID_Q[i][0].test(out)){ out = out.replace(KID_Q[i][0], KID_Q[i][1]); break; }
  }
  out = out.split('NASA hardware').join('NASA machine')
           .split('spacecraft').join('space machine')
           .split('instrument').join('science tool');
  return out;
}
var kidPicker = null, kidPickerQ = '', kidQSeen = '';

var TIPS = [
  '👋 Hi! I am <b>Patch</b>. Tap a glowing dot to read its story!',
  '⭐ A right answer = 1 star. Stars also give me new words!',
  '🗺️ The dots show where old machines are floating in space.',
  '💡 Stuck? Tap <b>Give me a hint</b>. Asking is smart!',
  '📖 My comic is called Chapter Zero. It tells how I was built!',
  '🔎 The dots that bunch together hold a space secret!'
];

/* ---------- state ---------- */
var savedHTML  = new Map();   /* element -> original innerHTML */
var savedNodes = new Map();   /* text node -> original value */
var hintLevel  = 0, tipIndex = 0, peekValue = '';
var lastQ = '', lastChips = 0, endDone = false, hSrcOrig = '';
var dock, sw, jar, badge, buddy, bubble, msg, btns, toastEl, toastTimer;

function keep(el, html){
  if(!el) return;
  if(!savedHTML.has(el)) savedHTML.set(el, el.innerHTML);
  el.innerHTML = html;
}
function applyText(){
  RELABELS.forEach(function(r){
    var els = $$(r.s);
    if(!els.length) return;
    els.forEach(function(el){ keep(el, r.t); });
  });
  $$('.hud .stat .lbl').forEach(function(el,i){
    if(STAT_LABELS[i]) keep(el, STAT_LABELS[i]);
  });
  $$('.mast-side .how-body ol li').forEach(function(el,i){
    if(HOW_STEPS[i]) keep(el, HOW_STEPS[i]);
  });
  if(window.__G){
    var ALL_PHRASES = PHRASES.concat(ZONE_NAMES.map(function(n,i){ return [n, KID_ZONES[i]]; }));
    $$(PHRASE_SCOPES).forEach(function(scope){
      var tw = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, null, false), n, out, orig;
      while((n = tw.nextNode())){
        if(!n.nodeValue || !n.nodeValue.trim()) continue;
        if(n.parentNode && /^(SCRIPT|STYLE|SVG)$/.test(n.parentNode.tagName)) continue;
        orig = n.nodeValue; out = orig;
        ALL_PHRASES.forEach(function(p){ out = out.split(p[0]).join(p[1]); });
        if(out !== orig){ if(!savedNodes.has(n)) savedNodes.set(n, orig); n.nodeValue = out; }
      }
    });
  }
  dynamic();
}
function restoreText(){
  savedHTML.forEach(function(html,el){ if(el.isConnected) el.innerHTML = html; });
  savedHTML.clear();
  savedNodes.forEach(function(txt,n){ if(n.parentNode) n.nodeValue = txt; });
  savedNodes.clear();
  unpolish();
}

/* ---------- dynamic strings produced by the quiz engine ---------- */
function dynamic(){
  var e = byId('qNum');
  if(e && /^Prompt /.test(e.textContent)){
    var raw = e.textContent;
    if(raw !== lastQ){ lastQ = raw; hintLevel = 0; peekValue = ''; }
    e.textContent = raw.replace(/^Prompt /, 'Question ');
  }
  e = byId('qTopic');
  if(e && /^Topic · /.test(e.textContent)){
    e.textContent = e.textContent
      .replace(/^Topic · /, 'We are learning about ')
      .replace(/ · zone /, ' · place ');
  }
  var inp = byId('qInput');
  if(inp){
    if(inp.placeholder.indexOf('Begin the investigation') === 0) inp.placeholder = 'Tap START, then type your guess here…';
    else if(inp.placeholder.indexOf('Type an answer') === 0) inp.placeholder = 'Type your guess here…';
  }
  var nx = byId('qNext');
  if(nx && nx.classList.contains('on')){
    if(nx.textContent.indexOf('Continue descent') > -1) nx.textContent = 'Next question →';
    else if(nx.textContent.indexOf('Close the case file') > -1) nx.textContent = 'See my stars! →';
  }
  var pw = byId('patchWords');
  if(pw && pw.textContent.indexOf('no words yet') > -1){
    pw.textContent = 'no words yet — each right answer gives Patch a new word!';
  }
  var src = byId('hSrc');
  if(src && /archive/i.test(src.textContent)){
    hSrcOrig = src.textContent;
    src.textContent = '📚 story box ready';
  }
  var ex = byId('qExplain');
  if(ex && ex.textContent.indexOf('Not in the archive') > -1){
    ex.innerHTML = '<b>💪 Not quite!</b> Try another space name — a mission, a robot or a tool. ' +
                   'You can always ask Patch for a hint!';
  }
  kidQuiz();
}
/* ---------- NEW: tap-to-answer picker + spoken question (age 7-8) ---------- */
var PICK_EMOJI = ['🚀','🛰️','🌙','🪐','☄️','🔭','🌍','⭐','🤖','🧑‍🚀'];
function kidAutoRead(){ return store.get('ghostAtlasKidAutoRead','on') !== 'off'; }
function speak(text){
  if(!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance) return;
  try{
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(String(text).replace(/[★⭐🚀🛰️🌙🪐☄️🔭🌍🤖🧑‍🚀👆💡📖🔎⭐❤️]/g,''));
    u.rate = 0.85; u.pitch = 1.15;
    window.speechSynthesis.speak(u);
  }catch(e){}
}
function kidActiveQ(){
  var G = window.__G;
  if(!G || !G.S || !G.QUESTIONS || !G.QUESTIONS[G.S.qi]) return null;
  if(!G.S.started || G.S.over || G.S.locked) return null;
  var inp = byId('qInput');
  if(!inp || inp.disabled) return null;
  return G.QUESTIONS[G.S.qi];
}
function pickButtons(q){
  var correct = null, i;
  var found = window.__G.S.found || [];
  for(i = 0; i < q.answers.length; i++){
    if(found.indexOf(q.answers[i].display) === -1){ correct = q.answers[i]; break; }
  }
  if(!correct) return null;
  var pool = (window.__G.POOL || []).map(function(x){ return x.answers[0]; })
    .concat((window.__G.QUESTIONS || []).map(function(x){ return x.answers[0]; }));
  var names = q.answers.map(function(a){ return a.display.toLowerCase(); });
  var bag = [], seen = {};
  for(i = 0; i < pool.length && bag.length < 12; i++){
    var a = pool[i];
    if(!a || !a.display) continue;
    var d = a.display.toLowerCase();
    if(seen[d] || names.indexOf(d) > -1) continue;
    var bad = names.some(function(n){ return d.indexOf(n) > -1 || n.indexOf(d) > -1; });
    if(bad) continue;
    seen[d] = 1; bag.push(a.display);
  }
  bag.sort(function(){ return Math.random() - 0.5; });
  var choices = [correct.display].concat(bag.slice(0, 2));
  choices.sort(function(){ return Math.random() - 0.5; });
  return { correct: correct, choices: choices };
}
function kidQuiz(){
  var G = window.__G;
  var qtext = byId('qText'), qtopic = byId('qTopic');
  /* displayed question + topic line get the simple reading-level rewrite */
  if(qtext && qtext.textContent.trim() && qtext.textContent !== '—'){
    var simple = kidQuestion(qtext.textContent);
    if(simple !== qtext.textContent){
      if(!savedHTML.has(qtext)) savedHTML.set(qtext, qtext.innerHTML);
      qtext.innerHTML = esc(simple);
    }
    if(qtopic){
      var t = qtopic.textContent, t2 = t, zi;
      for(zi = 0; zi < ZONE_NAMES.length && window.__G && window.__G.ZONES; zi++){
        t2 = t2.split(window.__G.ZONES[zi].t).join(KID_ZONES[zi]);
      }
      t2 = t2.replace(/^Topic · /, 'Where? ').replace(/ · zone /, ' · place ');
      if(t2 !== t && !savedHTML.has(qtopic)) savedHTML.set(qtopic, qtopic.innerHTML);
      if(t2 !== t) qtopic.textContent = t2;
    }
  }
  /* the picker itself (atlas only — page 05 does not expose submitAnswer) */
  if(!G || !byId('beginBtn')) return;
  var consoleEl = $('.console');
  if(!consoleEl) return;
  if(!kidPicker){
    kidPicker = document.createElement('div');
    kidPicker.className = 'kidpick';
    kidPicker.id = 'kidPick';
    kidPicker.innerHTML = '<div class="kidpick-h">👆 Too hard to type? Tap an answer!</div>'
      + '<div class="kidpick-btns" id="kidPickBtns"></div>'
      + '<div class="kidpick-foot">'
      + '<button type="button" class="kidpickread" id="kidPickRead">🔊 Read the question</button>'
      + '<button type="button" class="kidpickread" id="kidPickAuto">🔇 Auto-read: ON</button>'
      + '</div>';
    var timerEl = consoleEl.querySelector('.timer');
    if(timerEl) consoleEl.insertBefore(kidPicker, timerEl);
    else consoleEl.appendChild(kidPicker);
    byId('kidPickBtns').addEventListener('click', function(e){
      var b = e.target.closest('button.kidchoice');
      if(!b) return;
      var inp = byId('qInput');
      if(!inp || inp.disabled) return;
      inp.value = b.getAttribute('data-v');
      if(G.submitAnswer){ G.submitAnswer(); }
      setTimeout(kidQuiz, 60);
    });
    byId('kidPickRead').addEventListener('click', function(){
      var t = byId('qText');
      if(window.speechSynthesis && window.speechSynthesis.speaking){
        window.speechSynthesis.cancel(); toast('🔇 Stopped reading.'); return;
      }
      if(t) speak(t.textContent);
    });
    byId('kidPickAuto').addEventListener('click', function(){
      var v = kidAutoRead();
      store.set('ghostAtlasKidAutoRead', v ? 'off' : 'on');
      this.textContent = v ? '🔊 Auto-read: OFF' : '🔇 Auto-read: ON';
      if(!v){ var t = byId('qText'); if(t) speak(t.textContent); }
    });
  }
  var q = kidActiveQ(), btnsEl = byId('kidPickBtns');
  if(!q || !btnsEl){ kidPicker.style.display = 'none'; return; }
  var picked = pickButtons(q);
  if(!picked){ kidPicker.style.display = 'none'; return; }
  kidPicker.style.display = '';
  var sig = q.id + '|' + picked.choices.join('|');
  if(sig !== kidPickerQ){
    kidPickerQ = sig;
    var html = '', i, em;
    for(i = 0; i < picked.choices.length; i++){
      em = PICK_EMOJI[(q.id.length + i * 3) % PICK_EMOJI.length];
      html += '<button type="button" class="kidchoice" data-v="' + esc(picked.choices[i]) + '">'
            + '<span class="kce">' + em + '</span>' + esc(picked.choices[i]) + '</button>';
    }
    btnsEl.innerHTML = html;
    byId('kidPickAuto').textContent = kidAutoRead() ? '🔇 Auto-read: ON' : '🔊 Auto-read: OFF';
    if(kidAutoRead()) speak(kidQuestion(q.prompt || (byId('qText') || {}).textContent || ''));
  }
}
var ZONE_NAMES = ['Surface','Low Earth Orbit','Van Allen Belts','Cislunar Space','Lunar Surface',
  'Solar Orbit','Martian Transfer','Martian Surface','Asteroid Belt','Jovian System',
  'Saturnian System','Kuiper Belt','Heliopause','Interstellar Space'];

function unpolish(){
  if(kidPicker){ kidPicker.style.display = 'none'; kidPickerQ = ''; }
  if('speechSynthesis' in window){ try{ window.speechSynthesis.cancel(); }catch(e){} }
  var e = byId('qNum');
  if(e) e.textContent = e.textContent.replace(/^Question /, 'Prompt ');
  e = byId('qTopic');
  if(e) e.textContent = e.textContent
    .replace(/^We are learning about /, 'Topic · ')
    .replace(/ · place /, ' · zone ');
  var inp = byId('qInput');
  if(inp){
    if(inp.placeholder === 'Tap START, then type your guess here…') inp.placeholder = 'Begin the investigation to type…';
    else if(inp.placeholder === 'Type your guess here…') inp.placeholder = 'Type an answer, press Enter…';
  }
  var nx = byId('qNext');
  if(nx){
    if(nx.textContent === 'Next question →') nx.textContent = 'Continue descent ▼';
    else if(nx.textContent === 'See my stars! →') nx.textContent = 'Close the case file ▼';
  }
  var pw = byId('patchWords');
  if(pw && pw.textContent === 'no words yet — each right answer gives Patch a new word!'){
    pw.textContent = 'no words yet — every correct answer becomes a word Patch keeps';
  }
  var src = byId('hSrc');
  if(src && hSrcOrig) src.textContent = hSrcOrig;
}

/* ---------- rewards ---------- */
function updateJar(){
  if(jar) jar.textContent = '⭐ ' + stars + ' star' + (stars === 1 ? '' : 's');
  if(badge) badge.textContent = String(stars);
}
function toast(text){
  if(!toastEl) return;
  toastEl.textContent = text;
  toastEl.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(function(){ toastEl.classList.remove('show'); }, 2700);
}
function award(n, text){
  stars += n;
  store.set(SKEY, String(stars));
  updateJar();
  toast(text);
}
function checkFound(){
  var f = byId('qFound');
  if(!f) return;
  var n = f.querySelectorAll('.chip').length;
  if(n > lastChips){
    lastChips = n;
    var last = f.lastElementChild, b = last && last.querySelector('b');
    var name = b ? b.textContent : 'a space machine';
    award(1, '⭐ Awesome! You found ' + name + '!');
  } else if(n < lastChips) lastChips = n;
}
function checkEnd(){
  if(endDone) return;
  var b = byId('endBox');
  if(b && getComputedStyle(b).display !== 'none'){
    endDone = true;
    award(3, '🏅 Case closed! You are a real space detective!');
  }
}

/* ---------- Patch's helper ---------- */
function say(html){
  if(!msg || !dock) return;
  msg.innerHTML = html;
  dock.classList.add('open');
}
function nextTip(){
  say(TIPS[tipIndex % TIPS.length]);
  tipIndex++;
}
function currentQ(){
  var G = window.__G;
  if(!G || !G.QUESTIONS || !G.S) return null;
  var q = G.QUESTIONS[G.S.qi];
  return q ? {q:q, zone:G.ZONES[q.zone]} : null;
}
function hint(){
  var c = currentQ();
  if(!c){
    say('🔎 I give clues on the <b>Space Map</b> page while you play. '
      + '<a href="index.html">Take me there →</a>');
    return;
  }
  if(!window.__G.S.started){
    say('▶ Tap <b>Start playing!</b> first, then I can give you a clue.');
    return;
  }
  hintLevel = Math.min(3, hintLevel + 1);
  var zKidName = c.zone.t;
  var zi = ZONE_NAMES.indexOf(c.zone.t);
  if(zi > -1) zKidName = KID_ZONES[zi];
  if(hintLevel === 1){
    say('🔎 We are looking near <b>' + esc(zKidName) + '</b>. The topic is <b>' + esc(c.q.topic)
      + '</b>. Read the question out loud, then try any name you know!');
  } else if(hintLevel === 2){
    var letters = [];
    c.q.answers.slice(0, 8).forEach(function(a){
      var ch = (a.display || '').trim().charAt(0).toUpperCase();
      if(ch && letters.indexOf(ch) < 0) letters.push(ch);
    });
    say('💡 Some right answers start with: <b>' + esc(letters.slice(0, 4).join(', '))
      + '</b>. Any real name from this place counts — even a simple one!');
  } else {
    var a = c.q.answers[0];
    peekValue = (a.match && a.match[0]) || a.display;
    say('🤝 It is OK to peek — that is how we learn! One answer is <b>' + esc(a.display) + '</b>. '
      + (a.note ? esc(a.note) : '') + ' <button type="button" class="kiduse">Use this answer</button>');
  }
}
function readAloud(){
  if(!('speechSynthesis' in window) || !window.SpeechSynthesisUtterance){
    say('🔇 This browser cannot read out loud. Ask a grown-up to read the story with you!');
    return;
  }
  var intro = byId('kidIntro'), story = $('.story'), txt;
  if(intro) txt = intro.innerText;
  else if(story) txt = story.innerText.slice(0, 700);
  else txt = document.title + '. Explore the map, read the stories, and collect stars.';
  try{
    window.speechSynthesis.cancel();
    var u = new SpeechSynthesisUtterance(txt);
    u.rate = 0.9; u.pitch = 1.1;
    window.speechSynthesis.speak(u);
    toast('🔊 Reading to you…');
  }catch(e){ toast('🔇 Reading aloud is not available here.'); }
}

/* ---------- welcome strip ---------- */
function makeIntro(){
  if(!window.__G || byId('kidIntro')) return;
  var wrap = $('.wrap');
  if(!wrap) return;
  var d = document.createElement('div');
  d.className = 'kidintro';
  d.id = 'kidIntro';
  d.innerHTML = '<div class="kidface">' + PATCH + '</div><div>'
    + '<h2>Hi! I am Patch 👋</h2>'
    + '<p>I am a little robot built from old NASA parts. Let\'s be space detectives together! '
    + 'Old machines are still out there in space, and every one has a story.</p>'
    + '<ol><li>👆 Tap a glowing dot to read its comic</li>'
    + '<li>👆 Tap a big answer button below the question</li>'
    + '<li>⭐ Get a star and teach me a new word</li></ol>'
    + '</div>';
  wrap.insertBefore(d, wrap.firstElementChild);
}

/* ---------- dock ---------- */
function buildDock(){
  dock = document.createElement('div');
  dock.className = 'kiddock';
  dock.id = 'kidDock';
  /* Only the atlas has #beginBtn. Every other page is dense reading text,
     so Patch tucks into the right edge there instead of sitting on words. */
  if(!byId('beginBtn')) dock.classList.add('reading');
  dock.innerHTML =
    '<div class="kidbubble" id="kidBubble">'
      + '<span class="kidwho">Patch says</span>'
      + '<div class="kidmsg" id="kidMsg"></div>'
      + '<div class="kidbtns" id="kidBtns">'
        + '<button type="button" data-kid="hint">💡 Give me a hint</button>'
        + '<button type="button" data-kid="tip">🔄 Another tip</button>'
        + (('speechSynthesis' in window) ? '<button type="button" data-kid="read">🔊 Read to me</button>' : '')
        + '<button type="button" data-kid="classic">⚙️ Grown-up view</button>'
        + '<button type="button" data-kid="close">✖ Close</button>'
      + '</div>'
    + '</div>'
    + '<div class="kidrow">'
      + '<span class="kidjar" id="kidJar">⭐ 0 stars</span>'
      + '<button type="button" class="kidswitch" id="kidSwitch" aria-pressed="true">🧒 Junior · ON</button>'
    + '</div>'
    + '<div class="kidbuddywrap">'
      + '<button type="button" class="kidbuddy" id="kidBuddy" aria-label="Talk to Patch">'
        + '<span class="kidfullface">' + PATCH + '</span>'
        + '<span class="kidtabface">' + PATCH_MINI + '</span>'
      + '</button>'
      + '<span class="kidstarbadge" id="kidStarBadge">0</span>'
    + '</div>';
  document.body.appendChild(dock);

  toastEl = document.createElement('div');
  toastEl.className = 'kidtoast';
  toastEl.id = 'kidToast';
  toastEl.setAttribute('role', 'status');
  document.body.appendChild(toastEl);

  sw     = byId('kidSwitch');
  jar    = byId('kidJar');
  badge  = byId('kidStarBadge');
  buddy  = byId('kidBuddy');
  if(buddy) buddy.title = 'Tap Patch for tips, hints and stars';
  bubble = byId('kidBubble');
  msg    = byId('kidMsg');
  btns   = byId('kidBtns');
  updateJar();

  sw.addEventListener('click', function(){ setMode(!on); });
  buddy.addEventListener('click', function(){
    if(!on){ setMode(true); }
    if(dock.classList.contains('open')) dock.classList.remove('open');
    else nextTip();
  });
  bubble.addEventListener('click', function(e){
    var b = e.target.closest('button');
    if(!b) return;
    if(b.classList.contains('kiduse')){
      var inp = byId('qInput');
      if(inp && peekValue){ inp.value = peekValue; inp.focus(); toast('⌨️ I filled it in — now press Enter!'); }
      return;
    }
    var act = b.getAttribute('data-kid');
    if(act === 'hint') hint();
    else if(act === 'tip') nextTip();
    else if(act === 'read') readAloud();
    else if(act === 'classic') setMode(false);
    else if(act === 'close') dock.classList.remove('open');
  });
  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape' && dock) dock.classList.remove('open');
  });
}

/* ---------- mode switch (no reload, quiz progress survives) ---------- */
function setMode(v){
  on = !!v;
  store.set(KEY, on ? 'on' : 'off');
  root.classList.toggle('kid', on);
  root.setAttribute('data-kid-mode', on ? 'on' : 'off');
  if(sw){
    sw.setAttribute('aria-pressed', String(on));
    sw.textContent = on ? '🧒 Junior · ON' : '🧒 Turn on Junior mode';
  }
  if(dock){
    dock.classList.toggle('classic', !on);
    if(!on) dock.classList.remove('open');
  }
  if(on){
    applyText();
    makeIntro();
    toast('🧒 Junior Explorer is ON — let\'s explore!');
  } else {
    restoreText();
    var i = byId('kidIntro');
    if(i) i.remove();
    toast('⚙️ Classic view is on.');
  }
}

/* ---------- observe the existing engine, never patch it ---------- */
function watch(){
  var ids = ['qNum','qTopic','qInput','qNext','patchWords','hSrc','qFound','qExplain','endBox'];
  var queued = false;
  function schedule(){
    if(queued) return;
    queued = true;
    requestAnimationFrame(function(){
      queued = false;
      if(on) dynamic();
    });
  }
  ids.forEach(function(id){
    var el = byId(id);
    if(!el) return;
    new MutationObserver(function(){
      if(!on) return;
      schedule();
      if(id === 'qFound') checkFound();
      if(id === 'endBox') checkEnd();
    }).observe(el, {childList:true, subtree:true, characterData:true,
                    attributes:true, attributeFilter:['placeholder','class','style','disabled']});
  });
  /* Reading reward on the story pages (the atlas awards stars per answer). */
  if(!window.__G){
    var rewarded = false;
    addEventListener('scroll', function(){
      if(rewarded || !on) return;
      var max = document.documentElement.scrollHeight - innerHeight;
      if(max > 400 && scrollY > max * 0.6){
        rewarded = true;
        award(1, '⭐ You explored a whole space story!');
      }
    }, {passive:true});
  }
}

function boot(){
  buildDock();
  setModeSilently();
  watch();
}
function setModeSilently(){
  if(sw){
    sw.setAttribute('aria-pressed', String(on));
    sw.textContent = on ? '🧒 Junior · ON' : '🧒 Turn on Junior mode';
  }
  if(dock) dock.classList.toggle('classic', !on);
  if(on){ applyText(); makeIntro(); }
}

/* diagnostics for the verification harnesses */
window.__KID = {
  get enabled(){ return on; },
  get stars(){ return stars; },
  get hints(){ return hintLevel; },
  get intro(){ return !!byId('kidIntro'); },
  get dock(){ return !!byId('kidDock'); },
  get reading(){ return !!dock && dock.classList.contains('reading'); },
  get tucked(){ return !!dock && dock.classList.contains('reading') &&
                       !dock.classList.contains('open') && !dock.classList.contains('classic'); },
  get relabeled(){ return savedHTML.size; },
  get bubbleOpen(){ return !!dock && dock.classList.contains('open'); },
  set:function(v){ setMode(v); return on; },
  toggle:function(){ setMode(!on); return on; },
  hint:hint, tip:nextTip, read:readAloud,
  resetStars:function(){ stars = 0; store.set(SKEY,'0'); updateJar(); return stars; }
};

if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', boot, {once:true});
} else {
  boot();
}
})();
