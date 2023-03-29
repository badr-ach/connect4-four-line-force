import {IntroMenu} from "../introMenuComponent/introMenuComponent.js";
import {Animator} from "../../scripts/animator.js";


export class LoadingPage extends HTMLElement {
    constructor(app) {
        super();
        this.attachShadow({ mode: "open" });
        this._app = app;
        this._animator = new Animator();
    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch(
        "./js/components/loadingPageComponent/loadingPageComponent.html"
        )
        .then((r) => r.text())
        .then((html) => html);
    }
}

customElements.define("loading-page", LoadingPage);

