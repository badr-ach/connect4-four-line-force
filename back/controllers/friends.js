import { UserModal } from "../models/user.js"


export const sendRequest = async (data, io, socket) => {
    try {

        if (socket.username === data.username) return socket.emit("notify", { message: "You cannot send a friend request to yourself." });

        Object.values(io.of("/api/friends").sockets).forEach((socket) => console.log("socket" + socket.username + "socket id" + socket.id));

        let receiver = await UserModal.findOne({ username: data.username });

        console.log("socket username is " + socket.username);

        let sender = await UserModal.findOne({ username: socket.username });

        console.log("sender is " + JSON.stringify(sender));

        if (receiver) {

            if (receiver.friends.includes(socket.username)) {

                socket.emit("notify", { message: "You are already friends with this user." });
                return;
            }


            if (receiver.incomingFriendRequests.includes(sender.username)) {

                socket.emit("notify", { message: "You have already sent a friend request to this user." });
                return;
            }

            receiver.incomingFriendRequests.push(sender.username);

            sender.outgoingFriendRequests.push(receiver.username);

            await UserModal.updateOne({ username: data.username }, receiver);

            await UserModal.updateOne({ username: socket.username }, sender);

            Object.values(io.of("/api/friends").sockets).forEach((sock) => {

                console.log("socket" + sock.username + "socket id" + sock.id)

                if (sock.username === data.username) {

                    console.log("I am here in send request 4")

                    socket.to(sock.id).emit("friend request", { username: socket.username, message: `${socket.username} sent you a friend request.` });

                }

            });

            socket.emit("notify", { message: "Friend request sent." })
        } else {

            socket.emit("notify", { message: "User not found." })

        }

    } catch (err) {
        console.log(err)
    }
}

export const acceptRequest = async (data, io, socket) => {

    try {

        if (socket.username === data.username) return;

        let sender = await UserModal.findOne({ username: data.username });

        let receiver = await UserModal.findOne({ username: socket.username });

        if (sender) {

            if (!sender.friends.includes(socket.username) && !receiver.friends.includes(data.username)) {

                sender.friends.push(socket.username);

                receiver.friends.push(data.username);

                sender.outgoingFriendRequests.splice(sender.outgoingFriendRequests.indexOf(socket.username), 1);

                receiver.incomingFriendRequests.splice(receiver.incomingFriendRequests.indexOf(data.username), 1);
                
                await UserModal.updateOne({ username: data.username }, sender);

                await UserModal.updateOne({ username: socket.username }, receiver);

                socket.emit("notify", { message: "Friend request accepted." });

                // for (let [id, sock] in io.of("/api/friends").sockets) {

                //     if (sock.username === data.username) {

                        // socket.to(id).emit("notify", { message: `${socket.username} accepted your friend request.` });

                //     }
                // }

                Object.values(io.of("/api/friends").sockets).forEach((sock) => {
                    
                    console.log("socket" + sock.username + "socket id" + sock.id)
    
                    if (sock.username === data.username) {
    
                        console.log("I am here in send request 4")
    
                        socket.to(sock.id).emit("notify", { message: `${socket.username} accepted your friend request.` });
    
                    }
                });

                // socket.to(id).emit("friend request accepted", { username: socket.username });
            }

        }

    } catch (err) {

        console.log(err)

    }
}