const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');
const highscoreEl = document.getElementById('highscore');
const startBtn = document.getElementById('start-btn');

canvas.width = 400;
canvas.height = 400;

let score = 0;
let highscore = localStorage.getItem('pixlHighscore') || 0;
let gameActive = false;
let animationId;

highscoreEl.innerText = `Best: ${highscore}`;

const player = {
    x: 200,
    y: 200,
    size: 20,
    speed: 5,
    color: '#00f3ff'
};

const keys = {};

let fragments = [];
let bugs = [];

function createItem(type) {
    return {
        x: Math.random() * (canvas.width - 20),
        y: Math.random() * (canvas.height - 20),
        size: 10,
        type: type
    };
}

function initGame() {
    score = 0;
    scoreEl.innerText = `Fragments: ${score}`;
    fragments = [createItem('fragment'), createItem('fragment')];
    bugs = [createItem('bug')];
    player.x = 200;
    player.y = 200;
    gameActive = true;
    startBtn.innerText = "System Reboot";
    gameLoop();
}

function update() {
    if (keys['w'] || keys['ArrowUp']) player.y -= player.speed;
    if (keys['s'] || keys['ArrowDown']) player.y += player.speed;
    if (keys['a'] || keys['ArrowLeft']) player.x -= player.speed;
    if (keys['d'] || keys['ArrowRight']) player.x += player.speed;

    // Boundary check
    player.x = Math.max(0, Math.min(canvas.width - player.size, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.size, player.y));

    // Fragment collision
    fragments.forEach((f, index) => {
        if (getCollision(player, f)) {
            score += 1;
            scoreEl.innerText = `Fragments: ${score}`;
            fragments.splice(index, 1);
            fragments.push(createItem('fragment'));

            // Add bug every 5 points
            if (score % 5 === 0) {
                bugs.push(createItem('bug'));
            }
        }
    });

    // Bug collision
    bugs.forEach(b => {
        if (getCollision(player, b)) {
            gameOver();
        }
    });
}

function getCollision(a, b) {
    return a.x < b.x + b.size &&
        a.x + a.size > b.x &&
        a.y < b.y + b.size &&
        a.y + a.size > b.y;
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Grid lines for tech feel
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 1;
    for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }

    // Player (Pixl)
    ctx.fillStyle = player.color;
    // Draw simple ghost shape
    ctx.beginPath();
    ctx.arc(player.x + player.size / 2, player.y + player.size / 2, player.size / 2, Math.PI, 0);
    ctx.lineTo(player.x + player.size, player.y + player.size);
    ctx.lineTo(player.x, player.y + player.size);
    ctx.fill();

    // Eyes
    ctx.fillStyle = '#000';
    ctx.fillRect(player.x + 4, player.y + 6, 3, 3);
    ctx.fillRect(player.x + 13, player.y + 6, 3, 3);

    // Fragments
    ctx.fillStyle = '#39ff14';
    fragments.forEach(f => {
        ctx.beginPath();
        ctx.arc(f.x + f.size / 2, f.y + f.size / 2, f.size / 2, 0, Math.PI * 2);
        ctx.fill();
        // Glow
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#39ff14';
    });
    ctx.shadowBlur = 0;

    // Bugs
    ctx.fillStyle = '#ff0055';
    bugs.forEach(b => {
        ctx.fillRect(b.x, b.y, b.size, b.size);
        // "Bug" legs
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#ff0055';
        ctx.beginPath();
        ctx.moveTo(b.x - 2, b.y - 2); ctx.lineTo(b.x + b.size + 2, b.y + b.size + 2);
        ctx.moveTo(b.x + b.size + 2, b.y - 2); ctx.lineTo(b.x - 2, b.y + b.size + 2);
        ctx.stroke();
    });
}

function gameLoop() {
    if (!gameActive) return;
    update();
    draw();
    animationId = requestAnimationFrame(gameLoop);
}

function gameOver() {
    gameActive = false;
    cancelAnimationFrame(animationId);

    if (score > highscore) {
        highscore = score;
        localStorage.setItem('pixlHighscore', highscore);
        highscoreEl.innerText = `Best: ${highscore}`;
    }

    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#ff0055';
    ctx.font = '20px "Press Start 2P"';
    ctx.textAlign = 'center';
    ctx.fillText('CRITICAL ERROR', canvas.width / 2, canvas.height / 2 - 20);
    ctx.font = '14px "Share Tech Mono"';
    ctx.fillStyle = '#fff';
    ctx.fillText(`Fragments restored: ${score}`, canvas.width / 2, canvas.height / 2 + 20);
}

window.addEventListener('keydown', e => keys[e.key.toLowerCase()] = true);
window.addEventListener('keyup', e => keys[e.key.toLowerCase()] = false);

startBtn.addEventListener('click', () => {
    if (!gameActive) {
        initGame();
    }
});
