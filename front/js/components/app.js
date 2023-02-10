import { signup } from "../api/user.js";
import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { WebSocket } from "../utils/WebSocket.js";
import { Connect4 } from "./gameComponent/gameComponent.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { Login } from "./loginPageComponent/loginPageComponent.js";
import { PlayMode } from "./playModeComponent/playModeComponent.js";
import { Register } from "./registerPageComponent/registerPageComponent.js";

export class App extends HTMLElement {


    constructor() {
        super();
        this._animator = new Animator();
        this._token = localStorage.getItem("token");

        signup({ username: "Guest", password: "Guest" })(this.dispatchEvent);
    }
    
    async connectedCallback() {
        this.appendChild(new IntroMenu(this));
        this.attachEventListeners();
    }  
    
    attachEventListeners() {
        this.addEventListener(events.signUpClicked, () => this._handleSignUpClick());
        this.addEventListener(events.loginClicked, () => this._handleLoginClick());
        this.addEventListener(events.guestClicked, () => this._handleGuestClick());

        this.addEventListener(events.vsComputerClicked, () => this._handleVsComputerClick());

    }


    _handleLoginClick() {
        this.removeChild(this.firstChild);
        this.appendChild(new Login(this));
    }

    _handleSignUpClick() {
        this.removeChild(this.firstChild);
        this.appendChild(new Register(this));
    }

    _handleGuestClick() {
        this.removeChild(this.firstChild);
        this.appendChild(new PlayMode(this));
    }

    _handleVsComputerClick() {
        this.removeChild(this.firstChild);
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._token } });
        socket.emit("setup", { type: "vsAI", player: "Guest" });
        socket.on("setup", (data) => {
            console.log("data we got");
            console.log(data)
            this.appendChild(new Connect4({app : this,...data}));
        });
    }

};

customElements.define("app-component", App);