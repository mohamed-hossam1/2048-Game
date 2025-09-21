"use strict"
import Grid from "./Grid.js"
import Tile from "./Tile.js"

const boardElement = document.querySelector('.game-board')
const grid = new Grid(boardElement)

grid.randomEmptyCell().tile = new Tile(boardElement)
grid.randomEmptyCell().tile = new Tile(boardElement)

setupInput()

function setupInput() {
  window.addEventListener("keydown", handleInput, { once: true })
  setupTouchInput()
}

async function handleInput(e) {
  const direction = e.key
  await processMove(direction)
}

function setupTouchInput() {
  let startX, startY, endX, endY

  window.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX
    startY = e.touches[0].clientY
  })

  window.addEventListener("touchend", async (e) => {
    endX = e.changedTouches[0].clientX
    endY = e.changedTouches[0].clientY

    const diffX = endX - startX
    const diffY = endY - startY

    if (Math.abs(diffX) > Math.abs(diffY)) {
      // حركة أفقية
      if (diffX > 0) {
        await processMove("ArrowRight")
      } else {
        await processMove("ArrowLeft")
      }
    } else {
      // حركة رأسية
      if (diffY > 0) {
        await processMove("ArrowDown")
      } else {
        await processMove("ArrowUp")
      }
    }
  })
}

async function processMove(direction) {
  try {
    switch (direction) {
      case "ArrowUp":
        if (!canMoveUp()) return
        await slideTiles(grid.cellsByColumn)
        break

      case "ArrowRight":
        if (!canMoveRight()) return
        await slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
        break

      case "ArrowDown":
        if (!canMoveDown()) return
        await slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
        break

      case "ArrowLeft":
        if (!canMoveLeft()) return
        await slideTiles(grid.cellsByRow)
        break

      default:
        return
    }

    grid.cells.forEach(cell => cell.mergeTiles())

    const newTile = new Tile(boardElement)
    grid.randomEmptyCell().tile = newTile

    if (!canMoveUp() && !canMoveDown() && !canMoveLeft() && !canMoveRight()) {
      await newTile.waitForTransition(true).catch(() => {})
      alert("Game Over")
      return
    }

  } finally {
    window.addEventListener("keydown", handleInput, { once: true })
  }
}

function slideTiles(cells) {
  return Promise.all(
    cells.flatMap(group => {
      const promises = []
      for (let i = 1; i < group.length; i++) {
        const cell = group[i]
        if (cell.tile == null) continue
        let lastValidCell
        for (let j = i - 1; j >= 0; j--) {
          const moveToCell = group[j]
          if (!moveToCell.canAccept(cell.tile)) break
          lastValidCell = moveToCell
        }

        if (lastValidCell != null) {
          promises.push(cell.tile.waitForTransition())
          if (lastValidCell.tile != null) {
            lastValidCell.mergeTile = cell.tile
          } else {
            lastValidCell.tile = cell.tile
          }
          cell.tile = null
        }
      }
      return promises
    })
  )
}

function canMoveUp() {
  return canMove(grid.cellsByColumn)
}
function canMoveDown() {
  return canMove(grid.cellsByColumn.map(column => [...column].reverse()))
}
function canMoveLeft() {
  return canMove(grid.cellsByRow)
}
function canMoveRight() {
  return canMove(grid.cellsByRow.map(row => [...row].reverse()))
}
function canMove(cells) {
  return cells.some(group => {
    return group.some((cell, index) => {
      if (index === 0) return false
      if (cell.tile == null) return false
      const moveToCell = group[index - 1]
      return moveToCell.canAccept(cell.tile)
    })
  })
}
