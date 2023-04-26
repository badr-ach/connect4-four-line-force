import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { Connect4 } from "../gameComponent/gameComponent.js";
import { LoadingPage } from "../loadingPageComponent/loadingPageComponent.js";

import { SideBar } from "../sideBarComponent/sideBarComponent.js";
import {LocalGame} from "../localGameComponent/localGameComponent.js";
import {IntroMenu} from "../introMenuComponent/introMenuComponent.js";
import { events } from "../../events/events.js";




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
        if(this._app.player !== "guest"){
            let homebtn = this.shadowRoot.querySelector("#home-link");
            homebtn.remove();
        }

        this._attachEventListeners();
    }

    _attachEventListeners(){
        this.shadowRoot.getElementById("vsComputer").addEventListener("click", () => this._handleVsComputerClick());
        if(this._app.player !== "guest"){
            this.shadowRoot.getElementById("vsPlayer").addEventListener("click", () => this._handleVsPlayerClick());
        }
        this.shadowRoot.getElementById("vsLocalPlayer").addEventListener("click", () => this._handleVsLocalPlayerClick());

        if(this._app.player === "guest"){
            let home = this.shadowRoot.getElementById("home-link");
            home.addEventListener("click", () => {
                while(this._app.firstChild){
                    this._app.removeChild(this._app.firstChild);
                }
                this._app.appendChild(new IntroMenu(this._app));
            });        }
    }

    _handleVsComputerClick() {
        this._checkBatteryLevel();
        new Audio("../../../audio/click_mode.wav").play();
        this._removingMyself();
        const socket = WebSocket.getSocketByNameSpace("/api/game", { auth: { token: this._app.token ? this._app.token : "guest" } });
        socket.emit("setup", { AIplays : Math.round(Math.random()) + 1});
        socket.once("setup", (data) => {
            this._app.appendChild(new Connect4({app : this._app,...data}));
        });
    }

    _handleVsLocalPlayerClick() {
        this._checkBatteryLevel();
        new Audio("../../../audio/click_mode.wav").play();
        this._removingMyself();
        this._app.appendChild(new LocalGame(this._app));
    }

    _handleVsPlayerClick() {
        this._checkBatteryLevel();
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
            let token = localStorage.getItem("token");
            if(token) this._app.appendChild(new SideBar(this._app));
    }


    _checkBatteryLevel(){
        navigator.getBattery().then((battery) => {
            if(battery.level < 0.2){
                navigator.vibrate(1000);
                this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                    title: "Battery Low",
                    content: "Your battery is low, please consider charging your device before playing.",
                    accept: () => {},
                    decline: () => {},
                    temporary: true
                } }));
            }
        });
    }
                        

    // _removingLoadingScreen(){
    //     for(let node of this._app.children){
    //         if(node.id === "loading-page") this._app.removeChild(node);
    //     }
    // }

}

customElements.define("play-mode-component", PlayMode);
