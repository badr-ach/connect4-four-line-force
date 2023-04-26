import {Animator} from "../../scripts/animator.js";

export class PopUp extends HTMLElement{
    constructor(app, title, content,accept, decline, temporary = false){
        super();
        this._app = app;
        this.title = title;
        this.content = content;
        this.accept = accept;
        this.decline = decline;
        this.temporary = temporary;
        this.attachShadow({mode: "open"});
        this._animator = new Animator();
    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/popUpComponent/popUpComponent.html")
            .then((r) => r.text())
            .then((html) => html);
        this.shadowRoot.querySelector("#popup-title").innerHTML = this.title;
        this.shadowRoot.querySelector("#popup-message").innerHTML = this.content;
        this.shadowRoot.querySelector(".modal").style.display = "block";
        if(this.temporary){
            this.shadowRoot.querySelector(".button1").style.display = "none";
            this.shadowRoot.querySelector(".button2").style.display = "none";
        }

        new Audio("../../../audio/notification.wav").play();

        this._attachEventListeners();
        if(this.temporary){
            setTimeout(() => {
                this._animator.beginAnimation("slide-left", this, () => {
                    this._app.removeChild(this);
                });
            }, 200000);
        }
        navigator.vibrate(500);
    }

    _attachEventListeners(){
        this.shadowRoot.querySelector(".close").addEventListener("click", () => this._handleCloseClick());
        if(!this.temporary){
            this.shadowRoot.querySelector(".button1").addEventListener("click", () => this._handleAcceptClick());
            this.shadowRoot.querySelector(".button2").addEventListener("click", () => this._handleDeclineClick());
        }
    }

    _handleCloseClick(){
        this.decline();
        new Audio("../../../audio/decline.wav").play();
        this._app.removeChild(this);
    }

    _handleAcceptClick(){
        this.accept();
        new Audio("../../../audio/accept.wav").play();
        this._app.removeChild(this);
    }

    _handleDeclineClick(){
        this.decline();
        new Audio("../../../audio/decline.wav").play();
        this._app.removeChild(this);
    }

}

customElements.define("pop-up", PopUp);
