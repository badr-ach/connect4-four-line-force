import auth from "../middlewares/socket.js";
import { sendRequest, acceptRequest } from "../controllers/friends.js";

export const init_friends_socket = (io) => {

    io.of("/api/friends").use(auth);

    io.of("/api/friends").on("connection", (socket) => {

        io.of("/api/friends").sockets[socket.id] = socket;

        console.log("User connect to friends socket namespace")

        socket.on("send request", (data) => sendRequest(data, io, socket));

        socket.on("accept request", (data) => acceptRequest(data, io, socket));
  
        socket.on("disconnect", () => {
            delete io.of("/api/friends").sockets[socket.id];
        });
    });

}