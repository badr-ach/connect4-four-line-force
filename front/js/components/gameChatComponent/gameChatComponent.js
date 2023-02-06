export class GameChat extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });

      this.shadowRoot.innerHTML = `
        <style>
            @import url("../gameChatComponent/gameChatComponent.css");
        </style>
        <div>
            <div class="chat-container">
                <div class="chat">
                    <div class="message"><b>username : </b> <span>message</span></div>
                </div>
                <div class="message-sender">
                    <input type="text" class="message-box">
                    <button class="send-button"><img src="https://icons-for-free.com/iconfiles/png/512/part+1+message-1320568353446515556.png"></button>
                </div>
            </div>
            <button class="chat-open-button" ><img class="chat-icon" src="https://icons-for-free.com/iconfiles/png/512/part+1+message-1320568353446515556.png"></button>
        </div>
      `;
    }
}

customElements.define("game-chat", GameChat);
