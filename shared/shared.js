// ─── CAT POSITIONS PER SCREEN ───
const CAT_POSITIONS = {
  'confirm':      0,      // just started
  'quiz':         0.33,   // 1/3 through
  'result':       0.60,   // past halfway
  'photoconfirm': 0.75,   // heading to photobooth
  'photostrip':   0.85,   // taking photos
  'stripfinal':   0.95,   // almost done
  'end':          1.0     // reached End!
};

// ─── INJECT NAV HTML ───
function injectNav(basePath) {
  const base = basePath || '../images/ui/';
  const nav  = document.getElementById('navPath');
  if (!nav) return;
  nav.innerHTML = `
    <div class="path-point">
      <img src="${base}icons8-location-100.png" class="path-pin" alt="start">
      <span class="path-label">Start</span>
    </div>
    <div class="path-svg-wrap">
      <img src="${base}navline.svg" class="nav-line" alt="">
      <img src="${base}catmove.svg" class="cat-move" id="catMover" alt="">
    </div>
    <div class="path-point">
      <img src="${base}icons8-location-100.png" class="path-pin" alt="end">
      <span class="path-label">End</span>
    </div>
  `;
}

// ─── SET CAT POSITION ───
function setCatPosition(pct) {
  window.addEventListener('load', () => {
    const cat = document.getElementById('catMover');
    if (!cat) return;
    const wrap = cat.parentElement;
    const maxLeft = wrap.offsetWidth - cat.offsetWidth;
    cat.style.left = (maxLeft * pct) + 'px';
  });
}

// ─── AUTO SET BY PAGE NAME ───
function initNav(basePath) {
  injectNav(basePath);
  const page     = window.location.pathname.split('/').pop().replace('.html', '');
  const position = CAT_POSITIONS[page] ?? 0;
  setCatPosition(position);
}