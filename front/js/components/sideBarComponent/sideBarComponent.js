import { Animator } from "../../scripts/animator.js";
import {logout} from "../../api/user.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { events } from "../../events/events.js";

export class SideBar extends HTMLElement{

    constructor(app){
        super();
        this._app = app;
        this._animator = new Animator();
        this.friendList = this._app.user.friends
        this._friendValue = "";

        console.log(this._app)
        console.log(JSON.stringify(this._app))

        this._socket = WebSocket.getSocketByNameSpace("/api/friends",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        this._socket.on("notify", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: { 
                title: "Notification",
                content: data.message,
                accept: () => {},
                decline: () => {},
                temporary: true
            } }));
        })

        this._socket.on("friend request", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: { 
                title: "Friend request",
                content: data.message,
                accept: () => {
                    this._socket.emit("accept request", { username: data.username });
                },
                decline: () => {},
                temporary: false
            } }));
        });
    }


    async connectedCallback(){
        this.innerHTML =
            await fetch("./js/components/sideBarComponent/sideBarComponent.html")
                .then((r) => r.text())
                .then((html) => html);

        let friends = document.querySelector(".friends");
        for(let i = 0; i < this.friendList.length; i++){
            let friend = document.createElement("li");
            let friendName = document.createElement("a");
            friendName.innerHTML = this.friendList[i];
            friendName.href = "#";
            friend.appendChild(friendName);
            friends.appendChild(friend);
        }

        let arrow = document.querySelectorAll(".arrow");
        for (var i = 0; i < arrow.length; i++) {
            arrow[i].addEventListener("click", (e)=>{
                let arrowParent = e.target.parentElement.parentElement;
                arrowParent.classList.toggle("showMenu");
            });
        }

        let sidebar = document.querySelector(".sidebar");
        let sidebarBtn = document.querySelector(".bx-btn");

        console.log(sidebarBtn);
        console.log(sidebar)

        sidebarBtn.addEventListener("click", ()=>{
            sidebar.classList.toggle("close");
        });

        this._attachEventListeners();
    }


    _attachEventListeners(){
        this.logoutBtn = document.querySelector(".fa-sign-out");
        this.addFriendBtn = document.querySelector(".fa-plus");
        
        this.logoutBtn.addEventListener("click", () => this._handleLogoutClicked());
        this.addFriendBtn.addEventListener("click", () => this._handleAddFriend());
    }


    _handleLogoutClicked(){
        logout()(this._app.dispatchEvent.bind(this._app));
    }


    _handleAddFriend(){
        console.log("add friend");
        let friendtag = document.getElementById("input-friend");
        console.log(friendtag);
        console.log(friendtag.value);
        this._socket.emit("send request",{ username: friendtag.value })
        friendtag.value = "";
    }

}

customElements.define("side-bar-component", SideBar);
