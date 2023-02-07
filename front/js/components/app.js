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

        WebSocket.connect("/api/game");
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

        // WebSocket.getSocket().on("gameCreated", (data) => {
        //     console.log(data);
        //     this.removeChild(this.firstChild);
        //     // this.appendChild(new Connect4(this, data.player, data.type));
        // });

        
        WebSocket.getSocketByNameSpace("/api/game").emit("connection", data => ({ type: "Computer", player: "Guest" }));

        this.appendChild(new Connect4(this,"Human","Computer"));
    }

};

customElements.define("app-component", App);