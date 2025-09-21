"use strict"
const GRID_SIZE = 4
const CELL_SIZE = 20
const CELL_GAP = 2
const BORDER_RADIUS = 2


export default class Grid {
    #cells
    constructor(boardElement){
        boardElement.style.setProperty("--grid-size", GRID_SIZE)
        boardElement.style.setProperty("--cell-size", `${CELL_SIZE}vmin`)
        boardElement.style.setProperty("--cell-gap", `${CELL_GAP}vmin`)
        boardElement.style.setProperty("--border-radius", `${BORDER_RADIUS}vmin`)

        this.#cells = createCellElements(boardElement).map((cellElement, index) => {
            const [x, y] = [index % GRID_SIZE, Math.floor(index / GRID_SIZE)]
            return new Cell(cellElement, x, y)
        })
    }

    get cells() {
        return this.#cells
    }

    get #emptyCells(){
        return this.#cells.filter(cell => cell.tile == null)
    }

    randomEmptyCell(){
        const randomIndex = Math.floor(Math.random() * (this.#emptyCells.length))
        return this.#emptyCells[randomIndex]
    }

    get cellsByColumn(){
        const grid = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(0))
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            grid[this.#cells[i].x][this.#cells[i].y] = this.#cells[i]
        }
        return grid
    }

    get cellsByRow(){
        const grid = Array.from({ length: GRID_SIZE }, () =>
        Array(GRID_SIZE).fill(0))
        for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
            grid[this.#cells[i].y][this.#cells[i].x] = this.#cells[i]
        }
        return grid
    }
}

class Cell{
    #cellElement
    #x
    #y
    #tile
    #mergeTile
    constructor(cellElement, x, y){
        this.#cellElement = cellElement
        this.#x = x
        this.#y = y
        this.#tile = null
    }

    get tile(){
        return this.#tile
    }

    get x(){
        return this.#x
    }

    get y(){
        return this.#y
    }

    set tile(value){
        this.#tile = value
        if(value == null) return
        this.#tile.x = this.#x
        this.#tile.y = this.#y
    }

    get mergeTile() {
        return this.#mergeTile
    }

    set mergeTile(value) {
        this.#mergeTile = value
        if (value == null) return
        this.#mergeTile.x = this.#x
        this.#mergeTile.y = this.#y
    }

    canAccept(tile) {
        return (this.tile == null || (this.mergeTile == null && this.tile.value === tile.value))
    }

    mergeTiles() {
        if (this.tile == null || this.mergeTile == null) return
        this.tile.value = this.tile.value + this.mergeTile.value
         this.tile.tileElement.style.animation = "none"
         this.tile.tileElement.offsetHeight
         this.tile.tileElement.style.animation = "merge 100ms ease-in-out"
        this.mergeTile.remove()
        this.mergeTile = null
    }
}

function createCellElements(boardElement){
    const cells = []
    for (let i = 0; i < GRID_SIZE * GRID_SIZE; i++) {
        const cell = document.createElement('div')
        cell.classList.add('cell')
        cells.push(cell)
        boardElement.append(cell)
        
    }
    return cells
}