import { events } from "../../events/events.js";
import { Animator } from "../../scripts/animator.js";


export class IntroMenu extends HTMLElement {
  constructor(app) {
    super();
    this.attachShadow({ mode: "open" });

    this._app = app;
    this._animator = new Animator();
    this.toggle = false;
  }

  async connectedCallback() {
    this.shadowRoot.innerHTML = await fetch(
      "./js/components/introMenuComponent/introMenuComponent.html"
    )
      .then((r) => r.text())
      .then((html) => html);
    this.circle = this.shadowRoot.getElementById("big-card");
    this.waves = this.shadowRoot.getElementById("waves");
    this.lilCards = this.shadowRoot.querySelectorAll(".little-card");
    this._attachEventListeners();
  }

  _attachEventListeners() {
    this.circle.addEventListener("click", () => this._handleCircleClick());
    this.lilCards[0].addEventListener("click", () => this._handleLoginClick());
    this.lilCards[1].addEventListener("click", () => this._handleSignUpClick());

    console.log(this.lilCards[2])
    this.lilCards[2].addEventListener("click", () => this._handleGuestClick());
  }

  _handleLoginClick() {
    this._app.dispatchEvent(new CustomEvent(events.loginClicked));
  }

  _handleSignUpClick() {
    this._app.dispatchEvent(new CustomEvent(events.signUpClicked));
  }

  _handleGuestClick() {
    this._handleCircleClick();
    this._animator.beginAnimation("slide-left",this, () => {
      this._app.dispatchEvent(new CustomEvent(events.guestClicked));
    });
  }

  _handleCircleClick() {
    if (this.toggle === false) {
      this.waves.classList.remove("active-waves");
      this.circle.style.left = "35%";
      for (let i = 0; i < this.lilCards.length; i++) {
        this.lilCards[i].style.left = "50%";
      }
      this.toggle = true;
    } else {
      this.waves.classList.add("active-waves");
      this.circle.style.left = "";
      for (let i = 0; i < this.lilCards.length; i++) {
        this.lilCards[i].style.left = "0%";
      }
      this.toggle = false;
    }
  }
}

customElements.define("intro-menu", IntroMenu);
