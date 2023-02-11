import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";
import {login, signup} from "../../api/user.js";


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

        this._attachEventListeners();
    }

    _attachEventListeners(){
        console.log("signup");
        const form = this.shadowRoot.getElementById("signupForm");
        const btn = this.shadowRoot.getElementById("signup-btn");
        btn.addEventListener("click", (e) => {
            e.preventDefault();
            console.log(form.mail.value);
            const body = JSON.stringify({
                "mail": form.mail.value,
                "username": form.username.value,
                "password": form.pwd.value
            });
            signup(body)();
        });
        /*form.addEventListener("submit", (e) => {
            e.preventDefault();
            const body = JSON.stringify({
                "mail": form.mail.value,
                "username": form.username.value,
                "password": form.pwd.value
            });
            signup(body);
        });*/
    }



}

customElements.define("register-component", Register);
