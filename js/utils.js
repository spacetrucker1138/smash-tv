// utils.js — Math helpers, collision detection, constants

const CANVAS_W = 800;
const CANVAS_H = 600;
const ARENA_X = 60;
const ARENA_Y = 60;
const ARENA_W = CANVAS_W - 120;
const ARENA_H = CANVAS_H - 120;

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function dist(ax, ay, bx, by) { const dx=ax-bx,dy=ay-by; return Math.sqrt(dx*dx+dy*dy); }
function normalize(dx, dy) { const len=Math.sqrt(dx*dx+dy*dy); if(len===0)return{x:0,y:0}; return{x:dx/len,y:dy/len}; }
function angleTo(ax, ay, bx, by) { return Math.atan2(by-ay, bx-ax); }
function circleCollide(ax,ay,ar,bx,by,br){ return dist(ax,ay,bx,by)<ar+br; }
function rectCollide(ax,ay,aw,ah,bx,by,bw,bh){ return ax<bx+bw&&ax+aw>bx&&ay<by+bh&&ay+ah>by; }
function randInt(lo,hi){ return Math.floor(Math.random()*(hi-lo+1))+lo; }
function randFloat(lo,hi){ return Math.random()*(hi-lo)+lo; }
function randFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
function lerp(a,b,t){ return a+(b-a)*t; }
function randEdgePos(){
  const edge=randInt(0,3);
  switch(edge){
    case 0: return{x:randFloat(ARENA_X,ARENA_X+ARENA_W),y:ARENA_Y+10};
    case 1: return{x:randFloat(ARENA_X,ARENA_X+ARENA_W),y:ARENA_Y+ARENA_H-10};
    case 2: return{x:ARENA_X+10,y:randFloat(ARENA_Y,ARENA_Y+ARENA_H)};
    case 3: return{x:ARENA_X+ARENA_W-10,y:randFloat(ARENA_Y,ARENA_Y+ARENA_H)};
  }
}
function drawBlock(ctx,x,y,w,h,fill,stroke){
  ctx.fillStyle=fill; ctx.fillRect(x,y,w,h);
  if(stroke){ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.strokeRect(x+.5,y+.5,w-1,h-1);}
}
function pixelText(ctx,text,x,y,size,color){
  ctx.save();ctx.font=`bold ${size}px 'Courier New',monospace`;ctx.fillStyle=color||'#fff';
  ctx.textAlign='left';ctx.textBaseline='top';ctx.fillText(text,x,y);ctx.restore();
}