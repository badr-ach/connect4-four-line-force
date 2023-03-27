import {Animator} from "../../scripts/animator.js";

export class Register extends HTMLElement{
    constructor(app){
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.user = {
            name: "John Smith",
            email: "john.smith@gmail.com",
        };
        this.friends = ["Jane Doe", "Mark Johnson", "Emily Lee"];
        this.invitations = ["David Kim", "Amy Chen", "Tom Brown"];

        this.writeUserData();


    }



    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/profileComponent/profileComponent.html")
            .then((r) => r.text())
            .then((html) => html);

        this._attachEventListeners();
    }

    writeUserData() {
        this.shadowRoot.getElementById("name").innerText = this.user.name;
        this.shadowRoot.getElementById("email").innerText = this.user.email;


        const friendList = this.shadowRoot.getElementById("friends");
        this.friends.forEach(friend => {
            const li = this.shadowRoot.ownerDocument.createElement("li");
            li.innerText = friend;
            friendList.appendChild(li);
        });

        const invitationList = this.shadowRoot.ownerDocument.getElementById("invitations");
        this.invitations.forEach(invitation => {

            const li = this.shadowRoot.ownerDocument.createElement("li");
            li.innerText = invitation;
            li.classList.add("pending");

            const acceptButton = this.shadowRoot.createElement("button");
            acceptButton.classList.add("accept-button");
            acceptButton.innerText = "Accepter";
            acceptButton.addEventListener("click", () => {
                invitationList.removeChild(li);

                const newFriend = this.shadowRoot.createElement("li");
                newFriend.innerText = invitation;
                friendList.appendChild(newFriend);
            });
            li.appendChild(acceptButton);

            const rejectButton = this.shadowRoot.createElement("button");
            rejectButton.classList.add("accept-button");

            rejectButton.innerText = "Refuser";
            rejectButton.addEventListener("click", () => {
                invitationList.removeChild(li);
            });
            li.appendChild(rejectButton);

            invitationList.appendChild(li);
        });
    }


}

customElements.define("profile-component", Register);



