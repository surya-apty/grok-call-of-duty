// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player object
const player = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 20,
    color: 'blue',
    speed: 5,
    dx: 0,
    dy: 0
};

// Projectiles array
const projectiles = [];

// Enemies array
const enemies = [];

// Handle player movement
const keys = {
    w: false,
    a: false,
    s: false,
    d: false
};

document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Shooting mechanics
document.addEventListener('click', (e) => {
    const angle = Math.atan2(e.clientY - player.y, e.clientX - player.x);
    const velocity = {
        x: Math.cos(angle) * 10,
        y: Math.sin(angle) * 10
    };
    projectiles.push({
        x: player.x,
        y: player.y,
        radius: 5,
        color: 'red',
        velocity
    });
});

// Spawn enemies periodically
function spawnEnemy() {
    setInterval(() => {
        const radius = 15;
        const x = Math.random() < 0.5 ? 0 - radius : canvas.width + radius;
        const y = Math.random() * canvas.height;
        const color = 'green';
        const velocity = {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 4
        };
        enemies.push({ x, y, radius, color, velocity });
    }, 2000); // Spawn every 2 seconds
}

// Update game state
function update() {
    // Player movement
    player.dx = 0;
    player.dy = 0;
    if (keys.w) player.dy = -player.speed;
    if (keys.s) player.dy = player.speed;
    if (keys.a) player.dx = -player.speed;
    if (keys.d) player.dx = player.speed;

    player.x += player.dx;
    player.y += player.dy;

    // Keep player in bounds
    player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x));
    player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y));

    // Update projectiles
    projectiles.forEach((projectile, pIndex) => {
        projectile.x += projectile.velocity.x;
        projectile.y += projectile.velocity.y;

        // Remove projectiles that go off-screen
        if (
            projectile.x < 0 ||
            projectile.x > canvas.width ||
            projectile.y < 0 ||
            projectile.y > canvas.height
        ) {
            projectiles.splice(pIndex, 1);
        }
    });

    // Update enemies
    enemies.forEach((enemy, eIndex) => {
        enemy.x += enemy.velocity.x;
        enemy.y += enemy.velocity.y;

        // Collision with projectiles
        projectiles.forEach((projectile, pIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);
            if (dist - enemy.radius - projectile.radius < 1) {
                enemies.splice(eIndex, 1);
                projectiles.splice(pIndex, 1);
            }
        });

        // Remove enemies that go off-screen (optional)
        if (
            enemy.x < -enemy.radius ||
            enemy.x > canvas.width + enemy.radius ||
            enemy.y < -enemy.radius ||
            enemy.y > canvas.height + enemy.radius
        ) {
            enemies.splice(eIndex, 1);
        }
    });
}

// Draw game objects
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw player
    ctx.beginPath();
    ctx.arc(player.x, player.y, player.radius, 0, Math.PI * 2);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();

    // Draw projectiles
    projectiles.forEach((projectile) => {
        ctx.beginPath();
        ctx.arc(projectile.x, projectile.y, projectile.radius, 0, Math.PI * 2);
        ctx.fillStyle = projectile.color;
        ctx.fill();
        ctx.closePath();
    });

    // Draw enemies
    enemies.forEach((enemy) => {
        ctx.beginPath();
        ctx.arc(enemy.x, enemy.y, enemy.radius, 0, Math.PI * 2);
        ctx.fillStyle = enemy.color;
        ctx.fill();
        ctx.closePath();
    });
}

// Game loop
function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

// Start the game
spawnEnemy();
gameLoop();