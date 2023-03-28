import { Animator } from "../../scripts/animator.js";
import {logout} from "../../api/user.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { events } from "../../events/events.js";
import { GameChat } from "../gameChatComponent/gameChatComponent.js";

export class SideBar extends HTMLElement{

    constructor(app){
        super();
        this._app = app;
        this._animator = new Animator();
        this.friendList = this._app.user.friends
        this.friendList = ["friend1", "friend3", "friend2"];
        this.invitations = ["friend2", "friend3", "friend4"];
        this._friendValue = "";
        this._chat_open = false;

        console.log(this._app)
        console.log(JSON.stringify(this._app))

        this._chat_socket =  WebSocket.getSocketByNameSpace("/api/chat",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        this._chat_socket.on("user connected", (data) => {
            if(this._app.user.friends.includes(data.username))
                this._chat_socket.emit("user connected", data);
        });

        this._friends_socket = WebSocket.getSocketByNameSpace("/api/friends",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        this._friends_socket.on("notify", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                title: "Notification",
                content: data.message,
                accept: () => {},
                decline: () => {},
                temporary: true
            } }));
        })

        this._friends_socket.on("friend request", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                title: "Friend request",
                content: data.message,
                accept: () => {
                    this._friends_socket.emit("accept request", { username: data.username });
                },
                decline: () => {},
                temporary: false
            } }));
        });
            this._socket.on("notify", (data) => {
                alert(data.message)
            })

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
            friendName.classList.add("friend");
            friendName.dataset.username = this.friendList[i];
            friend.appendChild(friendName);
            friends.appendChild(friend);

            friendName.addEventListener("click", (e)=>{
                if(!this._chat_open){
                    this._app.appendChild(new GameChat(this._app, e.target.dataset.username));
                }else{
                    this._app.removeChild(this._app.lastChild);
                    this._app.appendChild(new GameChat(this._app, e.target.dataset.username));
                }

            });
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

        let username = document.getElementById("sidebar-username");
        username.innerHTML = this._app.user.username;

        sidebarBtn.addEventListener("click", ()=>{
            sidebar.classList.toggle("close");
        });

        this._attachEventListeners();
        this._handleInvitations();
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

    _handleInvitations(){
        const list = document.querySelector('.friend-requests-list');
        const items = Array.from(list.children);
        const container = document.querySelector('.friend-requests-container');
        const leftButton = document.querySelector('.scroll-button.left');
        const rightButton = document.querySelector('.scroll-button.right');

        let currentIndex = 0;
        let itemWidth = items[0].offsetWidth;
        let containerWidth = container.offsetWidth;
        let visibleItems = Math.floor(containerWidth / itemWidth);

        leftButton.addEventListener('click', () => {
            if (currentIndex > 0) {
                currentIndex--;
                list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            }
        });

        rightButton.addEventListener('click', () => {
            if (currentIndex < items.length - visibleItems) {
                currentIndex++;
                list.style.transform = `translateX(-${currentIndex * itemWidth}px)`;
            }
        });


    }


    _handleAddFriend(){
        console.log("add friend");
        let friendtag = document.getElementById("input-friend");
        console.log(friendtag);
        console.log(friendtag.value);
        this._friends_socket.emit("send request",{ username: friendtag.value })
        friendtag.value = "";
    }

}


customElements.define("side-bar-component", SideBar);
