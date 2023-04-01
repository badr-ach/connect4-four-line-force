import { Animator } from "../../scripts/animator.js";
import { WebSocket } from "../../utils/WebSocket.js";

export class LocalConnect4 extends HTMLElement {
    constructor() {
        super();
        this.playerRed = "R";
        this.playerYellow = "Y";
        this.currPlayer = this.playerRed;

        this.gameOver = false;
        this.board = [];

        this.rows = 6;
        this.columns = 7;
        this.currColumns = []; //keeps track of which row each column is at.

        this.attachShadow({ mode: "open" });

    }

    async connectedCallback() {
        this.shadowRoot.innerHTML = await fetch("./js/components/localGameComponent/localGameComponent.html")
            .then((r) => r.text())
            .then((html) => html);

        this._setGame();
    }

    _setGame() {
        this.board = [];
        this.currColumns = [5, 5, 5, 5, 5, 5, 5];
        console.log("this.currColumns", this.currColumns);

        for (let r = 0; r < this.rows; r++) {
            let row = [];
            for (let c = 0; c < this.columns; c++) {
                // JS
                row.push(' ');
                // HTML
                let tile = this.shadowRoot.ownerDocument.createElement("div");
                tile.id = r.toString() + "-" + c.toString();
                tile.classList.add("tile");
                tile.addEventListener("click", this._setPiece);
                this.shadowRoot.getElementById("board").append(tile);
            }
            this.board.push(row);
        }
    }

    _setPiece() {
        if (this.gameOver) {
            return;
        }

        //get coords of that tile clicked
        console.log("this id", this.id);
        let coords = this.id.split("-");
        let r = parseInt(coords[0]);
        let c = parseInt(coords[1]);
        console.log("coords", r,c);

        // figure out which row the current column should be on
        console.log("currColumns", this.currColumns);
        r = this.currColumns[c];
        console.log("r", this.currColumns[c]);

        if (r < 0) { // board[r][c] != ' '
            return;
        }

        this.board[r][c] = this.currPlayer; //update JS board
        let tile = this.shadowRoot.getElementById(r.toString() + "-" + c.toString());
        if (this.currPlayer === this.playerRed) {
            tile.classList.add("red-piece");
            this.currPlayer = this.playerYellow;
        }
        else {
            tile.classList.add("yellow-piece");
            this.currPlayer = this.playerRed;
        }

        r -= 1; //update the row height for that column
        this.currColumns[c] = r; //update the array

        this._checkWinner();
    }

    _checkWinner() {
        // horizontal
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++){
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r][c+1] && this.board[r][c+1] == this.board[r][c+2] && this.board[r][c+2] == this.board[r][c+3]) {
                        this._setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // vertical
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows - 3; r++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r+1][c] && this.board[r+1][c] == this.board[r+2][c] && this.board[r+2][c] == this.board[r+3][c]) {
                        this._setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // anti diagonal
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r+1][c+1] && this.board[r+1][c+1] == this.board[r+2][c+2] && this.board[r+2][c+2] == this.board[r+3][c+3]) {
                        this._setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // diagonal
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r-1][c+1] && this.board[r-1][c+1] == this.board[r-2][c+2] && this.board[r-2][c+2] == this.board[r-3][c+3]) {
                        this._setWinner(r, c);
                        return;
                    }
                }
            }
        }
    }

    _setWinner(r, c) {
        let winner = this.shadowRoot.getElementById("winner");
        if (this.board[r][c] === this.playerRed) {
            winner.innerText = "Red Wins";
        } else {
            winner.innerText = "Yellow Wins";
        }
        this.gameOver = true;
    }

    /*_handleSaveGame(){
        this._socket.emit("saveGame", { gameId: this._gameId });
        this._socket.on("savedGame", (data) => {
            alert(data.message);
        });
    }

    _handleMouseHover(e) {
        if (this.gameOver) {
            return;
        }
        let column = e.target.getAttribute("column");
        let row = this.currColumns[column];

        if (row < 0) {
            return;
        }
        this.board[row][column] = this.currPlayer;
        this.renderBoard();
    }

    _handleMouseOut(e) {
        if (this.gameOver) {
            return;
        }
        let column = e.target.getAttribute("column");
        let row = this.currColumns[column];
        if (row < 0) {
            return;
        }
        this.board[row][column] = 0;
        this.renderBoard();
    }

    dropPiece(e) {
        if (this.gameOver) {
            return;
        }

        if (this.currPlayer !== 1) {
            return;
        }

        if(e.target.getAttribute("column") === null ||
            e.target.getAttribute("row") === null ||
            e.target.tagName !== "TD")
            return;

        let column = e.target.getAttribute("column");
        if (column === 0) {
            return;
        }
        let row = this.currColumns[column];
        if (row < 0) {
            return;
        }

        console.log(this.playerRed);

        WebSocket.getSocketByNameSpace("/api/game").emit("newMove", {
            gameId: this._gameId,
            move: [row, column],
            player: this.playerRed,
        });
    }

    renderBoard() {
        let tiles = this.shadowRoot.querySelectorAll(".tile");
        for (let i = 0; i < tiles.length; i++) {
            let row = tiles[i].getAttribute("row");
            let column = tiles[i].getAttribute("column");
            if (this.board[row][column] === 1) {
                tiles[i].classList.add("red-piece");
            } else if (this.board[row][column] === 2) {
                tiles[i].classList.add("yellow-piece");
            } else {
                tiles[i].classList.remove("red-piece");
                tiles[i].classList.remove("yellow-piece");
            }
        }

        if (this.winner !== null) {
            let winner_name = this.winner === 1 ? "Red" : "Yellow";
            this.shadowRoot.querySelector("#winner").innerHTML =
                this.winner == "Tie" ? "Tie!" : winner_name + " wins!";
        }
    }

    changePlayer() {
        if (this.currPlayer === 1) {
            this.currPlayer = 2;
        } else {
            this.currPlayer = 1;
        }
    }

    reset() {
        this.board = [];
        this.currColumns = [];
        this.gameOver = false;
        this.currPlayer = 1;
        this.shadowRoot.querySelector("#winner").innerHTML = "";
        this.shadowRoot.querySelector("#board").innerHTML = "";
        this.createBoard();
    }*/
}

customElements.define("local-connect-4", LocalConnect4);
