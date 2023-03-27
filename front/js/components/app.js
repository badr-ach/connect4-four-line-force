import { loadUser } from "../api/user.js";
import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { GameChat } from "./gameChatComponent/gameChatComponent.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { LoggedIntroMenu } from "./loggedInMenuComponent/loggedInMenuComponent.js";
import { Login } from "./loginPageComponent/loginPageComponent.js";
import { PlayMode } from "./playModeComponent/playModeComponent.js";
import { Register } from "./registerPageComponent/registerPageComponent.js";
import { SideBar } from "./sideBarComponent/sideBarComponent.js";

export class App extends HTMLElement {


    constructor() {
        super();
        this._animator = new Animator();
        this._token = localStorage.getItem("token");
        this.connected = false;
        this.player = "guest";
    }

    async connectedCallback() {
        this.appendChild(new SideBar(this));
        this.appendChild(new IntroMenu(this));
        this.appendChild(new GameChat(this));
        this.attachEventListeners();
        if (!this.connected) {
            loadUser()(this.dispatchEvent.bind(this));
        }
    }

    attachEventListeners() {
        // this.addEventListener(events.signUpClicked, () => this._handleSignUpClick());
        // this.addEventListener(events.loginClicked, () => this._handleLoginClick());
        // this.addEventListener(events.guestClicked, () => this._handleGuestClick());
        this.addEventListener(events.userLoaded, (data) => this._handleUserLoaded(data));
        this.addEventListener(events.signedOut, () => this._handleSignOut());
        this.addEventListener(events.error, (data) => this._handleError(data));
    }


    // _handleLoginClick() {
    //     this.removeChild(this.firstChild);
    //     this.appendChild(new Login(this));
    // }

    // _handleSignUpClick() {
    //     this.removeChild(this.firstChild);
    //     this.appendChild(new Register(this));
    // }

    // _handleGuestClick() {
    //     this.removeChild(this.firstChild);
    //     this.appendChild(new PlayMode(this));
    // }

    _handleUserLoaded({ detail }) {
        console.log("Im here in details")
        this.connected = true;
        this.player = detail.username;
        this._token = localStorage.getItem("token");
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        console.log("Im here in details")
        this.appendChild(new SideBar(this));                                                                                        
        this.appendChild(new LoggedIntroMenu(this));
    }

    _handleSignOut() {
        this.connected = false;
        this._token = null;
        this.player = "guest";
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }
        this.appendChild(new SideBar(this));     
        this.appendChild(new IntroMenu(this));
    }

    _handleError({ detail }) {
        alert(detail);
    }

};

customElements.define("app-component", App);
