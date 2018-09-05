const CANVAS_SIZE = 300;
const SPRITE_SIZE = 15;
const KEY_CODES = {
  37: "la",
  38: "ua",
  39: "ra",
  40: "da",
  65: "A",
  68: "D",
  83: "S",
  87: "W"
};
var canvas = null;
var ctx = null;
var snake = [randomSprite()];
var food = randomSprite();

const W_KEY_EL = document.getElementById("w");
const A_KEY_EL = document.getElementById("a");
const S_KEY_EL = document.getElementById("s");
const D_KEY_EL = document.getElementById("d");

document.addEventListener("keydown", function(event) {
  let head = snake[0];
  switch (KEY_CODES[event.which]) {
    case "ua":
    case "W": {
      W_KEY_EL.classList.add("key-selected");
      if (head.dir != "d") {
        head.dir = "u";
      }
      break;
    }
    case "la":
    case "A": {
      A_KEY_EL.classList.add("key-selected");
      if (head.dir != "r") {
        head.dir = "l";
      }
      break;
    }
    case "da":
    case "S": {
      S_KEY_EL.classList.add("key-selected");
      if (head.dir != "u") {
        head.dir = "d";
      }
      break;
    }
    case "ra":
    case "D": {
      D_KEY_EL.classList.add("key-selected");
      if (head.dir != "l") {
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
  return {
    x: randomComponent(),
    y: randomComponent()
  };
}

function isCollision(sprite1, sprite2) {
  return sprite1.x === sprite2.x && sprite1.y === sprite2.y;
}

function hasFoodCollision() {
  return isCollision(snake[0], food);
}

function hasWallCollision() {
  // TODO Camille's Challenge #2 (easy)
  // detect a collision between the snake's head and any of the four walls
  return false;
}

function hasSnakeCollision() {
  // TODO Camille's Challenge #2 (easy)
  // detect a collision between the snake's head and any sprite in the tail
  return false;
}

function animationLoop() {
  canvas.width = canvas.width;
  drawSprite(food.x, food.y);
  drawGrid();
  updateSnake();
  if (hasFoodCollision()) {
    appendSnake();
    // TODO Camille's Challenge #2 (medium)
    // make sure the food does not spawn on any of the snake sprites
    food = randomSprite();
  }
  drawSnake();
  if (hasSnakeCollision() || hasWallCollision()) {
    // todo: cancel animation loop, init new game
    drawSprite(snake[0].x, snake[0].y, "red");
    console.log("Game Over");
    return;
  }
  setTimeout(function() {
    window.requestAnimationFrame(animationLoop);
  }, 160);
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
  if (x < 0) {
    x = CANVAS_SIZE - SPRITE_SIZE;
  }
  if (y < 0) {
    y = CANVAS_SIZE - SPRITE_SIZE;
  }
  x %= CANVAS_SIZE;
  y %= CANVAS_SIZE;
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
    drawSprite(snake[i].x, snake[i].y, "blue");
  }
}
