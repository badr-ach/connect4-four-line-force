import { Animator } from "../../scripts/animator.js";

export class GameChat extends HTMLElement {
    constructor({ app, gameId, playerOne, playerTwo, board, currPlayer, currColumns, lastPlayer, gameOver, winner }) {
        super();
        this.attachShadow({ mode: "open" });
        this._app = app;
        this._gameId = gameId;
        this._playerOne = playerOne;
        this._playerTwo = playerTwo;
        this._board = board;
        this._currPlayer = currPlayer;
        this._currColumns = currColumns;
        this._lastPlayer = lastPlayer;
        this._gameOver = gameOver;
        this._winner = winner;
        this._animator = new Animator();
        this._message = "";
        this._messageList = [];
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch("./js/components/gameChatComponent/gameChatComponent.html")
        .then((r) => r.text())
        .then((html) => html);
        this._messageInput = this.shadowRoot.querySelector(".message-input");
        this._messageList = this.shadowRoot.querySelector(".message-list");
        // this._messageSubmit = this.shadowRoot.querySelector(".message-submit");
        // this._messageSubmit.addEventListener("click", () => this._handleMessageSubmit());
    }

    _handleMessageSubmit() {
        this._message = this._messageInput.value;
        this._messageList.innerHTML += `<li class="message">${this._message}</li>`;
        this._messageInput.value = "";
    }
}

customElements.define("game-chat", GameChat);
