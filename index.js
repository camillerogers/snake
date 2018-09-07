const CANVAS_SIZE = 500;
const SPRITE_SIZE = 25;
const KEY_CODES = {
  32: "space",
  37: "la",
  38: "ua",
  39: "ra",
  40: "da",
  65: "A",
  68: "D",
  83: "S",
  87: "W"
};
const NEON_GREEN = "#00ff00"
var canvas = null;
var ctx = null;
var snake;
var food;
var animationTimeoutId = -1;
var animationLoopId = 0;
var score;

const SCORE_EL = document.getElementById("score");
const W_KEY_EL = document.getElementById("w");
const A_KEY_EL = document.getElementById("a");
const S_KEY_EL = document.getElementById("s");
const D_KEY_EL = document.getElementById("d");

document.getElementById("reset").onclick = initGame;

document.addEventListener("keydown", function(event) {
  let head = snake[0];
  let onlyHead = snake.length < 2;
  switch (KEY_CODES[event.which]) {
    case "space":
      initGame();
      break;
    case "ua":
    case "W": {
      W_KEY_EL.classList.add("key-selected");
      if (onlyHead || head.dir != "d") {
        head.dir = "u";
      }
      break;
    }
    case "la":
    case "A": {
      A_KEY_EL.classList.add("key-selected");
      if (onlyHead || head.dir != "r") {
        head.dir = "l";
      }
      break;
    }
    case "da":
    case "S": {
      S_KEY_EL.classList.add("key-selected");
      if (onlyHead || head.dir != "u") {
        head.dir = "d";
      }
      break;
    }
    case "ra":
    case "D": {
      D_KEY_EL.classList.add("key-selected");
      if (onlyHead || head.dir != "l") {
        head.dir = "r";
      }
      break;
    }
  }
});

document.addEventListener("keyup", function(event) {
  switch (KEY_CODES[event.which]) {
    case "ua":
    case "W": {
      W_KEY_EL.classList.remove("key-selected");
      break;
    }
    case "la":
    case "A": {
      A_KEY_EL.classList.remove("key-selected");
      break;
    }
    case "da":
    case "S": {
      S_KEY_EL.classList.remove("key-selected");
      break;
    }
    case "ra":
    case "D": {
      D_KEY_EL.classList.remove("key-selected");
      break;
    }
  }
});

function initGame() {
  canvas = document.getElementById("canvas");
  canvas.width = CANVAS_SIZE;
  canvas.height = CANVAS_SIZE;
  ctx = canvas.getContext("2d");
  snake = [randomSprite()];
  food = randomSprite();
  score = 0;
  // cancel previous recursive animation call loop by clearing the last scheduled timeout from that loop
  // console.log(`Cancelling timeout: ${animationTimeoutId}, loop: ${animationLoopId}`);
  clearTimeout(animationTimeoutId);
  animationLoop(animationLoopId++);
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
  return {
    x: randomComponent(),
    y: randomComponent()
  };
}

function isCollision(sprite1, sprite2) {
  return sprite1.x === sprite2.x && sprite1.y === sprite2.y;
}

function hasFoodCollision(sprite) {
  return isCollision(sprite, food);
}

function hasWallCollision(sprite) {
  return (sprite.x < 0 || sprite.x >= CANVAS_SIZE || sprite.y < 0 || sprite.y >= CANVAS_SIZE);
}

function hasTailCollision(sprite) {
  for (let i = 1; i < snake.length; ++i) {
    if (isCollision(sprite, snake[i])) {
      return true;
    }
  }
  return false;
}

function animationLoop(loopId) {
  let head = snake[0];
  canvas.width = canvas.width;
  drawSprite(food.x, food.y, "red");
  updateSnake();
  if (hasFoodCollision(head)) {
    ++score;
    appendSnake();
    // TODO think of smarter way to generate random food
    food = randomSprite();
    while (hasFoodCollision(head) || hasTailCollision(food)) {
      food = randomSprite();
    }
  }
  drawSnake();
  drawGrid();
  if (hasWallCollision(head) ||hasTailCollision(head)) {
    // setTimeout(initGame,0); //
    printGameOver()
    return;
  }
  animationTimeoutId = setTimeout(function() {
    window.requestAnimationFrame(function () {
      animationLoop(loopId);
    });
  }, 180);
  // console.log(`Running timeout: ${animationTimeoutId}, loop: ${loopId}`);
}

function printGameOver() {
  canvas.width = canvas.width;
  ctx.fillStyle = NEON_GREEN;
  ctx.textAlign = "center";
  let tenth = Math.floor(CANVAS_SIZE / 10);
  let half = Math.floor(CANVAS_SIZE / 2);
  ctx.font = `${tenth}px Arial`;
  ctx.fillText("GAME OVER", half, half, CANVAS_SIZE);
  ctx.fillText(`SCORE: ${score}`, half, half + tenth, CANVAS_SIZE);
  SCORE_EL.innerText = Math.max(score, Number.parseInt(SCORE_EL.innerText));
}

function drawGrid() {
  ctx.strokeStyle = "black";
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

function drawSprite(x, y, color = NEON_GREEN) {
  ctx.fillStyle = color;
  // if (x < 0) {
  //   x = CANVAS_SIZE - SPRITE_SIZE;
  // }
  // if (y < 0) {
  //   y = CANVAS_SIZE - SPRITE_SIZE;
  // }
  // x %= CANVAS_SIZE;
  // y %= CANVAS_SIZE;
  ctx.fillRect(x, y, SPRITE_SIZE, SPRITE_SIZE);
}

function updateSnake() {
  for (let i = snake.length - 1; i >= 0; i--) {
    switch (snake[i].dir) {
      case "u":
        snake[i].y -= SPRITE_SIZE;
        break;
      case "l":
        snake[i].x -= SPRITE_SIZE;
        break;
      case "d":
        snake[i].y += SPRITE_SIZE;
        break;
      case "r":
        snake[i].x += SPRITE_SIZE;
        break;
    }
    if (i > 0) {
      snake[i].dir = snake[i - 1].dir;
    }
  }
}

function appendSnake() {
  var tail = snake[snake.length - 1];
  var sprite = {
    x: tail.x,
    y: tail.y,
    dir: tail.dir
  };
  switch (sprite.dir) {
    case "u":
      sprite.y += SPRITE_SIZE;
      // todo
      break;
    case "l":
      sprite.x += SPRITE_SIZE;
      // todo
      break;
    case "d":
      sprite.y -= SPRITE_SIZE;
      // todo
      break;
    case "r":
      sprite.x -= SPRITE_SIZE;
      // todo
      break;
  }
  snake.push(sprite);
}

function drawSnake() {
  for (let i = snake.length - 1; i >= 0; i--) {
    drawSprite(snake[i].x, snake[i].y);
  }
}
