// rooms.js — Stage 1 room definitions, wave scheduling, arena wall + door rendering

const STAGE1_ROOMS = [
  {
    id: 1, name: 'SHOW FLOOR', type: 'fight',
    bg: '#0c0c08', tile1: '#131310', tile2: '#171714', neonColor: '#FF8800',
    waves: [
      { delay: 0,   type: 'grunt',   count: 10 }, { delay: 90,  type: 'grunt',   count: 8  },
      { delay: 160, type: 'clubber', count: 4  }, { delay: 260, type: 'grunt',   count: 12 },
      { delay: 350, type: 'shooter', count: 4  }, { delay: 450, type: 'grunt',   count: 8  },
    ],
    totalEnemies: 46,
    pickupDrops: [
      { x: ARENA_X + ARENA_W * 0.5, y: ARENA_Y + ARENA_H * 0.5, type: 'spread' },
      { x: ARENA_X + 120, y: ARENA_Y + 120, type: 'machine' },
    ]
  },
  {
    id: 2, name: 'THE KILLING FIELDS', type: 'fight',
    bg: '#080f08', tile1: '#0b130b', tile2: '#0f170f', neonColor: '#00FF44',
    waves: [
      { delay: 0,   type: 'grunt',   count: 14 }, { delay: 70,  type: 'shooter', count: 5  },
      { delay: 150, type: 'clubber', count: 5  }, { delay: 240, type: 'grunt',   count: 12 },
      { delay: 330, type: 'shooter', count: 6  }, { delay: 420, type: 'clubber', count: 4  },
      { delay: 500, type: 'grunt',   count: 10 },
    ],
    totalEnemies: 56,
    pickupDrops: [
      { x: ARENA_X + 100, y: ARENA_Y + 100, type: 'shield' },
      { x: ARENA_X + ARENA_W - 100, y: ARENA_Y + ARENA_H - 100, type: 'laser' },
      { x: ARENA_X + ARENA_W * 0.5, y: ARENA_Y + ARENA_H * 0.5, type: 'spread' },
    ]
  },
  {
    id: 3, name: 'DEATH GALLERY', type: 'fight',
    bg: '#08080f', tile1: '#0b0b14', tile2: '#0f0f18', neonColor: '#AA44FF',
    waves: [
      { delay: 0,   type: 'roller',  count: 4  }, { delay: 50,  type: 'grunt',   count: 14 },
      { delay: 130, type: 'shooter', count: 6  }, { delay: 220, type: 'roller',  count: 4  },
      { delay: 310, type: 'clubber', count: 6  }, { delay: 400, type: 'grunt',   count: 14 },
      { delay: 490, type: 'roller',  count: 4  },
    ],
    totalEnemies: 52,
    pickupDrops: [
      { x: ARENA_X + ARENA_W / 2, y: ARENA_Y + 80, type: 'grenade' },
      { x: ARENA_X + ARENA_W / 2, y: ARENA_Y + ARENA_H - 80, type: 'speed' },
      { x: ARENA_X + 100, y: ARENA_Y + ARENA_H / 2, type: 'electric' },
    ]
  },
  {
    id: 4, name: 'BLOOD ARENA', type: 'fight',
    bg: '#0f0606', tile1: '#160808', tile2: '#1a0a0a', neonColor: '#FF2200',
    waves: [
      { delay: 0,   type: 'grunt',   count: 16 }, { delay: 60,  type: 'roller',  count: 5  },
      { delay: 130, type: 'clubber', count: 6  }, { delay: 210, type: 'shooter', count: 8  },
      { delay: 300, type: 'roller',  count: 5  }, { delay: 390, type: 'grunt',   count: 16 },
      { delay: 480, type: 'clubber', count: 5  },
    ],
    totalEnemies: 61,
    pickupDrops: [
      { x: ARENA_X + 80, y: ARENA_Y + ARENA_H / 2, type: 'electric' },
      { x: ARENA_X + ARENA_W - 80, y: ARENA_Y + ARENA_H / 2, type: 'extralife' },
      { x: ARENA_X + ARENA_W / 2, y: ARENA_Y + ARENA_H / 2, type: 'shield' },
    ]
  },
  {
    id: 5, name: 'ANTECHAMBER', type: 'fight',
    bg: '#0d0900', tile1: '#130e00', tile2: '#171200', neonColor: '#FFCC00',
    waves: [
      { delay: 0,   type: 'grunt',   count: 18 }, { delay: 50,  type: 'roller',  count: 6  },
      { delay: 100, type: 'clubber', count: 7  }, { delay: 170, type: 'shooter', count: 9  },
      { delay: 250, type: 'roller',  count: 6  }, { delay: 340, type: 'grunt',   count: 18 },
      { delay: 430, type: 'clubber', count: 6  }, { delay: 520, type: 'shooter', count: 8  },
    ],
    totalEnemies: 78,
    pickupDrops: [
      { x: ARENA_X + ARENA_W / 2, y: ARENA_Y + ARENA_H / 2, type: 'spread' },
      { x: ARENA_X + 100, y: ARENA_Y + ARENA_H - 100, type: 'shield' },
      { x: ARENA_X + ARENA_W - 100, y: ARENA_Y + 100, type: 'grenade' },
    ]
  },
  {
    id: 6, name: 'BOSS ARENA', type: 'boss',
    bg: '#0a0000', tile1: '#100000', tile2: '#160000', neonColor: '#FF0000',
    waves: [], totalEnemies: 0, pickupDrops: []
  }
];

class RoomManager {
  constructor() {
    this.currentRoomIndex = 0; this.roomCleared = false; this.roomTimer = 0;
    this.transitionTimer = 0; this.inTransition = false; this.waveSchedule = [];
    this._doorAnimTimer = 0; this._activeDoors = [false, false, false, false];
  }
  get currentRoom() { return STAGE1_ROOMS[this.currentRoomIndex]; }
  get totalRooms() { return STAGE1_ROOMS.length; }
  get roomNumber() { return this.currentRoomIndex + 1; }
  isBossRoom() { return this.currentRoom.type === 'boss'; }

  startRoom(enemyManager, pickups) {
    const room = this.currentRoom;
    this.roomCleared = false; this.roomTimer = 0;
    this._doorAnimTimer = 0; this._activeDoors = [false, false, false, false];
    enemyManager.clear(); pickups.clear();
    this.waveSchedule = room.waves.map(w => ({ ...w, fired: false }));
    for (const pd of room.pickupDrops) pickups.spawn(pd.x, pd.y, pd.type);
  }

  update(enemyManager, pickups, bullets) {
    if (this.inTransition) { if (--this.transitionTimer <= 0) this.inTransition = false; return; }
    this.roomTimer++; this._doorAnimTimer++;
    for (const w of this.waveSchedule) {
      if (!w.fired && this.roomTimer >= w.delay) {
        const doorIdx = randInt(0, 3);
        this._activeDoors[doorIdx] = true;
        setTimeout(() => { this._activeDoors[doorIdx] = false; }, 600);
        for (let i = 0; i < w.count; i++) {
          const pos = randDoorPos();
          const e = new Enemy(pos.x, pos.y, w.type);
          e.spawnTimer = 10 + i * 5;
          enemyManager.enemies.push(e);
        }
        w.fired = true;
      }
    }
    if (!this.roomCleared) {
      const allFired = this.waveSchedule.every(w => w.fired);
      if (allFired && enemyManager.count === 0) this.roomCleared = true;
    }
  }

  nextRoom() {
    if (this.currentRoomIndex < STAGE1_ROOMS.length - 1) {
      this.currentRoomIndex++; this.inTransition = true; this.transitionTimer = 90; return true;
    }
    return false;
  }

  drawFloor(ctx) {
    const room = this.currentRoom;
    const tileSize = 44;
    for (let ty = ARENA_Y; ty < ARENA_Y + ARENA_H; ty += tileSize) {
      for (let tx = ARENA_X; tx < ARENA_X + ARENA_W; tx += tileSize) {
        const even = ((Math.floor((tx - ARENA_X) / tileSize) + Math.floor((ty - ARENA_Y) / tileSize)) % 2 === 0);
        ctx.fillStyle = even ? room.tile1 : room.tile2;
        ctx.fillRect(tx, ty, Math.min(tileSize, ARENA_X + ARENA_W - tx), Math.min(tileSize, ARENA_Y + ARENA_H - ty));
      }
    }
    const vg = ctx.createRadialGradient(ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2, ARENA_H*0.2, ARENA_X + ARENA_W/2, ARENA_Y + ARENA_H/2, ARENA_H*0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.55)');
    ctx.fillStyle = vg; ctx.fillRect(ARENA_X, ARENA_Y, ARENA_W, ARENA_H);
    ctx.font = 'bold 11px monospace'; ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.textAlign = 'center';
    ctx.fillText(this.currentRoom.name, ARENA_X + ARENA_W / 2, ARENA_Y + ARENA_H - 12);
  }

  drawWalls(ctx) {
    const room = this.currentRoom, neon = room.neonColor || '#FF8800';
    const ax = ARENA_X, ay = ARENA_Y, aw = ARENA_W, ah = ARENA_H, wt = WALL_T, dw = DOOR_W;
    const cx = ax + aw / 2, cy = ay + ah / 2;
    const wallFill = '#1a1a22', wallHi = '#2e2e40', wallLo = '#0d0d14';
    _drawWallSegH(ctx, ax, ay - wt, aw, wt, cx - dw/2 - ax, cx + dw/2 - ax, wallFill, wallHi, wallLo, neon);
    _drawWallSegH(ctx, ax, ay + ah, aw, wt, cx - dw/2 - ax, cx + dw/2 - ax, wallFill, wallHi, wallLo, neon);
    _drawWallSegV(ctx, ax - wt, ay, wt, ah, cy - dw/2 - ay, cy + dw/2 - ay, wallFill, wallHi, wallLo, neon);
    _drawWallSegV(ctx, ax + aw, ay, wt, ah, cy - dw/2 - ay, cy + dw/2 - ay, wallFill, wallHi, wallLo, neon);
    for (const [cx2, cy2] of [[ax-wt,ay-wt],[ax+aw,ay-wt],[ax-wt,ay+ah],[ax+aw,ay+ah]]) {
      ctx.fillStyle = wallFill; ctx.fillRect(cx2, cy2, wt, wt);
      ctx.fillStyle = wallHi; ctx.fillRect(cx2, cy2, wt, 3); ctx.fillRect(cx2, cy2, 3, wt);
      ctx.fillStyle = wallLo; ctx.fillRect(cx2, cy2+wt-3, wt, 3); ctx.fillRect(cx2+wt-3, cy2, 3, wt);
      ctx.fillStyle = neon; ctx.globalAlpha = 0.7;
      ctx.fillRect(cx2+wt/2-3, cy2+wt/2-3, 6, 6); ctx.globalAlpha = 1;
    }
    const doorCenters = [
      { x: cx, y: ay-wt/2, horiz: true,  active: this._activeDoors[0] },
      { x: cx, y: ay+ah+wt/2, horiz: true,  active: this._activeDoors[1] },
      { x: ax-wt/2, y: cy, horiz: false, active: this._activeDoors[2] },
      { x: ax+aw+wt/2, y: cy, horiz: false, active: this._activeDoors[3] },
    ];
    for (const d of doorCenters) {
      if (d.active) {
        ctx.save(); ctx.globalAlpha = 0.6 + Math.sin(this._doorAnimTimer * 0.3) * 0.4;
        const gw = d.horiz ? dw+10 : wt+4, gh = d.horiz ? wt+4 : dw+10;
        const grad = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, Math.max(gw,gh)/2);
        grad.addColorStop(0, neon); grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad; ctx.fillRect(d.x-gw/2, d.y-gh/2, gw, gh); ctx.restore();
      } else {
        ctx.save(); ctx.globalAlpha = 0.3; ctx.strokeStyle = neon; ctx.lineWidth = 1.5;
        const tw = d.horiz ? dw : wt-4, th = d.horiz ? wt-4 : dw;
        ctx.strokeRect(d.x-tw/2, d.y-th/2, tw, th); ctx.restore();
      }
    }
    ctx.save(); ctx.strokeStyle = neon; ctx.lineWidth = 1.5; ctx.globalAlpha = 0.35;
    ctx.strokeRect(ax-wt, ay-wt, aw+wt*2, ah+wt*2); ctx.globalAlpha = 1; ctx.restore();
    if (this.inTransition) {
      ctx.fillStyle = `rgba(0,0,0,${this.transitionTimer/90})`;
      ctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
    }
  }
}

function _drawWallSegH(ctx, wx, wy, ww, wh, gapStart, gapEnd, fill, hi, lo, neon) {
  if (gapStart > 0) _wallRect(ctx, wx, wy, gapStart, wh, fill, hi, lo);
  const rightW = ww - gapEnd;
  if (rightW > 0) _wallRect(ctx, wx + gapEnd, wy, rightW, wh, fill, hi, lo);
  ctx.fillStyle = '#000'; ctx.fillRect(wx + gapStart, wy, gapEnd - gapStart, wh);
  ctx.save(); ctx.strokeStyle = neon; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
  ctx.strokeRect(wx+gapStart+1, wy+1, gapEnd-gapStart-2, wh-2); ctx.restore();
}

function _drawWallSegV(ctx, wx, wy, ww, wh, gapStart, gapEnd, fill, hi, lo, neon) {
  if (gapStart > 0) _wallRect(ctx, wx, wy, ww, gapStart, fill, hi, lo);
  const bottomH = wh - gapEnd;
  if (bottomH > 0) _wallRect(ctx, wx, wy + gapEnd, ww, bottomH, fill, hi, lo);
  ctx.fillStyle = '#000'; ctx.fillRect(wx, wy+gapStart, ww, gapEnd-gapStart);
  ctx.save(); ctx.strokeStyle = neon; ctx.lineWidth = 2; ctx.globalAlpha = 0.5;
  ctx.strokeRect(wx+1, wy+gapStart+1, ww-2, gapEnd-gapStart-2); ctx.restore();
}

function _wallRect(ctx, x, y, w, h, fill, hi, lo) {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.fillStyle = hi; ctx.fillRect(x, y, w, 3); ctx.fillRect(x, y, 3, h);
  ctx.fillStyle = lo; ctx.fillRect(x, y+h-3, w, 3); ctx.fillRect(x+w-3, y, 3, h);
}