// enemies.js
class Enemy{
  constructor(x,y,type){
    this.x=x;this.y=y;this.type=type;this.alive=true;this.age=0;this.fireCooldown=0;this.angle=0;
    const stats={grunt:{hp:2,maxHp:2,radius:10,speed:2.2,score:100,cash:100,damage:1},clubber:{hp:6,maxHp:6,radius:14,speed:1.2,score:300,cash:300,damage:2},shooter:{hp:3,maxHp:3,radius:10,speed:1.5,score:200,cash:200,damage:1},roller:{hp:8,maxHp:8,radius:14,speed:2.0,score:400,cash:400,damage:1}};
    const s=stats[type]||stats.grunt;Object.assign(this,s);
    if(type==='roller'){this.rollerAngle=Math.random()*Math.PI*2;this.rollerTimer=0;}
    if(type==='shooter'){this.prefDist=randInt(140,200);this.fireInterval=randInt(80,130);this.fireCooldown=randInt(0,this.fireInterval);}
    this.kbx=0;this.kby=0;this.hitFlash=0;this.spawnTimer=30;
  }
  update(px,py,bullets,particles){
    this.age++;if(this.spawnTimer>0){this.spawnTimer--;return;}
    this.x+=this.kbx;this.y+=this.kby;this.kbx*=0.8;this.kby*=0.8;
    const dx=px-this.x,dy=py-this.y,d=Math.sqrt(dx*dx+dy*dy);
    const nx=d>0?dx/d:0,ny=d>0?dy/d:0;
    switch(this.type){
      case 'grunt':this.x+=nx*this.speed;this.y+=ny*this.speed;this.angle=Math.atan2(dy,dx);break;
      case 'clubber':this.x+=nx*this.speed+Math.sin(this.age*0.05)*0.5;this.y+=ny*this.speed+Math.cos(this.age*0.05)*0.5;this.angle=Math.atan2(dy,dx);break;
      case 'shooter':
        this.angle=Math.atan2(dy,dx);
        if(d>this.prefDist+20){this.x+=nx*this.speed;this.y+=ny*this.speed;}
        else if(d<this.prefDist-20){this.x-=nx*this.speed;this.y-=ny*this.speed;}
        else{this.x+=-ny*this.speed;this.y+=nx*this.speed;}
        this.fireCooldown--;if(this.fireCooldown<=0){bullets.fireEnemy(this.x,this.y,px,py,3.5);this.fireCooldown=this.fireInterval;}
        break;
      case 'roller':
        this.rollerTimer++;if(this.rollerTimer>90){this.rollerAngle=angleTo(this.x,this.y,px,py)+randFloat(-0.4,0.4);this.rollerTimer=0;}
        this.x+=Math.cos(this.rollerAngle)*this.speed;this.y+=Math.sin(this.rollerAngle)*this.speed;
        if(this.x<ARENA_X+20){this.rollerAngle=Math.PI-this.rollerAngle;this.x=ARENA_X+20;}
        if(this.x>ARENA_X+ARENA_W-20){this.rollerAngle=Math.PI-this.rollerAngle;this.x=ARENA_X+ARENA_W-20;}
        if(this.y<ARENA_Y+20){this.rollerAngle=-this.rollerAngle;this.y=ARENA_Y+20;}
        if(this.y>ARENA_Y+ARENA_H-20){this.rollerAngle=-this.rollerAngle;this.y=ARENA_Y+ARENA_H-20;}
        this.fireCooldown--;if(this.fireCooldown<=0){for(let i=0;i<4;i++)bullets.fireEnemyAngle(this.x,this.y,(i/4)*Math.PI*2,3);this.fireCooldown=90;}
        break;
    }
    this.x=clamp(this.x,ARENA_X+this.radius,ARENA_X+ARENA_W-this.radius);
    this.y=clamp(this.y,ARENA_Y+this.radius,ARENA_Y+ARENA_H-this.radius);
    if(this.hitFlash>0)this.hitFlash--;
  }
  takeDamage(amount,kbAngle){this.hp-=amount;this.hitFlash=6;this.kbx=Math.cos(kbAngle)*3;this.kby=Math.sin(kbAngle)*3;if(this.hp<=0)this.alive=false;}
  draw(ctx){
    if(this.spawnTimer>0&&Math.floor(this.spawnTimer/3)%2===0)return;
    ctx.save();if(this.hitFlash>0&&this.hitFlash%2===0){ctx.globalAlpha=0.4;ctx.filter='brightness(10)';}
    switch(this.type){
      case 'grunt':Sprites.footGrunt(ctx,this.x,this.y);break;
      case 'clubber':Sprites.clubMech(ctx,this.x,this.y);break;
      case 'shooter':Sprites.shooter(ctx,this.x,this.y,this.angle);break;
      case 'roller':Sprites.roller(ctx,this.x,this.y);break;
    }
    ctx.restore();
    if(this.hp<this.maxHp){const bw=this.radius*2.5,bh=3,bx=this.x-bw/2,by=this.y-this.radius-8;ctx.fillStyle='#500';ctx.fillRect(bx,by,bw,bh);ctx.fillStyle='#F00';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh);}
  }
}
class EnemyManager{
  constructor(){this.enemies=[];this.waveQueue=[];this.waveTimer=0;this.waveInterval=120;this.totalKills=0;}
  spawnEnemy(type){const pos=randEdgePos();this.enemies.push(new Enemy(pos.x,pos.y,type));}
  update(px,py,bullets,particles,pickups){
    if(this.waveQueue.length>0){this.waveTimer--;if(this.waveTimer<=0){const wave=this.waveQueue.shift();const count=wave.count||1;for(let i=0;i<count;i++)setTimeout(()=>this.spawnEnemy(wave.type),i*150);this.waveTimer=this.waveInterval;}}
    for(let i=this.enemies.length-1;i>=0;i--){
      const e=this.enemies[i];e.update(px,py,bullets,particles);
      const hits=bullets.getPlayerHits(e.x,e.y,e.radius);
      for(const h of hits){e.takeDamage(h.damage,angleTo(px,py,e.x,e.y));if(h.weaponType==='electric')particles.electricArc(e.x,e.y);else particles.explode(e.x,e.y,5,'#FF4400','#FFAA00');}
      if(!e.alive){particles.blood(e.x,e.y,8);particles.cashBurst(e.x,e.y,e.cash);particles.explode(e.x,e.y,12,'#FF0000','#FF8800');if(Math.random()<0.3)pickups.spawnRandom(e.x,e.y);this.totalKills++;this.enemies.splice(i,1);}
    }
  }
  draw(ctx){for(const e of this.enemies)e.draw(ctx);}
  get count(){return this.enemies.length;}
  clear(){this.enemies=[];this.waveQueue=[];}
  getMeleeHits(px,py,pr){const hits=[];for(const e of this.enemies){if(e.spawnTimer>0)continue;if(circleCollide(e.x,e.y,e.radius,px,py,pr))hits.push(e);}return hits;}
}