const canvas = document.getElementById('glcanvas');
const gl = canvas.getContext('webgl');
        
if (!gl) {
    alert('WebGL not supported!');
    throw new Error('WebGL not supported');
}
        
gl.disable(gl.DEPTH_TEST);
gl.clearColor(0.0, 0.0, 0.0, 1.0);
        
function perspective(fov, aspect, near, far) {
    const f = 1.0 / Math.tan(fov / 2);
    const nf = 1.0 / (near - far);
    return new Float32Array([
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
    ]);
}
        
function identity() {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
        
function translate(tx, ty, tz) {
    return new Float32Array([
        1, 0, 0, 0,
        0, 1, 0, 0,
        0, 0, 1, 0,
        tx, ty, tz, 1
    ]);
}
        
function scale(sx, sy, sz) {
    return new Float32Array([
        sx, 0, 0, 0,
        0, sy, 0, 0,
        0, 0, sz, 0,
        0, 0, 0, 1
    ]);
}
        
function rotz(theta) {
    const c = Math.cos(theta);
    const s = Math.sin(theta);
    return new Float32Array([
        c, s, 0, 0,
        -s, c, 0, 0,
        0, 0, 1, 0,
        0, 0, 0, 1
    ]);
}
        
function multiply(a, b) {
    const result = new Float32Array(16);
    for (let col = 0; col < 4; col++) {
        for (let row = 0; row < 4; row++) {
            let sum = 0;
            for (let k = 0; k < 4; k++) {
                sum += a[row + k * 4] * b[k + col * 4];
            }
            result[row + col * 4] = sum;
        }
    }
    return result;
}
        
const vertexShaderSource = `
    attribute vec3 aPosition;
    attribute vec3 aColor;
    
    uniform mat4 uProjection;
    uniform mat4 uModel;
    
    varying vec3 vColor;
    
    void main() {
        gl_Position = uProjection * uModel * vec4(aPosition, 1.0);
        vColor = aColor;
    }
`;
        
const fragmentShaderSource = `
    precision mediump float;
    
    varying vec3 vColor;
    
    void main() {
        gl_FragColor = vec4(vColor, 1.0);
    }
`;
        
function createShader(type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader error:', gl.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}
        
const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);
        
const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);
gl.useProgram(program);
        
// Enhanced ship design
const shipVertices = new Float32Array([
    // Main fuselage
    0.0, 0.18, 0.0,
    -0.06, -0.08, 0.0,
    0.06, -0.08, 0.0,
    // Cockpit
    0.0, 0.05, 0.0,
    -0.04, -0.05, 0.0,
    0.04, -0.05, 0.0,
    // Left wing
    -0.08, 0.08, 0.0,
    -0.15, -0.08, 0.0,
    -0.06, -0.08, 0.0,
    // Right wing
    0.08, 0.08, 0.0,
    0.15, -0.08, 0.0,
    0.06, -0.08, 0.0,
    // Engine left
    -0.04, -0.08, 0.0,
    -0.07, -0.14, 0.0,
    -0.01, -0.14, 0.0,
    // Engine right
    0.04, -0.08, 0.0,
    0.07, -0.14, 0.0,
    0.01, -0.14, 0.0,
]);
        
const shipColors = new Float32Array([
    // Main fuselage - cyan
    0.0, 1.0, 0.8,  0.0, 1.0, 0.8,  0.0, 1.0, 0.8,
    // Cockpit - light blue
    0.3, 0.8, 1.0,  0.3, 0.8, 1.0,  0.3, 0.8, 1.0,
    // Left wing - cyan
    0.0, 0.9, 0.7,  0.0, 0.9, 0.7,  0.0, 0.9, 0.7,
    // Right wing - cyan
    0.0, 0.9, 0.7,  0.0, 0.9, 0.7,  0.0, 0.9, 0.7,
    // Engine left - orange
    1.0, 0.5, 0.0,  1.0, 0.5, 0.0,  1.0, 0.5, 0.0,
    // Engine right - orange
    1.0, 0.5, 0.0,  1.0, 0.5, 0.0,  1.0, 0.5, 0.0,
]);
        
const enemyVertices = new Float32Array([
    // Body
    0.0, 0.08, 0.0,
    -0.07, 0.0, 0.0,
    0.07, 0.0, 0.0,
    0.0, -0.08, 0.0,
    -0.07, 0.0, 0.0,
    0.07, 0.0, 0.0,
    // Antenna
    0.0, 0.08, 0.0,
    -0.02, 0.12, 0.0,
    0.02, 0.12, 0.0,
]);
        
const bulletVertices = new Float32Array([
    -0.015, 0.04, 0.0,
    -0.015, -0.02, 0.0,
    0.015, -0.02, 0.0,
    -0.015, 0.04, 0.0,
    0.015, -0.02, 0.0,
    0.015, 0.04, 0.0,
]);
        
const starVertices = new Float32Array([
    -0.01, 0.01, 0.0,
    -0.01, -0.01, 0.0,
    0.01, -0.01, 0.0,
    -0.01, 0.01, 0.0,
    0.01, -0.01, 0.0,
    0.01, 0.01, 0.0
]);
        
const particleVertices = new Float32Array([
    -0.02, 0.02, 0.0,
    -0.02, -0.02, 0.0,
    0.02, -0.02, 0.0,
    -0.02, 0.02, 0.0,
    0.02, -0.02, 0.0,
    0.02, 0.02, 0.0
]);
        
// Create static buffers
const buffers = {
    ship: { pos: gl.createBuffer(), verts: shipVertices, count: shipVertices.length / 3 },
    enemy: { pos: gl.createBuffer(), verts: enemyVertices, count: enemyVertices.length / 3 },
    bullet: { pos: gl.createBuffer(), verts: bulletVertices, count: bulletVertices.length / 3 },
    star: { pos: gl.createBuffer(), verts: starVertices, count: starVertices.length / 3 },
    particle: { pos: gl.createBuffer(), verts: particleVertices, count: particleVertices.length / 3 }
};

// Initialize all buffers once
Object.values(buffers).forEach(buf => {
    gl.bindBuffer(gl.ARRAY_BUFFER, buf.pos);
    gl.bufferData(gl.ARRAY_BUFFER, buf.verts, gl.STATIC_DRAW);
});

// Dynamic color buffers (reused every frame)
const shipColorBuffer = gl.createBuffer();
const enemyColorBuffer = gl.createBuffer();
const bulletColorBuffer = gl.createBuffer();
const starColorBuffer = gl.createBuffer();
const particleColorBuffer = gl.createBuffer();

gl.bindBuffer(gl.ARRAY_BUFFER, shipColorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, shipColors, gl.STATIC_DRAW);

const aPosition = gl.getAttribLocation(program, 'aPosition');
const aColor = gl.getAttribLocation(program, 'aColor');
const uProjection = gl.getUniformLocation(program, 'uProjection');
const uModel = gl.getUniformLocation(program, 'uModel');
        
const projectionMatrix = perspective(45 * Math.PI / 180, canvas.width / canvas.height, 0.1, 100);
gl.uniformMatrix4fv(uProjection, false, projectionMatrix);
        
// Game objects
let stars = [];
const numStars = 200;
        
for (let i = 0; i < numStars; i++) {
    stars.push({
        x: (Math.random() - 0.5) * 2.2,
        y: (Math.random() - 0.5) * 2.2,
        size: Math.random() * 0.7 + 0.2,
        brightness: Math.random() * 0.6 + 0.4,
        twinkleSpeed: Math.random() * 0.003 + 0.002,
        phase: Math.random() * Math.PI * 2
    });
}
        
let gameState = 'start';
let score = 0;
let lives = 3;
        
const player = {
    x: 0,
    y: -0.75,
    speed: 0.07,
    invincible: 0,
    engineGlow: 0
};
        
let bullets = [];
const bulletSpeed = 0.13;
let shootTimer = 0;
        
let enemies = [];
let enemyTimer = 0;
let enemyDelay = 40;
let wave = 1;
let waveProgress = 0;
        
let particles = [];
const MAX_PARTICLES = 200;
        
// Audio
let audioCtx = null;
function initAudio() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
}
        
function playBeep(freq, len, vol = 0.08) {
    if (!audioCtx) return;
    try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'square';
        osc.frequency.value = freq;
        gain.gain.value = vol;
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + len);
        osc.start();
        osc.stop(audioCtx.currentTime + len);
    } catch(e) {}
}
        
const keys = {};
        
window.addEventListener('keydown', (e) => {
    keys[e.key] = true;
    if ([' ', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
});
        
window.addEventListener('keyup', (e) => {
    keys[e.key] = false;
});
        
document.getElementById('startBtn').addEventListener('click', startGame);
document.getElementById('restartBtn').addEventListener('click', startGame);
        
function startGame() {
    initAudio();
    gameState = 'playing';
    score = 0;
    lives = 3;
    wave = 1;
    waveProgress = 0;
    player.x = 0;
    player.y = -0.75;
    player.invincible = 0;
    player.engineGlow = 0;
    bullets = [];
    enemies = [];
    particles = [];
    enemyTimer = 0;
    enemyDelay = 40;
    shootTimer = 0;
    
    updateHUD();
    document.getElementById('startScreen').style.display = 'none';
    document.getElementById('gameOver').classList.remove('show');
}
        
function spawnEnemy() {
    const types = ['basic', 'basic', 'basic', 'fast', 'fast', 'tough'];
    const type = types[Math.floor(Math.random() * types.length)];
    
    const enemy = {
        x: (Math.random() - 0.5) * 1.7,
        y: 1.1,
        type: type,
        speed: 0.007 + wave * 0.0008,
        wobble: Math.random() * Math.PI * 2,
        health: type === 'tough' ? 2 : 1
    };
    
    if (type === 'fast') {
        enemy.speed *= 1.8;
        enemy.x = (Math.random() - 0.5) * 1.4;
    } else if (type === 'tough') {
        enemy.speed *= 0.6;
    }
    
    enemies.push(enemy);
}
        
function spawnExplosion(x, y, size) {
    const count = Math.floor(8 + size * 12);
    for (let i = 0; i < count; i++) {
        if (particles.length >= MAX_PARTICLES) break;
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const speed = (0.01 + Math.random() * 0.03) * size;
        particles.push({
            x, y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            life: 1.5,
            maxLife: 1.5,
            color: [1.0, 0.3 + Math.random() * 0.4, 0.0]
        });
    }
}
        
function update() {
    if (gameState !== 'playing') return;
    
    // Player movement with diagonal normalization
    let dx = 0, dy = 0;
    if (keys['ArrowLeft'] || keys['a'] || keys['A']) dx -= 1; 
    if (keys['ArrowRight'] || keys['d'] || keys['D']) dx += 1;
    if (keys['ArrowUp'] || keys['w'] || keys['W']) dy += 1;
    if (keys['ArrowDown'] || keys['s'] || keys['S']) dy -= 1;
    
    if (dx !== 0 && dy !== 0) {
        dx *= 0.707;
        dy *= 0.707;
    }
    
    player.x += dx * player.speed;
    player.y += dy * player.speed;
    player.x = Math.max(-0.9, Math.min(0.9, player.x));
    player.y = Math.max(-0.85, Math.min(0.85, player.y));
    
    if (keys[' '] && shootTimer <= 0) {  // Shooting
        bullets.push({ x: player.x, y: player.y + 0.1 });
        bullets.push({ x: player.x - 0.05, y: player.y + 0.06 });
        bullets.push({ x: player.x + 0.05, y: player.y + 0.06 });
        playBeep(880, 0.06, 0.04);
        shootTimer = 6;
    }
    if (shootTimer > 0) shootTimer--;
    
    player.engineGlow = Math.sin(Date.now() * 0.02) * 0.3 + 0.7;  // Engine glow
    
    for (let i = bullets.length - 1; i >= 0; i--) {  // Update bullets
        bullets[i].y += bulletSpeed;
        if (bullets[i].y > 1.2) bullets.splice(i, 1);
    }
    
    for (let i = enemies.length - 1; i >= 0; i--) {   // Update enemies
        const e = enemies[i];
        e.y -= e.speed;
        
        if (e.type === 'fast') {
            e.wobble += 0.08;
            e.x += Math.sin(e.wobble) * 0.004;
        }
        
        if (e.y < -1.1) {
            enemies.splice(i, 1);
            if (player.invincible <= 0) {
                lives--;
                updateHUD();
                playBeep(100, 0.3, 0.1);
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }
    for (let i = particles.length - 1; i >= 0; i--) {   // Update particles
        const p = particles[i]; 
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.03;
        if (p.life <= 0) particles.splice(i, 1);
    }
    
    if (player.invincible > 0) player.invincible--;  // Player invincibility
    
    enemyTimer++;
    if (enemyTimer >= enemyDelay) {     // Enemy spawning
        spawnEnemy();
        enemyTimer = 0;
        if (Math.random() < 0.3) spawnEnemy();
    }
    // Waves
    waveProgress++;
    if (waveProgress > 500) {
        wave++;
        waveProgress = 0;
        enemyDelay = Math.max(15, 40 - wave * 2);
        playBeep(660, 0.08, 0.05);
        setTimeout(() => playBeep(880, 0.08, 0.05), 150);
    }
    // Collision: bullets vs enemies
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            const ex = bullets[i].x - enemies[j].x;
            const ey = bullets[i].y - enemies[j].y;
            if (Math.sqrt(ex * ex + ey * ey) < 0.1) {
                bullets.splice(i, 1);
                enemies[j].health--;
                if (enemies[j].health <= 0) {
                    const size = enemies[j].type === 'tough' ? 2 : 1;
                    spawnExplosion(enemies[j].x, enemies[j].y, size);
                    score += enemies[j].type === 'tough' ? 25 : (enemies[j].type === 'fast' ? 15 : 10);
                    enemies.splice(j, 1);
                    updateHUD();
                    playBeep(400, 0.15, 0.06);
                } else {
                    playBeep(600, 0.05, 0.04);
                }
                break;
            }
        }
    }
    // Collision: player vs enemies
    if (player.invincible <= 0) {
        for (let i = enemies.length - 1; i >= 0; i--) {
            const ex = player.x - enemies[i].x;
            const ey = player.y - enemies[i].y;
            if (Math.sqrt(ex * ex + ey * ey) < 0.13) {
                const size = enemies[i].type === 'tough' ? 2 : 1;
                spawnExplosion(enemies[i].x, enemies[i].y, size);
                enemies.splice(i, 1);
                lives--;
                player.invincible = 90;
                updateHUD();
                playBeep(80, 0.3, 0.12);
                if (lives <= 0) {
                    gameOver();
                    return;
                }
            }
        }
    }
}
        
function updateHUD() {
    document.getElementById('score').textContent = `Score: ${score}`;
    let hearts = '';
    for (let i = 0; i < lives; i++) hearts += '❤️';
    document.getElementById('lives').innerHTML = `Life: <span>${hearts}</span>`;
}
        
function gameOver() {
    gameState = 'gameOver';
    document.getElementById('finalScore').textContent = `FINAL SCORE: ${score}`;
    document.getElementById('gameOver').classList.add('show');
    playBeep(40, 0.6, 0.15);
    spawnExplosion(player.x, player.y, 3);
}
        
function drawShape(buffer, vertCount, colors, colorBuffer, x, y, sx = 1, sy = 1, rot = 0) {
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
    
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
    gl.enableVertexAttribArray(aColor);
    gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);
    
    let model = multiply(identity(), translate(x, y, -2.0));
    if (rot !== 0) model = multiply(model, rotz(rot));
    if (sx !== 1 || sy !== 1) model = multiply(model, scale(sx, sy, 1.0));
    gl.uniformMatrix4fv(uModel, false, model);
    gl.drawArrays(gl.TRIANGLES, 0, vertCount);
}
        
function render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    const time = Date.now() * 0.001;
    
    // Draw stars
    for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        const twinkle = s.brightness + Math.sin(time * s.twinkleSpeed * 100 + s.phase) * 0.25;
        const bright = Math.max(0.15, twinkle);
        const colors = new Float32Array(18).fill(bright);
        drawShape(buffers.star.pos, 6, colors, starColorBuffer, s.x, s.y, s.size, s.size);
    }
    
    if (gameState === 'playing' || gameState === 'gameOver') {
        update();
        
        // Draw player
        if (player.invincible <= 0 || Math.floor(player.invincible / 5) % 2 === 0) {
            drawShape(buffers.ship.pos, shipVertices.length / 3, shipColors, shipColorBuffer, player.x, player.y);
            
            // Engine glow
            const glowColors = new Float32Array([1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0]);
            drawShape(buffers.particle.pos, 6, glowColors, particleColorBuffer, 
                player.x - 0.025, player.y - 0.14, 0.5 * player.engineGlow, 0.8 * player.engineGlow);
            drawShape(buffers.particle.pos, 6, glowColors, particleColorBuffer, 
                player.x + 0.025, player.y - 0.14, 0.5 * player.engineGlow, 0.8 * player.engineGlow);
        }
        
        // Draw bullets
        for (let i = 0; i < bullets.length; i++) {
            const colors = new Float32Array([1,1,0.3, 1,1,0.3, 1,1,0.3, 1,1,0.3, 1,1,0.3, 1,1,0.3]);
            drawShape(buffers.bullet.pos, 6, colors, bulletColorBuffer, bullets[i].x, bullets[i].y);
        }
        
        // Draw enemies
        for (let i = 0; i < enemies.length; i++) {
            const e = enemies[i];
            let colors;
            if (e.type === 'basic') {
                colors = new Float32Array([1,0.2,0.2, 1,0.2,0.2, 1,0.2,0.2, 1,0.2,0.2, 1,0.2,0.2, 1,0.2,0.2, 0.8,0,0, 0.8,0,0, 0.8,0,0]);
            } else if (e.type === 'fast') {
                colors = new Float32Array([1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.6,0, 1,0.4,0, 1,0.4,0, 1,0.4,0]);
            } else {
                colors = new Float32Array([1,0,0.5, 1,0,0.5, 1,0,0.5, 1,0,0.5, 1,0,0.5, 1,0,0.5, 0.8,0,0.4, 0.8,0,0.4, 0.8,0,0.4]);
            }
            const s = e.type === 'tough' ? 1.4 : 1;
            drawShape(buffers.enemy.pos, 9, colors, enemyColorBuffer, e.x, e.y, s, s);
        }
        
        // Draw particles
        for (let i = 0; i < particles.length; i++) {
            const p = particles[i];
            const alpha = p.life / p.maxLife;
            const colors = new Float32Array(18);
            for (let j = 0; j < 6; j++) {
                colors[j*3] = p.color[0] * alpha;
                colors[j*3+1] = p.color[1] * alpha;
                colors[j*3+2] = p.color[2] * alpha;
            }
            drawShape(buffers.particle.pos, 6, colors, particleColorBuffer, p.x, p.y, alpha, alpha);
        }
    }
    
    if (gameState === 'start') {
        const floatY = Math.sin(time * 3) * 0.1;
        drawShape(buffers.ship.pos, shipVertices.length / 3, shipColors, shipColorBuffer, 0, floatY);
    }
    
    requestAnimationFrame(render);
}
        
render();