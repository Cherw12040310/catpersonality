const CAT_DATA = {
  american_shorthair: {
    name: 'American Shorthair',
    img:  '../images/cats/americanshorthairfull.png',
    color: '#c5caf0',
    doodles: [
    { src: '../images/onboarding-ui/meow.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/swirl.svg',  style: 'width:10%;bottom:80%;right:80%;' },
    { src: '../images/onboarding-ui/flower.svg', style: 'width:12%;bottom:10%;left:8%;' },
  ],
    traits: [
      'chill but secretly affectionate',
      'watches everything before getting involved',
      'adapts easily to new environments',
      'sleeps like it completed a long shift'
    ]
    
  },
  british_shorthair: {
    name: 'British Shorthair',
    img:  '../images/cats/britishshorthairfull.png',
    color: '#B5D5B0',
    doodles: [
    { src: '../images/onboarding-ui/icecream.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/star.png',  style: 'width:15%;bottom:20%;right:80%;' },
    { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
        { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },

  ],
    traits: [
      'calm and collected in every situation',
      'independent but deeply loyal',
      'total homebody who loves comfort',
      'dignified and a little mysterious'
    ]
  },
  maincoon: {
    name: 'Maine Coon',
    img:  '../images/cats/mainecoonfull.png',
    color: '#c29790',
    doodles: [
    { src: '../images/onboarding-ui/icecream.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/star.png',  style: 'width:15%;bottom:20%;right:80%;' },
    { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },

  ],
    traits: [
      'adventurous and always up for something new',
      'playful energy that never runs out',
      'loves being the life of the party',
      'curious about absolutely everything'
    ]
  },
  birman: {
    name: 'Birman',
    img:  '../images/cats/birmanfull.png',
    color: '#F5C2E2',
    doodles: [
    { src: '../images/onboarding-ui/icecream.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/star.png',  style: 'width:15%;bottom:20%;right:80%;' },
    { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
        { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },

  ],
    traits: [
      'gentle and deeply caring',
      'the best listener in any room',
      'people feel instantly at ease around you',
      'quiet strength and warmth'
    ]
  },
  ragdoll: {
    name: 'Ragdoll',
    img:  '../images/cats/ragdollfull.png',
    color: '#be8780',
    doodles: [
    { src: '../images/onboarding-ui/meow.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/swirl.svg',  style: 'width:10%;bottom:80%;right:80%;' },
    { src: '../images/onboarding-ui/flower.svg', style: 'width:12%;bottom:10%;left:8%;' },
  ],
    traits: [
      'the most relaxed person ever',
      'super affectionate and warm',
      'goes with the flow effortlessly',
      'spreads good vibes everywhere'
    ]
  },
  tabby: {
    name: 'Tabby',
    img:  '../images/cats/tabbyfull.png',
    color: '#829fcd',
    doodles: [
    { src: '../images/onboarding-ui/icecream.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/star.png',  style: 'width:15%;bottom:20%;right:80%;' },
    { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
        { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },

  ],
    traits: [
      'always involved in everything',
      'endlessly curious about everyone',
      'social but does things their own way',
      'clever observer who quietly supervises'
    ]
  },
  tuxedo: {
    name: 'Tuxedo',
    img:  '../images/cats/tuxedofull.png',
    color: '#7f8bb5',
    doodles: [
    { src: '../images/onboarding-ui/icecream.svg',   style: 'width:28%;top:8%;right:8%;' },
    { src: '../images/onboarding-ui/star.png',  style: 'width:15%;bottom:20%;right:80%;' },
    { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;bottom:80%;left:8%;' },
        { src: '../images/onboarding-ui/swirl one.svg', style: 'width:10%;top:80%;right:9%;' },
  ],
    traits: [
      'walks into a room and owns it',
      'naturally charming and bold',
      'confident in every situation',
      'people are drawn to your energy'
    ]
  }
};

const winnerKey = sessionStorage.getItem('catResult') || 'american_shorthair';
const cat = CAT_DATA[winnerKey] || CAT_DATA['american_shorthair'];

sessionStorage.setItem('catColor', cat.color);
sessionStorage.setItem('catImg',   cat.img);
sessionStorage.setItem('catName',  cat.name);

document.documentElement.style.setProperty('--cat-color', cat.color);
document.getElementById('catName').textContent = cat.name;
document.getElementById('catName').textContent = cat.name;
document.getElementById('catImg').src = cat.img;

const doodleLayer = document.getElementById('doodleLayer');
doodleLayer.innerHTML = '';
if (cat.doodles) {
  cat.doodles.forEach(d => {
    const img = document.createElement('img');
    img.src = d.src;
    img.style.cssText = 'position:absolute;opacity:1;pointer-events:none;' + d.style;
    img.alt = '';
    doodleLayer.appendChild(img);
  });
}
document.getElementById('catImg').src = cat.img;

const traitsList = document.getElementById('traitsList');
cat.traits.forEach((t) => {
  const item = document.createElement('div');
  item.className = 'trait-item';
  item.innerHTML = `<p class="trait-text">${t}</p>`;
  traitsList.appendChild(item);
});

const catCard         = document.getElementById('catCard');
const personalityCard = document.getElementById('personalityCard');

let startX    = 0;
let currentX  = 0;
let isDragging = false;
let isSwiped  = false;

function onStart(e) {
  isDragging = true;
  startX = e.touches ? e.touches[0].clientX : e.clientX;
  if (isSwiped) {
    personalityCard.style.transition = 'none';
  } else {
    catCard.style.transition = 'none';
  }
}

function onMove(e) {
  if (!isDragging) return;
  e.preventDefault();
  currentX = (e.touches ? e.touches[0].clientX : e.clientX) - startX;
  const rotate = currentX * 0.06;

  if (isSwiped) {
    personalityCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  } else {
    catCard.style.transform = `translateX(${currentX}px) rotate(${rotate}deg)`;
  }
}

function onEnd() {
  if (!isDragging) return;
  isDragging = false;
  const threshold = 80;

  if (!isSwiped) {
    catCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    if (Math.abs(currentX) > threshold) {
      isSwiped = true;
      catCard.style.transform = 'scale(0.92) translateY(12px)';
      catCard.style.opacity = '0.5';
      catCard.style.zIndex = '1';
      personalityCard.style.zIndex = '2';
      personalityCard.classList.add('revealed');
      const hint = catCard.querySelector('.swipe-hint');
      if (hint) hint.style.display = 'none';
    } else {
      catCard.style.transform = 'translateX(0) rotate(0deg)';
    }
  } else {
    personalityCard.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    if (Math.abs(currentX) > threshold) {
      isSwiped = false;
      personalityCard.style.transform = 'scale(0.95) translateY(10px)';
      personalityCard.classList.remove('revealed');
      personalityCard.style.zIndex = '1';
      catCard.style.zIndex = '2';
      catCard.style.opacity = '1';
      catCard.style.transform = 'translateX(0) rotate(0deg)';
      const hint = catCard.querySelector('.swipe-hint');
      if (hint) hint.style.display = 'block';
    } else {
      personalityCard.style.transform = 'translateX(0) rotate(0deg) scale(1)';
    }
  }
  currentX = 0;
}

catCard.addEventListener('mousedown', onStart);
personalityCard.addEventListener('mousedown', onStart);
window.addEventListener('mousemove', onMove);
window.addEventListener('mouseup', onEnd);
catCard.addEventListener('touchstart', onStart, { passive: true });
catCard.addEventListener('touchmove', onMove, { passive: false });
catCard.addEventListener('touchend', onEnd);
personalityCard.addEventListener('touchstart', onStart, { passive: true });
personalityCard.addEventListener('touchmove', onMove, { passive: false });
personalityCard.addEventListener('touchend', onEnd);