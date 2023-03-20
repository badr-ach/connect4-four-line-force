import auth from "../middlewares/socket.js";

export const init_game_socket = (io) => {

    io.of("/api/chat").use(auth);

    io.of("/api/chat").on("connection", (socket) => {

      const users = [];
        for (let [id, socket] of io.of("/").sockets) {
            users.push({
            userID: id,
            username: socket.username,
            });
        }
        socket.emit("users", users);

      socket.on("join" , (room) => { socket.join(room) });
  
      // probably shared and should be stored with sockets playing the game
      socket.on("message", async (data) => setup(data, io));
  
    });

}