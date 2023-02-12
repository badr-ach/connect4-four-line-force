import { loadUser, signup } from "../api/user.js";
import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { WebSocket } from "../utils/WebSocket.js";
import { Connect4 } from "./gameComponent/gameComponent.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { LoggedIntroMenu } from "./loggedInMenuComponent/loggedInMenuComponent.js";
import { Login } from "./loginPageComponent/loginPageComponent.js";
import { PlayMode } from "./playModeComponent/playModeComponent.js";
import { Register } from "./registerPageComponent/registerPageComponent.js";

export class App extends HTMLElement {


    constructor() {
        super();
        this._animator = new Animator();
        this._token = localStorage.getItem("token");
        this._connected = false;
    }

    async connectedCallback() {
        this.appendChild(new IntroMenu(this));
        this.attachEventListeners();
        if(!this._connected){
            loadUser()(this.dispatchEvent.bind(this));
        }
    }

    attachEventListeners() {
        this.addEventListener(events.signUpClicked, () => this._handleSignUpClick());
        this.addEventListener(events.loginClicked, () => this._handleLoginClick());
        this.addEventListener(events.guestClicked, () => this._handleGuestClick());
        this.addEventListener(events.userLoaded, (data) => this._handleUserLoaded(data));
        this.addEventListener(events.signedOut, () => this._handleSignOut());
        this.addEventListener(events.resumeGameClicked, () => this._handleResumeGameClick());
        this.addEventListener(events.vsComputerClicked, () => this._handleVsComputerClick());
        this.addEventListener(events.error, (data) => this._handleError(data));
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
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: "guest" } });
        socket.emit("setup", { AIplays:1, type: "vsAI", player: this._player, resume: false });
        socket.on("setup", (data) => {
            this.appendChild(new Connect4({app : this,...data}));
        });
    }

    _handleUserLoaded({detail}) {
        this._connected = true;
        this._player = detail.username;
        this.removeChild(this.firstChild);
        this.appendChild(new LoggedIntroMenu(this));
    }

    _handleSignOut() {
        this._connected = false;
        this._token = null;
        this.removeChild(this.firstChild);
        this.appendChild(new IntroMenu(this));
    }

    _handleResumeGameClick() {
        this.removeChild(this.firstChild);
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._token } });
        socket.emit("setup", { AIplays:1, type: "vsAI", player: this._player, resume: true });
        socket.on("setup", (data) => {
            console.log("game",data);
            this.appendChild(new Connect4({app : this,...data}));
        });
    }

    _handleError({detail}) {
        alert(detail);
    }

};

customElements.define("app-component", App);
