import auth from "../middlewares/socket.js";

export const init_game_socket = (io) => {

    io.of("/api/chat").use(auth);

    io.of("/api/chat").on("connection", (socket) => {

      const users = [];

      for (let [id, socket] of io.of("/api/chat").sockets) {
        //todo: check if user is friend with socket.username
            users.push({
            userID: id,
            username: socket.username,
            });
      }
      
      // send the users friend list to the client
      socket.emit("connected friends", users);

      // when a user connects, send the users friend list to all connected clients
      socket.broadcast.emit("user connected", {
        userID: socket.id,
        username: socket.username,
      });

      socket.on("disconnect", () => {
        socket.broadcast.emit("user disconnected", socket.id);
      });

      socket.on("user disconnected", (id) => {
        users.splice(users.findIndex((user) => user.userID === id), 1);
      });

      socket.on("private message", ({ content, to }) => {
        if(users.findIndex((user) => user.userID === to) === -1) return;
        socket.to(to).emit("private message", {
          content,
          from: socket.id,
        });
      });
  
    });

}