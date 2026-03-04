// rooms.js — Stage 1 room definitions and wave scheduling
const STAGE1_ROOMS=[
  {id:1,name:'SHOW FLOOR',type:'fight',bg:'#111108',tile1:'#161610',tile2:'#1a1a14',waves:[{delay:0,type:'grunt',count:6},{delay:120,type:'grunt',count:4},{delay:200,type:'clubber',count:2},{delay:320,type:'grunt',count:6},{delay:420,type:'shooter',count:2}],totalEnemies:20,pickupDrops:[{x:ARENA_X+ARENA_W*0.5,y:ARENA_Y+ARENA_H*0.5,type:'spread'}]},
  {id:2,name:'THE KILLING FIELDS',type:'fight',bg:'#0a100a',tile1:'#0d140d',tile2:'#111811',waves:[{delay:0,type:'grunt',count:8},{delay:90,type:'shooter',count:3},{delay:180,type:'clubber',count:3},{delay:280,type:'grunt',count:6},{delay:360,type:'shooter',count:4},{delay:460,type:'clubber',count:2}],totalEnemies:26,pickupDrops:[{x:ARENA_X+80,y:ARENA_Y+80,type:'shield'},{x:ARENA_X+ARENA_W-80,y:ARENA_Y+ARENA_H-80,type:'laser'}]},
  {id:3,name:'DEATH GALLERY',type:'fight',bg:'#0a0a12',tile1:'#0d0d18',tile2:'#11111e',waves:[{delay:0,type:'roller',count:2},{delay:60,type:'grunt',count:8},{delay:160,type:'shooter',count:4},{delay:260,type:'roller',count:2},{delay:360,type:'clubber',count:4},{delay:460,type:'grunt',count:8}],totalEnemies:28,pickupDrops:[{x:ARENA_X+ARENA_W/2,y:ARENA_Y+60,type:'grenade'},{x:ARENA_X+ARENA_W/2,y:ARENA_Y+ARENA_H-60,type:'speed'}]},
  {id:4,name:'BLOOD ARENA',type:'fight',bg:'#120808',tile1:'#180a0a',tile2:'#1e0e0e',waves:[{delay:0,type:'grunt',count:10},{delay:80,type:'roller',count:3},{delay:160,type:'clubber',count:4},{delay:260,type:'shooter',count:5},{delay:360,type:'roller',count:3},{delay:460,type:'grunt',count:10}],totalEnemies:35,pickupDrops:[{x:ARENA_X+60,y:ARENA_Y+ARENA_H/2,type:'electric'},{x:ARENA_X+ARENA_W-60,y:ARENA_Y+ARENA_H/2,type:'extralife'}]},
  {id:5,name:'ANTECHAMBER',type:'fight',bg:'#0e0a00',tile1:'#141000',tile2:'#181400',waves:[{delay:0,type:'grunt',count:12},{delay:60,type:'roller',count:4},{delay:120,type:'clubber',count:5},{delay:200,type:'shooter',count:6},{delay:300,type:'roller',count:4},{delay:400,type:'grunt',count:12},{delay:500,type:'clubber',count:4}],totalEnemies:47,pickupDrops:[{x:ARENA_X+ARENA_W/2,y:ARENA_Y+ARENA_H/2,type:'spread'},{x:ARENA_X+80,y:ARENA_Y+ARENA_H-80,type:'shield'}]},
  {id:6,name:'BOSS ARENA',type:'boss',bg:'#0a0000',tile1:'#100000',tile2:'#160000',waves:[],totalEnemies:0,pickupDrops:[]}
];
class RoomManager{
  constructor(){this.currentRoomIndex=0;this.roomCleared=false;this.roomTimer=0;this.transitionTimer=0;this.inTransition=false;this.waveSchedule=[];}
  get currentRoom(){return STAGE1_ROOMS[this.currentRoomIndex];}
  get totalRooms(){return STAGE1_ROOMS.length;}
  get roomNumber(){return this.currentRoomIndex+1;}
  isBossRoom(){return this.currentRoom.type==='boss';}
  startRoom(enemyManager,pickups){
    const room=this.currentRoom;this.roomCleared=false;this.roomTimer=0;
    enemyManager.clear();pickups.clear();
    this.waveSchedule=room.waves.map(w=>({...w,fired:false}));
    for(const pd of room.pickupDrops)pickups.spawn(pd.x,pd.y,pd.type);
  }
  update(enemyManager,pickups,bullets){
    if(this.inTransition){this.transitionTimer--;if(this.transitionTimer<=0)this.inTransition=false;return;}
    this.roomTimer++;
    for(const w of this.waveSchedule){if(!w.fired&&this.roomTimer>=w.delay){for(let i=0;i<w.count;i++){const pos=randEdgePos();const e=new Enemy(pos.x,pos.y,w.type);e.spawnTimer=15+i*8;enemyManager.enemies.push(e);}w.fired=true;}}
    if(!this.roomCleared){const allFired=this.waveSchedule.every(w=>w.fired);if(allFired&&enemyManager.count===0)this.roomCleared=true;}
  }
  nextRoom(){if(this.currentRoomIndex<STAGE1_ROOMS.length-1){this.currentRoomIndex++;this.inTransition=true;this.transitionTimer=90;return true;}return false;}
  drawFloor(ctx){
    const room=this.currentRoom,tileSize=40;
    for(let ty=ARENA_Y;ty<ARENA_Y+ARENA_H;ty+=tileSize)for(let tx=ARENA_X;tx<ARENA_X+ARENA_W;tx+=tileSize){
      const even=((Math.floor((tx-ARENA_X)/tileSize)+Math.floor((ty-ARENA_Y)/tileSize))%2===0);
      ctx.fillStyle=even?room.tile1:room.tile2;ctx.fillRect(tx,ty,tileSize,tileSize);
    }
    const vg=ctx.createRadialGradient(ARENA_X+ARENA_W/2,ARENA_Y+ARENA_H/2,ARENA_H*0.2,ARENA_X+ARENA_W/2,ARENA_Y+ARENA_H/2,ARENA_H*0.75);
    vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,'rgba(0,0,0,0.5)');
    ctx.fillStyle=vg;ctx.fillRect(ARENA_X,ARENA_Y,ARENA_W,ARENA_H);
    ctx.font='bold 10px monospace';ctx.fillStyle='rgba(255,255,255,0.12)';ctx.textAlign='center';
    ctx.fillText(this.currentRoom.name,ARENA_X+ARENA_W/2,ARENA_Y+ARENA_H-10);
    if(this.inTransition){ctx.fillStyle=`rgba(0,0,0,${this.transitionTimer/90})`;ctx.fillRect(0,0,CANVAS_W,CANVAS_H);}
  }
}