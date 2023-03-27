import { init_game_socket } from "./routes/game.js";
import { init_friends_socket } from "./routes/friends.js";
import { init_chat_socket } from "./routes/chat.js";

export default function (io) {

  init_game_socket(io);

  init_friends_socket(io);

  init_chat_socket(io);

}

