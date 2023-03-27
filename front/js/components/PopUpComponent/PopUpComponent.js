import {Animator} from "../../scripts/animator.js";



export class PopUp extends HTMLElement{
    constructor(app){
        super();
        this._app = app;
        this.attachShadow({mode: "open"});
        this._animator = new Animator();
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/popUpComponent/popUpComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        this._attachEventListeners();
    }

    _attachEventListeners(){

    }


}
