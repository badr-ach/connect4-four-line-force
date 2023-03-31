import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import {events} from "../../events/events.js";
import {fetcher} from "../../utils/requester.js";

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
    this.api = fetcher();

  }



  async connectedCallback() {
    this.shadowRoot.innerHTML = await fetch("./js/components/gameComponent/gameComponent.html")
        .then((r) => r.text())
        .then((html) => html);
    this._setUpSocket();
    this._showGameTurn();
    this._attachEventListeners();
    this.renderBoard();
  }

  async disconnectedCallback(){
    this._socket.emit("disconnect game");
  }

  _showGameTurn() {
    console.log("curr player", this.currPlayer, this.playerRed ,this.playerYellow)
    this.shadowRoot.getElementById("turn").innerText = this.currPlayer;
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

    this.shadowRoot.querySelector("#mute-btn").addEventListener("click", this._handleMute.bind(this));
    this.shadowRoot.querySelectorAll(".chat-input").forEach( (e) => e.addEventListener("click", this._handleChat.bind(this)));
    this.shadowRoot.querySelector("#save-btn").addEventListener("click", this._handleSaveGame.bind(this));
  }

  _handleMute(e){
    let muteBtn = this.shadowRoot.querySelector("#mute-btn");
    if (muteBtn.innerHTML === "Mute") {
      muteBtn.innerHTML = "Unmute";
      this._socket.emit("mute", {player: this._app.player, gameId: this._gameId});
    } else {
      muteBtn.innerHTML = "Mute";
      this._socket.emit("unmute", {player: this._app.player, gameId: this._gameId});
    }
  }

  _handleChat(e){
    let message = e.target.innerHTML;
    this._socket.emit("new message", {message: message, player: this._app.player, roomId: this.roomId, gameId: this._gameId});
    let div = this.shadowRoot.ownerDocument.createElement("div");

    div.classList.add("bubble", "bubble-bottom-left");
    let messageSpan = document.createElement("h2");
    messageSpan.innerHTML =  message;
    div.appendChild(messageSpan);
    console.log(div);
    this.shadowRoot.appendChild(div);
    setTimeout(() => {
      this.shadowRoot.removeChild(div);
    }, 2000);
  }

  _setUpSocket(){
    this._socket = WebSocket.getSocketByNameSpace("/api/game");

    this._socket.on("updatedBoard", (data) => {
      this.board = data.board;
      this.currColumns = data.currColumns;
      this.currPlayer = data.currPlayer;
      let turn = this.shadowRoot.getElementById("turn");
      turn.innerText = this.currPlayer;
      if (data.gameOver) {
        this.gameOver = true;
        this.winner = data.winner;
      }
      this.renderBoard();
    });

    this._socket.on("game-error", (data) => {
      this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
        title: "Error",
        message: data,
        accept: () => {},
        decline: () => {},
        temporary: true
      } }));
    });

    this._socket.on("new message", (data) => {
      let div = this.shadowRoot.ownerDocument.createElement("div");

      div.classList.add("bubble1", "bubble-bottom-left1");
      let messageSpan = document.createElement("h2");
      messageSpan.innerHTML = "From "+ data.player + " : " + data.message;
      div.appendChild(messageSpan);
      console.log(div);
      this.shadowRoot.appendChild(div);
      setTimeout(() => {
        this.shadowRoot.removeChild(div);
      }, 2000);
    });
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
