import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";

export class GameChat extends HTMLElement {
    constructor( app, username) {
        super();
        this.attachShadow({ mode: "open" });
        this._app = app;
        this.username = username;
        this._animator = new Animator();
        this._message = "";
        this._messageList = [];
        this._chat_socket = WebSocket.getSocketByNameSpace("/api/chat",{ auth: { token: this._app.token ? 
            this._app.token : "guest" } });

        this._chat_socket.on("private message", (data) => {
            console.log("got private message");
            this._messageList.innerHTML += `<li class="message">${data.from} : ${data.content}</li>`;
        });

    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch("./js/components/gameChatComponent/gameChatComponent.html")
        .then((r) => r.text())
        .then((html) => html);
        this._messageInput = this.shadowRoot.querySelector("#message-input");
        this._messageList = this.shadowRoot.querySelector("#message-list");
        this._messageSubmit = this.shadowRoot.querySelector("#submit-btn");
        this._messageSubmit.addEventListener("click", () => this._handleMessageSubmit());
    }

    _handleMessageSubmit() {
        
        this._message = this._messageInput.value;
        this._messageList.innerHTML += `<li class="message">${this._app.user.username} : ${this._message}</li>`;
        this._messageInput.value = "";

        this._chat_socket.emit("private message", { content: this._message, to: this.username });
    }
}

customElements.define("game-chat", GameChat);
