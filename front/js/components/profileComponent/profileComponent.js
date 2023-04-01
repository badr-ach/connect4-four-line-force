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
        this.rank = "";
        this.rangeRank = ["../../../images/bronze-coin.png", "../../../images/silver-coin.png", "../../../images/gold-coin.png"];
    }



    async connectedCallback(){

        this.shadowRoot.innerHTML = await fetch("./js/components/profileComponent/profileComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        await this._setUpUser();
        await this._setUpHistory();
        await this._setUpProgression();

    }

    async _setUpUser() {

        const res = await this.api.post(this.rootPath + "/api/loadUser");
        this.username = res.user.username;
        console.log("user is " + res.user.rating)
        this.shadowRoot.getElementById("userName").innerHTML = res.user.username;
        this.shadowRoot.getElementById("email").innerHTML = res.user.mail;
        this.shadowRoot.getElementById("score").innerHTML = res.user.rating;
        if(res.user.rating < 300){
            this.rank = "Bronze";
        } else if(res.user.rating < 600){
            this.rank = "Silver";
        }else {
            this.rank = "Gold";
        }
        this.shadowRoot.getElementById("rank").innerHTML = this.rank;

        const rankImg = this.shadowRoot.querySelector('.rank-img');

        if (this.rank === "Bronze") {
            rankImg.src = this.rangeRank[0];
        } else if (this.rank === "Silver") {
            rankImg.src = this.rangeRank[1];
        } else if (this.rank === "Gold") {
            rankImg.src = this.rangeRank[2];
        }

    }

    async _setUpHistory() {

        const res = await this.api.post(this.rootPath + "/api/history");
        this.shadowRoot.getElementById("games").innerHTML = res.history.length;
        this.shadowRoot.getElementById("online-wins").innerHTML = res.history.filter(x => x.winner === this.username).length;
        console.log(res.history)
        this.shadowRoot.getElementById("tie").innerHTML = res.history.filter(x => x.winner === "Tie").length;
        this._fillUpHistory(res.history);
        this._setUpProgression(res.history)
    }

    async _setUpProgression(history) {
        const wins = history.filter(x => x.winner === this.username).length;
        const games = history.length;

        this.shadowRoot.getElementById("novicePlayer").style.width = Math.min(100, Math.round(((games) / 10) * 100)) + "%";
        this.shadowRoot.getElementById("novicePlayer").innerHTML = Math.min(100, Math.round(((games) / 10) * 100)) + "%";

        this.shadowRoot.getElementById("noviceWinner").style.width = Math.min(100, Math.round((wins / 10) * 100)) + "%";
        this.shadowRoot.getElementById("noviceWinner").innerHTML = Math.min(100, Math.round((wins / 10) * 100)) + "%";

        this.shadowRoot.getElementById("OG").style.width = Math.min(100, Math.round(((games) / 100) * 100)) + "%";
        this.shadowRoot.getElementById("OG").innerHTML = Math.min(Math.round(((games) / 100) * 100)) + "%";

        const player = await this.api.post(this.rootPath + "/api/loadUser");
        const playerScore = player.user.rating;
        this.shadowRoot.getElementById("intermediatePlayer").style.width = Math.min(Math.round((playerScore / 400) * 100)) + "%";
        this.shadowRoot.getElementById("intermediatePlayer").innerHTML = Math.min(100, Math.round((playerScore / 400) * 100)) + "%";

        this.shadowRoot.getElementById("goodPlayer").style.width = Math.min(100, Math.round((playerScore / 800) * 100)) + "%";
        this.shadowRoot.getElementById("goodPlayer").innerHTML = Math.min(Math.round((playerScore / 800) * 100)) + "%";
    }

    _fillUpHistory(history){
        const historyTable = this.shadowRoot.getElementById("history-table");
        history.forEach(game => {
            const tr = document.createElement("tr");
            const againstTd = document.createElement("td");
            againstTd.textContent = game.playerTwo;
            const resultTd = document.createElement("td");
            resultTd.textContent = game.winner === this.username ? "Win" : "Loss";
            tr.appendChild(againstTd);
            tr.appendChild(resultTd);
            historyTable.appendChild(tr);

        });
    }

}

customElements.define("profile-component", ProfileComponent);



