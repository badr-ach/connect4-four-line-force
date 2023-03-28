import {Animator} from "../../scripts/animator.js";
import {fetcher} from "../../utils/requester.js";


export class ProfileComponent extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.api = fetcher();
        this.rootPath = "http://localhost:8000";
        this.historyGames = [];
        const token = localStorage.getItem("token");
        this.api.use({Authorization: "Bearer " + token});

    }



    async connectedCallback(){

        this.shadowRoot.innerHTML = await fetch("./js/components/profileComponent/profileComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        await this._setUpUser();
        await this._setUpHistory();

    }

    async _setUpUser() {

        const res = await this.api.post(this.rootPath + "/api/loadUser");
        console.log("user is ", res.user.username);
        this.shadowRoot.getElementById("userName").innerHTML = res.user.username;
        this.shadowRoot.getElementById("email").innerHTML = res.user.mail;
    }

    async _setUpHistory() {

        const res = await this.api.post(this.rootPath + "/api/history");
        console.log("history is ", res);
        this.shadowRoot.getElementById("w").innerHTML = res.history.winner;
    }

}

customElements.define("profile-component", ProfileComponent);



