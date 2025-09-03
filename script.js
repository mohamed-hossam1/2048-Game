'use strict';

const TILE = 148.75;
const GAP = 21;
const OFFSET = 21;
const MOVE_DURATION = 200;

const gameBox = document.querySelector('.game-box');

const numbers = [
  { value: 2, bg: '#c5b3fbff', text: '#333333', size: '80px' },
  { value: 4, bg: '#b69ef4ff', text: '#333333', size: '80px' },
  { value: 8, bg: '#b490f8ff', text: '#333333', size: '80px' },
  { value: 16, bg: '#9f7aea', text: '#333333', size: '70px' },
  { value: 32, bg: '#805ad5', text: '#333333', size: '70px' },
  { value: 64, bg: '#6b46c1', text: '#ffffff', size: '70px' },
  { value: 128, bg: '#553c9a', text: '#ffffff', size: '60px' },
  { value: 256, bg: '#44337a', text: '#ffffff', size: '60px' },
  { value: 512, bg: '#322659', text: '#ffffff', size: '60px' },
  { value: 1024, bg: '#1a202c', text: '#fbbf24', size: '50px' },
  { value: 2048, bg: '#000000', text: '#fbbf24', size: '50px' }
];

let board = [ [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0] ];

const moveQueue = [];
let isProcessing = false;

function processMoveQueue() {
    if (isProcessing || moveQueue.length === 0) {
        return;
    }
    isProcessing = true;
    
    const move = moveQueue.shift();
    
    const onMoveEnd = () => {
        isProcessing = false;
        processMoveQueue();
    };
    
    if (move === 'ArrowRight') moveRight(onMoveEnd);
    else if (move === 'ArrowLeft') moveLeft(onMoveEnd);
    else if (move === 'ArrowUp') moveUp(onMoveEnd);
    else if (move === 'ArrowDown') moveDown(onMoveEnd);
}

const translate = (i, j) => {
  const x = OFFSET + (TILE + GAP) * j;
  const y = OFFSET + (TILE + GAP) * i;
  return [x, y];
};

const getObjByValue = (value) => numbers[Math.log2(value) - 1];

const createTile = (i, j, value)=> {
  const el = document.createElement('div');
  el.classList.add('new_card');
  el.textContent = String(value);

  const numObj = getObjByValue(value);
  el.style.background = numObj.bg;
  el.style.color = numObj.text;
  el.style.fontSize = numObj.size;

  const [x, y] = translate(i, j);
  el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(0)`;
  
  gameBox.appendChild(el);
  
  board[i][j] = el;
  
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`;
    });
  });

  return el;
}

const appendCard = () => {
  let emptyCells = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!board[r][c]) {
        emptyCells.push({ r, c });
      }
    }
  }

  if (emptyCells.length === 0) {
    return;
  }

  const { r: i, c: j } = emptyCells[Math.floor(Math.random() * emptyCells.length)];
  const value = 2**(Math.floor(Math.random() * 2) + 1);
  createTile(i, j, value);
};

function hasPossibleMoves() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (!board[r][c]) {
        return true;
      }
    }
  }

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const currentValue = board[r][c] ? parseInt(board[r][c].textContent) : null;
      if (currentValue) {
        if (c < 3 && board[r][c+1] && parseInt(board[r][c+1].textContent) === currentValue) {
          return true;
        }
        if (r < 3 && board[r+1][c] && parseInt(board[r+1][c].textContent) === currentValue) {
          return true;
        }
      }
    }
  }
  return false;
}

function checkGameOver() {
  if (!hasPossibleMoves()) {
    alert("Game Over!");
    location.reload()
    document.removeEventListener('keydown', handleKeyDown);
  }
}

function moveRight(onEnd) {
  let moves = [];
  let moved = false; 

  for (let row = 0; row < 4; row++) {
    let blocks = []
    for (let col = 3; col >= 0; col--) {
      if(board[row][col]){
        blocks.push({el: board[row][col], row: row, col: col})
      }
    }
    let k = 0
    let pointer = 3
    while (k < blocks.length){
      if(k+1 < blocks.length && blocks[k].el.textContent === blocks[k+1].el.textContent){
        let newCol = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: row, ecol: newCol, new: true})
        moves.push({el: blocks[k+1].el, srow: blocks[k+1].row, scol: blocks[k+1].col, erow: row, ecol: newCol, delete: true})
        if(blocks[k].col !== newCol || blocks[k+1].col !== newCol) moved = true
        k++
      } else {
        let newCol = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: row, ecol: newCol})
        if(blocks[k].col !== newCol) moved = true
      }
      pointer--
      k++
    }
  }

  if(moves.length === 0) {
    checkGameOver();
    if (onEnd) onEnd();
    return;
  }

  let newBoard = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ];

  moves.forEach(move => {
    let [x, y] = translate(move.erow, move.ecol)
    move.el.style.transition = `transform ${MOVE_DURATION}ms ease`
    move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
  })

  setTimeout(()=>{
    moves.forEach(move=>{
      move.el.style.transition = ''
      if(move.delete){
        if (move.el.parentNode) gameBox.removeChild(move.el);
      }else{
        if(move.new){
          let newValue = parseInt(move.el.textContent) * 2;
          move.el.textContent = String(newValue);
          const numObj = getObjByValue(newValue);
          move.el.style.background = numObj.bg;
          move.el.style.color = numObj.text;
          move.el.style.fontSize = numObj.size;
          move.el.style.transform += ' scale(1.2)'
          setTimeout(()=>{
            let [x, y] = translate(move.erow, move.ecol)
            move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
          },100)
        }
        newBoard[move.erow][move.ecol] = move.el
      }
    })
    board = newBoard;
    if(moved) appendCard(); 
    checkGameOver();
    if (onEnd) onEnd();
  }, MOVE_DURATION);
}

function moveLeft(onEnd) {
  let moves = [];
  let moved = false; 
  for (let row = 0; row < 4; row++) {
    let blocks = []
    for (let col = 0; col < 4; col++) {
      if(board[row][col]){
        blocks.push({el: board[row][col], row: row, col: col})
      }
    }
    let k = 0
    let pointer = 0
    while (k < blocks.length){
      if(k+1 < blocks.length && blocks[k].el.textContent === blocks[k+1].el.textContent){
        let newCol = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: row, ecol: newCol, new: true})
        moves.push({el: blocks[k+1].el, srow: blocks[k+1].row, scol: blocks[k+1].col, erow: row, ecol: newCol, delete: true})
        if(blocks[k].col !== newCol || blocks[k+1].col !== newCol) moved = true
        k++
      } else {
        let newCol = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: row, ecol: newCol})
        if(blocks[k].col !== newCol) moved = true
      }
      pointer++
      k++
    }
  }
  if(moves.length === 0) {
    checkGameOver();
    if (onEnd) onEnd();
    return;
  }
  let newBoard = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ];
  moves.forEach(move => {
    let [x, y] = translate(move.erow, move.ecol)
    move.el.style.transition = `transform ${MOVE_DURATION}ms ease`
    move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
  })
  setTimeout(()=>{
    moves.forEach(move=>{
      move.el.style.transition = ''
      if(move.delete){
        if (move.el.parentNode) gameBox.removeChild(move.el)
      }else{
        if(move.new){
          let newValue = parseInt(move.el.textContent) * 2;
          move.el.textContent = String(newValue);
          const numObj = getObjByValue(newValue);
          move.el.style.background = numObj.bg;
          move.el.style.color = numObj.text;
          move.el.style.fontSize = numObj.size;
          move.el.style.transform += ' scale(1.2)'
          setTimeout(()=>{
            let [x, y] = translate(move.erow, move.ecol)
            move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
          },100)
        }
        newBoard[move.erow][move.ecol] = move.el
      }
    })
    board = newBoard;
    if(moved) appendCard(); 
    checkGameOver();
    if (onEnd) onEnd();
  }, MOVE_DURATION);
}

function moveUp(onEnd) {
  let moves = [];
  let moved = false; 
  for (let col = 0; col < 4; col++) {
    let blocks = []
    for (let row = 0; row < 4; row++) {
      if(board[row][col]){
        blocks.push({el: board[row][col], row: row, col: col})
      }
    }
    let k = 0
    let pointer = 0
    while (k < blocks.length){
      if(k+1 < blocks.length && blocks[k].el.textContent === blocks[k+1].el.textContent){
        let newRow = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: newRow, ecol: col, new: true})
        moves.push({el: blocks[k+1].el, srow: blocks[k+1].row, scol: blocks[k+1].col, erow: newRow, ecol: col, delete: true})
        if(blocks[k].row !== newRow || blocks[k+1].row !== newRow) moved = true
        k++
      } else {
        let newRow = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: newRow, ecol: col})
        if(blocks[k].row !== newRow) moved = true
      }
      pointer++
      k++
    }
  }
  if(moves.length === 0) {
    checkGameOver();
    if (onEnd) onEnd();
    return;
  }
  let newBoard = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ];
  moves.forEach(move => {
    let [x, y] = translate(move.erow, move.ecol)
    move.el.style.transition = `transform ${MOVE_DURATION}ms ease`
    move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
  })
  setTimeout(()=>{
    moves.forEach(move=>{
      move.el.style.transition = ''
      if(move.delete){
        if (move.el.parentNode) gameBox.removeChild(move.el)
      }else{
        if(move.new){
          let newValue = parseInt(move.el.textContent) * 2;
          move.el.textContent = String(newValue);
          const numObj = getObjByValue(newValue);
          move.el.style.background = numObj.bg;
          move.el.style.color = numObj.text;
          move.el.style.fontSize = numObj.size;
          move.el.style.transform += ' scale(1.2)'
          setTimeout(()=>{
            let [x, y] = translate(move.erow, move.ecol)
            move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
          },100)
        }
        newBoard[move.erow][move.ecol] = move.el
      }
    })
    board = newBoard;
    if(moved) appendCard(); 
    checkGameOver();
    if (onEnd) onEnd();
  }, MOVE_DURATION);
}

function moveDown(onEnd) {
  let moves = [];
  let moved = false; 
  for (let col = 0; col < 4; col++) {
    let blocks = []
    for (let row = 3; row >= 0; row--) {
      if(board[row][col]){
        blocks.push({el: board[row][col], row: row, col: col})
      }
    }
    let k = 0
    let pointer = 3
    while (k < blocks.length){
      if(k+1 < blocks.length && blocks[k].el.textContent === blocks[k+1].el.textContent){
        let newRow = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: newRow, ecol: col, new: true})
        moves.push({el: blocks[k+1].el, srow: blocks[k+1].row, scol: blocks[k+1].col, erow: newRow, ecol: col, delete: true})
        if(blocks[k].row !== newRow || blocks[k+1].row !== newRow) moved = true
        k++
      } else {
        let newRow = pointer
        moves.push({el: blocks[k].el, srow: blocks[k].row, scol: blocks[k].col, erow: newRow, ecol: col})
        if(blocks[k].row !== newRow) moved = true
      }
      pointer--
      k++
    }
  }
  if(moves.length === 0) {
    checkGameOver();
    if (onEnd) onEnd();
    return;
  }
  let newBoard = [ [0,0,0,0], [0,0,0,0], [0,0,0,0], [0,0,0,0] ];
  moves.forEach(move => {
    let [x, y] = translate(move.erow, move.ecol)
    move.el.style.transition = `transform ${MOVE_DURATION}ms ease`
    move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
  })
  setTimeout(()=>{
    moves.forEach(move=>{
      move.el.style.transition = ''
      if(move.delete){
        if (move.el.parentNode) gameBox.removeChild(move.el)
      }else{
        if(move.new){
          let newValue = parseInt(move.el.textContent) * 2;
          move.el.textContent = String(newValue);
          const numObj = getObjByValue(newValue);
          move.el.style.background = numObj.bg;
          move.el.style.color = numObj.text;
          move.el.style.fontSize = numObj.size;
          move.el.style.transform += ' scale(1.2)'
          setTimeout(()=>{
            let [x, y] = translate(move.erow, move.ecol)
            move.el.style.transform = `translate3d(${x}px, ${y}px, 0) scale(1)`
          },100)
        }
        newBoard[move.erow][move.ecol] = move.el
      }
    })
    board = newBoard;
    if(moved) appendCard(); 
    checkGameOver();
    if (onEnd) onEnd();
  }, MOVE_DURATION);
}

appendCard();
appendCard();
checkGameOver();

function handleKeyDown(e) {
  if (['ArrowRight', 'ArrowLeft', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      e.preventDefault();
      moveQueue.push(e.key);
      processMoveQueue();
  }
}

document.addEventListener('keydown', handleKeyDown);