const canvasEl = document.getElementById('game')      // create variable for 'game' element
const scoreEl = document.getElementsByClassName('currentScore')[0]    // create variable for 'game' element
const maxScoreEl = document.getElementsByClassName('maxScore')  [0]    // create variable for 'game' element
const pausedEl = document.getElementsByClassName('paused')[0]    // create variable for 'game' element
const upBtnEl = document.getElementsByClassName('up')[0]    // create variable for 'game' element
const leftBtnEl = document.getElementsByClassName('left')[0]    // create variable for 'game' element
const downBtnEl = document.getElementsByClassName('down')[0]    // create variable for 'game' element
const rightBtnEl = document.getElementsByClassName('right')[0]    // create variable for 'game' element
const pauseBtnEl = document.getElementsByClassName('pause')[0]    // create variable for 'game' element

const context = canvasEl.getContext('2d')
canvasEl.width=400
canvasEl.height=400
const grid = canvasEl.width / 25         // size of cell in pixels
let framesCount = 0           // speed
const initLength = 2  // initial length of snake
let score = 0
let bestScore = 0
let isPaused = false
let firstRender = true

/* snake state */
const snake = {
    x: 160,             // initial coords
    y: 160,
    dx: grid,           // initial direction of moving
    dy: 0,
    snakeCells: [],     // array of snakeCells of snake tail
    snakeLength: initLength,    // initial length of snake
}

/* apple state */
const apple = {
    x: 320,             // initial coords
    y: 320
}

/* apple appearance randomizer */
function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min)) + min
}

/* MainLoop */
function loop () {
    // to reduce the frame rate, we will only output every fifth frame. FPS 60/5 = 12
    requestAnimationFrame(loop)
    if (++framesCount < 5) return
    framesCount = 0

    // game info render
    scoreEl.innerText = score
    maxScoreEl.innerText = bestScore
    pausedEl.innerText = isPaused ? 'YES' : 'NO'
    if (!isPaused) {

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
            snake.x = canvasEl.width - grid
        } else if (snake.x >= canvasEl.width) {
            snake.x = 0
        }
        if (snake.y < 0) {
            snake.y = canvasEl.height - grid
        } else if (snake.y >= canvasEl.height) {
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
        context.fillRect(apple.x + 1, apple.y + 1, grid - 2, grid - 2)

        // draw the snake
        snake.snakeCells.forEach((cell, index) => {
            context.fillStyle = ['#2DC64F', 'green'][Number(!!index)]        // highlight head with another color
            context.fillRect(cell.x + 1, cell.y + 1, grid - 2, grid - 2)

            // if the snake ate an apple
            if (cell.x === apple.x && cell.y === apple.y) {
                score++
                bestScore = Math.max(bestScore, score)
                console.log('Count: ' + score + ', record: ' + bestScore)
                snake.snakeLength++
                // update new apple coords
                apple.x = getRandomInt(0, 25) * grid
                apple.y = getRandomInt(0, 25) * grid
            }
            // checking if the snake ate itself
            for (let i = index + 1; i < snake.snakeCells.length; i++) {
                // if there is a cell with the same coordinates as the head - the game is over
                if (cell.x === snake.snakeCells[i].x && cell.y === snake.snakeCells[i].y) {
                    // Set initial values
                    score = 0
                    firstRender = true
                    snake.x = 160
                    snake.y = 160
                    snake.snakeCells = []
                    snake.snakeLength = initLength
                    snake.dx = grid
                    snake.dy = 0
                    apple.x = 320
                    apple.y = 320
                }
            }
        })
        if (firstRender) isPaused = true
        firstRender = false
    }
}

// listen keydown
document.addEventListener('keydown', e => {
    if (e.code === 'ArrowLeft' && snake.dx === 0) {
        snake.dx = -grid
        snake.dy = 0
    } else if (e.code === 'ArrowUp' && snake.dy === 0) {
        snake.dy = -grid
        snake.dx = 0
    } else if (e.code === 'ArrowRight' && snake.dx === 0) {
        snake.dx = grid
        snake.dy = 0
    } else if (e.code === 'ArrowDown' && snake.dy === 0) {
        snake.dy = grid
        snake.dx = 0
    } else if (e.code === 'Space') {
        isPaused = !isPaused
    }
})
leftBtnEl.addEventListener('click', () => {
        snake.dx = -grid
        snake.dy = 0
    })
upBtnEl.addEventListener('click', () => {
        snake.dy = -grid
        snake.dx = 0
    })
rightBtnEl.addEventListener('click', () => {
        snake.dx = grid
        snake.dy = 0
    })
downBtnEl.addEventListener('click', () => {
        snake.dy = grid
        snake.dx = 0
    })
pauseBtnEl.addEventListener('click', () => {
        isPaused = !isPaused
    })


/* Start game */
requestAnimationFrame(loop)




