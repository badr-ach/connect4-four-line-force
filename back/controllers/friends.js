import { UserModal } from "../models/user.js"


export const sendRequest = async (data, io, socket) => {
    try{

        if(socket.username === data.username) return;

        let receiver = await UserModal.findOne({username: data.username});

        let sender = await UserModal.findOne({username: socket.username});

        if(receiver) {
            
            if(receiver.friends.includes(sender.username)) {

                socket.emit("notify", {message: "You are already friends with this user."});

            }

            receiver.incomingFriendRequests.push(sender.username);

            sender.outgoingFriendRequests.push(receiver.username);
        
            await receiver.save();

            await sender.save();

            for( let [id,sock] in io.of("/").sockets) {

                if(sock.username === data.username) {

                    socket.to(id).emit("friend request", {username: socket.username , message: `${socket.username} sent you a friend request.`});

                    socket.emit("notify", {message: "Friend request sent."})
                }
            }
        }

    } catch(err) {
        console.log(err)
    }
}

export const acceptRequest = async (data, io, socket) => {
    try{
        if(socket.username === data.username) return;

        let sender = await UserModal.findOne({username: data.username});

        let receiver = await UserModal.findOne({username: socket.username});

        if(sender){

            if(!sender.friends.includes(socket.username) && !receiver.friends.includes(data.username)) {

                sender.friends.push(socket.username);

                receiver.friends.push(data.username);

                await sender.save();

                socket.emit("notify", {message: "Friend request accepted."});

                socket.emit("friend request accepted", {username: data.username});

                for( let [id,sock] in io.of("/").sockets) {

                    if(sock.username === data.username) {

                        socket.to(id).emit("notify", {message: `${socket.username} accepted your friend request.`});

                        socket.to(id).emit("friend request accepted", {username: socket.username});
                    }
                }
            }

        }


    }catch(err){
        console.log(err)
    }
}