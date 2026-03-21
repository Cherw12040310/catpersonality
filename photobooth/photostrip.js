// ─── GET CAT DATA ───
const catName  = sessionStorage.getItem('catName')  || 'Probablyy a cat';
const catColor = sessionStorage.getItem('catColor') || '#f5c8d0';
const catImg   = sessionStorage.getItem('catImg')   || '';

// ─── ELEMENTS ───
const video            = document.getElementById('videoEl');
const countdownOverlay = document.getElementById('countdownOverlay');
const countNum         = document.getElementById('countdownNumber');
const flash            = document.getElementById('flash');
const startBtn         = document.getElementById('startBtn');
const nextBtn          = document.getElementById('nextBtn');
const smileText        = document.getElementById('smileText');

const photos = [null, null, null];
let running  = false;

// ─── CAMERA ───
async function startCamera() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 960 } },
      audio: false
    });
    video.srcObject = stream;
    video.play();
  } catch(e) {
    smileText.textContent = 'camera access failed — please allow access';
    startBtn.disabled = true;
  }
}

startCamera();

// ─── COUNTDOWN ───
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function runCountdown() {
  countdownOverlay.classList.add('visible');
  for (let i = 3; i >= 1; i--) {
    countNum.textContent = i;
    countNum.style.animation = 'none';
    void countNum.offsetWidth;
    countNum.style.animation = 'popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    await sleep(1000);
  }
  countdownOverlay.classList.remove('visible');
}

// ─── CAPTURE PHOTO ───
async function capturePhoto(index) {
  smileText.textContent = `shot ${index + 1} of 3 — smile or make a funny face!`;
  await runCountdown();

  flash.classList.add('go');
  await sleep(80);
  flash.classList.remove('go');

  const offscreen = document.getElementById('photo' + index);
  offscreen.width  = 600;
  offscreen.height = 450;
  const ctx = offscreen.getContext('2d');

  const vW = video.videoWidth  || video.offsetWidth;
  const vH = video.videoHeight || video.offsetHeight;
  const targetAspect = 600 / 450;
  const vAspect = vW / vH;
  let sx, sy, sw, sh;
  if (vAspect > targetAspect) {
    sh = vH; sw = vH * targetAspect;
    sx = (vW - sw) / 2; sy = 0;
  } else {
    sw = vW; sh = vW / targetAspect;
    sx = 0; sy = (vH - sh) / 2;
  }

  ctx.drawImage(video, sx, sy, sw, sh, 0, 0, 600, 450);
  photos[index] = offscreen.toDataURL('image/jpeg', 0.92);
  document.getElementById('dot' + index).classList.add('taken');
}

// ─── SESSION ───
async function startSession() {
  if (running) return;
  running = true;
  startBtn.disabled = true;
  nextBtn.classList.remove('visible');

  for (let i = 0; i < 3; i++) {
    await capturePhoto(i);
    if (i < 2) await sleep(600);
  }

  smileText.textContent = 'all done! feel free to retake or continue';
  startBtn.textContent  = 'retake';
  startBtn.disabled     = false;
  nextBtn.classList.add('visible');
  running = false;
}

// ─── START / RETAKE BUTTON ───
startBtn.addEventListener('click', () => {
  if (startBtn.textContent.includes('retake')) {
    photos.fill(null);
    [0,1,2].forEach(i => document.getElementById('dot' + i).classList.remove('taken'));
    nextBtn.classList.remove('visible');
    startBtn.textContent  = 'start 🐾';
    smileText.textContent = '3, 2, 1 smile';
  } else {
    startSession();
  }
});

// ─── NEXT BUTTON ───
nextBtn.addEventListener('click', () => {
  sessionStorage.setItem('photos',   JSON.stringify(photos));
  sessionStorage.setItem('catColor', catColor);
  sessionStorage.setItem('catImg',   catImg);
  nextBtn.style.background = '#c8c8c8';
  setTimeout(() => {
    window.location.href = 'stripfinal.html';
  }, 300);
});