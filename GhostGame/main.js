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
  lll
  yyy
  yyy
  yyy
  yyy
   y
  `,
  `
  LLL
  YYY
  YYY
  YYY
  YYY
   Y
  `,
  //speed boost power up anim
  `
  CCC 
  CCC 
   C
    C
   CCC
   CCC
  `,
  `
   cccc
   cccc 
    c
   c
  cccc
  cccc
  `,
  //invincibility power up anim
  `
  PPP 
  PPP 
   P
    P
   PPP
   PPP
  `,
  `
   ppp
   ppp 
    p
   p
  ppp
  ppp
  `
];

const windowLen= {x: 120, y: 100}
const platformHeight = 10;
const leftMargin = 20;
const MIN_HEIGHT = windowLen.y - 20;
const MAX_HEIGHT = 20;
const MID_HEIGHT = (MIN_HEIGHT + MAX_HEIGHT)/2;
const yLevels = [MIN_HEIGHT, 60, 40, MAX_HEIGHT]
const speedLevels = [1, 1.5, 2];
const powerupSpeed = 0.5;
const powerupDelay = 6;
const powerupDuration = 5000;
let playerSpeed = speedLevels[0];
const rightMargin = windowLen.x - leftMargin;
const particleSpeed = 4;
const particleNum = 200;
const particleColorMain= "yellow";
const particleColorSecondary = "purple";
let currentPowerup = {text: "", color: "black"}


options = {
  viewSize: windowLen,
  theme: "simple",
  isPlayingBgm: false,
  isReplayEnabled: false
}

score= 0;
let ghost; 
let enemies;
let powerups;

function update() {
  if (!ticks) { //this happens before the first frame
    ghost= {pos: vec(leftMargin, MID_HEIGHT), flyingUp: true, alive: true, body: null, takesDamage: true};
    enemies= [
      {posx: rightMargin - leftMargin ,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin - leftMargin/2,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin ,speed: getRandSpeedLevel() ,body: null},
      {posx: rightMargin + leftMargin/2 ,speed: getRandSpeedLevel() ,body: null}
    ];
    powerups = {
      speedBoost: { pos: vec(rightMargin, MID_HEIGHT), active: false, available: false, body: []},
      invincibility: {pos: vec(rightMargin, MIN_HEIGHT), active: false, available: false, body: []}
    }
  }

  //UI borders
  color("light_blue");
  rect(0,windowLen.y - platformHeight , windowLen.x, platformHeight);
  rect(0, 0, windowLen.x, platformHeight);
  text(currentPowerup.text, 30, 4, {color: currentPowerup.color});

  color("black");
  if (powerups.invincibility.active) {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].body = char((ticks % 20 < 10) ? "e" : "f", enemies[i].posx, yLevels[i], { rotation: 1 });
    }
  } else {
    for (let i = 0; i < enemies.length; i++) {
      enemies[i].body = char("e", enemies[i].posx, yLevels[i], { rotation: 1 });
    }
  }

  //activate powerups
  playerSpeed = (powerups.speedBoost.active) ? speedLevels[1] : speedLevels[0];
  ghost.takesDamage = (powerups.invincibility.active) ? false : true;

  console.log("player speed: ", playerSpeed);
  console.log("Takes damage: ", ghost.takesDamage);

  if (ghost.flyingUp){
    if (ghost.pos.y > MAX_HEIGHT) ghost.pos.y -= playerSpeed; //fly up
    ghost.body = char((ticks%10 < 5)?"a":"b", ghost.pos.x,ghost.pos.y); //anim

  }else{
    if (ghost.pos.y < MIN_HEIGHT) ghost.pos.y+= playerSpeed; //fly down
    ghost.body = char((ticks%10 < 5)?"c":"d", ghost.pos.x, ghost.pos.y); //anim
  }
  
  if (ghost.alive) {
    if ( (ghost.body.isColliding.char.e || ghost.body.isColliding.char.f) && ghost.takesDamage){ // handle enemy collision
      ghost.alive = false;
      color(particleColorMain);
      particle(ghost.pos.x, ghost.pos.y, particleNum, particleSpeed)
      color(particleColorSecondary);
      particle(ghost.pos.x, ghost.pos.y, particleNum/2, particleSpeed/2)
      color("black");
      play("hit"); 
      ghost.body = null; 
      return;
    }
    if (input.isJustPressed){ //switch flying direction on press
      ghost.flyingUp = !ghost.flyingUp;
      play("synth");
    }
    for (const enemy of enemies){ //spawn enemies
      if (enemy.posx < 0){
        enemy.posx = rightMargin;
        enemy.speed= getRandSpeedLevel();
        score= Math.floor(score + enemy.speed); 
      }else{
        enemy.posx -= enemy.speed;
      }
    }
    if (ticks % (60 * powerupDelay) == 1) { //spawn random powerup every [powerupDelay] seconds
      if ( rndi(2) == 1 ) {
        powerups.speedBoost = {
          pos: vec(windowLen.x,
          yLevels[rndi(yLevels.length)]),
          active: false,
          available: true,
          body: []
        }
      } else {
        powerups.invincibility = {
          pos: vec(windowLen.x,
          yLevels[rndi(yLevels.length)]),
          active: false,
          available: true,
          body: []
        }
      }
    }
    //display powerups if available
    if (powerups.speedBoost.available) {
      powerups.speedBoost.pos.x -= powerupSpeed;
      powerups.speedBoost.body[0] = char("g", powerups.speedBoost.pos.x, powerups.speedBoost.pos.y, { rotation: ticks / 9 });
      powerups.speedBoost.body[1] = char("h", powerups.speedBoost.pos.x, powerups.speedBoost.pos.y, { rotation: - ticks / 11 });
      if (powerups.speedBoost.pos.x < 0) powerups.speedBoost.available = false;
    }
    if (powerups.invincibility.available) {
      powerups.invincibility.pos.x -= powerupSpeed;
      powerups.invincibility.body[0] = char("i", powerups.invincibility.pos.x, powerups.invincibility.pos.y, { rotation: ticks / 9 });
      powerups.invincibility.body[1] = char("j", powerups.invincibility.pos.x, powerups.invincibility.pos.y, { rotation: - ticks / 11 });
      if (powerups.invincibility.pos.x < 0) powerups.invincibility.available = false;
    }
    if (powerups.speedBoost.body.length) {
      if ((powerups.speedBoost.body[0].isColliding.char.a || powerups.speedBoost.body[1].isColliding.char.a)) { // colision with speed boost power up
        currentPowerup = { text: "SPEED", color: "light_cyan" };
        powerups.speedBoost.active = true;
        powerups.speedBoost.available = false;
        powerups.speedBoost.body = [];
        play("powerUp");
        setTimeout(() => {
          currentPowerup = { text: "", color: "black" };
          text(currentPowerup.text, 30, 4, {color: currentPowerup.color});
          powerups.speedBoost.active = false;
          currentPowerup = { text: "", color: "black" };
        }, powerupDuration);
      }
    } //power up collision
    if (powerups.invincibility.body.length) {
      if ((powerups.invincibility.body[0].isColliding.char.a || powerups.invincibility.body[0].isColliding.char.a)) { // colision with invincibility power up
        text(currentPowerup.text, 30, 4, {color: currentPowerup.color});
        powerups.invincibility.active = true;
        ghost.takesDamage = false;
        powerups.invincibility.available = false;
        powerups.invincibility.body = [];
        currentPowerup = { text: "INVINCIBLE", color: "purple" }
        play("laser");
        setTimeout(() => {
          currentPowerup = { text: "", color: "black" };
          text(currentPowerup.text, 30, 4, {color: currentPowerup.color});
          powerups.invincibility.active = false;
          ghost.takesDamage = true;
        }, powerupDuration);
      }
    }
  }else{ // if game over
    setTimeout(()=> end(` SCORE: ${score}`), 1000);
  }

}

function getRandSpeedLevel(){
  return speedLevels[rndi(speedLevels.length)] *difficulty ;
}
 