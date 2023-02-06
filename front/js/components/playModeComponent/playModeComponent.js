import { Animator } from "../../scripts/animator.js";
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

        this._attachEventListeners();
    }

    _attachEventListeners(){
        this.shadowRoot.getElementById("vsComputer").addEventListener("click", () => this._handleVsComputerClick());
        this.shadowRoot.getElementById("vsPlayer").addEventListener("click", () => this._handleVsPlayerClick());
    }

    _handleVsComputerClick(){
        this._animator.beginAnimation("slide-left", this, () => {});
        this._app.dispatchEvent(new CustomEvent(events.vsComputerClicked));
    }

    _handleVsPlayerClick(){
        this._app.dispatchEvent(new CustomEvent(events.vsPlayerClicked));
    }

    // const vsComputer = document.getElementById("vsComputer");
    // const vsPlayer = document.getElementById("vsPlayer");

    // vsComputer.addEventListener("click", function() {
    //     alert("You have selected vs computer!");
    // });

    // vsPlayer.addEventListener("click", function() {
    //     alert("You have selected vs player!");
    // });

}

customElements.define("play-mode-component", PlayMode);