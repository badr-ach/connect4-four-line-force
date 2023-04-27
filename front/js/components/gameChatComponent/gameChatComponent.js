import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";

export class GameChat extends HTMLElement {
    constructor( app, username, messages, pushMessageToState) {
        super();
        this.attachShadow({ mode: "open" });
        this._app = app;
        this.username = username;
        this._animator = new Animator();
        this._message = "";
        this._messageList = messages;
        this._pushMessageToState = pushMessageToState;
        this._chat_socket =  WebSocket.getSocketByNameSpace("/api/chat",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        this._chat_socket.on("private message", (data) => {
            let messageList = this.shadowRoot.querySelector("#message-list");
            messageList.innerHTML += `<li class="message">${data.from} : ${data.content}</li>`;
        });
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch("./js/components/gameChatComponent/gameChatComponent.html")
        .then((r) => r.text())
        .then((html) => html);
        this._messageInput = this.shadowRoot.querySelector("#message-input");
        this._chatHistory = this.shadowRoot.querySelector("#chat-history");
        this._messageInput.addEventListener("keyup", (e) => {
            if(e.keyCode === 13) {
                this._handleMessageSubmit();
            }
        });
        let messageList = this.shadowRoot.querySelector("#message-list");
        for(let i = 0; i < this._messageList.length; i++) {
            messageList.innerHTML += `<li class="message">${this._messageList[i][0]} : ${this._messageList[i][1]}</li>`;
        }
        this._messageSubmit = this.shadowRoot.querySelector("#submit-btn");
        this._closeBtn = this.shadowRoot.querySelector(".close-button");
        this._closeBtn.addEventListener("click", () => this._handleCloseBtnClick());
        this._messageSubmit.addEventListener("click", () => this._handleMessageSubmit());
        if(window.innerWidth < 500) {
            const chatBox = this.shadowRoot.querySelector(".chat-box");
            const handleBlur = () => {
                setTimeout(() => {
                    if (!this._messageInput.matches(":focus") && !this._messageSubmit.matches(":focus")) {
                        chatBox.classList.remove("above-keyboard");
                        chatBox.classList.add("chat-box");
                    }
                }, 0);
            };

            this._messageInput.addEventListener("focus", () => {
                chatBox.classList.add("above-keyboard");
            });

            this._messageInput.addEventListener("blur", handleBlur);

            this._messageSubmit.addEventListener("mousedown", () => {
                this._messageSubmit.addEventListener("mouseup", handleBlur, { once: true });
            });
        }
    }



    _handleMessageSubmit() {

        this._message = this._messageInput.value;
        let messageList = this.shadowRoot.querySelector("#message-list");
        messageList.innerHTML += `<li class="message">${this._app.user.username} : ${this._message}</li>`;
        this._messageInput.value = "";

        this._chat_socket.emit("private message", { content: this._message, to: this.username });
        this._pushMessageToState(this.username,this._message);
    }

    _handleCloseBtnClick() {
        this._app.removeChild(this);
    }
}

customElements.define("game-chat", GameChat);
