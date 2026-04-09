const board             = document.getElementById('board');
const addBtn            = document.getElementById('addBtn');
const modalOverlay      = document.getElementById('modalOverlay');
const cancelBtn         = document.getElementById('cancelBtn');
const submitBtn         = document.getElementById('submitBtn');
const uploadArea        = document.getElementById('uploadArea');
const fileInput         = document.getElementById('fileInput');
const uploadPreview     = document.getElementById('uploadPreview');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const noteInput         = document.getElementById('noteInput');
const loadingText       = document.getElementById('loadingText');
const emptyState        = document.getElementById('emptyState');

let selectedImageData = null;

// ─── LOAD CATS ───
async function loadCats() {
  try {
    loadingText.style.display = 'none';
    const keys = Object.keys(localStorage).filter(k => k.startsWith('cats:'));
    if (keys.length === 0) {
      emptyState.style.display = 'flex';
      return;
    }
    emptyState.style.display = 'none';
    keys.forEach(key => {
      try {
        const data = JSON.parse(localStorage.getItem(key));
        if (data) renderCat(data);
      } catch (e) {}
    });
  } catch (e) {
    loadingText.textContent = 'could not load board';
  }
}

// ─── RENDER CAT ───
function renderCat(data) {
  const boardRect = board.getBoundingClientRect();
  const w = boardRect.width  || 300;
  const h = boardRect.height || 400;

  const sticker = document.createElement('div');
  sticker.className = 'cat-sticker';

  const size = data.size || Math.floor(Math.random() * 40 + 80);
  const x    = data.x !== undefined ? data.x * w : Math.random() * (w - size - 20) + 10;
  const y    = data.y !== undefined ? data.y * h : Math.random() * (h - size - 60) + 10;
  const rot  = data.rot !== undefined ? data.rot : (Math.random() * 20 - 10);

  sticker.style.width     = size + 'px';
  sticker.style.left      = x + 'px';
  sticker.style.top       = y + 'px';
  sticker.style.transform = `rotate(${rot}deg)`;

  const img = document.createElement('img');
  img.src = data.img;
  sticker.appendChild(img);

  if (data.note) {
    const note = document.createElement('p');
    note.className = 'cat-note';
    note.textContent = data.note;
    sticker.appendChild(note);
  }

  board.appendChild(sticker);
  makeDraggable(sticker);
}

// ─── MAKE DRAGGABLE ───
function makeDraggable(el) {
  let isDragging = false;
  let startX, startY, origX, origY;

  function dragStart(e) {
    isDragging = true;
    const touch = e.touches ? e.touches[0] : e;
    startX = touch.clientX;
    startY = touch.clientY;
    origX = parseFloat(el.style.left) || 0;
    origY = parseFloat(el.style.top)  || 0;
    el.style.zIndex = '5';
    e.preventDefault();
  }

  function dragMove(e) {
    if (!isDragging) return;
    const touch = e.touches ? e.touches[0] : e;
    const dx = touch.clientX - startX;
    const dy = touch.clientY - startY;
    el.style.left = (origX + dx) + 'px';
    el.style.top  = (origY + dy) + 'px';
  }

  function dragEnd() {
    isDragging = false;
    el.style.zIndex = '';
  }

  el.addEventListener('mousedown', dragStart);
  window.addEventListener('mousemove', dragMove);
  window.addEventListener('mouseup', dragEnd);
  el.addEventListener('touchstart', dragStart, { passive: false });
  el.addEventListener('touchmove', dragMove, { passive: false });
  el.addEventListener('touchend', dragEnd);
}

// ─── MODAL ───
addBtn.addEventListener('click', () => {
  selectedImageData = null;
  uploadPreview.style.display = 'none';
  uploadPlaceholder.style.display = 'flex';
  noteInput.value = '';
  modalOverlay.classList.add('visible');
});

cancelBtn.addEventListener('click', () => modalOverlay.classList.remove('visible'));

uploadArea.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => {
    selectedImageData = ev.target.result;
    uploadPreview.src = selectedImageData;
    uploadPreview.style.display = 'block';
    uploadPlaceholder.style.display = 'none';
  };
  reader.readAsDataURL(file);
});

// ─── SUBMIT ───
submitBtn.addEventListener('click', async () => {
  if (!selectedImageData) { alert('please add a photo first!'); return; }
  submitBtn.textContent = 'posting...';
  submitBtn.disabled = true;

  const boardRect = board.getBoundingClientRect();
  const w = boardRect.width  || 300;
  const h = boardRect.height || 400;
  const size = Math.floor(Math.random() * 40 + 80);

  const data = {
    img:  selectedImageData,
    note: noteInput.value.trim(),
    size: size,
    x:    (Math.random() * (w - size - 20) + 10) / w,
    y:    (Math.random() * (h - size - 60) + 10) / h,
    rot:  Math.random() * 20 - 10,
    ts:   Date.now()
  };

  const key = 'cats:' + data.ts;

  try {
    await window.storage.set(key, JSON.stringify(data), true);
    renderCat(data);
    emptyState.style.display = 'none';
    modalOverlay.classList.remove('visible');
  } catch (e) {
    alert('could not save — try again!');
  }

  submitBtn.textContent = 'post to board';
  submitBtn.disabled = false;
});

// ─── CONTINUE ───
document.getElementById('continueBtn').addEventListener('click', () => {
  window.location.href = '../photobooth/photoconfirm.html';
});

// ─── INIT ───
loadCats();
