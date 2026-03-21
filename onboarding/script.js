// ─── SLIDER ───
const track = document.getElementById('sliderTrack');
const thumb = document.getElementById('sliderThumb');
const fill = document.getElementById('sliderFill');
const label = document.getElementById('sliderLabel');

let sliderDragging = false;
let startX = 0;
let startLeft = 0;

function getPad() { return 4; }
function thumbW() { return thumb.offsetWidth; }
function trackW() { return track.offsetWidth; }
function getMaxLeft() {
  return sliderTrack.offsetWidth - thumb.offsetWidth - 12;
}

function getClientX(e) {
  return e.touches ? e.touches[0].clientX : e.clientX;
}

function updatePosition(leftPx) {
  const p = getPad();
  const max = getMaxLeft();
  const clamped = Math.min(Math.max(leftPx, p), max);
  const pct = (clamped - p) / (max - p);
  thumb.style.left = clamped + 'px';
  fill.style.width = (clamped + thumbW() / 2) + 'px';
  label.style.opacity = Math.max(0, 1 - pct * 2.5);
  return pct;
}

function snapBack() {
  thumb.style.transition = 'left 0.45s cubic-bezier(0.34,1.56,0.64,1)';
  fill.style.transition = 'width 0.45s cubic-bezier(0.34,1.56,0.64,1)';
  label.style.transition = 'opacity 0.3s ease';
  thumb.style.left = getPad() + 'px';
  fill.style.width = (getPad() + thumbW() / 2) + 'px';
  label.style.opacity = 1;
  setTimeout(() => {
    thumb.style.transition = '';
    fill.style.transition = '';
    label.style.transition = '';
  }, 500);
}

function triggerSuccess() {
  sliderDragging = false;
  thumb.style.transition = 'left 0.2s cubic-bezier(0.16,1,0.3,1)';
  fill.style.transition = 'width 0.2s cubic-bezier(0.16,1,0.3,1)';
  thumb.style.left = getMaxLeft() + 'px';
  fill.style.width = trackW() + 'px';
  label.style.opacity = 0;
  setTimeout(() => {
    window.location.href = '../onboarding/confirm.html';
  }, 300);
}

track.addEventListener('pointerdown', e => {
  e.preventDefault();
  sliderDragging = true;
  track.setPointerCapture(e.pointerId);
  startX = e.clientX;
  startLeft = parseFloat(thumb.style.left) || getPad();
});

track.addEventListener('pointermove', e => {
  if (!sliderDragging) return;
  const pct = updatePosition(startLeft + (e.clientX - startX));
  if (pct >= 0.97) triggerSuccess();
});

track.addEventListener('pointerup', () => {
  if (!sliderDragging) return;
  sliderDragging = false;
  const current = parseFloat(thumb.style.left) || getPad();
  const pct = (current - getPad()) / (getMaxLeft() - getPad());
  if (pct < 0.97) snapBack();
});

window.addEventListener('load', () => {
  thumb.style.left = getPad() + 'px';
  fill.style.width = (getPad() + thumbW() / 2) + 'px';
});
