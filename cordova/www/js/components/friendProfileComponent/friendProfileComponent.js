import {Animator} from "../../scripts/animator.js";
import {fetcher} from "../../utils/requester.js";
import {WebSocket} from "../../utils/WebSocket.js";
import {SideBar} from "../sideBarComponent/sideBarComponent.js";
import {LoggedIntroMenu} from "../loggedInMenuComponent/loggedInMenuComponent.js";


export class FriendProfileComponent extends HTMLElement{
    constructor(app, friend){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.api = fetcher();
        this.rootPath = "http://13.39.75.52/";
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
        this._attachEventListeners();

    }

    _attachEventListeners(){

        const challengeBtn = this.shadowRoot.getElementById("challenge");
        const deleteBtn = this.shadowRoot.getElementById("delete");
        console.log("challenge but: ",challengeBtn)
        console.log("delete but: ",deleteBtn)

        this._friends_socket = WebSocket.getSocketByNameSpace("/api/friends",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        challengeBtn.addEventListener("click", (e)=>{
            this._friends_socket.emit("challenge", { username: this.username });
        });

        deleteBtn.addEventListener("click", (e)=>{
            this._friends_socket.emit("delete friend", { username: this.username });
            this._removingMyself();
        });
    }

    _removingMyself(){
        while(this._app.firstChild){
            this._app.removeChild(this._app.firstChild);
        }
        this._app.appendChild(new SideBar(this._app));
        this._app.appendChild(new LoggedIntroMenu(this._app));
    }

    async _setUpUser() {

        const res = await this.api.get(this.rootPath + "/api/profile/" + this.username);
        this.shadowRoot.getElementById("userName").innerHTML = this.username;
        this.shadowRoot.getElementById("score").innerHTML = res.profile.user.rating;
        if(res.profile.user.rating < 300){
            this.rank = "Bronze";
        } else if(res.profile.user.rating < 600){
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

        const res = await this.api.get(this.rootPath + "/api/profile/" + this.username);
        console.log(res.profile.history)
        this.shadowRoot.getElementById("games").innerHTML = res.profile.history.length;
        this.shadowRoot.getElementById("online-wins").innerHTML = res.profile.history.filter(x => x.winner === this.username).length;
        console.log(res.history)
        this.shadowRoot.getElementById("tie").innerHTML = res.profile.history.filter(x => x.winner === "Tie").length;
        await this._setUpProgression(res.profile.history)
    }

    async _setUpProgression(history) {
        console.log("length filter",history.filter(x => x.winner === this.username).length)
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
        console.log("this",Math.min(100, Math.round((playerScore / 800) * 100)) + "%")
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



