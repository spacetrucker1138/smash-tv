// sprites.js — Procedural pixel-art sprite rendering
// Hot-pink (#FF00FF) = chroma key placeholder for Gemini sprites

const Sprites = {
  player(ctx,x,y,dir,weaponType){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    ctx.fillStyle='#3399FF';ctx.fillRect(-10,-10,20,20);
    ctx.fillStyle='#1166CC';ctx.fillRect(-6,-6,12,12);
    ctx.fillStyle='#FFCC88';ctx.fillRect(-6,-14,12,10);
    ctx.fillStyle='#000';ctx.fillRect(-4,-12,3,3);ctx.fillRect(1,-12,3,3);
    const gx=Math.cos(dir)*12,gy=Math.sin(dir)*12;
    ctx.strokeStyle='#888';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(0,0);ctx.lineTo(gx,gy);ctx.stroke();
    ctx.fillStyle='#ccc';ctx.fillRect(gx-3,gy-3,6,6);
    const wColors={machine:'#0f0',spread:'#ff0',laser:'#f0f',grenade:'#f80',electric:'#0ff'};
    ctx.fillStyle=wColors[weaponType]||'#0f0';ctx.fillRect(-4,6,8,3);
    ctx.restore();
  },
  footGrunt(ctx,x,y){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    ctx.fillStyle='#CC3300';ctx.fillRect(-8,-8,16,16);
    ctx.fillStyle='#FF5522';ctx.fillRect(-5,-5,10,10);
    ctx.fillStyle='#FF0';ctx.fillRect(-4,-6,3,3);ctx.fillRect(1,-6,3,3);
    ctx.restore();
  },
  clubMech(ctx,x,y){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    ctx.fillStyle='#888';ctx.fillRect(-12,-12,24,24);
    ctx.fillStyle='#555';ctx.fillRect(-8,-8,16,16);
    ctx.fillStyle='#999';ctx.fillRect(-18,-4,8,8);ctx.fillRect(10,-4,8,8);
    ctx.fillStyle='#aaa';ctx.fillRect(-22,-6,6,12);ctx.fillRect(16,-6,6,12);
    ctx.fillStyle='#F00';ctx.fillRect(-6,-8,4,4);ctx.fillRect(2,-8,4,4);
    ctx.restore();
  },
  shooter(ctx,x,y,angle){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);
    ctx.fillStyle='#9900CC';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#CC44FF';ctx.beginPath();ctx.arc(0,0,6,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#888';ctx.fillRect(6,-2,10,4);ctx.restore();
  },
  roller(ctx,x,y){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    ctx.fillStyle='#666600';ctx.fillRect(-14,-10,28,20);
    ctx.fillStyle='#999900';ctx.fillRect(-10,-7,20,14);
    ctx.fillStyle='#333';ctx.fillRect(-14,-12,28,4);ctx.fillRect(-14,8,28,4);
    ctx.fillStyle='#888800';ctx.beginPath();ctx.arc(0,0,8,0,Math.PI*2);ctx.fill();
    ctx.restore();
  },
  bulletPlayer(ctx,x,y,angle,type){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.rotate(angle);
    switch(type){
      case 'machine': ctx.fillStyle='#FFFF00';ctx.fillRect(-6,-2,12,4);break;
      case 'spread':  ctx.fillStyle='#FF8800';ctx.fillRect(-5,-2,10,4);break;
      case 'laser':   ctx.fillStyle='#FF00FF';ctx.fillRect(-12,-1,24,2);break;
      case 'grenade': ctx.fillStyle='#00FF00';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();break;
      case 'electric':ctx.fillStyle='#00FFFF';ctx.fillRect(-8,-1,16,2);ctx.fillStyle='#FFFFFF';ctx.fillRect(-4,-1,8,2);break;
      default:        ctx.fillStyle='#FFD700';ctx.fillRect(-5,-2,10,4);
    }
    ctx.restore();
  },
  bulletEnemy(ctx,x,y){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    ctx.fillStyle='#FF3300';ctx.beginPath();ctx.arc(0,0,4,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#FF9900';ctx.beginPath();ctx.arc(0,0,2,0,Math.PI*2);ctx.fill();
    ctx.restore();
  },
  mutoidMan(ctx,x,y,phase,tick){
    const bob=Math.sin(tick*0.05)*3;
    ctx.save();ctx.translate(Math.round(x),Math.round(y+bob));
    ctx.fillStyle='rgba(0,0,0,0.3)';ctx.beginPath();ctx.ellipse(0,60,50,12,0,0,Math.PI*2);ctx.fill();
    ctx.fillStyle='#557';ctx.fillRect(-30,30,20,35);ctx.fillRect(10,30,20,35);
    ctx.fillStyle='#334';ctx.fillRect(-34,58,26,10);ctx.fillRect(8,58,26,10);
    ctx.fillStyle=phase>=2?'#884422':'#556677';ctx.fillRect(-40,-20,80,55);
    ctx.fillStyle=phase>=2?'#AA5533':'#778899';ctx.fillRect(-28,-14,56,38);
    ctx.fillStyle='#aab';
    for(let i=-20;i<=20;i+=14){ctx.beginPath();ctx.arc(i,-4,4,0,Math.PI*2);ctx.fill();}
    const armSwing=Math.sin(tick*0.08)*20;
    ctx.save();ctx.translate(-42,0);ctx.rotate(armSwing*Math.PI/180);
    ctx.fillStyle='#446';ctx.fillRect(-8,-5,16,40);
    ctx.fillStyle='#888';ctx.fillRect(-12,30,24,18);ctx.fillStyle='#aaa';ctx.fillRect(-10,32,20,14);
    ctx.restore();
    ctx.save();ctx.translate(42,0);ctx.rotate(-armSwing*Math.PI/180);
    ctx.fillStyle='#446';ctx.fillRect(-8,-5,16,40);
    ctx.fillStyle='#888';ctx.fillRect(-12,30,24,18);ctx.fillStyle='#aaa';ctx.fillRect(-10,32,20,14);
    ctx.restore();
    ctx.fillStyle='#446';ctx.fillRect(-12,-32,24,16);
    ctx.fillStyle=phase>=2?'#993322':'#667788';ctx.fillRect(-28,-66,56,38);
    ctx.fillStyle=phase>=2?'#BB4433':'#889999';ctx.fillRect(-22,-60,44,28);
    const eyeColor=phase>=2?'#FF0000':'#FF6600',eyeGlow=phase>=2?'#FF4444':'#FFAA00';
    ctx.fillStyle=eyeColor;ctx.fillRect(-18,-56,12,10);ctx.fillRect(6,-56,12,10);
    ctx.fillStyle=eyeGlow;ctx.fillRect(-15,-54,6,6);ctx.fillRect(9,-54,6,6);
    ctx.fillStyle='#222';ctx.fillRect(-16,-42,32,8);
    for(let i=-12;i<=12;i+=6){ctx.fillStyle='#444';ctx.fillRect(i-1,-42,2,8);}
    if(phase>=2){ctx.fillStyle='#FFAA00';for(let i=0;i<3;i++){ctx.fillRect(randInt(-20,20),randInt(-10,20),3,3);}}
    ctx.restore();
  },
  pickup(ctx,x,y,type){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));
    const pulse=0.8+Math.sin(Date.now()*0.005)*0.2;ctx.globalAlpha=pulse;
    switch(type){
      case 'machine': ctx.fillStyle='#00FF00';ctx.fillRect(-8,-8,16,16);ctx.fillStyle='#003300';ctx.fillRect(-5,-2,10,4);break;
      case 'spread':  ctx.fillStyle='#FF8800';ctx.fillRect(-8,-8,16,16);for(let i=-1;i<=1;i++){ctx.fillStyle='#FFCC00';ctx.fillRect(-2+i*5,-3,4,6);}break;
      case 'laser':   ctx.fillStyle='#FF00FF';ctx.fillRect(-8,-8,16,16);ctx.fillStyle='#FFFFFF';ctx.fillRect(-8,-1,16,2);break;
      case 'grenade': ctx.fillStyle='#00AA00';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#00FF00';ctx.fillRect(-2,-9,4,4);break;
      case 'electric':ctx.fillStyle='#00CCCC';ctx.fillRect(-8,-8,16,16);ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.moveTo(0,-6);ctx.lineTo(-4,0);ctx.lineTo(0,0);ctx.lineTo(-4,6);ctx.lineTo(4,0);ctx.lineTo(0,0);ctx.lineTo(4,-6);ctx.closePath();ctx.fill();break;
      case 'shield':  ctx.fillStyle='#0044FF';ctx.beginPath();ctx.arc(0,0,9,0,Math.PI*2);ctx.fill();ctx.fillStyle='#88AAFF';ctx.beginPath();ctx.arc(0,0,5,0,Math.PI*2);ctx.fill();break;
      case 'speed':   ctx.fillStyle='#FFFF00';ctx.fillRect(-8,-8,16,16);ctx.fillStyle='#FF8800';ctx.beginPath();ctx.moveTo(2,-7);ctx.lineTo(-2,0);ctx.lineTo(2,0);ctx.lineTo(-2,7);ctx.lineTo(4,-1);ctx.lineTo(0,-1);ctx.closePath();ctx.fill();break;
      case 'cash':    ctx.fillStyle='#FFD700';ctx.fillRect(-7,-7,14,14);pixelText(ctx,'$',-5,-7,14,'#FFD700');break;
      case 'extralife':ctx.fillStyle='#FF0088';ctx.beginPath();ctx.arc(0,0,10,0,Math.PI*2);ctx.fill();ctx.fillStyle='#FFFFFF';ctx.fillRect(-2,-6,4,12);ctx.fillRect(-6,-2,12,4);break;
    }
    ctx.globalAlpha=1;ctx.restore();
  },
  explosion(ctx,x,y,frame,maxFrames){
    const t=frame/maxFrames,r=lerp(5,40,t),alpha=lerp(1,0,t);
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.globalAlpha=alpha;
    ctx.strokeStyle='#FF8800';ctx.lineWidth=3;ctx.beginPath();ctx.arc(0,0,r,0,Math.PI*2);ctx.stroke();
    if(t<0.3){ctx.fillStyle='#FFFFFF';ctx.beginPath();ctx.arc(0,0,r*0.5,0,Math.PI*2);ctx.fill();}
    for(let i=0;i<6;i++){const a=(i/6)*Math.PI*2+frame*0.1;ctx.fillStyle='#FF4400';ctx.fillRect(Math.cos(a)*r*1.2-2,Math.sin(a)*r*1.2-2,4,4);}
    ctx.restore();
  },
  shield(ctx,x,y,alpha){
    ctx.save();ctx.translate(Math.round(x),Math.round(y));ctx.globalAlpha=alpha*0.6;
    const grad=ctx.createRadialGradient(0,0,8,0,0,20);
    grad.addColorStop(0,'rgba(0,100,255,0)');grad.addColorStop(0.7,'rgba(0,150,255,0.3)');grad.addColorStop(1,'rgba(100,200,255,0.8)');
    ctx.fillStyle=grad;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle=`rgba(100,200,255,${alpha})`;ctx.lineWidth=2;ctx.beginPath();ctx.arc(0,0,20,0,Math.PI*2);ctx.stroke();
    ctx.restore();
  }
};