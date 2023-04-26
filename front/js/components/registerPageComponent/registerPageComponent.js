import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";
import {login, signup} from "../../api/user.js";
import {LoggedIntroMenu} from "../loggedInMenuComponent/loggedInMenuComponent.js";
import {IntroMenu} from "../introMenuComponent/introMenuComponent.js";


export class Register extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/registerPageComponent/registerPageComponent.html")
        .then((r) => r.text())
        .then((html) => html);

        let home = this.shadowRoot.getElementById("home-link");
        home.addEventListener("click", () => {
            while(this._app.firstChild){
                this._app.removeChild(this._app.firstChild);
            }
            this._app.appendChild(new IntroMenu(this._app));
        });

        this._attachEventListeners();
    }

    _attachEventListeners(){
        const form = this.shadowRoot.getElementById("signupForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            signup({ username: form.username.value, mail:form.mail.value, password: form.pwd.value })
            (this._app.dispatchEvent.bind(this._app));
        });


    }



}

customElements.define("register-component", Register);
