import { Animator } from "../../scripts/animator.js";
import {logout} from "../../api/user.js";
import { WebSocket } from "../../utils/WebSocket.js";

export class SideBar extends HTMLElement{

    constructor(app){
        super();
        this._app = app;
        this._animator = new Animator();
        this.friendList = ["friend1", "friend3", "friend2"];
        this._friendValue = "";

        if(this._app.connected){

            this._socket = WebSocket.getSocketByNameSpace("/api/friends");

            this._socket.on("friend request", (data) => {
                alert(data.message);
            });

            this._socket.on("notify", (data) => {
                alert(data.message)
            })
            
        }
    }


    async connectedCallback(){
        this.innerHTML =
            await fetch("./js/components/sideBarComponent/sideBarComponent.html")
                .then((r) => r.text())
                .then((html) => html);

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
        let friendtag = document.getElementById("searchFriend");
        console.log(this.friendtag);
        console.log(this.friendtag.value);
        this._socket.emit("send request",{ username: friendtag.value })
    }

}

customElements.define("side-bar-component", SideBar);
