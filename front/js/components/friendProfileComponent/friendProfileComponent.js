import {Animator} from "../../scripts/animator.js";
import {fetcher} from "../../utils/requester.js";


export class FriendProfileComponent extends HTMLElement{
    constructor(app, friend){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.api = fetcher();
        this.rootPath = "http://localhost:8000";
        this.historyGames = [];
        const token = localStorage.getItem("token");
        this.api.use({Authorization: "Bearer " + token});
        this.username = friend;
        this.rank = "";
        this.rangeRank = ["../../../images/bronze-coin.png", "../../../images/silver-coin.png", "../../../images/gold-coin.png"];

    }



    async connectedCallback(){
    console.log("friend is " + this.username)
        this.shadowRoot.innerHTML = await fetch("./js/components/friendProfileComponent/friendProfileComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        await this._setUpUser();
        await this._setUpHistory();
        await this._setUpProgression();

    }

    async _setUpUser() {

        const res = await this.api.get(this.rootPath + "/api/profile/" + this.username);
        console.log("res find is "+ res)
        console.log("user find is "+ res.user)
        this.shadowRoot.getElementById("userName").innerHTML = this.username;
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

        const res = await this.api.post(this.rootPath + "/api/profile/" + this.username);
        console.log(res.history)
        this.shadowRoot.getElementById("games").innerHTML = res.history.length;
        this.shadowRoot.getElementById("online-wins").innerHTML = res.history.filter(x => x.winner === this.username).length;
        console.log(res.history)
        this.shadowRoot.getElementById("tie").innerHTML = res.history.filter(x => x.winner === "Tie").length;
        await this._setUpProgression(res.history)
    }

    async _setUpProgression(history) {
        const wins = history.filter(x => x.winner === this.username).length;
        const games = history.length;

        this.shadowRoot.getElementById("welcome-abroad").style.width = Math.min(100, Math.round(((games) / 10) * 100)) + "%";
        this.shadowRoot.getElementById("welcome-abroad").innerHTML = Math.min(100, Math.round(((games) / 10) * 100)) + "%";

        this.shadowRoot.getElementById("primer").style.width = Math.min(100, Math.round((wins / 15) * 100)) + "%";
        this.shadowRoot.getElementById("primer").innerHTML = Math.min(100, Math.round((wins / 15) * 100)) + "%";

        this.shadowRoot.getElementById("goat").style.width = Math.min(100, Math.round(((games) / 100) * 100)) + "%";
        this.shadowRoot.getElementById("goat").innerHTML = Math.min(100, Math.round(((games) / 100) * 100)) + "%";

        const player = await this.api.post(this.rootPath + "/api/loadUser");
        const playerScore = player.user.rating;
        this.shadowRoot.getElementById("levelup").style.width = Math.min(100,Math.round( (playerScore / 400) * 100)) + "%";
        this.shadowRoot.getElementById("levelup").innerHTML = Math.min(100, Math.round((playerScore / 400) * 100)) + "%";

        this.shadowRoot.getElementById("utlimate-goat").style.width = Math.min(100, Math.round((playerScore / 800) * 100)) + "%";
        this.shadowRoot.getElementById("utlimate-goat").innerHTML = Math.min(100, Math.round((playerScore / 800) * 100)) + "%";

        let minConsecutivesWins = 0;
        let currentConsecutivesWins = 0;
        for(let i = 0; i < history.length; i++){
            if(history[i].winner === this.username){
                currentConsecutivesWins++;
            } else {
                if(currentConsecutivesWins >minConsecutivesWins){
                    minConsecutivesWins = currentConsecutivesWins;
                }
                currentConsecutivesWins = 0;
            }
            if(currentConsecutivesWins > minConsecutivesWins){
                minConsecutivesWins = currentConsecutivesWins;
            }
        }

        console.log("minConsecutivesWins",minConsecutivesWins, currentConsecutivesWins)

        this.shadowRoot.getElementById("5-games").style.width = Math.min(100, Math.round((minConsecutivesWins / 5) * 100)) + "%";
        this.shadowRoot.getElementById("5-games").innerHTML = Math.min(100, Math.round((minConsecutivesWins / 5) * 100)) + "%";
    }

}

customElements.define("friend-profile-component", FriendProfileComponent);



