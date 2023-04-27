import { Animator } from "../../scripts/animator.js";
import {befriend, loadUser, logout, rejectfriend} from "../../api/user.js";
import { WebSocket } from "../../utils/WebSocket.js";
import { events } from "../../events/events.js";
import { GameChat } from "../gameChatComponent/gameChatComponent.js";
import { LoggedIntroMenu } from "../loggedInMenuComponent/loggedInMenuComponent.js";
import { ProfileComponent } from "../profileComponent/profileComponent.js";
import { LoadingPage } from "../loadingPageComponent/loadingPageComponent.js";
import { Connect4 } from "../gameComponent/gameComponent.js";
import {FriendProfileComponent} from "../friendProfileComponent/friendProfileComponent.js";

export class SideBar extends HTMLElement{

    constructor(app){
        super();
        this._app = app;
        this.id = "side-bar"
        this._animator = new Animator();
        this.friendList = app.user.friends;
        this.invitations = this._app.user.incomingFriendRequests;

        this._friendValue = "";
        this._chat_open = false;

        this._messages = new Map();

        this.addEventListener("click", (e) => {
            let audio = new Audio("../../../audio/click_short.wav");
            audio.play();
        });

        console.log(this._app)
        console.log(JSON.stringify(this._app))

        this._chat_socket =  WebSocket.getSocketByNameSpace("/api/chat",{ auth: { token: this._app.token ? this._app.token : "guest" } });


        this._chat_socket.on("private message", (data) => {
            let messages = this._messages.get(data.from) ? this._messages.get(data.from) : [];
            messages.push([data.from,data.content]);
            this._messages.set(data.from, messages);

            cordova.plugins.notification.local.schedule({
                title: 'New message',
                text: data.from +' : '+ data.content,
                foreground: false,
            });

        });

        this._game_socket = WebSocket.getSocketByNameSpace("/api/game",{ auth: { token: this._app.token ? this._app.token : "guest" } });

        this._game_socket.on("custom setup", (data) => {
            while(this._app.firstChild){
                this._app.removeChild(this._app.firstChild);
            }
            this._app.appendChild(new SideBar(this._app));
            this._app.appendChild(new Connect4({app : this._app,...data}));

        });

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

        this._friends_socket.on("friend request accepted", (data) => {
            location.reload();
        });

        this._friends_socket.on("friend request", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                title: "Friend request",
                content: data.message,
                accept: () => {
                    this._friends_socket.emit("accept request", { username: data.username });
                    location. reload();
                    loadUser()(this._app.dispatchEvent.bind(this._app));
                },
                decline: () => {
                    this._friends_socket.emit("decline request", { username: data.username });
                    location.reload();
                },
                temporary: false
            } }));
        });

        this._friends_socket.on("challenge accepted", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                title: "Challenge accepted",
                content: data.message,
                accept: () => {},
                decline: () => {},
                temporary: true
            } }));
            this._game_socket.emit("challenge", { username: data.username });
        });

        this._friends_socket.on("challenge", (data) => {
            this._app.dispatchEvent(new CustomEvent(events.popUp, { detail: {
                title: "Challenge",
                content: data.message,
                accept: () => {
                    this._friends_socket.emit("challenge accepted", { username: data.username });
                    this._game_socket.emit("challenge", { username: data.username });
                },
                decline: () => {
                    this._friends_socket.emit("challenge declined", { username: data.username });
                    this._game_socket.emit("challenge declined", { username: data.username });
                },
                temporary: false
            } }));
        });
    }



    async connectedCallback(){
        let i;
        this.innerHTML =
            await fetch("./js/components/sideBarComponent/sideBarComponent.html")
                .then((r) => r.text())
                .then((html) => html);
        let home = document.getElementById("home-link");
        home.addEventListener("click", () => {
            while(this._app.firstChild){
                this._app.removeChild(this._app.firstChild);
            }
            this._app.appendChild(new SideBar(this._app));
            this._app.appendChild(new LoggedIntroMenu(this._app));
        });
        let friends = document.querySelector(".friends");
        for(let i = 0; i < this.friendList.length; i++){
            let friend = document.createElement("li");
            let friendName = document.createElement("a");

            let wrapper = document.createElement("div");
            wrapper.classList.add("friendicons-wrapper");

            let textwrapper = document.createElement("div");
            textwrapper.classList.add("friendname-text-wrapper");
            textwrapper.innerHTML = this.friendList[i];
            textwrapper.dataset.username = this.friendList[i];

            let msgBtn = document.createElement("i");
            let challengeBtn = document.createElement("i");
            let deleteBtn = document.createElement("i");

            msgBtn.classList.add( "fa", "fa-envelope");
            msgBtn.dataset.username = this.friendList[i];
            deleteBtn.classList.add( "fa", "fa-trash");
            deleteBtn.dataset.username = this.friendList[i];
            challengeBtn.classList.add( "fa", "fa-bolt");
            challengeBtn.dataset.username = this.friendList[i];

            friendName.appendChild(textwrapper);
            msgBtn.href = "#";
            friendName.classList.add("friend");
            friendName.dataset.username = this.friendList[i];
            friend.appendChild(friendName);
            friends.appendChild(friend);

            wrapper.appendChild(msgBtn);
            wrapper.appendChild(deleteBtn);
            wrapper.appendChild(challengeBtn);

            friendName.appendChild(wrapper);

            msgBtn.addEventListener("click", (e)=>{
                if(!this._chat_open){
                    this._app.appendChild(new GameChat(this._app, e.target.dataset.username,
                        this._messages.get(e.target.dataset.username) ? this._messages.get(e.target.dataset.username) : [],
                        (from,message)=>{
                            let messages = this._messages.get(from) ? this._messages.get(from) : [];
                            messages.push([this._app.user.username,message]);
                            this._messages.set(from, messages);
                        }));
                }else{
                    this._app.removeChild(this._app.lastChild);
                    this._app.appendChild(new GameChat(this._app, e.target.dataset.username,
                        this._messages.get(e.target.dataset.username) ? this._messages.get(e.target.dataset.username) : [],
                        (from,message)=>{
                            let messages = this._messages.get(from) ? this._messages.get(from) : [];
                            messages.push([this._app.user.username,message]);
                            this._messages.set(from, messages);
                        }));
                }

            });

            challengeBtn.addEventListener("click", (e)=>{
                this._friends_socket.emit("challenge", { username: e.target.dataset.username });
            });

            deleteBtn.addEventListener("click", (e)=>{
                friends.removeChild(friend);
                console.log(friend);
                this._friends_socket.emit("delete friend", { username: e.target.dataset.username });
            });
        }

        // Select all friend a elements
        const friendElements = document.querySelectorAll(".friendname-text-wrapper");

        // Loop through each friend element and add click event listener
        friendElements.forEach((friendElement) => {
            console.log("friend is ", friendElement.dataset.username);
            friendElement.addEventListener("click", () => {
                this._handleFriendProfileClicked(friendElement.dataset.username);
            });
        });





        let arrow = document.querySelectorAll(".arrow");
        for (i = 0; i < arrow.length; i++) {
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

    _handleSwipe(){       
        let startX, startY, endX, endY;

        document.addEventListener("touchstart", function(event) {
            // Récupération des coordonnées de départ
            startX = event.touches[0].pageX;
            startY = event.touches[0].pageY;
        });
        
        document.addEventListener("touchend", function(event) {
            // Récupération des coordonnées d'arrivée
            endX = event.changedTouches[0].pageX;
            endY = event.changedTouches[0].pageY;
        
            let sidebar = document.querySelector(".sidebar");
            // Calcul de la distance parcourue en X et en Y
            var distX = endX - startX;
            var distY = endY - startY;
        
            // Calcul de l'angle de déplacement
            var angle = Math.atan2(distY, distX) * 180 / Math.PI;
            
            if(Math.abs(distX) > 50 || Math.abs(distY) > 50) {
                // Détermination de la direction du swipe en fonction de l'angle
                if (angle >= -45 && angle < 45) {
                    // Swipe à droite
                    sidebar.classList.toggle("close");
                } else {
                    // Swipe à gauche
                    sidebar.classList.toggle("close");
                }
            }
        });
    }

    _attachEventListeners(){
        this.logoutBtn = document.getElementById("logout-link");
        this.addFriendBtn = document.querySelector(".fa-plus");

        this.logoutBtn.addEventListener("click", () => this._handleLogoutClicked());
        this.addFriendBtn.addEventListener("click", () => this._handleAddFriend());
        document.getElementById("profile").addEventListener("click", () => this._handleProfileClicked());
        this._handleSwipe();
    }


    _handleLogoutClicked(){
        logout()(this._app.dispatchEvent.bind(this._app));
    }

    _handleInvitations(){
        const list = document.querySelector('.friend-requests-list');

        const container = document.querySelector('.friend-requests-container');
        const leftButton = document.querySelector('.scroll-button.left');
        const rightButton = document.querySelector('.scroll-button.right');
        this.invitations.forEach(invitation => {
            const li = document.createElement("li");
            li.classList.add("friend-request");
            const sp = document.createElement("span");
            sp.classList.add("friend-request-name");
            sp.innerText = invitation;
            const sp2 = document.createElement("span");
            sp2.classList.add("friend-request-icons");
            let acceptIcon = document.createElement("i");
            let declineIcon = document.createElement("i");
            acceptIcon.classList.add("fa", "fa-check","accept-icon");
            declineIcon.classList.add("fa", "fa-times","decline-icon");

            li.appendChild(sp);
            li.appendChild(sp2);
            sp2.appendChild(acceptIcon);
            sp2.appendChild(declineIcon);
            list.appendChild(li);

            acceptIcon.addEventListener("click", () => {

                befriend({username: invitation})(this._app.dispatchEvent.bind(this._app));

                list.removeChild(li);
                //////////////////////////////
                let friends = document.querySelector(".friends");
                let username =  invitation;
                let friend = document.createElement("li");
                let friendName = document.createElement("a");

                let wrapper = document.createElement("div");
                wrapper.classList.add("friendicons-wrapper");

                let textwrapper = document.createElement("div");
                textwrapper.classList.add("friendname-text-wrapper");
                textwrapper.innerHTML = username;
                textwrapper.dataset.username = username;

                let msgBtn = document.createElement("i");
                let challengeBtn = document.createElement("i");
                let deleteBtn = document.createElement("i");

                msgBtn.classList.add( "fa", "fa-envelope");
                msgBtn.dataset.username = username;
                deleteBtn.classList.add( "fa", "fa-trash");
                deleteBtn.dataset.username = username;
                challengeBtn.classList.add( "fa", "fa-bolt");
                challengeBtn.dataset.username = username;

                friendName.appendChild(textwrapper);
                msgBtn.href = "#";
                friendName.classList.add("friend");
                friendName.dataset.username = username;
                friend.appendChild(friendName);
                friends.appendChild(friend);

                wrapper.appendChild(msgBtn);
                wrapper.appendChild(deleteBtn);
                wrapper.appendChild(challengeBtn);

                friendName.appendChild(wrapper);

                msgBtn.addEventListener("click", (e)=>{
                    if(!this._chat_open){
                        this._app.appendChild(new GameChat(this._app, e.target.dataset.username,
                            this._messages.get(e.target.dataset.username) ? this._messages.get(e.target.dataset.username) : [],
                            (from,message)=>{
                                let messages = this._messages.get(from) ? this._messages.get(from) : [];
                                messages.push([this._app.user.username,message]);
                                this._messages.set(from, messages);
                            }));
                    }else{
                        this._app.removeChild(this._app.lastChild);
                        this._app.appendChild(new GameChat(this._app, e.target.dataset.username,
                            this._messages.get(e.target.dataset.username) ? this._messages.get(e.target.dataset.username) : [],
                            (from,message)=>{
                                let messages = this._messages.get(from) ? this._messages.get(from) : [];
                                messages.push([this._app.user.username,message]);
                                this._messages.set(from, messages);
                            }));
                    }

                });

                challengeBtn.addEventListener("click", (e)=>{
                    this._friends_socket.emit("challenge", { username: e.target.dataset.username });
                });

                deleteBtn.addEventListener("click", (e)=>{
                    friends.removeChild(friend);
                    console.log(friend);
                    this._friends_socket.emit("delete friend", { username: e.target.dataset.username });

                });

            });

            declineIcon.addEventListener("click", () => {
                rejectfriend({username: invitation})(this._app.dispatchEvent.bind(this._app));

                list.removeChild(li);
            });
        });
        const items = Array.from(list.children);
        if(items.length !== 0){
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
    }

    writeUserData() {
        const invitation1 = document.querySelector(".friend-requests-list");

        this.invitations.forEach(invitation => {
            console.log(invitation);
            const li = document.createElement("li");
            li.classList.add("friend-request");
            const sp = document.createElement("span");
            sp.classList.add("friend-request-name");
            sp.innerText = invitation;
            const sp2 = document.createElement("span");
            sp2.classList.add("friend-request-icons");
            let acceptIcon = document.createElement("i");
            let declineIcon = document.createElement("i");
            acceptIcon.classList.add("accept-icon fa", "fa-check");
            declineIcon.classList.add("decline-icon fa", "fa-times");

            li.appendChild(sp);
            li.appendChild(sp2);
            sp2.appendChild(acceptIcon);
            sp2.appendChild(declineIcon);
            invitation1.appendChild(li);
        });







        const invitationList = this.shadowRoot.ownerDocument.getElementById("invitations");
        this.invitations.forEach(invitation => {

            const li = this.shadowRoot.ownerDocument.createElement("li");
            li.innerText = invitation;
            li.classList.add("pending");

            const acceptButton = this.shadowRoot.ownerDocument.createElement("button");
            acceptButton.classList.add("accept-button");
            acceptButton.innerText = "Accepter";
            acceptButton.addEventListener("click", () => {
                befriend({username: invitation})(this._app.dispatchEvent.bind(this._app));

                invitationList.removeChild(li);

                const newFriend = this.shadowRoot.ownerDocument.createElement("li");
                newFriend.innerText = invitation;
                friendList.appendChild(newFriend);
            });
            li.appendChild(acceptButton);

            const rejectButton = this.shadowRoot.ownerDocument.createElement("button");
            rejectButton.classList.add("accept-button");

            rejectButton.innerText = "Refuser";
            rejectButton.addEventListener("click", () => {
                rejectfriend({username: invitation})(this._app.dispatchEvent.bind(this._app));
                invitationList.removeChild(li);
            });
            li.appendChild(rejectButton);

            invitationList.appendChild(li);
        });


    }


    _handleProfileClicked(){
        while (this._app.firstChild) {
            this._app.removeChild(this._app.firstChild);
        }
        this._app.appendChild(new SideBar(this._app));
        this._app.appendChild(new ProfileComponent(this._app));
    }

    _handleFriendProfileClicked(friend) {
        while (this._app.firstChild) {
            this._app.removeChild(this._app.firstChild);
        }
        this._app.appendChild(new SideBar(this._app));
        this._app.appendChild(new FriendProfileComponent(this._app , friend));

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
