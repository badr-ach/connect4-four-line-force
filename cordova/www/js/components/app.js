import { loadUser } from "../api/user.js";
import { events } from "../events/events.js";
import { Animator } from "../scripts/animator.js";
import { IntroMenu } from "./introMenuComponent/introMenuComponent.js";
import { LoggedIntroMenu } from "./loggedInMenuComponent/loggedInMenuComponent.js";
import { PopUp } from "./popUpComponent/popUpComponent.js";
import { SideBar } from "./sideBarComponent/sideBarComponent.js";

export class App extends HTMLElement {
  constructor() {
    super();
    this._animator = new Animator();
    this.token = window.localStorage.getItem("token");
    this.player = "guest";
  }

  async connectedCallback() {

    this.online = navigator.connection.type === Connection.UNKNOWN | Connection.NONE ? false : true;

    this.appendChild(new IntroMenu(this));
    this.attachEventListeners();
    if (!this.connected) {
      loadUser()(this.dispatchEvent.bind(this));
    }
    let ambient = new Audio("../../../audio/ambient.wav");
    ambient.loop = true;
    ambient.volume = 0.2;
    ambient.play();
  }

  attachEventListeners() {
    this.addEventListener(events.userLoaded, (data) =>
      this._handleUserLoaded(data)
    );
    this.addEventListener(events.signedOut, () => this._handleSignOut());
    this.addEventListener(events.error, (data) => this._handleError(data));
    this.addEventListener(events.popUp, (data) => this._handlePopUp(data));
    document.addEventListener(
      "offline",
      () => {
        this.onOffline();
      },
      false
    );
    document.addEventListener(
      "online",
      async () => {
        this.onOnline();
      },
      false
    );
  }

  onOffline() {
    this.online = false;
    for (let i = 0; i < this.children.length; i++) {
      this.removeChild(this.children[i]);
    }

    
    // Create the modal element and set its attributes
    const modal = document.createElement('div');
    modal.setAttribute('id', 'offline-modal');
    modal.innerHTML = `
      <div class="modal-content">
        <p>You're offline! Please check your internet connection.</p>
      </div>
      <div class="modal-overlay"></div>
    `;
  
    // Append the modal to the end of the document
    document.body.appendChild(modal);
  
  
  // Define the CSS for the modal
  const modalStyles = `
    #offline-modal {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        margin: auto;
      width: 90%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
  
    .modal-content {
      position: relative;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background-color: white;
      border-radius: 5px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 99999;
    }
  
    .modal-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 9998;
    }
  `;
  
    // Create a style element and add the modal styles to it
    const styleEl = document.createElement('style');
    styleEl.innerHTML = modalStyles;
    document.head.appendChild(styleEl);
    
    // Prevent clicks on the modal overlay from propagating to elements behind it
    const modalOverlay = document.querySelector('.modal-overlay');
    modalOverlay.addEventListener('click', e => e.stopPropagation());
    
    // Function to remove the modal from the DOM
    function closeModal() {
        const modal = document.getElementById('offline-modal');
        modal.remove();
    }
    
    // Add an event listener to the document to close the modal when clicked
    document.addEventListener('click', closeModal);
  
  }

  async onOnline() {
    if (!this.online) {
      await this.connectedCallback();
      this.online = true;
    }
  }

  _handleUserLoaded({ detail }) {
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }

    this.user = detail;
    this.connected = true;
    this.player = detail.username;
    this.token = window.localStorage.getItem("token");

    console.log("I got called");
    this.appendChild(new SideBar(this));
    this.appendChild(new LoggedIntroMenu(this));
  }

  _handleSignOut() {
    this.connected = false;
    this.token = null;
    this.player = "guest";
    while (this.firstChild) {
      this.removeChild(this.firstChild);
    }
    this.appendChild(new IntroMenu(this));
  }

  _handlePopUp({ detail }) {
    this.appendChild(
      new PopUp(
        this,
        detail.title,
        detail.content,
        detail.accept,
        detail.decline,
        detail.temporary
      )
    );
  }

  _handleError({ detail }) {
    this.appendChild(
      new PopUp(
        this,
        "Error",
        detail,
        () => {},
        () => {},
        true
      )
    );
  }
}

customElements.define("app-component", App);
