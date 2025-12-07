const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let basket = { x: 120, y: 350, width: 60, height: 20 };
let gifts = [];
let obstacles = [];
let points = 0;
let lives = 3;
let gameOver = false;

function spawnGift() {
    gifts.push({ x: Math.random() * 280, y: -20, size: 20 });
}

function spawnObstacle() {
    obstacles.push({ x: Math.random() * 280, y: -20, size: 20 });
}

function drawBasket() {
    ctx.fillStyle = "#ff4d6d";
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
}

function drawGifts() {
    ctx.fillStyle = "#ffaccc";
    gifts.forEach(g => {
        ctx.beginPath();
        ctx.arc(g.x, g.y, g.size, 0, Math.PI * 2);
        ctx.fill();
    });
}

function drawObstacles() {
    ctx.fillStyle = "#555";
    obstacles.forEach(o => {
        ctx.beginPath();
        ctx.rect(o.x, o.y, o.size, o.size);
        ctx.fill();
    });
}

function updateGifts() {
    gifts.forEach(g => g.y += 2);
    gifts = gifts.filter(g => {
        const caught =
            g.y + g.size > basket.y &&
            g.x > basket.x && g.x < basket.x + basket.width;

        if (caught) {
            points++;
            if (points >= 20) endGame(true);
        }

        return g.y < 420 && !caught;
    });
}

function updateObstacles() {
    obstacles.forEach(o => o.y += 3);
    obstacles = obstacles.filter(o => {
        const hit =
            o.y + o.size > basket.y &&
            o.x > basket.x && o.x < basket.x + basket.width;

        if (hit) {
            lives--;
            if (lives <= 0) endGame(false);
        }

        return o.y < 420 && !hit;
    });
}

function drawHUD() {
    ctx.fillStyle = "#000";
    ctx.font = "16px Arial";
    ctx.fillText("Puntos: " + points, 10, 20);
    ctx.fillText("Vidas: " + lives, 220, 20);
}

function endGame(win) {
    gameOver = true;

    if (win) {
        document.getElementById("surprise").classList.remove("hidden");
        document.getElementById("openGiftBtn").classList.remove("hidden");

        document.getElementById("openGiftBtn").onclick = () => {
            openPopup();
        };

    } else {
        document.getElementById("retryLose").classList.remove("hidden");
    }
}

function resetGame() {
    points = 0;
    lives = 3;
    gifts = [];
    obstacles = [];
    gameOver = false;

    document.getElementById("surprise").classList.add("hidden");
    document.getElementById("retryLose").classList.add("hidden");

    gameLoop();
}

document.getElementById("retryBtn").addEventListener("click", resetGame);
document.getElementById("retryWin").addEventListener("click", resetGame);

canvas.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    basket.x = e.clientX - rect.left - basket.width / 2;
});

function gameLoop() {
    if (gameOver) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (Math.random() < 0.03) spawnGift();
    if (Math.random() < 0.02) spawnObstacle();

    updateGifts();
    updateObstacles();

    drawGifts();
    drawObstacles();
    drawBasket();
    drawHUD();

    requestAnimationFrame(gameLoop);
}

function openPopup() {
    document.getElementById("popupOverlay").style.display = "flex";
}

function closePopup() {
    document.getElementById("popupOverlay").style.display = "none";
}

gameLoop();
