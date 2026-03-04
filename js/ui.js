// ui.js — HUD, screens, announcements
const UI={
  drawTitle(ctx,tick,sel){
    const cx=CANVAS_W/2;ctx.fillStyle='#000';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    for(let y=0;y<CANVAS_H;y+=4){ctx.fillStyle='rgba(0,0,0,0.15)';ctx.fillRect(0,y,CANVAS_W,2);}
    ctx.fillStyle='#fff';for(let i=0;i<80;i++){const sx=(i*137+tick*0.3)%CANVAS_W,sy=(i*97)%CANVAS_H,sz=(Math.sin(tick*0.05+i)+1)*1.5;ctx.fillRect(sx,sy,sz,sz);}
    ctx.save();const tp=1+Math.sin(tick*0.06)*0.03;ctx.translate(cx,120);ctx.scale(tp,tp);
    ctx.font='bold 72px "Courier New",monospace';ctx.textAlign='center';
    ctx.fillStyle='#440000';ctx.fillText('SMASH',3,3);ctx.fillText('TV',3,73);
    ctx.fillStyle='#FF0000';ctx.fillText('SMASH',0,0);ctx.fillStyle='#FF6600';ctx.fillText('TV',0,70);
    ctx.strokeStyle='#FFFF00';ctx.lineWidth=2;ctx.strokeText('SMASH',0,0);ctx.strokeText('TV',0,70);
    ctx.restore();
    ctx.font='bold 14px "Courier New",monospace';ctx.fillStyle='#FFAA00';ctx.textAlign='center';
    ctx.fillText('THE YEAR IS 1999. TELEVISION IS DEADLY.',cx,220);
    ctx.strokeStyle='#FF0000';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(80,240);ctx.lineTo(CANVAS_W-80,240);ctx.stroke();
    ctx.font='11px "Courier New",monospace';ctx.fillStyle='#aaa';ctx.fillText('"I\'D BUY THAT FOR A DOLLAR!" — SMASH TV HOST',cx,260);
    const opts=['1 PLAYER','2 PLAYER','HOW TO PLAY'];
    for(let i=0;i<opts.length;i++){const y=310+i*42,isSel=i===sel;
      if(isSel){ctx.fillStyle='rgba(255,0,0,0.2)';ctx.fillRect(cx-110,y-22,220,34);ctx.strokeStyle='#FF0000';ctx.lineWidth=2;ctx.strokeRect(cx-110,y-22,220,34);ctx.fillStyle='#FFD700';ctx.font='bold 18px monospace';ctx.fillText('►',cx-125,y-4);ctx.fillText('◄',cx+110,y-4);}
      ctx.font=`bold ${isSel?20:16}px "Courier New",monospace`;ctx.fillStyle=isSel?'#FFD700':'#888';ctx.fillText(opts[i],cx,y);}
    if(Math.floor(tick/30)%2===0){ctx.font='13px "Courier New",monospace';ctx.fillStyle='#FF8800';ctx.fillText('PRESS  ENTER  TO  START',cx,450);}
    ctx.font='10px monospace';ctx.fillStyle='#555';
    ctx.fillText('MOVE: WASD/ARROWS   AIM+SHOOT: MOUSE+SPACE  |  IJKL FIRE BUTTONS',cx,490);
    ctx.fillStyle='#333';ctx.font='9px monospace';ctx.fillText('INSPIRED BY SMASH TV (MIDWAY 1990) — FAN TRIBUTE',cx,570);
  },
  drawHowToPlay(ctx){
    const cx=CANVAS_W/2;ctx.fillStyle='#000';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.font='bold 28px monospace';ctx.fillStyle='#FF0000';ctx.textAlign='center';ctx.fillText('HOW TO PLAY',cx,60);
    ctx.strokeStyle='#FF6600';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(80,80);ctx.lineTo(CANVAS_W-80,80);ctx.stroke();
    const lines=[['MOVE','WASD or ARROW KEYS'],['AIM & SHOOT','MOUSE — hold SPACE or click to fire'],['FIRE BUTTONS','I=UP  K=DOWN  J=LEFT  L=RIGHT'],['',''],['WEAPONS','Pick up colored icons:'],['  MACHINE','Default — infinite'],['  SPREAD','Orange — 3-way fan'],['  LASER','Purple — high DPS'],['  GRENADE','Green — explodes'],['  ELECTRIC','Cyan — arc damage'],['',''],['SHIELD','Blue — absorbs 1 hit'],['SPEED','Yellow — faster movement'],['EXTRA LIFE','Pink cross — +1 life'],['',''],['BOSS','Defeat MUTOID MAN'],['  PHASE 1','Charges + 4-way spread'],['  PHASE 2','Below 50% — 8-way rotating spread']];
    ctx.textAlign='left';for(let i=0;i<lines.length;i++){const y=108+i*20,[label,desc]=lines[i];if(!label)continue;ctx.font='bold 11px monospace';ctx.fillStyle='#FF8800';ctx.fillText(label,80,y);ctx.font='11px monospace';ctx.fillStyle='#ccc';ctx.fillText(desc,230,y);}
    ctx.textAlign='center';ctx.font='bold 13px monospace';ctx.fillStyle='#FFD700';ctx.fillText('PRESS ENTER OR BACKSPACE TO RETURN',cx,560);
  },
  drawContinue(ctx,countdown,score){
    const cx=CANVAS_W/2;ctx.fillStyle='rgba(0,0,0,0.85)';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.font='bold 48px monospace';ctx.fillStyle='#FF0000';ctx.textAlign='center';ctx.fillText('CONTINUE?',cx,200);
    const radius=60,angle=(countdown/600)*Math.PI*2;
    ctx.strokeStyle='#333';ctx.lineWidth=8;ctx.beginPath();ctx.arc(cx,310,radius,0,Math.PI*2);ctx.stroke();
    ctx.strokeStyle='#FF0000';ctx.beginPath();ctx.arc(cx,310,radius,-Math.PI/2,-Math.PI/2+angle);ctx.stroke();
    ctx.font='bold 56px monospace';ctx.fillStyle='#FFD700';ctx.fillText(Math.ceil(countdown/60),cx,330);
    ctx.font='16px monospace';ctx.fillStyle='#aaa';ctx.fillText(`SCORE: ${score}`,cx,400);
    ctx.font='bold 14px monospace';ctx.fillStyle='#FF8800';ctx.fillText('PRESS ENTER TO CONTINUE',cx,450);
    ctx.fillStyle='#555';ctx.fillText('PRESS ESCAPE TO QUIT',cx,476);
  },
  drawGameOver(ctx,score,highScore){
    const cx=CANVAS_W/2;ctx.fillStyle='rgba(0,0,0,0.9)';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    ctx.font='bold 64px monospace';ctx.fillStyle='#FF0000';ctx.textAlign='center';ctx.fillText('GAME OVER',cx,200);
    ctx.font='bold 18px monospace';ctx.fillStyle='#FFD700';ctx.fillText(`FINAL SCORE: ${score.toLocaleString()}`,cx,280);
    if(score>=highScore){ctx.fillStyle='#FF8800';ctx.fillText('NEW HIGH SCORE!',cx,320);}else{ctx.fillStyle='#888';ctx.fillText(`HIGH SCORE: ${highScore.toLocaleString()}`,cx,320);}
    ctx.font='bold 14px monospace';ctx.fillStyle='#FF8800';ctx.fillText('PRESS ENTER TO PLAY AGAIN',cx,400);
  },
  drawVictory(ctx,score,tick){
    const cx=CANVAS_W/2;ctx.fillStyle='#000';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);
    const colors=['#FF0000','#FF8800','#FFFF00','#00FF00','#00FFFF','#FF00FF'];
    ctx.font='bold 56px monospace';ctx.fillStyle=colors[Math.floor(tick/8)%colors.length];ctx.textAlign='center';ctx.fillText('YOU WIN!',cx,180);
    ctx.font='bold 24px monospace';ctx.fillStyle='#FFAA00';ctx.fillText('MUTOID MAN DEFEATED',cx,240);ctx.fillText('STAGE 1 COMPLETE',cx,280);
    ctx.font='bold 20px monospace';ctx.fillStyle='#FFD700';ctx.fillText(`SCORE: ${score.toLocaleString()}`,cx,360);
    ctx.font='14px monospace';ctx.fillStyle='#aaa';ctx.fillText('PRESS ENTER TO PLAY AGAIN',cx,440);
  },
  drawHUD(ctx,player,stage,room,totalRooms){
    ctx.fillStyle='rgba(0,0,0,0.8)';
    ctx.fillRect(0,0,ARENA_X,CANVAS_H);ctx.fillRect(ARENA_X+ARENA_W,0,ARENA_X,CANVAS_H);
    ctx.fillRect(0,0,CANVAS_W,ARENA_Y);ctx.fillRect(0,ARENA_Y+ARENA_H,CANVAS_W,CANVAS_H-ARENA_Y-ARENA_H);
    ctx.strokeStyle='#333';ctx.lineWidth=2;ctx.strokeRect(ARENA_X,ARENA_Y,ARENA_W,ARENA_H);
    ctx.font='bold 11px monospace';ctx.fillStyle='#FF6600';ctx.textAlign='center';
    ctx.fillText(`STAGE ${stage}  •  ROOM ${room}/${totalRooms}`,CANVAS_W/2,20);
    ctx.textAlign='left';ctx.font='bold 10px monospace';
    ctx.fillStyle='#3399FF';ctx.fillText('PLAYER',5,20);
    ctx.fillStyle='#fff';ctx.fillText('SCORE',5,36);ctx.fillStyle='#FFD700';ctx.fillText(player.score.toLocaleString(),5,50);
    ctx.fillStyle='#fff';ctx.fillText('LIVES',5,66);
    for(let i=0;i<player.lives;i++){ctx.fillStyle='#FF3399';ctx.fillRect(5+i*12,72,8,8);}
    ctx.fillStyle='#fff';ctx.fillText('WEAPON',5,96);ctx.font='bold 9px monospace';
    const wColor={machine:'#0f0',spread:'#f80',laser:'#f0f',grenade:'#080',electric:'#0ff'};
    ctx.fillStyle=wColor[player.weapon]||'#0f0';ctx.fillText(player.weapon.toUpperCase(),5,110);
    const pct=player.weaponMeterPct;
    for(let i=0;i<6;i++){ctx.fillStyle=i/6<pct?(wColor[player.weapon]||'#0f0'):'#222';ctx.fillRect(5+i*8,116,6,8);ctx.strokeStyle='#444';ctx.lineWidth=1;ctx.strokeRect(5+i*8,116,6,8);}
    if(player.shieldActive){ctx.fillStyle='#88AAFF';ctx.font='bold 9px monospace';ctx.fillText(`SHIELD ${Math.ceil(player.shieldTimer/60)}s`,5,136);}
    if(player.speedBoost){ctx.fillStyle='#FFFF00';ctx.font='bold 9px monospace';ctx.fillText(`SPEED ${Math.ceil(player.speedTimer/60)}s`,5,152);}
    ctx.textAlign='center';ctx.font='10px monospace';ctx.fillStyle='#553300';
    ctx.fillText('♦  SMASH TV  ♦  GOOD LUCK... YOU\'LL NEED IT  ♦',CANVAS_W/2,CANVAS_H-8);
  },
  drawAnnouncement(ctx,text,alpha,color){if(alpha<=0)return;ctx.save();ctx.globalAlpha=alpha;ctx.font='bold 28px monospace';ctx.fillStyle=color||'#FFD700';ctx.textAlign='center';ctx.strokeStyle='#000';ctx.lineWidth=4;ctx.strokeText(text,CANVAS_W/2,CANVAS_H/2-20);ctx.fillText(text,CANVAS_W/2,CANVAS_H/2-20);ctx.restore();},
  drawPause(ctx){ctx.fillStyle='rgba(0,0,0,0.7)';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);ctx.font='bold 40px monospace';ctx.fillStyle='#FFD700';ctx.textAlign='center';ctx.fillText('PAUSED',CANVAS_W/2,CANVAS_H/2-20);ctx.font='14px monospace';ctx.fillStyle='#aaa';ctx.fillText('PRESS P TO RESUME',CANVAS_W/2,CANVAS_H/2+30);},
  drawBossWarning(ctx,tick){if(Math.floor(tick/15)%2===0){ctx.fillStyle='rgba(150,0,0,0.25)';ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}ctx.font='bold 32px monospace';ctx.fillStyle='#FF0000';ctx.textAlign='center';ctx.strokeStyle='#000';ctx.lineWidth=3;ctx.strokeText('⚠  WARNING  ⚠',CANVAS_W/2,CANVAS_H/2-20);ctx.fillText('⚠  WARNING  ⚠',CANVAS_W/2,CANVAS_H/2-20);ctx.font='bold 18px monospace';ctx.fillStyle='#FF8800';ctx.fillText('MUTOID MAN APPROACHES',CANVAS_W/2,CANVAS_H/2+20);},
  scorePopups:[],
  addScorePop(x,y,value,color){this.scorePopups.push({x,y,value,color:color||'#FFD700',life:1,vy:-1.5});},
  updateScorePops(){for(let i=this.scorePopups.length-1;i>=0;i--){const p=this.scorePopups[i];p.y+=p.vy;p.life-=0.02;if(p.life<=0)this.scorePopups.splice(i,1);}},
  drawScorePops(ctx){for(const p of this.scorePopups){ctx.save();ctx.globalAlpha=p.life;ctx.font='bold 12px monospace';ctx.fillStyle=p.color;ctx.textAlign='center';ctx.fillText(`+${p.value}`,p.x,p.y);ctx.restore();}}
};