const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const highScoreElem = document.querySelector("#high-score");
const scoreElem = document.querySelector("#score");
const timeElem = document.querySelector("#time");

const blockHeight = 50;
const blockWidth = 50;

let highScore = 0;
let score = 0;
let time = `00-00`

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

//so as we need to store the indexes we need to create a 2d array but by default js doesnot create 2d array
//therefore we'll create a 1D array overhere and will convert it into an 2d array in runtime
const blocks = [];
let snake = [
  {
    x: 1,
    y: 3,
  },
];

let direction = "down";

// for(let i = 0; i < rows*cols; i++){
//     const block = document.createElement('div');
//     block.classList.add("block");
//     board.appendChild(block);
// }

//FPS (Frame per second ) == ek second me frame kitna change hoga

for (let row = 0; row < rows; row++) {
  for (let col = 0; col < cols; col++) {
    const block = document.createElement("div");
    block.classList.add("block");
    board.appendChild(block);
    block.innerText = `${row},${col}`;
    blocks[`${row}-${col}`] = block;
  }
}

function render() {
  let head = null; //head is basically fierst cordinate of snake array

  blocks[`${food.x}-${food.y}`].classList.add("food");

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 };
  } else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y };
  } else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y };
  }

  if (head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols) {
    clearInterval(intervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  //to add food in head whenever it consumes it the head increases
  if (head.x == food.x && head.y == food.y) {
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);
    score += 10;
    scoreElem.innerText = score;

    if(score > highScore){
      highScore = score;
      localStorage.setItem("highScore", highScore.toString())
    }
  }

  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.remove("fill");
  });
  snake.unshift(head); //to change the first cordinate in array snake
  snake.pop(); //to remove the very last cordinate of array snake
  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.add("fill");
  });
}

// intervalId = setInterval(() => {
//   render();
// }, 500);

startButton.addEventListener("click", () => {
  modal.style.display = "none";
  intervalId = setInterval(() => {
    render();
  }, 300);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  clearInterval(intervalId); // Stop the previous game

  // Remove the old snake and food from the board
  document.querySelectorAll(".fill").forEach((block) => {
    block.classList.remove("fill");
  });

  document.querySelectorAll(".food").forEach((block) => {
    block.classList.remove("food");
  });

  // Reset the snake
  snake = [{ x: 1, y: 3 }];

  // Reset the direction
  direction = "down";

  // Generate new food
  food = {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols),
  };

  // Hide the modal
  modal.style.display = "none";

  // Start a fresh game
  intervalId = setInterval(render, 300);
}

// script.js:68 ArrowUp
// script.js:68 ArrowDown
// script.js:68 ArrowLeft
// script.js:68 ArrowRight
addEventListener("keydown", (event) => {
  if (event.key == "ArrowUp") {
    direction = "up";
  } else if (event.key == "ArrowDown") {
    direction = "down";
  } else if (event.key == "ArrowLeft") {
    direction = "left";
  } else if (event.key == "ArrowRight") {
    direction = "right";
  }
});
