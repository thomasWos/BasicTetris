const WIDTH = 10
const HEIGHT = 20

const MINI_WIDTH = 5
const MINI_HEIGHT = 5

const ltetromino = [
  [1, 2, WIDTH + 1, WIDTH * 2 + 1],
  [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 2],
  [1, WIDTH + 1, WIDTH * 2, WIDTH * 2 + 1],
  [WIDTH, WIDTH * 2, WIDTH * 2 + 1, WIDTH * 2 + 2],
]

const zTetromino = [
  [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
  [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
  [WIDTH + 1, WIDTH + 2, WIDTH * 2, WIDTH * 2 + 1],
  [0, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
]

const tTetromino = [
  [1, WIDTH, WIDTH + 1, WIDTH + 2],
  [1, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
  [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH * 2 + 1],
  [1, WIDTH, WIDTH + 1, WIDTH * 2 + 1],
]

const oTetromino = [
  [0, 1, WIDTH, WIDTH + 1],
  [0, 1, WIDTH, WIDTH + 1],
  [0, 1, WIDTH, WIDTH + 1],
  [0, 1, WIDTH, WIDTH + 1],
]

const iTetromino = [
  [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
  [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
  [WIDTH, WIDTH + 1, WIDTH + 2, WIDTH + 3],
  [1, WIDTH + 1, WIDTH * 2 + 1, WIDTH * 3 + 1],
]

const tetrominoes = [ltetromino, zTetromino, tTetromino, oTetromino, iTetromino]
const bgColors = tetrominoBgColors()

document.addEventListener('DOMContentLoaded', () => {
  buildGrid()

  const grid = document.querySelector('.grid')
  let squares = Array.from(document.querySelectorAll('.grid div'))

  const scoreDisplay = document.querySelector('#score')
  const startBtn = document.querySelector('#start-button')
  let score = 0

  let timerId

  let position = 4
  let rotation = 0

  let random = Math.floor(Math.random() * tetrominoes.length)
  let nextRandom = 0
  let tetromino = tetrominoes[random][rotation]

  function draw() {
    tetromino.forEach(index =>
      squares[position + index].classList.add('tetromino', bgColors[random])
    )
  }

  function undraw() {
    tetromino.forEach(index =>
      squares[position + index].classList.remove('tetromino', bgColors[random])
    )
  }

  document.addEventListener('keyup', control)
  function control(e) {
    if (e.keyCode === 37) {
      moveLeft()
    } else if (e.keyCode === 38) {
      rotate()
    } else if (e.keyCode === 39) {
      moveRight()
    } else if (e.keyCode === 40) {
      moveDown()
    }
  }

  function moveDown() {
    undraw()
    position += WIDTH
    draw()
    freeze()
  }

  function freeze() {
    if (tetromino.some(index => squares[position + index + WIDTH].classList.contains('taken'))) {
      tetromino.forEach(index => squares[position + index].classList.add('taken'))
      random = nextRandom
      nextRandom = Math.floor(Math.random() * tetrominoes.length)
      tetromino = tetrominoes[random][rotation]
      position = 4
      rotation = 0
      draw()
      displayMiniShape()
      addScore()
      gameOver()
    }
  }

  function moveLeft() {
    undraw()
    const isAtLeftEdge = tetromino.some(index => (position + index) % WIDTH === 0)
    if (!isAtLeftEdge) {
      position -= 1
    }
    if (tetromino.some(index => squares[position + index].classList.contains('taken'))) {
      position += 1
    }
    draw()
  }

  function moveRight() {
    undraw()
    const isAtRightEdge = tetromino.some(index => (position + index) % WIDTH === WIDTH - 1)
    if (!isAtRightEdge) {
      position += 1
    }
    if (tetromino.some(index => squares[position + index].classList.contains('taken'))) {
      position -= 1
    }
    draw()
  }

  function rotate() {
    undraw()
    rotation++
    if (rotation === tetromino.length) {
      rotation = 0
    }
    tetromino = tetrominoes[random][rotation]
    draw()
  }

  const miniSquares = document.querySelectorAll('.mini-grid div')

  // Tetrominos without rotations
  const upNextTetrominoes = [
    [MINI_WIDTH + 1, MINI_WIDTH * 2 + 1, MINI_WIDTH * 3 + 1, MINI_WIDTH + 2], //lTetromino
    [MINI_WIDTH + 1, MINI_WIDTH * 2 + 1, MINI_WIDTH * 2 + 2, MINI_WIDTH * 3 + 2], //zTetromino
    [MINI_WIDTH + 2, MINI_WIDTH * 2 + 1, MINI_WIDTH * 2 + 2, MINI_WIDTH * 2 + 3], //tTetromino
    [MINI_WIDTH + 1, MINI_WIDTH + 2, MINI_WIDTH * 2 + 1, MINI_WIDTH * 2 + 2], //oTetromino
    [2, MINI_WIDTH + 2, MINI_WIDTH * 2 + 2, MINI_WIDTH * 3 + 2], //iTetromino
  ]

  function displayMiniShape() {
    miniSquares.forEach(square => {
      const classList = square.classList
      bgColors.forEach(c => classList.remove(c))
    })
    upNextTetrominoes[nextRandom].forEach(index =>
      miniSquares[index].classList.add('tetromino', bgColors[nextRandom])
    )
  }

  startBtn.addEventListener('click', () => {
    if (timerId) {
      clearInterval(timerId)
      timerId = null
    } else {
      draw()
      timerId = setInterval(moveDown, 1000)
      nextRandom = Math.floor(Math.random() * tetrominoes.length)
      displayMiniShape()
    }
  })

  function addScore() {
    for (let i = 0; i < WIDTH * HEIGHT; i += WIDTH) {
      const row = [i, i + 1, i + 2, i + 3, i + 4, i + 5, i + 6, i + 7, i + 8, i + 9]

      let allTaken = row.every(index => squares[index].classList.contains('taken'))
      if (allTaken) {
        score += 10
        scoreDisplay.innerHTML = score
        row.forEach(index => {
          const classList = squares[index].classList
          classList.remove('taken', 'tetromino')
          bgColors.forEach(c => classList.remove(c))
        })
        const squareRemoved = squares.splice(i, WIDTH)
        squares = squareRemoved.concat(squares)
        squareRemoved.reverse().forEach(div => grid.prepend(div))
      }
    }
  }

  function gameOver() {
    const gameOver = tetromino.some(index => squares[index + position].classList.contains('taken'))
    if (gameOver) {
      scoreDisplay.innerHTML = 'End'
      clearInterval(timerId)
    }
  }
})

function buildGrid() {
  const grid = document.querySelector('.grid')
  for (let i = 0; i < WIDTH * HEIGHT; i++) {
    const elem = document.createElement('div')
    grid.appendChild(elem)
  }

  for (let i = 0; i < WIDTH; i++) {
    const elem = document.createElement('div')
    elem.classList.add('taken')
    grid.appendChild(elem)
  }

  // Minigrid
  const minigrid = document.querySelector('.mini-grid')
  for (let i = 0; i < MINI_WIDTH * MINI_HEIGHT; i++) {
    const elem = document.createElement('div')
    minigrid.appendChild(elem)
  }
}

function tetrominoBgColors() {
  const bgColors = []
  for (let i = 1; i <= 5; i++) {
    bgColors.push(`tetromino-color-${i}`)
  }
  return bgColors
}
