
import { Animator } from "../../scripts/animator.js";
import { events } from "../../events/events.js";
import {logout} from "../../api/user.js";
import {SideBar} from "../test/sideBarComponent.js";



this.user = {
    name: "John Smith",
    email: "john.smith@example.com",
};
this.friends = ["Jane Doe", "Mark Johnson", "Emily Lee"];

this.invitations = ["David Kim", "Amy Chen", "Tom Brown"];




    document.getElementById("name").innerText = user.name;
    document.getElementById("email").innerText = user.email;

    const friendList = document.getElementById("friends");
    friends.forEach(friend => {
    const li = document.createElement("li");
    li.innerText = friend;
    friendList.appendChild(li);
});

const invitationList = document.getElementById("invitations");
invitations.forEach(invitation => {
    //const li = document.createElement("li");
    //li.innerText = invitation;
    //li.classList.add("pending");
    //invitationList.appendChild(li);
    const li = document.createElement("li");
    li.innerText = invitation;
    li.classList.add("pending");

    const acceptButton = document.createElement("button");
    acceptButton.innerText = "Accepter";
    acceptButton.addEventListener("click", () => {
        // Remove invitation from the list of pending invitations
        invitationList.removeChild(li);

        // Add friend to the list of friends
        const newFriend = document.createElement("li");
        newFriend.innerText = invitation;
        friendList.appendChild(newFriend);
    });
    li.appendChild(acceptButton);

    const rejectButton = document.createElement("button");
    rejectButton.innerText = "Refuser";
    rejectButton.addEventListener("click", () => {
        invitationList.removeChild(li);
    });
    li.appendChild(rejectButton);

    invitationList.appendChild(li);
});



