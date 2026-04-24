let balance = 100;
const SPIN_COST = 5;

const SYMBOL_HEIGHT = 80;
const COPIES = 10;

// --- PAYOUTS ---
const payouts = {
  "🍒": 2,
  "🍋": 3,
  "🍊": 4,
  "⭐": 10,
  "💎": 50
};

// --- REELS ---
const reels = [
  ["🍒","🍋","🍊","⭐","🍒","🍋","💎","🍊","⭐","🍒"],
  ["🍋","🍊","⭐","🍒","🍋","💎","🍊","⭐","🍒","🍋"],
  ["🍊","⭐","🍒","🍋","💎","🍊","⭐","🍒","🍋","🍊"]
];

// --- PAYLINES (0=top,1=middle,2=bottom) ---
const paylines = [
  { name: "Top", row: 0 },
  { name: "Middle", row: 1 },
  { name: "Bottom", row: 2 }
];

// --- HELPERS ---
function getStopIndex(reel) {
  return Math.floor(Math.random() * reel.length);
}

function getSymbolAt(reel, index) {
  return reel[index % reel.length];
}

// --- BUILD REEL ---
function buildReel(element, reel) {
  element.innerHTML = "";

  let fullStrip = [];

  for (let i = 0; i < COPIES; i++) {
    fullStrip = fullStrip.concat(reel);
  }

  fullStrip.forEach(symbol => {
    const div = document.createElement("div");
    div.className = "symbol";
    div.textContent = symbol;
    element.appendChild(div);
  });

  // IMPORTANT: start at safe offset (not tied to stop index)
  const startOffset = reel.length * SYMBOL_HEIGHT * 2;

  element.style.transition = "none";
  element.style.transform = `translateY(-${startOffset}px)`;
}

// --- SPIN ANIMATION ---
function spinReel(element, reel, stopIndex, duration) {
  return new Promise(resolve => {

    const baseOffset = reel.length * SYMBOL_HEIGHT * 2;
    const loops = 6; // more loops = smoother + slower feel

    const finalOffset =
      baseOffset +
      (loops * reel.length + stopIndex) * SYMBOL_HEIGHT;

    // start animation
    element.style.transition =
      `transform ${duration}ms cubic-bezier(0.12, 0.8, 0.2, 1)`;

    element.style.transform = `translateY(-${finalOffset}px)`;

    setTimeout(() => {

      requestAnimationFrame(() => {
        element.style.transition = "none";

        // reset to stable resting position
        const resetOffset =
          baseOffset + stopIndex * SYMBOL_HEIGHT;

        element.style.transform = `translateY(-${resetOffset}px)`;

        resolve();
      });

    }, duration);
  });
}

// --- GET 3 VISIBLE SYMBOLS ---
function getVisibleGrid(reel, stopIndex) {
  return [
    getSymbolAt(reel, stopIndex - 1), // top
    getSymbolAt(reel, stopIndex),     // middle
    getSymbolAt(reel, stopIndex + 1)  // bottom
  ];
}

// --- INIT ---
function init() {
  const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
  ];

  reels.forEach((reel, i) => buildReel(reelEls[i], reel));
  updateBalance();
}

// --- SPIN ---
async function spin() {
  const button = document.querySelector("button");
  const result = document.getElementById("result");
  const paylineDisplay = document.getElementById("paylineDisplay");

  if (balance < SPIN_COST) {
    result.textContent = "Not enough tokens!";
    return;
  }

  button.disabled = true;
  result.textContent = "";
  paylineDisplay.textContent = "";

  balance -= SPIN_COST;
  updateBalance();

  const reelEls = [
    document.getElementById("reel1"),
    document.getElementById("reel2"),
    document.getElementById("reel3")
  ];

  const stops = reels.map(getStopIndex);

  await Promise.all([
    spinReel(reelEls[0], reels[0], stops[0], 1800),
    spinReel(reelEls[1], reels[1], stops[1], 2400),
    spinReel(reelEls[2], reels[2], stops[2], 3000)
  ]);

  // --- BUILD GRID ---
  const grid = reels.map((reel, i) =>
    getVisibleGrid(reel, stops[i])
  );

  console.log("GRID:", grid);

  // --- PAYLINE WIN CHECK ---
  let winAmount = 0;
  let winningLines = [];

  for (let line of paylines) {

    const symbols = [
      grid[0][line.row],
      grid[1][line.row],
      grid[2][line.row]
    ];

    const counts = {};

    for (let s of symbols) {
      counts[s] = (counts[s] || 0) + 1;
    }

    for (let symbol in counts) {

      if (counts[symbol] === 3) {
        winAmount += payouts[symbol] * 10;
        winningLines.push(`${line.name}: 3x ${symbol}`);
      }

      else if (counts[symbol] === 2) {
        winAmount += payouts[symbol];
        winningLines.push(`${line.name}: 2x ${symbol}`);
      }
    }
  }

  // --- RESULT ---
  if (winAmount > 0) {
    balance += winAmount;
    result.textContent = `🎉 Win! +${winAmount}`;
    paylineDisplay.textContent = winningLines.join(" | ");
  } else {
    result.textContent = "Try again!";
  }

  updateBalance();
  console.log('test');
  button.disabled = false;
}

// --- BALANCE ---
function updateBalance() {
  document.getElementById("balance").textContent =
    `Tokens: ${balance}`;
}

function addTokens() {
  balance += 50;
  updateBalance();
}

// --- START ---
window.onload = init;
