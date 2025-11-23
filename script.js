let hiScore = Number(localStorage.getItem("highScore")) || 0;

const board = document.querySelector(".board")
const scoreCard = document.querySelector("#score")
const startgame = document.querySelector(".start-btn").addEventListener('click', start)
const startModal = document.querySelector(".start-game")
const resetModal = document.querySelector(".gameOver")
const modal = document.querySelector('.modal')
const rbtn = document.querySelector('.resetButton').addEventListener('click', resetGame)
const hscore = document.querySelector('#high-score')

hscore.innerHTML = hiScore;

const blockWidth = 50;
const blockheight = 50;

const cols = Math.floor(board.clientWidth / blockWidth)
const rows = Math.floor(board.clientHeight / blockheight)

let intervalId = null
let score = 0
let direction = "stand";

let food = {
    X: Math.floor(Math.random() * rows),
    Y: Math.floor(Math.random() * cols)
}

const snake = [
    { X: 2, Y: 2 },
]

let blocks = []
for (let rw = 0; rw < rows; rw++) {
    for (let coln = 0; coln < cols; coln++) {
        const block = document.createElement('div');
        block.classList.add("box");
        board.appendChild(block);
        blocks[`${rw}-${coln}`] = block;
    }
}

function render() {
    // Clear old snake & food
    for (let key in blocks) {
        blocks[key].classList.remove("snake", "food")
    }

    // Draw snake
    snake.forEach((segment) => {
        blocks[`${segment.X}-${segment.Y}`].classList.add("snake")
    })

    // Draw food
    blocks[`${food.X}-${food.Y}`].classList.add("food")
}

function restart() {
    modal.classList.add("addModal")
    startModal.classList.add("removeModal")
    resetModal.classList.remove('gameOver')
    resetModal.classList.add("addModal")
}

function resetGame() {

    modal.classList.remove("addModal")

    // Reset snake
    snake.length = 0
    snake.push({ X: 2, Y: 2 })

    // Reset score
    score = 0
    scoreCard.innerHTML = "0"

    // Reset direction
    direction = "stand"

    // Reset food
    food = {
        X: Math.floor(Math.random() * rows),
        Y: Math.floor(Math.random() * cols)
    }

    start()
    render()
}

function start() {

    modal.classList.add("removeModal")

    intervalId = setInterval(() => {

        let head = { ...snake[0] }

        if (direction === "right") head.Y += 1
        else if (direction === "left") head.Y -= 1
        else if (direction === "up") head.X -= 1
        else if (direction === "down") head.X += 1

        // Wall collision
        if (head.X < 0 || head.X >= rows || head.Y < 0 || head.Y >= cols) {
            clearInterval(intervalId)
            restart()
            return
        }

        // Eating food
        if (food.X === head.X && food.Y === head.Y) {

            food = {
                X: Math.floor(Math.random() * rows),
                Y: Math.floor(Math.random() * cols)
            }

            snake.unshift(head)
            score += 10
            scoreCard.innerHTML = `${score}`

            // Update high score & save in localStorage
            if (score > hiScore) {
                hiScore = score
                localStorage.setItem("highScore", hiScore)
                hscore.innerHTML = hiScore
            }

        } else {
            snake.pop()
            snake.unshift(head)
        }

        render()

    }, 700)
}

addEventListener('keydown', (event) => {
    if (event.key === "ArrowUp" && direction !== "down") direction = "up"
    else if (event.key === "ArrowDown" && direction !== "up") direction = "down"
    else if (event.key === "ArrowRight" && direction !== "left") direction = "right"
    else if (event.key === "ArrowLeft" && direction !== "right") direction = "left"
})
