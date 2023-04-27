import { Animator } from "../../scripts/animator.js";
import {login} from "../../api/user.js";
import {IntroMenu} from "../introMenuComponent/introMenuComponent.js";

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

        let home = this.shadowRoot.getElementById("home-link");
        home.addEventListener("click", () => {
            while(this._app.firstChild){
                this._app.removeChild(this._app.firstChild);
            }
            this._app.appendChild(new IntroMenu(this._app));
        });

        this._sendLoginNotification();

        this._attachEventListeners();
    }

    _attachEventListeners(){
        const form = this.shadowRoot.getElementById("loginForm");
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            login({ mail:form.mail.value, username:form.mail.value ,password: form.pwd.value })(this._app.dispatchEvent.bind(this._app));
        });
    }


    _sendLoginNotification() {
        const acceptAction = {
            id: 'accept-action',
            title: 'Accept',
            foreground: true,
            destructive: false
        };

        const declineAction = {
            id: 'decline-action',
            title: 'Decline',
            foreground: true,
            destructive: true
        };

        // Programmer la notification
        cordova.plugins.notification.local.schedule({
            title: 'You are in the login page',
            text: 'Do you want to login ?',
            trigger: { at: new Date() },
            actions: [acceptAction, declineAction]
        });

        // Ajouter des gestionnaires d'événements pour les boutons de la notification
        cordova.plugins.notification.local.on('accept-action', function(notification) {
            console.log('Accept action clicked');
        });

        cordova.plugins.notification.local.on('decline-action', function(notification) {
            console.log('Decline action clicked');
        });

    }
}

customElements.define("login-component", Login);
