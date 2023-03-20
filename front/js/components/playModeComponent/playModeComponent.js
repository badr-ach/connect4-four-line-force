import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { Connect4 } from "../gameComponent/gameComponent.js";


export class PlayMode extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/playModeComponent/playModeComponent.html")
        .then((r) => r.text())
        .then((html) => html);

        this._attachEventListeners();
    }

    _attachEventListeners(){
        this.shadowRoot.getElementById("vsComputer").addEventListener("click", () => this._handleVsComputerClick());
        this.shadowRoot.getElementById("vsPlayer").addEventListener("click", () => this._handleVsPlayerClick());
    }


    _handleVsComputerClick() {
        this._app.removeChild(this);
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._app._token ? this._app._token : "guest" } });
        socket.emit("setup", { AIplays : Math.round(Math.random()) + 1});
        socket.on("setup", (data) => {
            this._app.appendChild(new Connect4({app : this._app,...data}));
        });
    }

    _handleVsPlayerClick() {
        this._app.removeChild(this);
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._app._token ? this._app._token : "guest" } });
        socket.emit("setup", { AIplays:-1});
        socket.on("setup", (data) => {
            console.log(data);
            this._app.appendChild(new Connect4({app : this._app,...data}));
        });
        socket.on("waitingForOpponent" , (data) => {
            alert("Waiting for opponent");
        });
    }
}

customElements.define("play-mode-component", PlayMode);
