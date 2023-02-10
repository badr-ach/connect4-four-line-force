/*import { Animator } from "../../scripts/animator.js";
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
    // x x





}

customElements.define("login-component", Login);*/

const form = document.getElementById("loginForm");

function login() {
    console.log("je subm2");

    const request = new Request('http://localhost:8000/api/login.js', {
        method: 'POST',
        body: JSON.stringify({"mail": form.mail.value, "password": form.pwd.value}),
        headers: {
            'Content-Type': 'text/plain'
        }
    });

    fetch(request)
        .then(res => res.text())
        .then(text => console.log(text))
        .catch(error => console.error(error));
}
