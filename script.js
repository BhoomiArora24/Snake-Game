const board = document.querySelector(".board");
const startButton = document.querySelector(".btn-start");
const modal = document.querySelector(".modal");
const startGameModal = document.querySelector(".start-game");
const gameOverModal = document.querySelector(".game-over");
const restartButton = document.querySelector(".btn-restart");
const highScoreElem = document.querySelector("#high-score");
const scoreElem = document.querySelector("#score");
const timeElem = document.querySelector("#time");

const eatSound = new Audio("sounds/nahtt-eat-323883.mp3");
const gameOverSound = new Audio("sounds/freesound_community-wrong-buzzer-6268.mp3");

const blockHeight = 50;
const blockWidth = 50;

let highScore = Number(localStorage.getItem("highScore")) || 0;

highScoreElem.innerText = highScore;
let score = 0;
let time = `00-00`;

const cols = Math.floor(board.clientWidth / blockWidth);
const rows = Math.floor(board.clientHeight / blockHeight);
let intervalId = null;
let timerIntervalId = null;
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
    gameOverSound.currentTime = 0;
    gameOverSound.play().catch(() => {});
    clearInterval(intervalId);
    clearInterval(timerIntervalId);
    modal.style.display = "flex";
    startGameModal.style.display = "none";
    gameOverModal.style.display = "flex";
    return;
  }

  //to add food in head whenever it consumes it the head increases
  if (head.x == food.x && head.y == food.y) {
    eatSound.currentTime = 0;
    eatSound.play().catch(() => {});
    blocks[`${food.x}-${food.y}`].classList.remove("food");
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    blocks[`${food.x}-${food.y}`].classList.add("food");

    snake.unshift(head);
    score += 10;
    scoreElem.innerText = score;

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("highScore", highScore.toString());
      highScoreElem.innerText = highScore;
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
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
    timeElem.innerText = time;
  }, 1000);
});

restartButton.addEventListener("click", restartGame);

function restartGame() {
  gameOverSound.pause();
  gameOverSound.currentTime = 0;
  clearInterval(intervalId); // Stop the previous game
  clearInterval(timerIntervalId);
  score = 0;

  // Remove the old snake and food from the board
  document.querySelectorAll(".fill").forEach((block) => {
    block.classList.remove("fill");
  });

  document.querySelectorAll(".food").forEach((block) => {
    block.classList.remove("food");
  });

  score = 0;
  time = "00-00";

  scoreElem.innerText = score;
  timeElem.innerText = time;
  highScoreElem.innerText = highScore;

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
  timerIntervalId = setInterval(() => {
    let [min, sec] = time.split("-").map(Number);

    if (sec == 59) {
      min += 1;
      sec = 0;
    } else {
      sec += 1;
    }

    time = `${String(min).padStart(2, "0")}-${String(sec).padStart(2, "0")}`;
    timeElem.innerText = time;
  }, 1000);
}

function setDirection(newDir) {
  if (!newDir) return;
  if (snake.length > 1) {
    if (newDir === "up" && direction === "down") return;
    if (newDir === "down" && direction === "up") return;
    if (newDir === "left" && direction === "right") return;
    if (newDir === "right" && direction === "left") return;
  }
  direction = newDir;
}

// Keyboard controls
addEventListener("keydown", (event) => {
  if (event.key === "ArrowUp" || event.key === "w" || event.key === "W") {
    setDirection("up");
  } else if (event.key === "ArrowDown" || event.key === "s" || event.key === "S") {
    setDirection("down");
  } else if (event.key === "ArrowLeft" || event.key === "a" || event.key === "A") {
    setDirection("left");
  } else if (event.key === "ArrowRight" || event.key === "d" || event.key === "D") {
    setDirection("right");
  }
});

// Touch / on-screen D-Pad buttons
const controlButtons = document.querySelectorAll(".ctrl-btn");
controlButtons.forEach((btn) => {
  const handlePress = (event) => {
    event.preventDefault();
    setDirection(btn.dataset.dir);
  };
  btn.addEventListener("pointerdown", handlePress);
  btn.addEventListener("click", handlePress);
});

// Virtual Joystick controls
const joystickBase = document.querySelector("#joystick-base");
const joystickKnob = document.querySelector("#joystick-knob");
let isDraggingJoystick = false;
let joystickCenter = { x: 0, y: 0 };
const maxDistance = 36;
const deadZone = 10;

function updateJoystickPosition(clientX, clientY) {
  const dx = clientX - joystickCenter.x;
  const dy = clientY - joystickCenter.y;
  const distance = Math.hypot(dx, dy);

  const clampedDist = Math.min(distance, maxDistance);
  const angle = Math.atan2(dy, dx);

  const knobX = Math.cos(angle) * clampedDist;
  const knobY = Math.sin(angle) * clampedDist;

  joystickKnob.style.transform = `translate(calc(-50% + ${knobX}px), calc(-50% + ${knobY}px))`;
  joystickKnob.classList.add("active");

  if (distance > deadZone) {
    if (Math.abs(dx) > Math.abs(dy)) {
      setDirection(dx > 0 ? "right" : "left");
    } else {
      setDirection(dy > 0 ? "down" : "up");
    }
  }
}

if (joystickBase && joystickKnob) {
  joystickBase.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    isDraggingJoystick = true;
    try {
      joystickBase.setPointerCapture(event.pointerId);
    } catch (_) {}
    const rect = joystickBase.getBoundingClientRect();
    joystickCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };
    updateJoystickPosition(event.clientX, event.clientY);
  });

  joystickBase.addEventListener("pointermove", (event) => {
    if (!isDraggingJoystick) return;
    event.preventDefault();
    updateJoystickPosition(event.clientX, event.clientY);
  });

  const stopJoystick = (event) => {
    if (!isDraggingJoystick) return;
    isDraggingJoystick = false;
    try {
      joystickBase.releasePointerCapture(event.pointerId);
    } catch (_) {}
    joystickKnob.style.transform = "translate(-50%, -50%)";
    joystickKnob.classList.remove("active");
  };

  joystickBase.addEventListener("pointerup", stopJoystick);
  joystickBase.addEventListener("pointercancel", stopJoystick);
}

// Mode switcher (Joystick vs D-Pad)
const modeBtns = document.querySelectorAll(".mode-btn");
const dpadControls = document.querySelector("#dpad-controls");
const joystickWrapper = document.querySelector("#joystick-wrapper");

function setControlMode(mode) {
  if (!dpadControls || !joystickWrapper) return;
  if (mode === "joystick") {
    dpadControls.style.display = "none";
    joystickWrapper.style.display = "flex";
  } else {
    dpadControls.style.display = "flex";
    joystickWrapper.style.display = "none";
  }
  modeBtns.forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.mode === mode);
  });
  localStorage.setItem("controlMode", mode);
}

modeBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    setControlMode(btn.dataset.mode);
  });
});

// Default to joystick on smaller/mobile devices, otherwise use saved/dpad
const defaultMode = window.innerWidth <= 768 ? "joystick" : "dpad";
const savedMode = localStorage.getItem("controlMode") || defaultMode;
setControlMode(savedMode);
