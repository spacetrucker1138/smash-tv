// game.js — Main game loop and state machine

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = CANVAS_W;
canvas.height = CANVAS_H;

function resizeCanvas() {
  const ratio = CANVAS_W / CANVAS_H, winW = window.innerWidth, winH = window.innerHeight;
  if (winW / winH > ratio) { canvas.style.height = winH + 'px'; canvas.style.width = (winH * ratio) + 'px'; }
  else { canvas.style.width = winW + 'px'; canvas.style.height = (winW / ratio) + 'px'; }
}
window.addEventListener('resize', resizeCanvas); resizeCanvas();

const STATES = { TITLE:'title', HOW_TO_PLAY:'howtoplay', PLAYING:'playing', BOSS_WARNING:'boss_warning', PAUSED:'paused', CONTINUE:'continue', GAME_OVER:'gameover', VICTORY:'victory' };

let gameState = STATES.TITLE, tick = 0, titleOption = 0;
let highScore = parseInt(localStorage.getItem('smashtv_hs') || '0');
let player, bullets, particles, pickups, enemyManager, roomManager, boss;
let announcement = { text: '', alpha: 0, color: '#FFD700', timer: 0 };
function showAnnouncement(text, color, duration) { announcement.text = text; announcement.color = color||'#FFD700'; announcement.alpha = 1; announcement.timer = duration||120; }
let bossWarningTimer = 0, continueCountdown = 0;

canvas.addEventListener('mousedown', () => { if (player) player.keys['MouseFire'] = true; });
canvas.addEventListener('mouseup',   () => { if (player) player.keys['MouseFire'] = false; });

window.addEventListener('keydown', (e) => {
  if (gameState === STATES.TITLE) {
    if (e.code === 'ArrowUp')   titleOption = (titleOption - 1 + 3) % 3;
    if (e.code === 'ArrowDown') titleOption = (titleOption + 1) % 3;
    if (e.code === 'Enter' || e.code === 'Space') { if (titleOption === 2) gameState = STATES.HOW_TO_PLAY; else startGame(); }
  } else if (gameState === STATES.HOW_TO_PLAY) {
    if (['Enter','Backspace','Escape'].includes(e.code)) gameState = STATES.TITLE;
  } else if (gameState === STATES.PLAYING) {
    if (e.code === 'KeyP' || e.code === 'Escape') gameState = STATES.PAUSED;
  } else if (gameState === STATES.PAUSED) {
    if (e.code === 'KeyP' || e.code === 'Escape') gameState = STATES.PLAYING;
  } else if (gameState === STATES.CONTINUE) {
    if (e.code === 'Enter') doRespawn(); else if (e.code === 'Escape') triggerGameOver();
  } else if (gameState === STATES.GAME_OVER || gameState === STATES.VICTORY) {
    if (e.code === 'Enter' || e.code === 'Space') gameState = STATES.TITLE;
  }
});

function startGame() {
  bullets = new BulletManager(); particles = new ParticleSystem(); pickups = new PickupManager();
  enemyManager = new EnemyManager(); roomManager = new RoomManager(); boss = null;
  player = new Player(ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2, 'blue');
  roomManager.startRoom(enemyManager, pickups);
  gameState = STATES.PLAYING; showAnnouncement('ROOM 1: SHOW FLOOR', '#FF8800');
}

function doRespawn() {
  player.lives = 2; player.respawn(ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2);
  bullets.clear(); gameState = STATES.PLAYING; showAnnouncement('GOOD LUCK!', '#FF8800');
}

function triggerGameOver() {
  if (player.score > highScore) { highScore = player.score; localStorage.setItem('smashtv_hs', highScore); }
  gameState = STATES.GAME_OVER;
}

function advanceRoom() {
  if (!roomManager.nextRoom()) return;
  bullets.clear(); particles.clear(); pickups.clear(); enemyManager.clear(); boss = null;
  const room = roomManager.currentRoom;
  if (room.type === 'boss') { bossWarningTimer = 180; gameState = STATES.BOSS_WARNING; bullets.clear(); }
  else { roomManager.startRoom(enemyManager, pickups); showAnnouncement(`ROOM ${roomManager.roomNumber}: ${room.name}`, '#FF8800'); }
}

function spawnBoss() {
  boss = new MutoidMan(ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2);
  roomManager.startRoom(enemyManager, pickups);
  showAnnouncement('MUTOID MAN!', '#FF0000', 180);
}

function handlePlayerHit() {
  const died = player.takeDamage(particles);
  if (died && player.lives < 0) { showAnnouncement('YOU DIED', '#FF0000'); setTimeout(() => { gameState = STATES.CONTINUE; continueCountdown = 600; }, 1200); }
  else if (died) { showAnnouncement(`${player.lives} LIVES LEFT`, '#FF8800'); setTimeout(() => { player.respawn(ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2); }, 1500); }
}

function update() {
  tick++;
  if (announcement.timer > 0) { announcement.timer--; if (announcement.timer < 40) announcement.alpha = announcement.timer / 40; }
  UI.updateScorePops();
  if (gameState === STATES.BOSS_WARNING) { if (--bossWarningTimer <= 0) { gameState = STATES.PLAYING; spawnBoss(); } return; }
  if (gameState === STATES.CONTINUE) { if (--continueCountdown <= 0) triggerGameOver(); return; }
  if (gameState !== STATES.PLAYING) return;
  player.update(bullets, particles);
  bullets.update(particles);
  particles.update();
  pickups.update();
  enemyManager.update(player.x, player.y, bullets, particles, pickups);
  roomManager.update(enemyManager, pickups, bullets);
  if (boss && boss.alive) {
    boss.update(player.x, player.y, bullets, particles);
    if (boss.isDead()) {
      pickups.spawnBossLoot(boss.x, boss.y); player.score += 10000;
      UI.addScorePop(boss.x, boss.y-40, 10000, '#FFD700');
      showAnnouncement('MUTOID MAN DEFEATED!', '#FFD700', 180);
      setTimeout(() => { if (player.score > highScore) { highScore = player.score; localStorage.setItem('smashtv_hs', highScore); } gameState = STATES.VICTORY; }, 3000);
      boss.alive = false; boss = null;
    }
  }
  const collected = pickups.collect(player.x, player.y, player.radius);
  if (collected) { player.applyPickup(collected); if (collected==='extralife') showAnnouncement('EXTRA LIFE!','#FF3399'); else if (collected==='shield') showAnnouncement('SHIELD ACTIVE','#88AAFF'); }
  if (player.alive && player.invincible === 0) {
    if (bullets.getEnemyHits(player.x, player.y, player.radius).length > 0) handlePlayerHit();
    else if (enemyManager.getMeleeHits(player.x, player.y, player.radius).length > 0) handlePlayerHit();
  }
  const newKills = enemyManager.totalKills;
  if (newKills !== (update._lastKillCount || 0)) { player.score += (newKills - (update._lastKillCount||0)) * 100; update._lastKillCount = newKills; }
  if (!roomManager.isBossRoom() && roomManager.roomCleared && !roomManager.inTransition) advanceRoom();
}

function draw() {
  ctx.clearRect(0, 0, CANVAS_W, CANVAS_H);
  if (gameState === STATES.TITLE)       { UI.drawTitle(ctx, tick, titleOption); return; }
  if (gameState === STATES.HOW_TO_PLAY) { UI.drawHowToPlay(ctx); return; }
  if (gameState === STATES.GAME_OVER)   { UI.drawGameOver(ctx, player ? player.score : 0, highScore); return; }
  if (gameState === STATES.VICTORY)     { UI.drawVictory(ctx, player ? player.score : 0, tick); particles.update(); particles.draw(ctx); return; }
  if (gameState === STATES.BOSS_WARNING){ ctx.fillStyle='#000'; ctx.fillRect(0,0,CANVAS_W,CANVAS_H); UI.drawBossWarning(ctx, tick); return; }
  if (gameState === STATES.CONTINUE) {
    roomManager.drawFloor(ctx); roomManager.drawWalls(ctx);
    particles.draw(ctx); pickups.draw(ctx); enemyManager.draw(ctx); if (boss) boss.draw(ctx);
    player.draw(ctx);
    UI.drawHUD(ctx, player, 1, roomManager.roomNumber, roomManager.totalRooms);
    UI.drawContinue(ctx, continueCountdown, player.score); return;
  }
  ctx.fillStyle = '#000'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  roomManager.drawFloor(ctx);
  particles.draw(ctx); pickups.draw(ctx); bullets.draw(ctx);
  enemyManager.draw(ctx); if (boss) boss.draw(ctx);
  player.draw(ctx);
  roomManager.drawWalls(ctx);  // walls + doors ON TOP of entities
  UI.drawScorePops(ctx);
  UI.drawAnnouncement(ctx, announcement.text, announcement.alpha, announcement.color);
  UI.drawHUD(ctx, player, 1, roomManager.roomNumber, roomManager.totalRooms);
  if (gameState === STATES.PAUSED) UI.drawPause(ctx);
}

function loop() { update(); draw(); requestAnimationFrame(loop); }
loop();