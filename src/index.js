import "./styles.css";

document.getElementById("start-button").addEventListener("click", () => {
  console.log("clicked");
  transitionSequence();
});

function transitionSequence() {
  fadeOut();
  setTimeout(() => gameStart(), 1000);
}

function gameStart() {
  console.log("assets loaded");
  let mainContainer = document.getElementById("main-container");
  let startContainer = document.getElementById("start-container");
  let title = document.getElementById("title");
  document.getElementById("start-button").style.display = "none";
  startContainer.style.display = "block";
  startContainer.style.height = "auto";
  title.style.margin = "40px auto 30px auto";
  mainContainer.style.display = "flex";
  fadeIn();
}

function fadeOut() {
  console.log("fading-in");
  let transition = document.getElementById("transition");
  transition.style.zIndex = 1;
  transition.style.opacity = 1;
  return;
}

function fadeIn() {
  console.log("fading-out");
  let transition = document.getElementById("transition");
  transition.style.opacity = 0;
  setTimeout(() => {
    transition.style.zIndex = -1;
  }, 2000);
}

/*
  returns a new player object

*/
function playerFactory() {}

/*
  Represents the game board, includes functions that:
    Creates a new game board
    Clears a game board
    access a specific tile
    Modify a specific tile
    Print the current board
*/
const gameBoard = (() => {
  let _board; // undefined = board not yet created
  let _rows;
  let _cols;

  //Checks to see if board is already created;
  //returns true if board has been created
  const _checkBoardCreated = () => {
    return typeof _board !== "undefined";
  };

  //Check bounds of board, return true if pass false if fail
  const _checkBounds = (row, col) => {
    let error = true;

    if (row > _rows || row < 0) {
      console.log(`Row index out of bounds, must be between 1 - ${_rows}`);
      error = false;
    }

    if (col > _cols || col < 0) {
      console.log(`Column index out of bounds, must be between 1 - ${_cols}`);
      error = false;
    }

    return error;
  };

  // Takes dimensions and returns a gameboard object
  const createBoard = (rows, cols) => {
    if (_checkBoardCreated()) {
      // provide some informative message
      console.log("board already created!");
    } else {
      _rows = rows;
      _cols = cols;

      _board = new Array(rows);
      for (let i = 0; i < rows; i++) {
        _board[i] = new Array(cols);
        for (let col = 0; col < cols; col++) {
          _board[i][col] = 0;
        }
      }

      console.log(`Board of ${rows} x ${cols} created`);
    }
  };

  const clearBoard = () => {
    _board = undefined;
    createBoard(_rows, _cols);
  };

  /*
  Set a tile at row, col
  If row col is out of bounds, returns null
  val should be -1, 0, or 1
*/
  const setTile = (row, col, val) => {
    if (!_checkBounds(row, col)) {
      console.log("setTile() returning null");
      return null;
    }

    console.log(`${val} tile set at ${row}, ${col}`);
    _board[row][col] = val;
    console.log(_board[row][col]);
  };

  /*
    Grab a tile at row, col
    If row or col is out of bounds, returns null
  */
  const getTile = (row, col) => {
    return !_checkBounds(row, col) ? null : _board[row][col];
  };

  /*
  Prints the current state of the board.
    Note: if !boardCreated then returns informative message
  */
  const printBoardState = () => {
    if (_checkBoardCreated()) {
      let boardString = "";
      for (let row = 0; row < _rows; row++) {
        boardString += "| ";
        for (let col = 0; col < _cols; col++) {
          boardString += _board[row][col] + " ";
        }
        boardString += "|\n";
      }
      return boardString;
    } else {
      console.log("Board not yet created, can't print state");
    }
  };

  return {
    createBoard,
    clearBoard,
    getTile,
    setTile,
    printBoardState
  };
})();

/*
//Test for double create board:
gameBoard.createBoard(6, 7);
gameBoard.createBoard(5,6);
*/

/*
//Print board state test:
console.log(gameBoard.printBoardState());
gameBoard.createBoard(3, 3);
console.log(gameBoard.printBoardState());
*/

const gameController = (() => {
  let tiles = document.querySelectorAll(".slot");
  let currentPlayer = -1;
  gameBoard.createBoard(6, 7);
  const _rows = 6;
  const _cols = 7;

  const tileOnclick = (i) => {
    console.log(i);
    const row = Math.floor(i / _cols);
    const col = i % _cols;
    const tile = gameBoard.getTile(row, col);
    if (tile !== null && tile === 0) {
      //console.log("tile fill");
      if (currentPlayer === 1) {
        tiles[i].src = "tile-blue.png";
        gameBoard.setTile(row, col, 1);
      } else {
        tiles[i].src = "tile-red.png";
        gameBoard.setTile(row, col, -1);
      }
    } else {
      console.log("tile filled already");
    }
  };

  const initTileOnclick = () => {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      tiles[i].addEventListener("click", tileOnclick.bind(tile, i));
    }
  };

  const placePiece = (player, row, col) => {};
  return { initTileOnclick };
})();

gameController.initTileOnclick();
