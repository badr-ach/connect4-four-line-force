import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { Connect4 } from "../gameComponent/gameComponent.js";
import { LoadingPage } from "../loadingPageComponent/loadingPageComponent.js";
import { LocalConnect4 } from "../localGameComponent/localGameComponent.js";
import { SideBar } from "../sideBarComponent/sideBarComponent.js";


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
        if(this._app.player === "guest"){
            let vsplayer = this.shadowRoot.querySelector("#vsPlayer");
            console.log(vsplayer);
            vsplayer.remove();
        }

        this._attachEventListeners();
    }

    _attachEventListeners(){
        this.shadowRoot.getElementById("vsComputer").addEventListener("click", () => this._handleVsComputerClick());
        if(!this._app.player === "guest"){
            this.shadowRoot.getElementById("vsPlayer").addEventListener("click", () => this._handleVsPlayerClick());
        }
        this.shadowRoot.getElementById("vsLocalPlayer").addEventListener("click", () => this._handleVsLocalPlayerClick());
    }


    _handleVsComputerClick() {
        new Audio("../../../audio/click_mode.wav").play();
        this._removingMyself();
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._app.token ? this._app.token : "guest" } });
        socket.emit("setup", { AIplays : Math.round(Math.random()) + 1});
        socket.once("setup", (data) => {
            this._app.appendChild(new Connect4({app : this._app,...data}));
        });
    }

    _handleVsLocalPlayerClick() {
        new Audio("../../../audio/click_mode.wav").play();
        this._removingMyself();
        this._app.appendChild(new LocalConnect4(this._app));
    }

    _handleVsPlayerClick() {
        new Audio("../../../audio/click_mode.wav").play();
        this._removingMyself();
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._app.token ? this._app.token : "guest" } });
        socket.emit("setup", { AIplays:-1});
        socket.once("setup", (data) => {
            this._removingMyself();
            this._app.appendChild(new Connect4({app : this._app,...data}));

        });

        socket.once("waitingForOpponent" , (data) => {
            this._app.appendChild(new LoadingPage(this._app));
        });
    }

    _removingMyself(){
            while(this._app.firstChild){
                this._app.removeChild(this._app.firstChild);
            }
            this._app.appendChild(new SideBar(this._app));
    }

    // _removingLoadingScreen(){
    //     for(let node of this._app.children){
    //         if(node.id === "loading-page") this._app.removeChild(node);
    //     }
    // }
}

customElements.define("play-mode-component", PlayMode);
