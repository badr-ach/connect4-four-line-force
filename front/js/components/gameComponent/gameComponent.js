import { Animator } from "../../scripts/animator.js";

export class Connect4 extends HTMLElement {
  constructor(app, playerRed, playerYellow) {
    super();
    this.attachShadow({ mode: "open" });

     this.shadowRoot.innerHTML = `
            <style>@import "./js/components/gameComponent/gameComponent.css"; </style>
            <h1 id="winner"></h1>
            <div id="wrapper">
            <table>
              <thead>
                <tr class="column-selector">
                    <td class="column"><span class="hidden arrow" column=0>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=1>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=2>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=3>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=4>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=5>&darr;</span></td>
                    <td class="column"><span class="hidden arrow" column=6>&darr;</span></td>
                </tr>
              </thead>
              <tbody id="board">
                <tr>
                  <td class="tile" row=0 column=0></td>
                  <td class="tile" row=0 column=1></td>
                  <td class="tile" row=0 column=2></td>
                  <td class="tile" row=0 column=3></td>
                  <td class="tile" row=0 column=4></td>
                  <td class="tile" row=0 column=5></td>
                  <td class="tile" row=0 column=6></td>
                </tr>
                <tr>
                  <td class="tile" row=1 column=0></td>
                  <td class="tile" row=1 column=1></td>
                  <td class="tile" row=1 column=2></td>
                  <td class="tile" row=1 column=3></td>
                  <td class="tile" row=1 column=4></td>
                  <td class="tile" row=1 column=5></td>
                  <td class="tile" row=1 column=6></td>
                </tr>
                <tr>
                  <td class="tile" row=2 column=0></td>
                  <td class="tile" row=2 column=1></td>
                  <td class="tile" row=2 column=2></td>
                  <td class="tile" row=2 column=3></td>
                  <td class="tile" row=2 column=4></td>
                  <td class="tile" row=2 column=5></td>
                  <td class="tile" row=2 column=6></td>
                </tr>
                <tr>
                  <td class="tile" row=3 column=0></td>
                  <td class="tile" row=3 column=1></td>
                  <td class="tile" row=3 column=2></td>
                  <td class="tile" row=3 column=3></td>
                  <td class="tile" row=3 column=4></td>
                  <td class="tile" row=3 column=5></td>
                  <td class="tile" row=3 column=6></td>
                </tr>
                <tr>
                  <td class="tile" row=4 column=0></td>
                  <td class="tile" row=4 column=1></td>
                  <td class="tile" row=4 column=2></td>
                  <td class="tile" row=4 column=3></td>
                  <td class="tile" row=4 column=4></td>
                  <td class="tile" row=4 column=5></td>
                  <td class="tile" row=4 column=6></td>
                </tr>
                <tr>
                  <td class="tile" row=5 column=0></td>
                  <td class="tile" row=5 column=1></td>
                  <td class="tile" row=5 column=2></td>
                  <td class="tile" row=5 column=3></td>
                  <td class="tile" row=5 column=4></td>
                  <td class="tile" row=5 column=5></td>
                  <td class="tile" row=5 column=6></td>
                </tr>
              </tbody>
            </table>
          </div>
         `;

    this._app = app;
    this._animator = new Animator();


    this.playerRed = playerRed;
    this.playerYellow = playerYellow;

    this.currPlayer = this.playerRed;

    this.gameOver = false;
    this.board = [];

    this.rows = 6;
    this.columns = 7;
    this.currColumns = []; //keeps track of which row each column is at.
  }

  async connectedCallback() {

    // this.shadowRoot.innerHTML = await fetch(
    //   "./js/components/gameComponent/gameComponent.html"
    // )
    //   .then((r) => r.text())
    //   .then((html) => html);

    for (let i = 0; i < this.rows; i++) {
      this.board.push([]);
      for (let j = 0; j < this.columns; j++) {
        this.board[i].push(null);
      }
    }

    for (let i = 0; i < this.columns; i++) {
      this.currColumns.push(this.rows - 1);
    }

    this.shadowRoot
      .querySelector("#board")
      .addEventListener("click", this.dropPiece.bind(this));
    let arrows = this.shadowRoot.querySelectorAll(".arrow")

    for( let i = 0 ; i < arrows.length ; i++){
      arrows[i].addEventListener("click", this.dropPiece.bind(this));
      arrows[i].addEventListener("mouseover", this._handleMouseHover.bind(this));
      arrows[i].addEventListener("mouseout", this._handleMouseOut.bind(this));
    }

    //this.createBoard();
  }

  _handleMouseHover(e) {
    if (this.gameOver) {
      return;
    }
    let column = e.target.getAttribute("column");
    let row = this.currColumns[column];
    
    if (row < 0) {
      return;
    }
    this.board[row][column] = this.currPlayer;
    this.renderBoard();
  }

  _handleMouseOut(e) {
    if (this.gameOver) {
      return;
    }
    let column = e.target.getAttribute("column");
    let row = this.currColumns[column];
    if (row < 0) {
      return;
    }
    this.board[row][column] = null;
    this.renderBoard();
  }

  // createBoard() {
  //   let columnSelector = document.createElement("div");
  //   columnSelector.classList.add("column-selector");
  //   for (let i = 0; i < this.columns; i++) {
  //     let column = document.createElement("div");
  //     let span = document.createElement("span");
  //     column.classList.add("column");
  //     span.setAttribute("column", i);
  //     span.classList.add("arrow");
  //     span.classList.add("hidden");
  //     span.innerHTML = "&darr;";
  //     column.appendChild(span);
  //     columnSelector.appendChild(column);
  //     span.addEventListener("click", this.dropPiece.bind(this));
  //     span.addEventListener("mouseover", this._handleMouseHover.bind(this));
  //     span.addEventListener("mouseout", this._handleMouseOut.bind(this));
  //   }
  //   this.shadowRoot.querySelector("#wrapper").prepend(columnSelector);

  //   for (let i = 0; i < this.rows; i++) {
  //     this.board.push([]);
  //     for (let j = 0; j < this.columns; j++) {
  //       this.board[i].push(null);
  //       let tile = document.createElement("div");
  //       tile.classList.add("tile");
  //       tile.setAttribute("row", i);
  //       tile.setAttribute("column", j);
  //       this.shadowRoot.querySelector("#board").appendChild(tile);
  //     }
  //   }

  //   for (let i = 0; i < this.columns; i++) {
  //     this.currColumns.push(this.rows - 1);
  //   }
  // }

  dropPiece(e) {
    if (this.gameOver) {
      return;
    }
    let column = e.target.getAttribute("column");
    if (column === null) {
      return;
    }
    let row = this.currColumns[column];
    if (row < 0) {
      return;
    }
    this.board[row][column] = this.currPlayer;
    this.currColumns[column]--;
    this.renderBoard();
    this.checkWin();
    this.changePlayer();
  }

  renderBoard() {
    let tiles = this.shadowRoot.querySelectorAll(".tile");
    console.log(this.board)
    for (let i = 0; i < tiles.length; i++) {
      let row = tiles[i].getAttribute("row");
      let column = tiles[i].getAttribute("column");
      if (this.board[row][column] === this.playerRed) {
        tiles[i].classList.add("red-piece");
      } else if (this.board[row][column] === this.playerYellow) {
        tiles[i].classList.add("yellow-piece");
      } else {
        tiles[i].classList.remove("red-piece");
        tiles[i].classList.remove("yellow-piece");
      }
    }
  }

  checkWin() {
    //check horizontal
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns - 3; j++) {
        if (
          this.board[i][j] !== null &&
          this.board[i][j] === this.board[i][j + 1] &&
          this.board[i][j] === this.board[i][j + 2] &&
          this.board[i][j] === this.board[i][j + 3]
        ) {
          this.gameOver = true;
          this.shadowRoot.querySelector("#winner").innerHTML =
            this.currPlayer + " wins!";
          return;
        }
      }
    }

    //check vertical
    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (
          this.board[i][j] !== null &&
          this.board[i][j] === this.board[i + 1][j] &&
          this.board[i][j] === this.board[i + 2][j] &&
          this.board[i][j] === this.board[i + 3][j]
        ) {
          this.gameOver = true;
          this.shadowRoot.querySelector("#winner").innerHTML =
            this.currPlayer + " wins!";
          return;
        }
      }
    }

    //check diagonal
    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 0; j < this.columns - 3; j++) {
        if (
          this.board[i][j] !== null &&
          this.board[i][j] === this.board[i + 1][j + 1] &&
          this.board[i][j] === this.board[i + 2][j + 2] &&
          this.board[i][j] === this.board[i + 3][j + 3]
        ) {
          this.gameOver = true;
          this.shadowRoot.querySelector("#winner").innerHTML =
            this.currPlayer + " wins!";
          return;
        }
      }
    }

    //check diagonal
    for (let i = 0; i < this.rows - 3; i++) {
      for (let j = 3; j < this.columns; j++) {
        if (
          this.board[i][j] !== null &&
          this.board[i][j] === this.board[i + 1][j - 1] &&
          this.board[i][j] === this.board[i + 2][j - 2] &&
          this.board[i][j] === this.board[i + 3][j - 3]
        ) {
          this.gameOver = true;
          this.shadowRoot.querySelector("#winner").innerHTML =
            this.currPlayer + " wins!";
          return;
        }
      }
    }

    //check tie
    let tie = true;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.columns; j++) {
        if (this.board[i][j] === null) {
          tie = false;
        }
      }
    }
    if (tie) {
      this.gameOver = true;
      this.shadowRoot.querySelector("#winner").innerHTML = "Tie!";
    }
  }

  changePlayer() {
    if (this.currPlayer === this.playerRed) {
      this.currPlayer = this.playerYellow;
    } else {
      this.currPlayer = this.playerRed;
    }
  }

  reset() {
    this.board = [];
    this.currColumns = [];
    this.gameOver = false;
    this.currPlayer = this.playerRed;
    this.shadowRoot.querySelector("#winner").innerHTML = "";
    this.shadowRoot.querySelector("#board").innerHTML = "";
    this.createBoard();
  }
}

customElements.define("connect-4", Connect4);
