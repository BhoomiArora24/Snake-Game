const board = document.querySelector(".board");
const blockHeight = 50;
const blockWidth = 50;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;

//so as we need to store the indexes we need to create a 2d array but by default js doesnot create 2d array
//therefore we'll create a 1D array overhere and will convert it into an 2d array in runtime
const blocks = [];
const snake = [
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
  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.add("fill");
  });
}

intervalId = setInterval(() => {
  let head = null; //head is basically fierst cordinate of snake array

  if (direction === "left") {
    head = { x: snake[0].x, y: snake[0].y - 1 };
  } else if (direction === "right") {
    head = { x: snake[0].x, y: snake[0].y + 1 }
  }else if (direction === "down") {
    head = { x: snake[0].x + 1, y: snake[0].y }
  }
  else if (direction === "up") {
    head = { x: snake[0].x - 1, y: snake[0].y }
  }

  if(head.x < 0 || head.x >= rows || head.y < 0 || head.y >= cols){
    alert("Game over")
    clearInterval(intervalId)
  }

  snake.forEach((block) => {
    blocks[`${block.x}-${block.y}`].classList.remove("fill");
  });
  snake.unshift(head); //to change the first cordinate in array snake
  snake.pop(); //to remove the very last cordinate of array snake

  render();
}, 500);

// script.js:68 ArrowUp
// script.js:68 ArrowDown
// script.js:68 ArrowLeft
// script.js:68 ArrowRight
addEventListener("keydown", (event) => {
  if(event.key == "ArrowUp"){
    direction="up"
  }else if(event.key == "ArrowDown"){
    direction="down"
  }else if(event.key == "ArrowLeft"){
    direction="left"
  }else if(event.key == "ArrowRight"){
    direction="right"
  } 
})