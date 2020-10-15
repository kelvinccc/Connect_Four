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

    if (row >= _rows || row < 0) {
      console.log(`Row index out of bounds, must be between 1 - ${_rows}`);
      error = false;
    }

    if (col >= _cols || col < 0) {
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
    //console.log(_board[row][col]);
  };

  /*
    Grab a tile at row, col
    If row or col is out of bounds, returns null
  */
  const getTile = (row, col) => {
    return !_checkBounds(row, col) ? null : _board[row][col];
  };

  const checkLowestRow = (col) => {
    if (!_checkBounds(0, col)) {
      console.log("checkLowestRow() returning null");
      return null;
    }

    for (let i = _rows - 1; i >= 0; i--) {
      if (getTile(i, col) === 0) {
        //console.log(`lowest row ${i}`);
        return i;
      }
    }

    console.log(`rows filled completely`);
    return -1;
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

  const checkWinCondition = (row, col, player) => {
    return (
      _checkRow(row, col, player) ||
      _checkCol(row, col, player) ||
      _checkDiagonals(row, col, player)
    );
  };

  const _checkRow = (row, col, player) => {
    let totalCount = 1;

    //Once the first oppoosite player occurence happens, trigger these variables
    let leftTrigger = false;
    let rightTrigger = false;

    for (let count = 1; count <= 3; count++) {
      let tileLeft = getTile(row, col - count);
      let tileRight = getTile(row, col + count);

      if (tileLeft === null || tileLeft !== player) {
        //console.log("leftTrigger out of bounds - " + (row - count));
        leftTrigger = true;
      } else {
        //console.log(`${tileLeft} is ${player} - valid`);
        totalCount++;
      }

      if (tileRight === null || tileRight !== player) {
        //console.log("rTrigger out of bounds - " + (row + count));
        rightTrigger = true;
      } else {
        //console.log(`${tileRight} is ${player} - valid`);
        totalCount++;
      }

      //console.log(`current count ${totalCount}`);

      if (leftTrigger && rightTrigger) {
        break;
      }
    }

    return totalCount === 4;
  };

  const _checkCol = (row, col, player) => {
    let totalCount = 1;

    //Once the first oppoosite player occurence happens, trigger these variables
    let aboveTrigger = false;
    let belowTrigger = false;

    for (let count = 1; count <= 3; count++) {
      let tileAbove = getTile(row - count, col);
      let tileBelow = getTile(row + count, col);

      if (tileAbove === null || tileAbove !== player) {
        aboveTrigger = true;
      } else {
        totalCount++;
      }

      if (tileBelow === null || tileBelow !== player) {
        belowTrigger = true;
      } else {
        totalCount++;
      }

      if (aboveTrigger && belowTrigger) {
        break;
      }
    }

    return totalCount === 4;
  };

  const _checkDiagonals = (row, col, player) => {
    let totalCount = 1;

    //Once the first oppoosite player occurence happens, trigger these variables
    let lUpTrigger = false;
    let rDownTrigger = false;
    let lDownTrigger = false;
    let rUpTrigger = false;

    //Check LUp and RDown diagonals first
    for (let count = 1; count <= 3; count++) {
      let tileLUp = getTile(row - count, col - count);
      let tileRDown = getTile(row + count, col + count);

      if (tileLUp === null || tileLUp !== player) {
        lUpTrigger = true;
      } else {
        totalCount++;
      }

      if (tileRDown === null || tileRDown !== player) {
        rDownTrigger = true;
      } else {
        totalCount++;
      }

      if (lUpTrigger && rDownTrigger) {
        break;
      }
    }

    if (totalCount === 4) return true;

    totalCount = 1;

    //Check RUp LDown
    for (let count = 1; count <= 3; count++) {
      let tileRUp = getTile(row + count, col + count);
      let tileLDown = getTile(row - count, col - count);

      if (tileRUp === null || tileRUp !== player) {
        rUpTrigger = true;
      } else {
        totalCount++;
      }

      if (tileLDown === null || tileLDown !== player) {
        lDownTrigger = true;
      } else {
        totalCount++;
      }

      if (rUpTrigger && lDownTrigger) {
        break;
      }
    }
    return totalCount === 4;
  };

  return {
    createBoard,
    clearBoard,
    getTile,
    setTile,
    printBoardState,
    checkLowestRow,
    checkWinCondition
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
  const _rows = 6;
  const _cols = 7;
  gameBoard.createBoard(_rows, _cols);

  const _tileOnclick = (i) => {
    const row = Math.floor(i / _cols);
    const col = i % _cols;
    const tile = gameBoard.getTile(row, col);
    const lowestRow = gameBoard.checkLowestRow(col);
    const lrIndex = _cols * lowestRow + col;

    if (tile !== null && tile === 0 && lowestRow !== -1) {
      if (currentPlayer === 1) {
        tiles[lrIndex].src = "tile-blue.png";
        gameBoard.setTile(lowestRow, col, 1);
      } else {
        tiles[lrIndex].src = "tile-red.png";
        gameBoard.setTile(lowestRow, col, -1);
      }
      if (gameBoard.checkWinCondition) {
        console.log("win!");
      }
      currentPlayer *= -1;
    } else {
      console.log("tile filled already");
    }
  };

  const _initTileOnclick = () => {
    for (let i = 0; i < tiles.length; i++) {
      let tile = tiles[i];
      tiles[i].addEventListener("click", _tileOnclick.bind(tile, i));
    }
  };

  _initTileOnclick();
  const placePiece = (player, row, col) => {};
})();
