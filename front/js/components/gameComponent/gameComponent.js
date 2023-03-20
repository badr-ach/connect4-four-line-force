import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import {events} from "../../events/events.js";

export class Connect4 extends HTMLElement {
  constructor({
    app,
    gameId,
    roomId,
    playerOne,
    playerTwo,
    board,
    currPlayer,
    currColumns,
    lastPlayer,
    gameOver,
    winner,
  }) {
    super();
    this.attachShadow({ mode: "open" });

    this.shadowRoot.innerHTML = `
            <style>@import "./js/components/gameComponent/gameComponent.css"; </style>
            <h1 id="winner"></h1>
            <div id="wrapper">
              <button id="home-btn"> Home </button>
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
            <button id="save-btn"> SAVE THE GAME STATE </button>
          </div>
         `;

    this._app = app;
    this._animator = new Animator();
    this._gameId = gameId;

    
    this.roomId = roomId;
    this.playerRed = playerOne;
    this.playerYellow = playerTwo;
    this.currPlayer = currPlayer;

    this.currColumns = currColumns;
    this.board = board;

    this.rows = 6;
    this.columns = 7;
    
    this._lastPlayer = lastPlayer;
    this.gameOver = gameOver;
    this.winner = winner;
  }



  async connectedCallback() {
    this._setUpSocket();
    this._attachEventListeners();
    this.renderBoard();
  }


  _attachEventListeners() {
    this.shadowRoot.querySelector("#board").addEventListener("click", this.dropPiece.bind(this));
    let arrows = this.shadowRoot.querySelectorAll(".arrow");

    for (let i = 0; i < arrows.length; i++) {
      arrows[i].addEventListener("click", this.dropPiece.bind(this));
      arrows[i].addEventListener(
        "mouseover",
        this._handleMouseHover.bind(this)
      );
      arrows[i].addEventListener("mouseout", this._handleMouseOut.bind(this));
    }

    this.shadowRoot.querySelector("#save-btn").addEventListener("click", this._handleSaveGame.bind(this));
    this.shadowRoot.querySelector("#home-btn").addEventListener("click", this._handleHome.bind(this));
  }

  _setUpSocket(){
    this._socket = WebSocket.getSocketByNameSpace("/api/game");
    
    this._socket.on("updatedBoard", (data) => {
      this.board = data.board;
      this.currColumns = data.currColumns;
      this.currPlayer = data.currPlayer;
      if (data.gameOver) {
        this.gameOver = true;
        this.winner = data.winner;
      }
      this.renderBoard();
    });

    this._socket.on("game-error", (data) => {
      alert(data.message);
    });
  }

  _handleHome(){
    this._app.dispatchEvent(new CustomEvent(events.userLoaded));
  }

  _handleSaveGame(){
    this._socket.emit("saveGame", { gameId: this._gameId });
    this._socket.on("savedGame", (data) => {
      alert(data.message);
    });
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
    this.board[row][column] = this._app.player === this.playerRed ? 1 : 2;
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

    console.log("currPlayer: " + this.currPlayer);
    console.log("app.player: " + this._app.player);

    if (this.currPlayer !== this._app.player) {
      return;
    }

    if(e.target.getAttribute("column") === null ||
      e.target.getAttribute("row") === null ||
      e.target.tagName !== "TD")
      return;

    let column = e.target.getAttribute("column");
    if (column === 0) {
      return;
    }
    let row = this.currColumns[column];
    if (row < 0) {
      return;
    }

    WebSocket.getSocketByNameSpace("/api/game").emit("newMove", {
      gameId: this._gameId,
      roomId: this.roomId,
      move: [row, column],
      player: this._app.player,
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
      this.shadowRoot.querySelector("#winner").innerHTML =
        this.winner == "Tie" ? "Tie!" : this.winner + " wins!";
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
