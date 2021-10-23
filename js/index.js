const canvas = document.getElementById('game')      // create variable for 'game' element
const context = canvas.getContext('2d')
const grid = 16     // size of cell
const count = 0     // game speed

/* snake state */
let snake = {
    x: 160,         // initial coords
    y: 160,
    dx: grid,       // initial direction of moving
    dy: 0,
    cells: [],      // array of cells of snake tail
    maxCells: 4,    // initial length of snake
}

/* apple state */
let apple = {
    x: 320,         // initial coords
    y: 320
}

