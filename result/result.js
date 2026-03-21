const CAT_DATA = {
  american_shorthair: {
    name: 'American Shorthair',
    img:  '../images/cats/americanshorthair.JPG',
    color: '#565D93',
    traits: ['chill but secretly affectionate', 'watches everything before getting involved', 'adapts easily to new environments or people', 'sleeps like it completed a long shift']
  },
  british_shorthair: {
    name: 'British Shorthair',
    img:  '../images/cats/britishshorthair.JPG',
    color: '#31B36D',
    traits: ['calm and collected in every situation', 'independent but deeply loyal', 'total homebody who loves comfort', 'dignified and a little mysterious']
  },
  maincoon: {
    name: 'Maine Coon',
    img:  '../images/cats/maincoon.JPG',
    color: '#BC6E64',
    traits: ['adventurous and always up for something new', 'playful energy that never runs out', 'loves being the life of the party', 'curious about absolutely everything']
  },
  birman: {
    name: 'Birman',
    img:  '../images/cats/birman.JPG',
    color: '#F5A1C2',
    traits: ['gentle and deeply caring', 'the best listener in any room', 'people feel instantly at ease around you', 'quiet strength and warmth']
  },
  ragdoll: {
    name: 'Ragdoll',
    img:  '../images/cats/ragdoll.JPG',
    color: '#D4A12E',
    traits: ['the most relaxed person ever', 'super affectionate and warm', 'goes with the flow effortlessly', 'spreads good vibes everywhere']
  },
  tabby: {
    name: 'Tabby',
    img:  '../images/cats/tabby.JPG',
    color: '#6192E1',
    traits: ['always involved in everything', 'endlessly curious about everyone', 'social but does things their own way', 'clever observer who quietly supervises']
  },
  tuxedo: {
    name: 'Tuxedo',
    img:  '../images/cats/tuxedo.JPG',
    color: '#5271DD',
    traits: ['walks into a room and owns it', 'naturally charming and bold', 'confident in every situation', 'people are drawn to your energy']
  }
};

const winnerKey = sessionStorage.getItem('catResult') || 'tabby';
const cat = CAT_DATA[winnerKey] || CAT_DATA['tabby'];

// Store cat data for photobooth
sessionStorage.setItem('catColor', cat.color);
sessionStorage.setItem('catImg',   cat.img);
sessionStorage.setItem('catName',  cat.name);

document.documentElement.style.setProperty('--cat-color', cat.color);
document.getElementById('resultTitle').textContent = 'You are probably a ' + cat.name;
document.getElementById('cardTitle').textContent   = cat.name + ' Cat ID card';
document.getElementById('catImg').src              = cat.img;

const traitsEl = document.getElementById('catTraits');
cat.traits.forEach(t => {
  const div = document.createElement('div');
  div.className = 'trait';
  div.textContent = t;
  traitsEl.appendChild(div);
});

document.getElementById('nextBtn').addEventListener('click', () => {
  const btn = document.getElementById('nextBtn');
  btn.style.background = '#c8c8c8';
  btn.style.transform = 'scale(0.98)';
  setTimeout(() => {
    window.location.href = '../photobooth/photoconfirm.html';
  }, 300);
});