// boss.js — Mutoid Man boss state machine
// Phase 1: Charge + 4-way spread + slam
// Phase 2 (<50% HP): Faster, rotating 8-way spread, aggressive charges
class MutoidMan{
  constructor(cx,cy){
    this.x=cx;this.y=cy;this.hp=120;this.maxHp=120;this.radius=48;this.alive=true;
    this.phase=1;this.tick=0;this.hitFlash=0;this.kbx=0;this.kby=0;
    this.state='idle';this.stateTimer=0;this.chargeVx=0;this.chargeVy=0;this.shootAngle=0;
    this.announceTimer=0;this.dying=false;this.deathTimer=0;
  }
  update(px,py,bullets,particles){
    if(this.dying){this.deathTimer++;if(this.deathTimer%8===0)particles.grenadeBlast(this.x+randFloat(-40,40),this.y+randFloat(-40,40));return;}
    this.tick++;this.x+=this.kbx;this.y+=this.kby;this.kbx*=0.85;this.kby*=0.85;
    if(this.hp<=this.maxHp*0.5&&this.phase===1){this.phase=2;this.announceTimer=120;}
    const speed=this.phase>=2?2.8:1.8,fireRate=this.phase>=2?30:50;
    this.stateTimer++;
    switch(this.state){
      case 'idle':{
        const dx=px-this.x,dy=py-this.y,d=Math.sqrt(dx*dx+dy*dy)||1;
        this.x+=(dx/d)*0.6;this.y+=(dy/d)*0.6;
        if(this.stateTimer>(this.phase>=2?40:60)){
          const roll=Math.random();
          if(roll<0.45){this.state='charge';const a=angleTo(this.x,this.y,px,py);this.chargeVx=Math.cos(a)*speed*3.5;this.chargeVy=Math.sin(a)*speed*3.5;}
          else if(roll<0.8){this.state='shoot';this.shootAngle=angleTo(this.x,this.y,px,py);}
          else this.state='slam';
          this.stateTimer=0;
        }
        break;
      }
      case 'charge':{
        this.x+=this.chargeVx;this.y+=this.chargeVy;this.chargeVx*=0.96;this.chargeVy*=0.96;
        if(this.stateTimer>40||Math.abs(this.chargeVx)<0.3){this.state='idle';this.stateTimer=0;}
        break;
      }
      case 'shoot':{
        const count=this.phase>=2?8:4;
        if(this.stateTimer%fireRate===1){for(let i=0;i<count;i++){const a=this.shootAngle+(i/count)*Math.PI*2;bullets.fireEnemyAngle(this.x,this.y,a,4.5);}this.shootAngle+=this.phase>=2?0.3:0;particles.explode(this.x,this.y,5,'#FF6600','#FFFF00');}
        if(this.stateTimer>(this.phase>=2?180:140)){this.state='idle';this.stateTimer=0;}
        break;
      }
      case 'slam':{
        if(this.stateTimer===20){for(let i=0;i<12;i++)bullets.fireEnemyAngle(this.x,this.y,(i/12)*Math.PI*2,5);particles.grenadeBlast(this.x,this.y);}
        if(this.stateTimer>50){this.state='idle';this.stateTimer=0;}
        break;
      }
    }
    this.x=clamp(this.x,ARENA_X+60,ARENA_X+ARENA_W-60);
    this.y=clamp(this.y,ARENA_Y+60,ARENA_Y+ARENA_H-60);
    if(this.hitFlash>0)this.hitFlash--;
    const hits=bullets.getPlayerHits(this.x,this.y,this.radius);
    for(const h of hits){this.takeDamage(h.damage);particles.explode(this.x+randFloat(-20,20),this.y+randFloat(-20,20),4,'#FF8800','#FFFF00');}
  }
  takeDamage(amount){this.hp-=amount;this.hitFlash=8;if(this.hp<=0){this.hp=0;this.dying=true;}}
  isDead(){return this.dying&&this.deathTimer>90;}
  draw(ctx){
    if(this.announceTimer>0)this.announceTimer--;
    if(this.dying){ctx.save();ctx.globalAlpha=Math.max(0,1-this.deathTimer/90);if(this.hitFlash>0)ctx.filter='brightness(10)';Sprites.mutoidMan(ctx,this.x,this.y,this.phase,this.tick);ctx.restore();return;}
    ctx.save();if(this.hitFlash>0&&this.hitFlash%2===0)ctx.filter='brightness(10)';Sprites.mutoidMan(ctx,this.x,this.y,this.phase,this.tick);ctx.restore();
    const bw=200,bh=12,bx=this.x-bw/2,by=this.y-90;
    ctx.fillStyle='#300';ctx.fillRect(bx-1,by-1,bw+2,bh+2);
    ctx.fillStyle=this.phase>=2?'#FF4400':'#FF0000';ctx.fillRect(bx,by,bw*(this.hp/this.maxHp),bh);
    ctx.strokeStyle='#F00';ctx.lineWidth=1;ctx.strokeRect(bx-1,by-1,bw+2,bh+2);
    ctx.font='bold 9px monospace';ctx.fillStyle='#fff';ctx.textAlign='center';ctx.fillText('MUTOID MAN',this.x,by-4);
    if(this.phase>=2&&Math.floor(this.tick/20)%2===0){ctx.font='bold 11px monospace';ctx.fillStyle='#FF4400';ctx.fillText('⚡ ENRAGED ⚡',this.x,by-16);}
  }
}