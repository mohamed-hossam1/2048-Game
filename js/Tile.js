"use strict"
const tileStyles = [
  {bg: '#c5b3fbff', text: '#333333', size: '9vmin' },
  {bg: '#b69ef4ff', text: '#333333', size: '9vmin' },
  {bg: '#b490f8ff', text: '#333333', size: '9vmin' },
  {bg: '#9f7aea', text: '#333333', size: '8vmin' },
  {bg: '#805ad5', text: '#333333', size: '8vmin' },
  {bg: '#6b46c1', text: '#ffffff', size: '8vmin' },
  {bg: '#553c9a', text: '#ffffff', size: '7vmin' },
  {bg: '#44337a', text: '#ffffff', size: '7vmin' },
  {bg: '#322659', text: '#ffffff', size: '7vmin' },
  {bg: '#1a202c', text: '#fbbf24', size: '6vmin' },
  {bg: '#000000', text: '#fbbf24', size: '6vmin' }
];

export default class Tile {
    #value
    #x
    #y
    #tileElement

    constructor(boardElement, value = Math.random() > 0.5 ? 2 : 4){
        this.#tileElement = document.createElement('div')
        this.#tileElement.classList.add('tile')
        boardElement.append(this.#tileElement)
        
        this.value = value    
    }
    
    set value(v){
        this.#value = v
        const tileStyle = tileStyles[Math.log2(this.#value) - 1]
        this.#tileElement.innerHTML = this.#value 
        this.#tileElement.style.setProperty('background', tileStyle.bg)
        this.#tileElement.style.setProperty('color', tileStyle.text)
        this.#tileElement.style.setProperty('font-size', tileStyle.size)
    }

    get value(){
        return this.#value
    }

    get tileElement(){
        return this.#tileElement
    }

    set x(value){
        this.#x = value
        this.#tileElement.style.setProperty('--x', this.#x)
    }

    set y(value){
        this.#y = value
        this.#tileElement.style.setProperty('--y', this.#y)
    }

    remove() {
        this.#tileElement.remove()
    }

    waitForTransition(animation = false) {
        return new Promise(resolve => {
        this.#tileElement.addEventListener(
            animation ? "animationend" : "transitionend",
            resolve,
            {
            once: true,
            }
        )
        })
    }

}