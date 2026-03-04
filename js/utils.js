// utils.js — Math helpers, collision detection, constants

const CANVAS_W = 1280;
const CANVAS_H = 800;

// HUD panels: left/right = 90px, top = 70px, bottom = 50px
const ARENA_X = 90;
const ARENA_Y = 70;
const ARENA_W = CANVAS_W - 180;   // 1100
const ARENA_H = CANVAS_H - 120;   // 680

// Wall thickness (visual border drawn outside arena)
const WALL_T = 18;

// Door dimensions (cut into each wall, centered on each side)
const DOOR_W = 52;
const DOOR_H = WALL_T + 4;

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function dist(ax, ay, bx, by) { const dx = ax - bx, dy = ay - by; return Math.sqrt(dx * dx + dy * dy); }
function normalize(dx, dy) { const len = Math.sqrt(dx * dx + dy * dy); if (len === 0) return { x: 0, y: 0 }; return { x: dx / len, y: dy / len }; }
function angleTo(ax, ay, bx, by) { return Math.atan2(by - ay, bx - ax); }
function circleCollide(ax, ay, ar, bx, by, br) { return dist(ax, ay, bx, by) < ar + br; }
function rectCollide(ax, ay, aw, ah, bx, by, bw, bh) { return ax < bx + bw && ax + aw > bx && ay < by + bh && ay + ah > by; }
function randInt(lo, hi) { return Math.floor(Math.random() * (hi - lo + 1)) + lo; }
function randFloat(lo, hi) { return Math.random() * (hi - lo) + lo; }
function randFrom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function lerp(a, b, t) { return a + (b - a) * t; }

// 4 door center positions (for enemy spawning)
function getDoorPositions() {
  const cx = ARENA_X + ARENA_W / 2;
  const cy = ARENA_Y + ARENA_H / 2;
  return [
    { x: cx,              y: ARENA_Y + 2,           dir: 'north' },
    { x: cx,              y: ARENA_Y + ARENA_H - 2,  dir: 'south' },
    { x: ARENA_X + 2,     y: cy,                    dir: 'west'  },
    { x: ARENA_X + ARENA_W - 2, y: cy,              dir: 'east'  },
  ];
}

// Spawn at a random door, slightly inside the arena
function randDoorPos() {
  const doors = getDoorPositions();
  const d = randFrom(doors);
  const inset = 24;
  switch (d.dir) {
    case 'north': return { x: d.x + randFloat(-16, 16), y: ARENA_Y + inset };
    case 'south': return { x: d.x + randFloat(-16, 16), y: ARENA_Y + ARENA_H - inset };
    case 'west':  return { x: ARENA_X + inset,          y: d.y + randFloat(-16, 16) };
    case 'east':  return { x: ARENA_X + ARENA_W - inset, y: d.y + randFloat(-16, 16) };
  }
}

// Legacy alias
function randEdgePos() { return randDoorPos(); }

function drawBlock(ctx, x, y, w, h, fill, stroke) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1); }
}

function pixelText(ctx, text, x, y, size, color) {
  ctx.save();
  ctx.font = `bold ${size}px 'Courier New', monospace`;
  ctx.fillStyle = color || '#fff';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'top';
  ctx.fillText(text, x, y);
  ctx.restore();
}