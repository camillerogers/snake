const CANVAS_SIZE = 600;
const SPRITE_SIZE = 50;
var canvas = null;
var ctx = null;
var snake = [randomSprite()];
var food = randomSprite();

function initGame() {
  canvas = document.getElementById("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  ctx = canvas.getContext("2d");
  document.addEventListener("keydown", function(event) {
    switch (event.which) {
      case 87: // w
        snake[0].dir = "u";
        return;
      case 65: // a
        snake[0].dir = "l";
        return;
      case 83: // s
        snake[0].dir = "d";
        return;
      case 68: //d
        snake[0].dir = "r";
        return;
    }
  });
  animationLoop();
}

// source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
}

function randomComponent() {
  let a = getRandomIntInclusive(0, CANVAS_SIZE - SPRITE_SIZE);
  if (a / SPRITE_SIZE != 0) {
    a = a - (a % SPRITE_SIZE);
  }
  return a;
}

function randomSprite() {
  return { x: randomComponent(), y: randomComponent() };
}

function isCollision(sprite1, sprite2) {
  return sprite1.x === sprite2.x && sprite1.y === sprite2.y;
}

function animationLoop() {
  canvas.width = canvas.width;
  drawGrid();
  drawSnake();
  drawFood();
  if (isCollision(snake[0], food)) {
    food = randomSprite();
    appendSnake();
  }
  setTimeout(function() {
    window.requestAnimationFrame(animationLoop);
  }, 200);
}

function drawGrid() {
  for (let i = 0; i < CANVAS_SIZE; i += SPRITE_SIZE) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, CANVAS_SIZE);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(CANVAS_SIZE, i);
    ctx.stroke();
  }
}

function drawSprite(x, y, color = "black") {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, SPRITE_SIZE, SPRITE_SIZE);
}

function drawFood() {
  // TODO Camille's Challenge (easy)
  // draw the food sprite on the canvas
}

function appendSnake() {
  // TODO Camille's Challenge (medium)
  // append a sprite to the snake's data structure
}

function drawSnake() {
  // TODO Camille's Challenge (hard)
  // given the snakes data structure
  // 1) draw the snake-sprites on the canvas, and
  // 2) update the sprite pointers for the next draw
}
