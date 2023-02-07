import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { WebSocket } from "../utils/WebSocket.js";
import { Connect4 } from "./gameComponent/gameComponent.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { PlayMode } from "./playModeComponent/playModeComponent.js";

export class App extends HTMLElement {


    constructor() {
        super();
        // this.attachShadow({ mode: "open" });
        this._animator = new Animator();
    }
    
    async connectedCallback() {
        this.appendChild(new IntroMenu(this));
        this.attachEventListeners();
    }  

    
    attachEventListeners() {
        this.addEventListener(events.guestClicked, () => this._handleGuestClick());
        this.addEventListener(events.vsComputerClicked, () => this._handleVsComputerClick());
    }

    _handleGuestClick() {
        this.removeChild(this.firstChild);
        this.appendChild(new PlayMode(this));
        // let playMode = new PlayMode(this);
        // this._animator.beginAnimation("slide-right", playMode, () => {
        //     this.appendChild(playMode);
        // });
    }

    _handleVsComputerClick() {
        this.removeChild(this.firstChild);
        const socket = WebSocket.getSocketByNameSpace("/api/game");
        socket.emit("newGame", { type: "vsAI", player: "Guest" });
        socket.on("newGame", (data) => {
            console.log("data we got");
            console.log(data)
            this.appendChild(new Connect4({app : this,...data}));
        });
    }

};

customElements.define("app-component", App);