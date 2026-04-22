const symbols = ["🍒", "🍋", "🍊", "⭐", "💎"];

function getRandomSymbol() {
    return symbols[Math.floor(Math.random() * symbols.length)];
}

function spin() {
    const r1 = getRandomSymbol();
    const r2 = getRandomSymbol();
    const r3 = getRandomSymbol();

    document.getElementById("reel1").textContent = r1;
    document.getElementById("reel2").textContent = r2;
    document.getElementById("reel3").textContent = r3;

    if (r1 === r2 && r2 === r3) {
        document.getElementById("result").textContent = "🎉  You Win!";
    } else {
        document.getElementById("result").textContent = "Try again!";
    }
}
