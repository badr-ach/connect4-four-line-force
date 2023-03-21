import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";
import {logout} from "../../api/user.js";
/*

const body = document.querySelector('body'),
    sidebar = body.querySelector('nav'),
    toggle = body.querySelector(".toggle"),
    searchBtn = body.querySelector(".search-box"),
    modeSwitch = body.querySelector(".toggle-switch"),
    modeText = body.querySelector(".mode-text");


toggle.addEventListener("click" , () =>{
    sidebar.classList.toggle("close");
})

searchBtn.addEventListener("click" , () =>{
    sidebar.classList.remove("close");
})
*/

export class SideBar extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.friendList = ["friend1", "friend3", "friend2"];
        this._friendValue = "";

    }



    async connectedCallback(){
        this.shadowRoot.innerHTML =
            await fetch("./js/components/sideBarComponent/sideBarComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        this._logoutBtn = this.shadowRoot.querySelector(".bx-log-out");
        this._addFriendBtn = this.shadowRoot.querySelector(".bx-plus");
        this._attachEventListeners();
    }
    _attachEventListeners(){
        this._logoutBtn.addEventListener("click", () => this._handleLogoutClicked());
        this._addFriendBtn.addEventListener("click", () => this.addFriend());
    }

    _handleLogoutClicked(){
        logout()(this._app.dispatchEvent.bind(this._app));
    }


    addFriend(){
        this._friendValue = this.shadowRoot.getElementById("searchFriend");
        console.log(this._friendValue);
        console.log(this._friendValue.value);
    }


}

customElements.define("side-bar-component", SideBar);
