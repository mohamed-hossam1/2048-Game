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
}

async function handleInput(e) {
    const key = e.key
    try {
        switch (key) {
        case "ArrowUp":
            if (!canMoveUp()) {
            setupInput()
            return
            }
            await slideTiles(grid.cellsByColumn)
            break

        case "ArrowRight":
            if (!canMoveRight()) {
            setupInput()
            return
            }
            await slideTiles(grid.cellsByRow.map(row => [...row].reverse()))
            break

        case "ArrowDown":
            if (!canMoveDown()) {
            setupInput()
            return
            }
            await slideTiles(grid.cellsByColumn.map(column => [...column].reverse()))
            break

        case "ArrowLeft":
            if (!canMoveLeft()) {
            setupInput()
            return
            }
            await slideTiles(grid.cellsByRow)
            break

        default:
            setupInput()
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
        setupInput()
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
