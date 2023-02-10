import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";

export class Login extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/loginPageComponent/loginPageComponent.html")
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
        this._app.dispatchEvent(new CustomEvent(events.signUpClicked));
    }

    _handleVsPlayerClick(){
        this._app.dispatchEvent(new CustomEvent(events.vsPlayerClicked));
    }
}

customElements.define("login-component", Login);