import auth from "../middlewares/socket.js";
import { sendRequest, acceptRequest } from "../controllers/friends.js";

export const init_friends_socket = (io) => {

    io.of("/api/friends").use(auth);

    io.of("/api/friends").on("connection", (socket) => {

        socket.on("send request", (data) => sendRequest(data, io, socket));

        socket.on("accept request", (data) => acceptRequest(data, io, socket));
  
    });

}