import auth from "../middlewares/socket.js";

export const init_game_socket = (io) => {

    io.of("/api/friends").use(auth);

    io.of("/api/friends").on("connection", (socket) => {

        socket.on("send request", (data) => sendRequest(data, io, socket));

        socket.on("accept request", (data) => acceptRequest(data, io, socket));
  
    });

}