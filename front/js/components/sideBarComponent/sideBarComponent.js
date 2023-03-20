import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";
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
    }


    async connectedCallback(){
        this.shadowRoot.innerHTML =
            await fetch("./js/components/sideBarComponent/sideBarComponent.html")
            .then((r) => r.text())
            .then((html) => html);



        this._attachEventListeners();
    }
    _attachEventListeners(){

    }


}

customElements.define("side-bar-component", SideBar);
