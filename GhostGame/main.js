title = "LIL GHOST ";

description = `
FLY UP/DOWN [SPACE]
`;

characters = [
  //flying up anim - Cyan eyes
  `
  pppp
  pCpC
  pppp
  pppp
  pp p
  p  
  `,
  `
  pppp
  pCpC
  pppp
  pppp
  p pp
   p  
  `,
  //flying down anim - Yellow eyes
  `
  pppp
  pypy
  pppp
  pppp
  pp p
  p  
  `,
  `
  pppp
  pypy
  pppp
  pppp
  p pp
   p  
  `,
  //enemy anim
  `
   yy 
  y yy
  y yy
    yy
  y yy
   yy 
  `,
  `
   yy 
  y yy
    yy
  y yy
  y yy
   yy 
  `
];

const windowLen= {x: 120, y: 100}
const platformHeight = 10;
const leftMargin = 20;
const MIN_HEIGHT = windowLen.y - 20;
const MAX_HEIGHT = 20;
const MID_HEIGHT = (MIN_HEIGHT + MAX_HEIGHT)/2;
const yLevels = [MIN_HEIGHT, 60, 40, MAX_HEIGHT]
const speedLevels = [1, 1.5, 2 ];
const playerSpeed = speedLevels[0];
const rightMargin = windowLen.x - leftMargin;
const particleSpeed = 4;
const particleNum = 200;
const particleColorMain= "yellow";
const particleColorSecondary= "purple";


options = {
  viewSize: windowLen,
  theme: "simple",
  isPlayingBgm: false,
  isReplayEnabled: false
}

score= 0;
let highScore= 0;
let ghost; 
let enemies;

function update() {
  if (!ticks) { //this happens before the first frame
    ghost= {pos: vec(leftMargin, MID_HEIGHT), flyingUp: true, alive: true, body: null};
    enemies= [
      {posx: rightMargin - leftMargin ,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin - leftMargin/2,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin ,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin + leftMargin/2 ,speed: getRandSpeedLevel() ,body: null}
    ];
  }

  //UI borders
  color("light_blue");
  rect(0,windowLen.y - platformHeight , windowLen.x, platformHeight);
  rect(0,0, windowLen.x, platformHeight);

  color("black");
  for (let i=0; i<enemies.length; i++){
    enemies[i].body = char((ticks%10 < 5)?"e":"f", enemies[i].posx, yLevels[i]);
  }
  color("black");

  if (ghost.flyingUp){
    if (ghost.pos.y > MAX_HEIGHT) ghost.pos.y-= playerSpeed; //fly up
    ghost.body = char((ticks%10 < 5)?"a":"b", ghost.pos.x,ghost.pos.y); //anim

  }else{
    if (ghost.pos.y < MIN_HEIGHT) ghost.pos.y+= playerSpeed; //fly down
    ghost.body = char((ticks%10 < 5)?"c":"d", ghost.pos.x, ghost.pos.y); //anim
  }
  
  if (ghost.alive){
    if (ghost.body.isColliding.char.e){
      ghost.alive = false;
      color(particleColorMain);
      particle(ghost.pos.x, ghost.pos.y, particleNum, particleSpeed)
      color(particleColorSecondary);
      particle(ghost.pos.x, ghost.pos.y, particleNum/2, particleSpeed/2)
      color("black");
      play("hit"); 
      ghost.body = null; 
    }
    if (input.isJustPressed){
      ghost.flyingUp = !ghost.flyingUp; //switch flying direction
      play("synth");
    }
    for (const enemy of enemies){
      console.log(ghost.alive);
      if (enemy.posx < 0){
        enemy.posx = rightMargin;
        enemy.speed= getRandSpeedLevel();
        score= Math.floor(score + enemy.speed); 

      }else{
        enemy.posx -= enemy.speed;
      }
    }
  }else{ // if game over
    setTimeout(()=> end(` SCORE: ${score}`), 1000);
    
  }

}

function getRandSpeedLevel(){
  return speedLevels[rndi(3)] *difficulty ;
}
 