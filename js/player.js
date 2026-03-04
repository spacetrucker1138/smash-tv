// player.js
const WEAPON_FIRE_RATES={machine:6,spread:14,laser:3,grenade:35,electric:10};
const WEAPON_DURATIONS={machine:999999,spread:480,laser:360,grenade:300,electric:420};
class Player{
  constructor(x,y,colorLabel){
    this.x=x;this.y=y;this.colorLabel=colorLabel;this.radius=10;this.speed=3.2;
    this.alive=true;this.lives=3;this.score=0;this.cash=0;
    this.weapon='machine';this.weaponTimer=0;this.fireCooldown=0;this.fireAngle=0;
    this.shieldActive=false;this.shieldTimer=0;this.speedBoost=false;this.speedTimer=0;
    this.invincible=0;this.kbx=0;this.kby=0;this.grenades=0;
    this.keys={};this.mouseX=x;this.mouseY=y;this.respawnFlash=0;
    this._setupInput();
  }
  _setupInput(){
    this._keyDown=(e)=>{this.keys[e.code]=true;e.preventDefault&&e.preventDefault();};
    this._keyUp=(e)=>{this.keys[e.code]=false;};
    this._mouseMove=(e)=>{const canvas=document.getElementById('gameCanvas'),rect=canvas.getBoundingClientRect(),scaleX=canvas.width/rect.width,scaleY=canvas.height/rect.height;this.mouseX=(e.clientX-rect.left)*scaleX;this.mouseY=(e.clientY-rect.top)*scaleY;};
    window.addEventListener('keydown',this._keyDown);window.addEventListener('keyup',this._keyUp);window.addEventListener('mousemove',this._mouseMove);
  }
  destroy(){window.removeEventListener('keydown',this._keyDown);window.removeEventListener('keyup',this._keyUp);window.removeEventListener('mousemove',this._mouseMove);}
  applyPickup(type){
    switch(type){
      case 'machine':case 'spread':case 'laser':case 'grenade':case 'electric':this.weapon=type;this.weaponTimer=WEAPON_DURATIONS[type];break;
      case 'shield':this.shieldActive=true;this.shieldTimer=360;break;
      case 'speed':this.speedBoost=true;this.speedTimer=480;break;
      case 'extralife':this.lives++;break;
      case 'cash':this.score+=500;this.cash+=500;break;
    }
  }
  respawn(cx,cy){this.x=cx;this.y=cy;this.alive=true;this.invincible=180;this.respawnFlash=30;this.weapon='machine';this.weaponTimer=0;this.shieldActive=false;this.kbx=0;this.kby=0;}
  update(bullets,particles){
    if(!this.alive)return;
    if(this.invincible>0)this.invincible--;if(this.respawnFlash>0)this.respawnFlash--;if(this.fireCooldown>0)this.fireCooldown--;
    if(this.shieldActive){this.shieldTimer--;if(this.shieldTimer<=0)this.shieldActive=false;}
    if(this.speedBoost){this.speedTimer--;if(this.speedTimer<=0)this.speedBoost=false;}
    if(this.weapon!=='machine'){this.weaponTimer--;if(this.weaponTimer<=0)this.weapon='machine';}
    this.x+=this.kbx;this.y+=this.kby;this.kbx*=0.8;this.kby*=0.8;
    const spd=this.speed*(this.speedBoost?1.6:1);let mx=0,my=0;
    if(this.keys['KeyW']||this.keys['ArrowUp'])my-=1;
    if(this.keys['KeyS']||this.keys['ArrowDown'])my+=1;
    if(this.keys['KeyA']||this.keys['ArrowLeft'])mx-=1;
    if(this.keys['KeyD']||this.keys['ArrowRight'])mx+=1;
    if(mx!==0&&my!==0){mx*=0.7071;my*=0.7071;}
    this.x+=mx*spd;this.y+=my*spd;
    this.x=clamp(this.x,ARENA_X+this.radius,ARENA_X+ARENA_W-this.radius);
    this.y=clamp(this.y,ARENA_Y+this.radius,ARENA_Y+ARENA_H-this.radius);
    let fx=0,fy=0;
    if(this.keys['KeyI']||this.keys['KeyX'])fy-=1;
    if(this.keys['KeyK']||this.keys['KeyB'])fy+=1;
    if(this.keys['KeyJ']||this.keys['KeyY'])fx-=1;
    if(this.keys['KeyL'])fx+=1;
    if(fx!==0||fy!==0){this.fireAngle=Math.atan2(fy,fx);this._tryFire(bullets,particles);}
    else{this.fireAngle=Math.atan2(this.mouseY-this.y,this.mouseX-this.x);if(this.keys['Space']||this.keys['MouseFire'])this._tryFire(bullets,particles);}
  }
  _tryFire(bullets,particles){if(this.fireCooldown>0)return;bullets.firePlayer(this.x,this.y,this.fireAngle,this.weapon,particles);this.fireCooldown=WEAPON_FIRE_RATES[this.weapon]||8;}
  takeDamage(particles){
    if(this.invincible>0)return false;
    if(this.shieldActive){this.shieldTimer-=80;if(this.shieldTimer<=0)this.shieldActive=false;particles.hitFlash(this.x,this.y);return false;}
    particles.hitFlash(this.x,this.y);this.lives--;if(this.lives>=0)this.alive=false;return true;
  }
  draw(ctx){
    if(!this.alive)return;if(this.invincible>0&&Math.floor(this.invincible/6)%2===0)return;
    Sprites.player(ctx,this.x,this.y,this.fireAngle,this.weapon);
    if(this.shieldActive)Sprites.shield(ctx,this.x,this.y,Math.min(1,this.shieldTimer/60));
  }
  get weaponMeterPct(){if(this.weapon==='machine')return 1;return Math.max(0,this.weaponTimer/WEAPON_DURATIONS[this.weapon]);}
}