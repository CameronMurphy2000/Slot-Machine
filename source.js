const symbols = [
    { icon: "🍒", weight: 5 },
    { icon: "🍋", weight: 5 },
    { icon: "🍊", weight: 5 },
    { icon: "⭐", weight: 3 },
    { icon: "💎", weight: 1}
];

function animateReel(element, duration, finalSymbol) {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      element.textContent = getRandomSymbol();
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      element.textContent = finalSymbol;
      resolve();
    }, duration);
  });
}

function getRandomSymbol() {
    const totalWeight = symbols.reduce((sum, s) => sum + s.weight, 0);
    let random = Math.random() * totalWeight;

    for (let symbol of symbols) {
        if (random < symbol.weight) {
            return symbol.icon;
        }
        random -= symbol.weight;
    }
}

async function spin() {
  const button = document.querySelector("button");
  button.disabled = true;

  const r1 = getRandomSymbol();
  const r2 = getRandomSymbol();
  const r3 = getRandomSymbol();

  const reel1 = document.getElementById("reel1");
  const reel2 = document.getElementById("reel2");
  const reel3 = document.getElementById("reel3");

  await Promise.all([
    animateReel(reel1, 1000, r1),
    animateReel(reel2, 1500, r2),
    animateReel(reel3, 2000, r3)
  ]);

  if (r1 === r2 && r2 === r3) {
    document.getElementById("result").textContent = "🎉 You win!";
  } else {
    document.getElementById("result").textContent = "Try again!";
  }

  button.disabled = false;
  console.log(r1, r2, r3);
}
