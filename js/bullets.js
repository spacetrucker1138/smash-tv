// bullets.js
class Bullet{
  constructor(x,y,vx,vy,type,owner,damage,radius){
    this.x=x;this.y=y;this.vx=vx;this.vy=vy;this.type=type;this.weaponType=owner;
    this.damage=damage||1;this.radius=radius||4;this.alive=true;this.age=0;
    this.angle=Math.atan2(vy,vx);this.maxAge=80;
    this.isGrenade=(owner==='grenade');this.isLaser=(owner==='laser');
    if(this.isLaser)this.maxAge=6;if(this.isGrenade)this.maxAge=45;
  }
  update(){this.x+=this.vx;this.y+=this.vy;this.age++;if(this.x<ARENA_X-10||this.x>ARENA_X+ARENA_W+10||this.y<ARENA_Y-10||this.y>ARENA_Y+ARENA_H+10)this.alive=false;if(this.age>this.maxAge)this.alive=false;}
  draw(ctx){if(this.type==='player')Sprites.bulletPlayer(ctx,this.x,this.y,this.angle,this.weaponType);else Sprites.bulletEnemy(ctx,this.x,this.y);}
}
class BulletManager{
  constructor(){this.bullets=[];this.grenadeExplosions=[];}
  firePlayer(px,py,angle,weaponType,particles){
    const speed=weaponType==='laser'?18:(weaponType==='grenade'?7:10);
    const damage={machine:1,spread:1,laser:3,grenade:2,electric:2}[weaponType]||1;
    if(weaponType==='spread'){for(let i=-1;i<=1;i++){const a=angle+i*0.22;this.bullets.push(new Bullet(px+Math.cos(a)*16,py+Math.sin(a)*16,Math.cos(a)*speed,Math.sin(a)*speed,'player',weaponType,damage));}}
    else this.bullets.push(new Bullet(px+Math.cos(angle)*16,py+Math.sin(angle)*16,Math.cos(angle)*speed,Math.sin(angle)*speed,'player',weaponType,damage));
    if(particles)particles.muzzle(px,py,angle);
  }
  fireEnemy(ex,ey,tx,ty,speed){speed=speed||4;const a=angleTo(ex,ey,tx,ty);this.bullets.push(new Bullet(ex,ey,Math.cos(a)*speed,Math.sin(a)*speed,'enemy','enemy',1,5));}
  fireEnemyAngle(ex,ey,angle,speed){speed=speed||4;this.bullets.push(new Bullet(ex,ey,Math.cos(angle)*speed,Math.sin(angle)*speed,'enemy','enemy',1,5));}
  update(particles){
    for(let i=this.bullets.length-1;i>=0;i--){const b=this.bullets[i];b.update();if(!b.alive){if(b.isGrenade&&b.type==='player'){this.grenadeExplosions.push({x:b.x,y:b.y,frame:0,radius:50});if(particles)particles.grenadeBlast(b.x,b.y);}this.bullets.splice(i,1);}}
    for(let i=this.grenadeExplosions.length-1;i>=0;i--){this.grenadeExplosions[i].frame++;if(this.grenadeExplosions[i].frame>20)this.grenadeExplosions.splice(i,1);}
  }
  draw(ctx){for(const b of this.bullets)b.draw(ctx);for(const e of this.grenadeExplosions)Sprites.explosion(ctx,e.x,e.y,e.frame,20);}
  getPlayerHits(ex,ey,er){
    const hits=[];for(let i=this.bullets.length-1;i>=0;i--){const b=this.bullets[i];if(b.type!=='player')continue;if(circleCollide(b.x,b.y,b.radius,ex,ey,er)){hits.push(b);b.alive=false;this.bullets.splice(i,1);}}
    for(const exp of this.grenadeExplosions){if(dist(exp.x,exp.y,ex,ey)<exp.radius+er)hits.push({damage:3,weaponType:'grenade'});}
    return hits;
  }
  getEnemyHits(px,py,pr){const hits=[];for(let i=this.bullets.length-1;i>=0;i--){const b=this.bullets[i];if(b.type!=='enemy')continue;if(circleCollide(b.x,b.y,b.radius,px,py,pr)){hits.push(b);b.alive=false;this.bullets.splice(i,1);}}return hits;}
  clear(){this.bullets=[];this.grenadeExplosions=[];}
}