const CAT_DATA = {
  american_shorthair: { name: 'American Shorthair', img: '../images/cats/americanshorthair.JPG', color: '#e8d5b0' },
  british_shorthair:  { name: 'British Shorthair',  img: '../images/cats/britishshorthair.JPG',  color: '#565D93' },
  maincoon:           { name: 'Main Coon',          img: '../images/cats/maincoon.JPG',         color: '#a5c4a0' },
  birman:             { name: 'Birman',              img: '../images/cats/birman.JPG',            color: '#F5A1C2' },
  ragdoll:            { name: 'Ragdoll',             img: '../images/cats/ragdoll.JPG',           color: '#D4A12E' },
  tabby:              { name: 'Tabby',               img: '../images/cats/tabby.JPG',             color: '#6192E1' },
  tuxedo:             { name: 'Tuxedo',              img: '../images/cats/tuxedo.JPG',            color: '#5271DD' }
};

const QUESTIONS = [
  {
    question: "It's Friday night. What are you doing?",
    answers: [
      { text: "Cozy night in, no plans",             points: { british_shorthair: 2, ragdoll: 1 } },
      { text: "Out with as many friends as possible", points: { tabby: 2, maincoon: 1 } },
      { text: "Small hangout, close friends only",    points: { birman: 2, american_shorthair: 1 } },
      { text: "Doing something spontaneous",          points: { tuxedo: 2, american_shorthair: 1 } }
    ]
  },
  {
    question: "Someone cancels your plans last minute. You feel...",
    answers: [
      { text: "Honestly relieved",                    points: { british_shorthair: 2, birman: 1 } },
      { text: "Bummed but I'll find something else",  points: { american_shorthair: 2, tabby: 1 } },
      { text: "Fine — I'll use the time to explore",  points: { maincoon: 2, tuxedo: 1 } },
      { text: "I check in to make sure they're okay", points: { ragdoll: 2, birman: 1 } }
    ]
  },
  {
    question: "Pick your ideal weekend vibe:",
    answers: [
      { text: "Hiking or outdoor adventure",          points: { maincoon: 2, tabby: 1 } },
      { text: "Staying in, reading or watching shows",points: { british_shorthair: 2, ragdoll: 1 } },
      { text: "Exploring a new café or city spot",    points: { tuxedo: 2, american_shorthair: 1 } },
      { text: "Whatever, I'm flexible",               points: { american_shorthair: 2, ragdoll: 1 } }
    ]
  },
  {
    question: "How do your friends describe you?",
    answers: [
      { text: "The chill, reliable one",              points: { american_shorthair: 2, british_shorthair: 1 } },
      { text: "The bold, confident one",              points: { tuxedo: 2, tabby: 1 } },
      { text: "The sweet, caring one",                points: { birman: 2, ragdoll: 1 } },
      { text: "The curious, energetic one",           points: { tabby: 2, maincoon: 1 } }
    ]
  },
  {
    question: "What's your relationship with alone time?",
    answers: [
      { text: "I need it to recharge",                points: { british_shorthair: 2, birman: 1 } },
      { text: "I like it but miss people quickly",    points: { ragdoll: 2, american_shorthair: 1 } },
      { text: "I use it to plan my next adventure",   points: { maincoon: 2, tuxedo: 1 } },
      { text: "What is alone time?",                  points: { tabby: 2, maincoon: 1 } }
    ]
  },
  {
    question: "Your ideal home vibe is...",
    answers: [
      { text: "Cozy and minimal, very calm",          points: { birman: 2, british_shorthair: 1 } },
      { text: "Lively, always people over",           points: { tabby: 2, maincoon: 1 } },
      { text: "Warm and full of personal touches",    points: { ragdoll: 2, birman: 1 } },
      { text: "Stylish and a little bold",            points: { tuxedo: 2, british_shorthair: 1 } }
    ]
  },
  {
    question: "When something goes wrong you...",
    answers: [
      { text: "Stay calm and figure it out quietly",  points: { british_shorthair: 2, tuxedo: 1 } },
      { text: "Vent to friends then move on fast",    points: { american_shorthair: 2, tabby: 1 } },
      { text: "Check on everyone else first",         points: { birman: 2, ragdoll: 1 } },
      { text: "Turn it into an adventure",            points: { maincoon: 2, tuxedo: 1 } }
    ]
  },
  {
    question: "Pick your ideal holiday:",
    answers: [
      { text: "Beach, total relaxation",              points: { ragdoll: 2, birman: 1 } },
      { text: "City trip, explore everything",        points: { tuxedo: 2, american_shorthair: 1 } },
      { text: "Nature hike or camping",               points: { maincoon: 2, tabby: 1 } },
      { text: "Cozy cabin with close friends",        points: { birman: 2, british_shorthair: 1 } }
    ]
  }
];

const NUMS = ['01', '02', '03', '04'];

let scores = { american_shorthair: 0, british_shorthair: 0, maincoon: 0, birman: 0, ragdoll: 0, tabby: 0, tuxedo: 0 };
let currentQ = 0;

function loadQuestion(index) {
  if (index === 0) {
    scores = { american_shorthair: 0, british_shorthair: 0, maincoon: 0, birman: 0, ragdoll: 0, tabby: 0, tuxedo: 0 };
  }

  currentQ = index;
  const q = QUESTIONS[index];

  const pct = (index / QUESTIONS.length) * 100;
  document.getElementById('progressFill').style.width = pct + '%';
  document.getElementById('questionText').textContent = q.question;

  const grid = document.getElementById('answersGrid');
  grid.innerHTML = '';

  q.answers.forEach((a, i) => {
    const btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.innerHTML = `
      <div class="answer-num">${NUMS[i]}</div>
      <span class="answer-text">${a.text}</span>
    `;

    btn.style.opacity = 0;
    btn.style.transform = 'translateY(12px)';

    btn.addEventListener('click', () => selectAnswer(btn, a.points));

    setTimeout(() => {
      btn.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      btn.style.opacity = 1;
      btn.style.transform = 'translateY(0)';
    }, i * 80);

    grid.appendChild(btn);
  });
}

function selectAnswer(btn, points) {
  document.querySelectorAll('.answer-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  Object.entries(points).forEach(([cat, pts]) => {
    scores[cat] += pts;
  });

  setTimeout(() => {
    if (currentQ + 1 < QUESTIONS.length) {
      loadQuestion(currentQ + 1);
    } else {
      showResult();
    }
  }, 500);
}

function showResult() {
  // 1. Get all scores as [name, value] pairs
  const scoreEntries = Object.entries(scores);

  // 2. Find the highest point value achieved
  const maxScore = Math.max(...scoreEntries.map(entry => entry[1]));

  // 3. Filter list to ONLY cats that have the maxScore
  const winners = scoreEntries
    .filter(entry => entry[1] === maxScore)
    .map(entry => entry[0]);

  // 4. Randomly pick one from the winners (tie-breaker)
  const finalWinner = winners[Math.floor(Math.random() * winners.length)];

  sessionStorage.setItem('catResult', finalWinner);
  window.location.href = '../result/result.html';
}

loadQuestion(0);