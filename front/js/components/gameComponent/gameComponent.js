import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";

export class Connect4 extends HTMLElement {
  constructor({
    app,
    gameId,
    playerOne,
    playerTwo,
    board,
    currPlayer,
    currColumns,
    gameOver,
    winner,
  }) {
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
    this._gameId = gameId;

    this.playerRed = playerOne;
    this.playerYellow = playerTwo;
    this.currPlayer = currPlayer;

    this.currColumns = currColumns;
    this.board = board;

    this.rows = 6;
    this.columns = 7;

    this.gameOver = gameOver;
    this.winner = null;

    this._socket = WebSocket.getSocketByNameSpace("/api/game");

    WebSocket.getSocketByNameSpace("/api/game").on("updatedBoard", (data) => {
      this.board = data.board;
      this.currColumns = data.currColumns;
      if (data.currPlayer !== this.currPlayer) {
        console.log("here");
        this.currPlayer = data.currPlayer;
        this.changePlayer();
      }
      if (data.gameOver) {
        this.gameOver = true;
        this.winner = data.winner;
      }

      this.renderBoard();
    });
  }

  async connectedCallback() {
    this.shadowRoot
      .querySelector("#board")
      .addEventListener("click", this.dropPiece.bind(this));
    let arrows = this.shadowRoot.querySelectorAll(".arrow");

    for (let i = 0; i < arrows.length; i++) {
      arrows[i].addEventListener("click", this.dropPiece.bind(this));
      arrows[i].addEventListener(
        "mouseover",
        this._handleMouseHover.bind(this)
      );
      arrows[i].addEventListener("mouseout", this._handleMouseOut.bind(this));
    }
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
    this.board[row][column] = 0;
    this.renderBoard();
  }

  dropPiece(e) {
    if (this.gameOver) {
      return;
    }

    if (this.currPlayer !== 1) {
      return;
    }

    let column = e.target.getAttribute("column");
    if (column === 0) {
      return;
    }
    let row = this.currColumns[column];
    if (row < 0) {
      return;
    }

    console.log(this.playerRed);

    WebSocket.getSocketByNameSpace("/api/game").emit("newMove", {
      gameId: this._gameId,
      move: [row, column],
      player: this.playerRed,
    });
  }

  renderBoard() {
    let tiles = this.shadowRoot.querySelectorAll(".tile");
    for (let i = 0; i < tiles.length; i++) {
      let row = tiles[i].getAttribute("row");
      let column = tiles[i].getAttribute("column");
      if (this.board[row][column] === 1) {
        tiles[i].classList.add("red-piece");
      } else if (this.board[row][column] === 2) {
        tiles[i].classList.add("yellow-piece");
      } else {
        tiles[i].classList.remove("red-piece");
        tiles[i].classList.remove("yellow-piece");
      }
    }

    if (this.winner !== null) {
      let winner_name = this.winner === 1 ? "Red" : "Yellow";
      this.shadowRoot.querySelector("#winner").innerHTML =
        this.winner == "Tie" ? "Tie!" : winner_name + " wins!";
    }
  }

  changePlayer() {
    if (this.currPlayer === 1) {
      this.currPlayer = 2;
    } else {
      this.currPlayer = 1;
    }
  }

  reset() {
    this.board = [];
    this.currColumns = [];
    this.gameOver = false;
    this.currPlayer = 1;
    this.shadowRoot.querySelector("#winner").innerHTML = "";
    this.shadowRoot.querySelector("#board").innerHTML = "";
    this.createBoard();
  }
}

customElements.define("connect-4", Connect4);
