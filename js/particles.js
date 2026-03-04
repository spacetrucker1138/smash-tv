// particles.js — Particle system
class ParticleSystem{
  constructor(){this.particles=[];}
  explode(x,y,count,c1,c2){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=randFloat(1.5,5);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:randFloat(0.02,0.06),size:randFloat(2,5),color:Math.random()<0.5?c1:c2,type:'spark'});}}
  blood(x,y,count){for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=randFloat(1,4);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:randFloat(0.03,0.08),size:randFloat(2,4),color:'#CC0000',type:'blood'});}}
  cashBurst(x,y,amount){const count=Math.min(Math.floor(amount/100),8);for(let i=0;i<count;i++){const a=Math.random()*Math.PI*2,s=randFloat(1,3);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s-1,life:1,decay:randFloat(0.01,0.03),size:6,color:'#FFD700',type:'cash',text:'$'});}}
  muzzle(x,y,angle){for(let i=0;i<4;i++){const sp=angle+randFloat(-0.3,0.3),s=randFloat(3,8);this.particles.push({x,y,vx:Math.cos(sp)*s,vy:Math.sin(sp)*s,life:1,decay:0.15,size:randFloat(2,4),color:'#FFFF88',type:'spark'});}}
  grenadeBlast(x,y){for(let i=0;i<20;i++){const a=(i/20)*Math.PI*2,s=randFloat(4,9);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.04,size:randFloat(3,7),color:'#FF6600',type:'spark'});}this.particles.push({x,y,vx:0,vy:0,life:1,decay:0.1,size:30,color:'#FFFF00',type:'flash'});}
  electricArc(x,y){for(let i=0;i<12;i++){const a=Math.random()*Math.PI*2,s=randFloat(2,6);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.08,size:randFloat(1,3),color:'#00FFFF',type:'spark'});}}
  hitFlash(x,y){for(let i=0;i<8;i++){const a=Math.random()*Math.PI*2,s=randFloat(2,6);this.particles.push({x,y,vx:Math.cos(a)*s,vy:Math.sin(a)*s,life:1,decay:0.1,size:randFloat(3,6),color:'#FF0000',type:'spark'});}}
  update(){for(let i=this.particles.length-1;i>=0;i--){const p=this.particles[i];p.x+=p.vx;p.y+=p.vy;p.vx*=0.92;p.vy*=0.92;p.vy+=0.05;p.life-=p.decay;if(p.life<=0)this.particles.splice(i,1);}}
  draw(ctx){for(const p of this.particles){ctx.save();ctx.globalAlpha=Math.max(0,p.life);if(p.type==='flash'){const g=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,p.size);g.addColorStop(0,p.color);g.addColorStop(1,'transparent');ctx.fillStyle=g;ctx.beginPath();ctx.arc(p.x,p.y,p.size,0,Math.PI*2);ctx.fill();}else if(p.type==='cash'){ctx.fillStyle=p.color;ctx.font='bold 8px monospace';ctx.fillText(p.text,p.x,p.y);}else{ctx.fillStyle=p.color;ctx.fillRect(p.x-p.size/2,p.y-p.size/2,p.size,p.size);}ctx.restore();}}
  clear(){this.particles=[];}
}