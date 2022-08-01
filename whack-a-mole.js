const music = ['audio-files/01-main-menu.mp3',
'audio-files/02-mode-select.mp3',
'audio-files/03-wanted.mp3',
'audio-files/04-easy-level.mp3',
'audio-files/05-normal-level.mp3',
'audio-files/06-hard-level.mp3',
'audio-files/07-boss.mp3',
'audio-files/08-victory.mp3',
'audio-files/09-game-over.mp3']

const sound = document.getElementById('player');
const damagesound = document.getElementById('hit');
const menu = document.querySelector('.menu');
const starts = document.querySelectorAll('.start');
const difficulties = document.querySelectorAll('.difficulty');
const playagain = document.querySelector('.playagain');
const restart = document.querySelector('.reset');
const border = document.querySelector('.gradient-border');
const poster = document.querySelector('.poster');
const holes = document.querySelectorAll('.hole');
const moles = document.querySelectorAll('.mole');
const score = document.querySelector('.score');
const countdown = document.querySelector('.countdown');
const num3 = document.querySelector('#num3');
const num2 = document.querySelector('#num2');
const num1 = document.querySelector('#num1');
const victory = document.querySelector('#victory');
const gameover = document.querySelector('#gameOver');
const reward = document.querySelector('#reward');


let previousMole;
let flag = true;
let totalScore = 0;
let time = 10000;
let pointPerClick = 10000;
let speed = 1000;
let soundAgain;
let blinkFlag = true;


/* transitions and music when mode is selected */
starts.forEach(start => start.addEventListener('click', function(event){
  starts.forEach(start => {
    fadeOut(start);
    sound.src = music[1];
  });

  setTimeout(() => {
    difficulties.forEach(difficulty => {
    fadeIn(difficulty, 'block', 1);
    })
  },1000)
}));


/* runs transitions and music once difficulty is selected until runGame() */
difficulties.forEach(difficulty => difficulty.addEventListener('click', function(event){
  const clickedElement = event.target;
  if('Normal' === clickedElement.textContent){
    reward.textContent = '$25,000';
  } else if('Hard' === clickedElement.textContent) {
    reward.textContent = '$50,000';
  }
  fadeOut(menu);
  fadeOut(border);
  setTimeout(()=>{
    sound.src = music[2];
    fadeIn(poster, 'flex', 1);
  },500);

  
  setTimeout(()=>{
    fadeOut(poster);
    right();
    sound.pause();
  },8000);

  setTimeout(()=>{
    countDown();
  },9000);

  setTimeout(()=>{
    if('Easy' === clickedElement.textContent){
      sound.src = music[3];
      soundAgain = sound.src;
    } else if('Normal' === clickedElement.textContent){
      sound.src = music[4];
      soundAgain = sound.src;
      pointPerClick = 25000;
      speed = 850;
      time = 8500
    } else {
      sound.src = music[5];
      soundAgain = sound.src;
      pointPerClick = 50000;
      reward.textContent = '$50,000';
      speed = 750;
      time = 7500
    }
    runGame();
  },12000);
}));

/* runs game until flag is true */
function runGame(){
  score.style.visibility = 'visible';
  up()
  setTimeout(()=> {
    endGame();
  }, time);
}

/* endGame */
function endGame() {
  flag = false
  blinkFlag = true;
  sound.loop = false
  countdown.style.display ='flex';
  if(totalScore >= (pointPerClick * 10)){
    sound.src = music[7];
    victory.style.display ='block';
    blink(victory);
  } else {
    sound.src = music[8];
    gameover.style.display ='block';
    blink(gameover);
  }
  endMenu();
}


/* chooses random mole out of 6 with no repeats */
function randomMole(moles){
  let randomIndex = Math.floor(Math.random() * moles.length);
  let mole = moles[randomIndex];
  if (mole !== previousMole){
    previousMole = mole;
    return mole;
  } else {
    return randomMole(moles);
  }
}

/* adds and removes class to move mole up and down after time */
function up() {
  const mole = randomMole(moles);
  mole.classList.add('up');
  setTimeout(() => {
    mole.classList.remove('up');
    if(flag){up()};
  }, speed)
}


/* moves mole down by removing class */
function down() {
  damagesound.volume = 0.5;
  damagesound.play();
  this.classList.remove('up');
  totalScore += pointPerClick;
  score.textContent = `Score: $${totalScore}`;
}
/* checks to see if mole was clicked*/
moles.forEach(mole => mole.addEventListener('click', down));


/* controls countdown animation */
function countDown(){
  countdown.style.display ='flex';
  num3.style.display = 'block';
  setTimeout(()=>{
    num3.style.display = 'none';
    num2.style.display = 'block';
  },1000);

  setTimeout(()=>{
    num2.style.display = 'none';
    num1.style.display = 'block';
  },2000);

  setTimeout(()=>{
    num1.style.display = 'none';
    countdown.style.display ='none';
  },3000);
}

/* blinks element in and out */
function blink(element){
    setTimeout(()=>{
      element.style.display = 'none';
    },500);
    setTimeout(()=>{
      element.style.display = 'block';
    },700);

    setTimeout(()=>{
      if(blinkFlag)blink(element);
    },1200);
}

/* does a fadeIn transition on a element */
function fadeIn(element, display, endOpac) {
  let opac = 0.1;
  element.style.opacity = opac;
  element.style.display = display;
  let opTimer = setInterval(() => {
    if (opac >= endOpac) {
      clearInterval(opTimer)
    }
    element.style.opacity = opac;
    opac += 0.1;
  }, 50);
}


/* does a fadeOut transition on a element */
function fadeOut(element) {
  let opac = 0.6;
  let opTimer = setInterval(() => {
    if (opac <= 0.1) {
      clearInterval(opTimer);
      element.style.display = 'none';
    }
    element.style.opacity = opac;
    opac -= 0.1;
  },50);
}

/* fades out music */
function fadeMusic(element) {
  let volume = 1.0;
  let volTimer = setInterval(()=>{
    if (volume <= 0.1){
      clearInterval(volTimer);
    }
    element.volume = volume;
    volume -= 0.1;
  },100);
}

/* moves holes in from offscreen */
function right() {
  holes.forEach(hole => {
    hole.classList.add('right');
  })
}

/* Toggles music on and off */
function toggleMuted() {
  document.removeEventListener("click", toggleMuted);
  sound.muted = !sound.muted;
  if(sound.muted === true){
    document.getElementById("muteImage").src="images/speaker.svg";
  } else{
    document.getElementById("muteImage").src="images/speaker-fill.svg";
  }
  sound.play();
}
/* activates music only on first click anywhere */
document.addEventListener("click", toggleMuted);

function endMenu(){
  difficulties.forEach(difficulty => {
    difficulty.style.display = 'none';
  })
  restart.style.display = 'block';
  playagain.style.display = 'block';
  setTimeout(()=>{
    fadeIn(menu, 'block', 0.7);
    fadeIn(border, 'flex', 1);
  },4500);
}

/* reloads page */
function reset(){
  window.location.reload();
}

/* resets certain elements to default state to replay */
function playAgain(){
  blinkFlag = false;
  previousMole;
  flag = true;
  totalScore = 0;
  score.textContent = `Score: $${totalScore}`
  setTimeout(()=>{
    fadeOut(menu);
    fadeOut(border);
  },300);
  setTimeout(()=>{
    victory.style.display = 'none';
    gameover.style.display = 'none';
  },1200);
  setTimeout(()=>{
    countDown();
  },1550);
  setTimeout(()=>{
    sound.src = soundAgain;
    sound.play();
    runGame();
  },4550);
}