import auth from "../middlewares/socket.js";
import { sendRequest, acceptRequest, deleteFriend } from "../controllers/friends.js";

export const init_friends_socket = (io) => {

    io.of("/api/friends").use(auth);

    io.of("/api/friends").on("connection", (socket) => {

        io.of("/api/friends").sockets[socket.id] = socket;

        console.log("User connect to friends socket namespace")

        socket.on("send request", (data) => sendRequest(data, io, socket));

        socket.on("accept request", (data) => acceptRequest(data, io, socket));

        socket.on("delete friend", (data) => deleteFriend(data, io, socket));
  
        socket.on("disconnect", () => {
            delete io.of("/api/friends").sockets[socket.id];
        });

        socket.on("challenge", (data) => {
            Object.values(io.of("/api/friends").sockets).forEach((sock) => {
                if (sock.username === data.username) {
                    socket.to(sock.id).emit("challenge", 
                    { username: socket.username, message: `${socket.username} has challenged you to a game.` });
                }
            });
        });

        socket.on("challenge accepted", (data) => {
            Object.values(io.of("/api/friends").sockets).forEach((sock) => {
                if (sock.username === data.username) {
                    socket.to(sock.id).emit("challenge accepted", 
                    { username: socket.username, message: `${socket.username} has accepted your challenge.` });
                }
            });
        });

        socket.on("challenge declined", (data) => {
            Object.values(io.of("/api/friends").sockets).forEach((sock) => {
                if (sock.username === data.username) {
                    socket.to(sock.id).emit("challenge declined", 
                    { username: socket.username, message: `${socket.username} has declined your challenge.` });
                }
            });
        });
    });

}