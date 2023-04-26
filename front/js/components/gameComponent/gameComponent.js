import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import {events} from "../../events/events.js";
import {fetcher} from "../../utils/requester.js";
import {LoggedIntroMenu} from "../loggedInMenuComponent/loggedInMenuComponent.js";

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
    if(this.playerRed !== "AI" && this.playerYellow !== "AI") {
      this.shadowRoot.removeChild(this.shadowRoot.querySelector("#save-btn"));

    }
    if(this.playerRed === "AI" || this.playerYellow === "AI") {
      let turn = this.shadowRoot.querySelector(".turn");
      this.shadowRoot.removeChild(turn);
    }
    this.switchTurn();

    this._setUpSocket();
    this._handleChatBox()
    this._attachEventListeners();
    this.renderBoard();
  }

  async disconnectedCallback(){
    this._socket.emit("disconnect game", {gameId : this._gameId, roomId : this.roomId});
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
    if(this.playerRed !== "AI" && this.playerYellow !== "AI") {
      this.shadowRoot.querySelector("#mute-btn").addEventListener("click", this._handleMute.bind(this));
      this.shadowRoot.querySelectorAll(".chat-input").forEach((e) => e.addEventListener("click", this._handleChat.bind(this)));
    }

    if(this.playerRed === "AI" || this.playerYellow === "AI") {
      this.shadowRoot.querySelector("#save-btn").addEventListener("click", this._handleSaveGame.bind(this));

    }
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
  _handleChatBox(){
    if(this.playerRed !== "AI" && this.playerYellow !== "AI") {
      const chatBox = this.shadowRoot.ownerDocument.createElement("div");
      chatBox.id = "chat";
      chatBox.classList.add("chat-box");

      const chatMessages = this.shadowRoot.ownerDocument.createElement("div");
      chatMessages.classList.add("chat-messages");

      const chatButtons = this.shadowRoot.ownerDocument.createElement("div");
      chatButtons.id = "chat-messages";
      chatButtons.classList.add("chat-buttons");
      const button1 = this.shadowRoot.ownerDocument.createElement("button");
      button1.classList.add("chat-input");
      button1.textContent = "Nice move!";

      const button2 = this.shadowRoot.ownerDocument.createElement("button");
      button2.classList.add("chat-input");
      button2.textContent = "You're a beast!";

      const button3 = this.shadowRoot.ownerDocument.createElement("button");
      button3.classList.add("chat-input");
      button3.textContent = "Well played!";

      const button4 = this.shadowRoot.ownerDocument.createElement("button");
      button4.classList.add("chat-input");
      button4.textContent = "Good game!";

      chatButtons.appendChild(button1);
      chatButtons.appendChild(button2);
      chatButtons.appendChild(button3);
      chatButtons.appendChild(button4);

      const muteButton = this.shadowRoot.ownerDocument.createElement("button");
      muteButton.id = "mute-btn";
      muteButton.classList.add("mute-icon");
      muteButton.textContent = "Mute";

      chatBox.appendChild(chatMessages);
      chatBox.appendChild(chatButtons);
      chatBox.appendChild(muteButton);

      this.shadowRoot.appendChild(chatBox);
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

        this.switchTurn();
        if (data.gameOver) {
          this.gameOver = true;
          this.winner = data.winner;
        }

        this.renderBoard();
        setTimeout(() =>{
          new Audio("../../../audio/piece_down.wav").play();
        }, 500);
    });



    this._socket.once("game-error", (data) => {
      this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
        title: "Error",
        content: data.message,
        accept: () => {},
        decline: () => {},
        temporary: true
      } }));
      for(let i = 0; i < this._app.children.length; i++){
        if(this._app.children[i].id === "side-bar") continue;
        this._app.removeChild(this._app.children[i]);
      }
      this._app.appendChild(new LoggedIntroMenu(this._app));
    });

    this._socket.on("new message", (data) => {
      let div = this.shadowRoot.ownerDocument.createElement("div");

      div.classList.add("bubble1", "bubble-bottom-left1");
      let messageSpan = document.createElement("h2");
      messageSpan.innerHTML = "From "+ data.player + " : " + data.message;
      div.appendChild(messageSpan);
      this.shadowRoot.appendChild(div);
      setTimeout(() => {
        this.shadowRoot.removeChild(div);
      }, 2000);
    });
  }



  switchTurn(){
    if(this.playerRed !== "AI" && this.playerYellow !== "AI") {
      let turn = this.shadowRoot.querySelector(".turn");
      let turnText = this.shadowRoot.querySelector(".turn-text");
      turn.removeChild(turn.childNodes[2]);
      if (this.currPlayer === this.playerRed) {
        let span = this.shadowRoot.ownerDocument.createElement("span");
        turnText.innerHTML = this.currPlayer ;
        span.classList.add("redCircle");
        turn.appendChild(span);
      } else if(this.currPlayer === this.playerYellow){
        let span1 = this.shadowRoot.ownerDocument.createElement("span");
        turnText.innerHTML = this.currPlayer ;
        span1.classList.add("yellowCircle");
        turn.appendChild(span1);
      }
    }
  }

  _handleSaveGame(){
    this._socket.emit("saveGame", { gameId: this._gameId });
    this._socket.once("savedGame", (data) => {
      this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
        title: "Notification",
        content: data.message,
        accept: () => {},
        decline: () => {},
        temporary: true
      } }));
    });


      for(let node of this._app.children){
        if(node.id === "side-bar") continue;
        this._app.removeChild(node);
      }
      this._app.appendChild(new LoggedIntroMenu(this._app));

      /*this._app.dispatch(new CustomEvent(events.popUp, {
        detail: {
          title: "",
          content: "This game has been saved",
          temporary: true,
          accept: () => {},
          decline: () => {}
      }}));*/



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
      navigator.vibrate(500)
      return;
    }

    if (this.currPlayer !== this._app.player) {
      navigator.vibrate(500)
      return;
    }

    if(e.target.getAttribute("column") === null ||
      e.target.getAttribute("row") === null ||
      e.target.tagName !== "TD"){
      navigator.vibrate(500)
      return;
    }

    let column = e.target.getAttribute("column");
    if (column === 0) {
      navigator.vibrate(500)
      return;
    }
    let row = this.currColumns[column];
    if (row < 0) {
      navigator.vibrate(500)
      return;
    }

    WebSocket.getSocketByNameSpace("/api/game").emit("newMove", {
      gameId: this._gameId,
      roomId: this.roomId,
      move: [row, column],
      player: this._app.player,
    });

    new Audio("../../../audio/piece_down.wav").play();
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
        this.winner === "Tie" ? "Tie!" : this.winner + " wins!";
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
