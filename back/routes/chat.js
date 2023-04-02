import auth from "../middlewares/socket.js";

export const init_chat_socket = (io) => {

    io.of("/api/chat").use(auth);

    io.of("/api/chat").on("connection", (socket) => {

      console.log("user connected to chat namespace");

      const users = [];

      if(Object.values(io.of("/api/friends").sockets).filter((sock) => sock.username === socket.username).length === 0)
        io.of("/api/chat").sockets[socket.id] = socket;

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
      io.of("/api/chat").emit("user connected", {
        userID: socket.id,
        username: socket.username,
      });

      socket.on("user connected", (user) => {
        if(!users.find((u) => u.userID === user.userID))
          users.push(user);
      });

      socket.on("disconnect", () => {
        delete io.of("/api/chat").sockets[socket.id];
        users.splice(users.findIndex((user) => user.userID === socket.id), 1);
        socket.broadcast.emit("user disconnected", socket.id);
      });

      socket.on("user disconnected", (id) => {
        users.splice(users.findIndex((user) => user.userID === id), 1);
      });

      socket.on("private message", ({ content, to }) => {
        users.forEach((user) => {
          if (user.username === to) {
            socket.to(user.userID).emit("private message", {
              content,
              from: socket.username,
            });
          }
        });
      });
  
    });

}