const canvasEl = document.getElementById('game')      // create variable for 'game' element
const scoreEl = document.getElementsByClassName('currentScore')[0]    // create variable for 'game' element
const maxScoreEl = document.getElementsByClassName('maxScore')  [0]    // create variable for 'game' element
const upBtnEl = document.getElementsByClassName('up')[0]    // create variable for 'game' element
const leftBtnEl = document.getElementsByClassName('left')[0]    // create variable for 'game' element
const downBtnEl = document.getElementsByClassName('down')[0]    // create variable for 'game' element
const rightBtnEl = document.getElementsByClassName('right')[0]    // create variable for 'game' element
const pauseBtnEl = document.getElementsByClassName('pause')[0]    // create variable for 'game' element

const context = canvasEl.getContext('2d')
const field = { x: 25, y: 25 }  // size of canvas in cells
canvasEl.width = Math.floor((window.innerWidth - 2) / field.x) * field.x
canvasEl.height = canvasEl.width = Math.min(400, canvasEl.width)
// canvasEl.height = Math.min(400, canvasEl.width)
const grid = Math.floor(canvasEl.width / field.x)               // size of cell in pixels
let framesCount = 0             // speed
const initLength = 2            // initial length of snake
let score = 0                   // score
let bestScore = 0
let isPaused = false
let firstRender = true
let stepIsOver = false          // experimental feature for Preventing multiple button presses

/* snake state */
const snake = {
    x: 10,                      // initial coords in cells
    y: 10,
    dx: 1,                      // initial direction of moving
    dy: 0,
    snakeCells: [],             // array of snakeCells of snake tail
    snakeLength: initLength,    // initial length of snake
}

/* apple state */
const apple = {
    x: 20,                      // initial coords
    y: 20
}

/* apple appearance randomizer */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

/* MainLoop */
function loop () {
    // to reduce the frame rate, we will only output every fifth frame. FPS 60/5 = 12
    requestAnimationFrame(loop)
    if (++framesCount < 10) return
    framesCount = 0
    stepIsOver = true

    // game info render
    scoreEl.innerText = score
    maxScoreEl.innerText = bestScore
    if (!isPaused) {
        pauseBtnEl.innerText = firstRender ? `Start` : `${isPaused ? 'Resume' : 'Pause'}`

        // clean the canvas
        context.clearRect(0, 0, canvasEl.width, canvasEl.height)

        // draw the background canvas
        const field = { x: canvasEl.width / grid, y: canvasEl.height / grid }
        for (let y = 0; y <= field.y; y++) {
            for (let x = 0; x <= field.x; x++) {
                context.fillStyle = ['black', '#091722'][(x + y) % 2]
                context.fillRect(x * grid, y * grid, grid, grid)
            }
        }

        // Update coords of snakes head
        snake.x += snake.dx
        snake.y += snake.dy

        // When the border is reached, the head appears from the opposite side
        if (snake.x < 0) {
            snake.x = field.x
        } else if (snake.x >= field.x) {
            snake.x = 0
        }
        if (snake.y < 0) {
            snake.y = field.y
        } else if (snake.y >= field.y) {
            snake.y = 0
        }

        // add new coordinates of the head to the array
        snake.snakeCells.unshift({ x: snake.x, y: snake.y })
        // and remove the old coordinates of the tail, if haven`t eaten an apple
        if (snake.snakeCells.length > snake.snakeLength) {
            snake.snakeCells.pop()
        }

        // draw an apple
        context.fillStyle = 'red'
        context.fillRect(apple.x * grid + 1, apple.y * grid + 1, grid - 2, grid - 2)

        // draw the snake
        snake.snakeCells.forEach((cell, index) => {
            context.fillStyle = ['#2DC64F', 'green'][Number(!!index)]        // highlight head with another color
            context.fillRect(cell.x * grid + 1, cell.y * grid + 1, grid - 2, grid - 2)

            // if the snake ate an apple
            if (cell.x === apple.x && cell.y === apple.y) {
                score++
                bestScore = Math.max(bestScore, score)
                console.log('Count: ' + score + ', record: ' + bestScore)
                snake.snakeLength++
                // update new apple coords
                apple.x = getRandomInt(0, 25)
                apple.y = getRandomInt(0, 25)
            }
            // checking if the snake ate itself
            for (let i = index + 1; i < snake.snakeCells.length; i++) {
                // if there is a cell with the same coordinates as the head - the game is over
                if (cell.x === snake.snakeCells[i].x && cell.y === snake.snakeCells[i].y) {
                    // Set initial values
                    pauseBtnEl.innerText = `Start`
                    score = 0
                    firstRender = true
                    snake.x = 10
                    snake.y = 10
                    snake.snakeCells = []
                    snake.snakeLength = initLength
                    snake.dx = 1
                    snake.dy = 0
                    apple.x = 20
                    apple.y = 20
                }
            }
        })
        if (firstRender) isPaused = true
        firstRender = false
    }
}

// listen keydown and clicks
document.addEventListener('keydown', handler)
document.addEventListener('click', handler)

/* Start game */
requestAnimationFrame(loop)

function handler (e) {
    console.log('stepIsOver', stepIsOver)

    if (stepIsOver) {
        if (e.type === 'keydown' && e.code === 'ArrowLeft' || e.type === 'click' && e.target === leftBtnEl) {
            if (snake.dx === 0) {
                snake.dx = -1
                snake.dy = 0
            }
        } else if (e.type === 'keydown' && e.code === 'ArrowUp' || e.type === 'click' && e.target === upBtnEl) {
            if (snake.dy === 0) {
                snake.dy = -1
                snake.dx = 0
            }
        } else if (e.type === 'keydown' && e.code === 'ArrowRight' || e.type === 'click' && e.target === rightBtnEl) {
            if (snake.dx === 0) {
                snake.dx = 1
                snake.dy = 0
            }
        } else if (e.type === 'keydown' && e.code === 'ArrowDown' || e.type === 'click' && e.target === downBtnEl) {
            if (snake.dy === 0) {
                snake.dy = 1
                snake.dx = 0
            }
        } else if (e.type === 'keydown' && e.code === 'Space' || e.type === 'click' && e.target === pauseBtnEl) {
            isPaused = !isPaused
            console.log('stepIsOver', stepIsOver, 'isPaused', isPaused)
        } else return
        stepIsOver = false
    }
}



