// pickups.js
const WEAPON_TYPES=['machine','spread','laser','grenade','electric'];
const POWERUP_TYPES=['shield','speed','extralife'];
class Pickup{
  constructor(x,y,type){this.x=x;this.y=y;this.type=type;this.radius=10;this.alive=true;this.age=0;this.lifetime=600;}
  update(){this.age++;if(this.age>this.lifetime)this.alive=false;}
  draw(ctx){if(this.age>this.lifetime*0.7&&Math.floor(this.age/8)%2===0)return;Sprites.pickup(ctx,this.x,this.y,this.type);ctx.save();ctx.font='7px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText(this.type.toUpperCase().slice(0,3),this.x,this.y+16);ctx.restore();}
}
class PickupManager{
  constructor(){this.pickups=[];}
  spawn(x,y,type){this.pickups.push(new Pickup(x,y,type));}
  spawnRandom(x,y){const r=Math.random();if(r<0.60)this.spawn(x,y,randFrom(WEAPON_TYPES));else if(r<0.85)this.spawn(x,y,'cash');else this.spawn(x,y,randFrom(POWERUP_TYPES));}
  spawnBossLoot(cx,cy){const items=['extralife','shield','spread','laser','cash','cash'];for(let i=0;i<items.length;i++){const a=(i/items.length)*Math.PI*2,r=60;this.spawn(cx+Math.cos(a)*r,cy+Math.sin(a)*r,items[i]);}}
  update(){for(let i=this.pickups.length-1;i>=0;i--){this.pickups[i].update();if(!this.pickups[i].alive)this.pickups.splice(i,1);}}
  draw(ctx){for(const p of this.pickups)p.draw(ctx);}
  collect(px,py,pr=14){for(let i=this.pickups.length-1;i>=0;i--){const p=this.pickups[i];if(dist(px,py,p.x,p.y)<pr+p.radius){const t=p.type;this.pickups.splice(i,1);return t;}}return null;}
  clear(){this.pickups=[];}
}