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
    }


}

customElements.define("login-component", Login);