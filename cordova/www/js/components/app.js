import { loadUser } from "../api/user.js";
import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { LoggedIntroMenu } from "./loggedInMenuComponent/loggedInMenuComponent.js";
import { PopUp } from "./popUpComponent/popUpComponent.js";
import { SideBar } from "./sideBarComponent/sideBarComponent.js";

export class App extends HTMLElement {


    constructor() {
        super();
        this._animator = new Animator();
        this.token = window.localStorage.getItem("token");
        this.connected = false;
        this.player = "guest";
    }

    async connectedCallback() {
        this.appendChild(new IntroMenu(this));
        this.attachEventListeners();
        if (!this.connected) {
            loadUser()(this.dispatchEvent.bind(this));
        }
        let ambient = new Audio("../../../audio/ambient.wav");
        ambient.loop = true;
        ambient.volume = 0.2;
        ambient.play();
    }

    attachEventListeners() {
        this.addEventListener(events.userLoaded, (data) => this._handleUserLoaded(data));
        this.addEventListener(events.signedOut, () => this._handleSignOut());
        this.addEventListener(events.error, (data) => this._handleError(data));
        this.addEventListener(events.popUp, (data) => this._handlePopUp(data));
    }

    _handleUserLoaded({ detail }) {
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }

        this.user = detail;
        this.connected = true;
        this.player = detail.username;
        this.token = window.localStorage.getItem("token");

        console.log("I got called")
        this.appendChild(new SideBar(this));                                                                                        
        this.appendChild(new LoggedIntroMenu(this));
    }

    _handleSignOut() {
        this.connected = false;
        this.token = null;
        this.player = "guest";
        while (this.firstChild) {
            this.removeChild(this.firstChild);
        }     
        this.appendChild(new IntroMenu(this));
    }

    _handlePopUp({ detail }) {
        this.appendChild(new PopUp(this, detail.title, detail.content, detail.accept, detail.decline, detail.temporary))
    }

    _handleError({ detail }) {
        this.appendChild(new PopUp(this, "Error", detail, () => {}, () => {}, true));
    }

};

customElements.define("app-component", App);
