// ui.js — HUD, title screen, continue screen, announcements, game over

const UI = {

  drawTitle(ctx, tick, selectedOption) {
    const cx = CANVAS_W / 2;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    for (let y = 0; y < CANVAS_H; y += 4) { ctx.fillStyle = 'rgba(0,0,0,0.15)'; ctx.fillRect(0, y, CANVAS_W, 2); }
    ctx.fillStyle = '#fff';
    for (let i = 0; i < 120; i++) {
      const sx = (i * 137 + tick * 0.3) % CANVAS_W;
      const sy = (i * 97 + tick * 0.1) % CANVAS_H;
      const sz = (Math.sin(tick * 0.05 + i) + 1) * 1.5;
      ctx.fillRect(sx, sy, sz, sz);
    }
    ctx.save();
    const tp = 1 + Math.sin(tick * 0.06) * 0.03;
    ctx.translate(cx, 150); ctx.scale(tp, tp);
    ctx.font = 'bold 88px "Courier New", monospace'; ctx.textAlign = 'center';
    ctx.fillStyle = '#440000'; ctx.fillText('SMASH', 3, 3); ctx.fillText('TV', 3, 90);
    ctx.fillStyle = '#FF0000'; ctx.fillText('SMASH', 0, 0);
    ctx.fillStyle = '#FF6600'; ctx.fillText('TV', 0, 87);
    ctx.strokeStyle = '#FFFF00'; ctx.lineWidth = 2;
    ctx.strokeText('SMASH', 0, 0); ctx.strokeText('TV', 0, 87);
    ctx.restore();
    ctx.font = 'bold 16px "Courier New", monospace'; ctx.fillStyle = '#FFAA00'; ctx.textAlign = 'center';
    ctx.fillText('THE YEAR IS 1999. TELEVISION IS DEADLY.', cx, 280);
    ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(120, 300); ctx.lineTo(CANVAS_W - 120, 300); ctx.stroke();
    ctx.font = '13px "Courier New", monospace'; ctx.fillStyle = '#aaa';
    ctx.fillText('"I\'D BUY THAT FOR A DOLLAR!"  — SMASH TV HOST', cx, 322);
    const opts = ['1 PLAYER', '2 PLAYER', 'HOW TO PLAY'];
    for (let i = 0; i < opts.length; i++) {
      const y = 390 + i * 48, isSel = i === selectedOption;
      if (isSel) {
        ctx.fillStyle = 'rgba(255,0,0,0.2)'; ctx.fillRect(cx - 130, y - 26, 260, 40);
        ctx.strokeStyle = '#FF0000'; ctx.lineWidth = 2; ctx.strokeRect(cx - 130, y - 26, 260, 40);
        ctx.fillStyle = '#FFD700'; ctx.font = 'bold 20px monospace';
        ctx.fillText('►', cx - 148, y - 5); ctx.fillText('◄', cx + 130, y - 5);
      }
      ctx.font = `bold ${isSel ? 22 : 18}px "Courier New", monospace`;
      ctx.fillStyle = isSel ? '#FFD700' : '#888'; ctx.fillText(opts[i], cx, y);
    }
    if (Math.floor(tick / 30) % 2 === 0) { ctx.font = '14px "Courier New", monospace'; ctx.fillStyle = '#FF8800'; ctx.fillText('PRESS  ENTER  TO  START', cx, 570); }
    ctx.font = '11px monospace'; ctx.fillStyle = '#555';
    ctx.fillText('MOVE: WASD / ARROWS   AIM & SHOOT: MOUSE + SPACE  |  IJKL FIRE BUTTONS', cx, 610);
    ctx.fillText('PICK UP WEAPONS  •  SURVIVE THE SHOW  •  DEFEAT MUTOID MAN', cx, 628);
    ctx.fillStyle = '#333'; ctx.font = '9px monospace';
    ctx.fillText('INSPIRED BY SMASH TV (1990 MIDWAY) — FAN TRIBUTE — NOT FOR COMMERCIAL USE', cx, 720);
  },

  drawHowToPlay(ctx) {
    const cx = CANVAS_W / 2;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = 'bold 30px monospace'; ctx.fillStyle = '#FF0000'; ctx.textAlign = 'center';
    ctx.fillText('HOW TO PLAY', cx, 70);
    ctx.strokeStyle = '#FF6600'; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(100, 92); ctx.lineTo(CANVAS_W - 100, 92); ctx.stroke();
    const lines = [
      ['MOVE','WASD  or  ARROW KEYS'],['AIM & SHOOT','MOUSE — hold SPACE or click to fire'],
      ['FIRE BUTTONS','I = UP   K = DOWN   J = LEFT   L = RIGHT'],['',''],
      ['WEAPONS','Pick up colored icons:'],['  MACHINE','Default — rapid fire, infinite ammo'],
      ['  SPREAD','Orange — 3-way fan'],['  LASER','Purple — high DPS rapid beam'],
      ['  GRENADE','Green — arc, explodes on impact'],['  ELECTRIC','Cyan — bouncing arc damage'],['',''],
      ['POWER-UPS',''],['  SHIELD','Blue circle — absorbs 1 hit'],['  SPEED','Yellow — faster movement'],
      ['  EXTRA LIFE','Pink cross — +1 life'],['',''],
      ['BOSS','Defeat MUTOID MAN to clear Stage 1'],
      ['  PHASE 1','Charges + 4-way bullet spread'],
      ['  PHASE 2','Under 50% HP — 8-way rotating spread, faster'],
    ];
    ctx.textAlign = 'left';
    for (let i = 0; i < lines.length; i++) {
      const y = 126 + i * 24, [label, desc] = lines[i];
      if (!label) continue;
      ctx.font = 'bold 12px monospace'; ctx.fillStyle = '#FF8800'; ctx.fillText(label, 120, y);
      ctx.font = '12px monospace'; ctx.fillStyle = '#ccc'; ctx.fillText(desc, 300, y);
    }
    ctx.textAlign = 'center'; ctx.font = 'bold 14px monospace'; ctx.fillStyle = '#FFD700';
    ctx.fillText('PRESS ENTER OR BACKSPACE TO RETURN', cx, 690);
  },

  drawContinue(ctx, countdown, score) {
    const cx = CANVAS_W / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.85)'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = 'bold 52px monospace'; ctx.fillStyle = '#FF0000'; ctx.textAlign = 'center';
    ctx.fillText('CONTINUE?', cx, 240);
    const r = 70, angle = (countdown / 600) * Math.PI * 2;
    ctx.strokeStyle = '#333'; ctx.lineWidth = 10;
    ctx.beginPath(); ctx.arc(cx, 380, r, 0, Math.PI * 2); ctx.stroke();
    ctx.strokeStyle = '#FF0000';
    ctx.beginPath(); ctx.arc(cx, 380, r, -Math.PI / 2, -Math.PI / 2 + angle); ctx.stroke();
    ctx.font = 'bold 60px monospace'; ctx.fillStyle = '#FFD700'; ctx.fillText(Math.ceil(countdown / 60), cx, 400);
    ctx.font = '18px monospace'; ctx.fillStyle = '#aaa'; ctx.fillText(`SCORE: ${score}`, cx, 490);
    ctx.font = 'bold 16px monospace'; ctx.fillStyle = '#FF8800'; ctx.fillText('PRESS ENTER TO CONTINUE', cx, 540);
    ctx.fillStyle = '#555'; ctx.fillText('PRESS ESCAPE TO QUIT', cx, 568);
  },

  drawGameOver(ctx, score, highScore) {
    const cx = CANVAS_W / 2;
    ctx.fillStyle = 'rgba(0,0,0,0.9)'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = 'bold 72px monospace'; ctx.fillStyle = '#FF0000'; ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', cx, 260);
    ctx.font = 'bold 22px monospace'; ctx.fillStyle = '#FFD700';
    ctx.fillText(`FINAL SCORE: ${score.toLocaleString()}`, cx, 360);
    if (score >= highScore && score > 0) { ctx.fillStyle = '#FF8800'; ctx.fillText('NEW HIGH SCORE!', cx, 406); }
    else { ctx.fillStyle = '#888'; ctx.fillText(`HIGH SCORE: ${highScore.toLocaleString()}`, cx, 406); }
    ctx.font = 'bold 16px monospace'; ctx.fillStyle = '#FF8800';
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', cx, 500);
  },

  drawVictory(ctx, score, tick) {
    const cx = CANVAS_W / 2;
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    const colors = ['#FF0000','#FF8800','#FFFF00','#00FF00','#00FFFF','#FF00FF'];
    ctx.font = 'bold 64px monospace'; ctx.fillStyle = colors[Math.floor(tick / 8) % colors.length];
    ctx.textAlign = 'center'; ctx.fillText('YOU WIN!', cx, 220);
    ctx.font = 'bold 26px monospace'; ctx.fillStyle = '#FFAA00';
    ctx.fillText('MUTOID MAN DEFEATED', cx, 300); ctx.fillText('STAGE 1 COMPLETE', cx, 340);
    ctx.font = 'bold 22px monospace'; ctx.fillStyle = '#FFD700';
    ctx.fillText(`SCORE: ${score.toLocaleString()}`, cx, 440);
    ctx.font = '16px monospace'; ctx.fillStyle = '#aaa';
    ctx.fillText('PRESS ENTER TO PLAY AGAIN', cx, 520);
  },

  drawHUD(ctx, player, stage, room, totalRooms) {
    ctx.fillStyle = 'rgba(0,0,0,0.82)';
    ctx.fillRect(0, 0, ARENA_X, CANVAS_H);
    ctx.fillRect(ARENA_X + ARENA_W, 0, CANVAS_W - ARENA_X - ARENA_W, CANVAS_H);
    ctx.fillRect(0, 0, CANVAS_W, ARENA_Y);
    ctx.fillRect(0, ARENA_Y + ARENA_H, CANVAS_W, CANVAS_H - ARENA_Y - ARENA_H);
    ctx.strokeStyle = '#2a2a2a'; ctx.lineWidth = 1;
    ctx.strokeRect(ARENA_X, ARENA_Y, ARENA_W, ARENA_H);
    ctx.font = 'bold 13px monospace'; ctx.fillStyle = '#FF6600'; ctx.textAlign = 'center';
    ctx.fillText(`STAGE ${stage}  •  ROOM ${room}/${totalRooms}`, CANVAS_W / 2, 24);
    const lx = 6;
    ctx.textAlign = 'left';
    ctx.font = 'bold 11px monospace'; ctx.fillStyle = '#3399FF'; ctx.fillText('PLAYER 1', lx, 22);
    ctx.fillStyle = '#888'; ctx.font = '9px monospace'; ctx.fillText('SCORE', lx, 38);
    ctx.fillStyle = '#FFD700'; ctx.font = 'bold 13px monospace'; ctx.fillText(player.score.toLocaleString(), lx, 54);
    ctx.fillStyle = '#888'; ctx.font = '9px monospace'; ctx.fillText('LIVES', lx, 72);
    for (let i = 0; i < Math.max(0, player.lives); i++) { ctx.fillStyle = '#FF3399'; ctx.fillRect(lx + i * 14, 78, 10, 10); }
    ctx.fillStyle = '#888'; ctx.font = '9px monospace'; ctx.fillText('WEAPON', lx, 104);
    const wColor = { machine:'#0f0', spread:'#f80', laser:'#f0f', grenade:'#080', electric:'#0ff' };
    ctx.fillStyle = wColor[player.weapon] || '#0f0'; ctx.font = 'bold 10px monospace';
    ctx.fillText(player.weapon.toUpperCase(), lx, 118);
    const pct = player.weaponMeterPct;
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i / 6 < pct ? (wColor[player.weapon] || '#0f0') : '#1a1a1a';
      ctx.fillRect(lx + i * 12, 124, 10, 10);
      ctx.strokeStyle = '#333'; ctx.lineWidth = 1; ctx.strokeRect(lx + i * 12, 124, 10, 10);
    }
    if (player.shieldActive) { ctx.fillStyle = '#88AAFF'; ctx.font = 'bold 10px monospace'; ctx.fillText(`SHIELD ${Math.ceil(player.shieldTimer / 60)}s`, lx, 148); }
    if (player.speedBoost)  { ctx.fillStyle = '#FFFF00'; ctx.font = 'bold 10px monospace'; ctx.fillText(`SPEED ${Math.ceil(player.speedTimer / 60)}s`, lx, 164); }
    ctx.textAlign = 'center'; ctx.font = '10px monospace'; ctx.fillStyle = '#553300';
    ctx.fillText('♦  SMASH TV  ♦  GOOD LUCK... YOU\'LL NEED IT  ♦', CANVAS_W / 2, CANVAS_H - 10);
  },

  drawAnnouncement(ctx, text, alpha, color) {
    if (alpha <= 0) return;
    ctx.save(); ctx.globalAlpha = alpha;
    ctx.font = 'bold 30px monospace'; ctx.fillStyle = color || '#FFD700'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 5;
    ctx.strokeText(text, CANVAS_W / 2, CANVAS_H / 2 - 24);
    ctx.fillText(text, CANVAS_W / 2, CANVAS_H / 2 - 24);
    ctx.restore();
  },

  drawPause(ctx) {
    ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    ctx.font = 'bold 48px monospace'; ctx.fillStyle = '#FFD700'; ctx.textAlign = 'center';
    ctx.fillText('PAUSED', CANVAS_W / 2, CANVAS_H / 2 - 24);
    ctx.font = '16px monospace'; ctx.fillStyle = '#aaa';
    ctx.fillText('PRESS P TO RESUME', CANVAS_W / 2, CANVAS_H / 2 + 36);
  },

  drawBossWarning(ctx, tick) {
    if (Math.floor(tick / 15) % 2 === 0) { ctx.fillStyle = 'rgba(150,0,0,0.25)'; ctx.fillRect(0, 0, CANVAS_W, CANVAS_H); }
    ctx.font = 'bold 38px monospace'; ctx.fillStyle = '#FF0000'; ctx.textAlign = 'center';
    ctx.strokeStyle = '#000'; ctx.lineWidth = 4;
    ctx.strokeText('⚠  WARNING  ⚠', CANVAS_W / 2, CANVAS_H / 2 - 24);
    ctx.fillText('⚠  WARNING  ⚠', CANVAS_W / 2, CANVAS_H / 2 - 24);
    ctx.font = 'bold 20px monospace'; ctx.fillStyle = '#FF8800';
    ctx.fillText('MUTOID MAN APPROACHES', CANVAS_W / 2, CANVAS_H / 2 + 24);
  },

  scorePopups: [],
  addScorePop(x, y, value, color) { this.scorePopups.push({ x, y, value, color: color || '#FFD700', life: 1, vy: -1.5 }); },
  updateScorePops() {
    for (let i = this.scorePopups.length - 1; i >= 0; i--) {
      const p = this.scorePopups[i]; p.y += p.vy; p.life -= 0.02;
      if (p.life <= 0) this.scorePopups.splice(i, 1);
    }
  },
  drawScorePops(ctx) {
    for (const p of this.scorePopups) {
      ctx.save(); ctx.globalAlpha = p.life;
      ctx.font = 'bold 13px monospace'; ctx.fillStyle = p.color; ctx.textAlign = 'center';
      ctx.fillText(`+${p.value}`, p.x, p.y); ctx.restore();
    }
  }
};