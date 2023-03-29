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
        this.username = "";

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
        this.username = res.user.username;
        this.shadowRoot.getElementById("userName").innerHTML = res.user.username;
        this.shadowRoot.getElementById("email").innerHTML = res.user.mail;
    }

    async _setUpHistory() {

        const res = await this.api.post(this.rootPath + "/api/history");
        console.log("history is ", res);
        this.shadowRoot.getElementById("games").innerHTML = res.history.length;

        console.log("wins is ", res.history.filter(x => x.winner === this.username));
        this.shadowRoot.getElementById("online-wins").innerHTML = res.history.filter(x => x.winner === this.username).length;
        console.log("against",res.history[0]);
        console.log("winner ",res.history[0].winner)
        this._fillUpHistory(res.history);
    }

    _fillUpHistory(history){
        /*let history = [
            { against: "AI", result: "Win" },
            { against: "Human", result: "Loss" },
            { against: "Computer", result: "Tie" }
        ];*/
        const historyTable = this.shadowRoot.getElementById("history-table");
        history.forEach(game => {
            console.log("against",game.playerTwo);
            console.log("winner ",game.winner)
            const tr = document.createElement("tr");
            const againstTd = document.createElement("td");
            againstTd.textContent = game.playerTwo;
            const resultTd = document.createElement("td");
            resultTd.textContent = game.winner === game.playerOne ? "Win" : "Loss";
            tr.appendChild(againstTd);
            tr.appendChild(resultTd);
            historyTable.appendChild(tr);

        });
    }

}

customElements.define("profile-component", ProfileComponent);



