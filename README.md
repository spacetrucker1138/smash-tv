# SMASH TV — Browser Clone

A fully functional browser-based tribute to **Super Smash TV (SNES, 1992)**.
Zero dependencies. Pure HTML5 Canvas + JavaScript. Drop `index.html` in a browser tab and go.

---

## How to Run

Just open `index.html` in any modern browser. No server needed.

---

## Controls

| Action | Key |
|--------|-----|
| Move | WASD or Arrow Keys |
| Aim | Mouse |
| Fire | SPACE or Left Click (hold to auto-fire) |
| Fire Up/Down/Left/Right | I / K / J / L |
| Pause | P or ESC |

---

## Game Structure

**Stage 1 — 5 Fight Rooms + Boss**

| Room | Name | Notes |
|------|------|-------|
| 1 | Show Floor | Intro — grunts and clubbers |
| 2 | The Killing Fields | Shooters added |
| 3 | Death Gallery | Roller tanks debut |
| 4 | Blood Arena | Dense mixed waves |
| 5 | Antechamber | Everything at once |
| 6 | Boss Arena | **MUTOID MAN** |

**Weapons** (pick up colored icons):
- Machine Gun (default, infinite)
- Spread Shot (3-way fan)
- Laser (high DPS rapid beam)
- Grenade (arc + explosion)
- Electric Arc (cyan bouncing damage)

**Power-ups:** Shield (absorbs 1 hit), Speed Boost, Extra Life

---

## Enemy Types

| Enemy | Behavior |
|-------|----------|
| Foot Grunt | Fast swarmer, rushes player |
| Club Mechanoid | Slow tank, heavy melee |
| Shooter | Keeps distance, fires at player |
| Roller | Bounces off walls, 4-way bullet bursts |

---

## Boss: Mutoid Man

- **Phase 1**: Charges + 4-way spread
- **Phase 2** (< 50% HP): Faster, 8-way rotating spread, slam stomp
- Big HP bar displayed above boss

---

## File Structure

```
smash-tv/
├── index.html          # Entry point
└── js/
    ├── utils.js        # Math, collision, constants
    ├── sprites.js      # All procedural pixel-art rendering
    ├── particles.js    # Sparks, blood, cash, explosions
    ├── pickups.js      # Weapon/power-up collectibles
    ├── bullets.js      # Bullet pool (player + enemy)
    ├── enemies.js      # Enemy AI + wave manager
    ├── boss.js         # Mutoid Man boss state machine
    ├── player.js       # Player controller + input
    ├── rooms.js        # Stage 1 room definitions + floor
    ├── ui.js           # HUD, title, continue, game over screens
    └── game.js         # Main loop + game state machine
```

---

## Steam / EXE Conversion Notes

This is built to be wrapped in **Electron** or **NW.js** for a desktop exe:

```
npm install electron
npx electron .
```

---

## Engine Reuse for MMO Arcade Bar

The `player.js` movement system and `rooms.js` arena layout are designed to be portable.
For the MMO bar concept: Player → AvatarController, RoomManager → SceneManager with persistent world.

---

## Credits

Inspired by **Smash TV** (Midway, 1990) and **Super Smash TV** (SNES, Beam Software/Acclaim, 1992).
Fan tribute — not for commercial use in original form.
Graphics: procedural canvas (swap in Gemini sprites via chroma-key on `#FF00FF`).