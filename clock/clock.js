// Simple timezone clock app
// Uses Intl.DateTimeFormat with timeZone option

const TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Kolkata',
  'Asia/Tokyo',
  'Australia/Sydney',
  'Pacific/Auckland'
];

const TZ_SELECT = document.getElementById('tz-select');
const ADD_BTN = document.getElementById('add-btn');
const CLEAR_BTN = document.getElementById('clear-btn');
const CLOCKS_EL = document.getElementById('clocks');
const TOGGLE_24 = document.getElementById('24h-toggle');

let clocks = []; // array of timezone strings

function populateSelect(){
  // add common zones plus the user's detected timezone
  const userTZ = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const zones = new Set([userTZ, ...TIMEZONES]);
  TZ_SELECT.innerHTML = '';
  for(const z of zones){
    const opt = document.createElement('option');
    opt.value = z;
    opt.textContent = z;
    TZ_SELECT.appendChild(opt);
  }
}

function save(){
  try{
    localStorage.setItem('th_clocks', JSON.stringify(clocks));
    localStorage.setItem('th_24', TOGGLE_24.checked ? '1' : '0');
  }catch(e){
    // ignore
  }
}

function load(){
  try{
    const raw = localStorage.getItem('th_clocks');
    if(raw){
      const parsed = JSON.parse(raw);
      if(Array.isArray(parsed)) clocks = parsed;
    }
    const t = localStorage.getItem('th_24');
    if(t === '1') TOGGLE_24.checked = true;
  }catch(e){
    // ignore
  }
}

function formatTimeForTZ(tz){
  const options = {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: !TOGGLE_24.checked,
    timeZone: tz,
  };
  // also include date line
  const dateOptions = {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  };

  const dtf = new Intl.DateTimeFormat(undefined, options);
  const ddf = new Intl.DateTimeFormat(undefined, dateOptions);
  const now = new Date();
  return {
    time: dtf.format(now),
    date: ddf.format(now)
  };
}

function makeCard(tz){
  const card = document.createElement('article');
  card.className = 'clock-card';
  card.setAttribute('data-tz', tz);

  const header = document.createElement('div');
  header.className = 'clock-header';

  const name = document.createElement('div');
  name.className = 'tz-name';
  name.textContent = tz;

  const remove = document.createElement('button');
  remove.className = 'remove-btn';
  remove.textContent = 'Remove';
  remove.addEventListener('click', ()=>{
    removeClock(tz);
  });

  header.appendChild(name);
  header.appendChild(remove);

  const timeEl = document.createElement('div');
  timeEl.className = 'time';
  timeEl.setAttribute('aria-label', `Current time in ${tz}`);

  const dateEl = document.createElement('div');
  dateEl.className = 'date';
  dateEl.style.fontSize = '12px';
  dateEl.style.opacity = '0.85';
  dateEl.style.marginTop = '6px';

  card.appendChild(header);
  card.appendChild(timeEl);
  card.appendChild(dateEl);

  return {card, timeEl, dateEl};
}

function render(){
  CLOCKS_EL.innerHTML = '';
  for(const tz of clocks){
    const {card, timeEl, dateEl} = makeCard(tz);
    CLOCKS_EL.appendChild(card);
    // set initial
    const f = formatTimeForTZ(tz);
    timeEl.textContent = f.time;
    dateEl.textContent = f.date;
  }
}

function updateTimes(){
  const items = CLOCKS_EL.querySelectorAll('.clock-card');
  for(const card of items){
    const tz = card.getAttribute('data-tz');
    const timeEl = card.querySelector('.time');
    const dateEl = card.querySelector('.date');
    const f = formatTimeForTZ(tz);
    if(timeEl) timeEl.textContent = f.time;
    if(dateEl) dateEl.textContent = f.date;
  }
}

let tickInterval = null;
function startTicker(){
  if(tickInterval) clearInterval(tickInterval);
  // Align to the next full second for smoother updates
  const now = Date.now();
  const delay = 1000 - (now % 1000);
  setTimeout(()=>{
    updateTimes();
    tickInterval = setInterval(updateTimes, 1000);
  }, delay);
}

function addClock(tz){
  if(!tz) return;
  if(clocks.includes(tz)) return;
  clocks.push(tz);
  save();
  render();
}

function removeClock(tz){
  clocks = clocks.filter(x=>x!==tz);
  save();
  render();
}

function clearAll(){
  clocks = [];
  save();
  render();
}

// wire up
populateSelect();
load();
render();
startTicker();

ADD_BTN.addEventListener('click', ()=>{
  addClock(TZ_SELECT.value);
});

CLEAR_BTN.addEventListener('click', ()=>{
  clearAll();
});

TOGGLE_24.addEventListener('change', ()=>{
  save();
  // re-render times to respect hour12 change
  updateTimes();
});

// update when user changes selection via keyboard and presses Enter
TZ_SELECT.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter') addClock(TZ_SELECT.value);
});

// keep clocks running if storage changed in another tab
window.addEventListener('storage', (e)=>{
  if(e.key === 'th_clocks' || e.key === 'th_24'){
    load();
    render();
    startTicker();
  }
});

// If Intl doesn't support a timezone name, the browser will throw — guard it
try{
  // quick smoke: format for default UTC - will throw in broken Intl implementations
  new Intl.DateTimeFormat(undefined, {timeZone: 'UTC'});
}catch(err){
  console.warn('Intl.DateTimeFormat or timezone support unavailable in this browser. Clocks may not work.');
}
