import { init_game_socket } from "./routes/game.js";

export default function (io) {

  init_game_socket(io);

  init_chat_socket(io);

}

