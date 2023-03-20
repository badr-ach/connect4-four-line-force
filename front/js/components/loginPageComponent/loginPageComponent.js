import { Animator } from "../../scripts/animator.js";
import {login} from "../../api/user.js";

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
        const form = this.shadowRoot.getElementById("loginForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            login({ mail:form.mail.value, username:form.mail.value ,password: form.pwd.value })(this._app.dispatchEvent.bind(this._app));
        });
    }


}

customElements.define("login-component", Login);
