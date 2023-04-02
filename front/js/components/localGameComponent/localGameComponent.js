import {SideBar} from "../sideBarComponent/sideBarComponent.js";
import {Animator} from "../../scripts/animator.js";
import {events} from "../../events/events.js";
import {LoggedIntroMenu} from "../loggedInMenuComponent/loggedInMenuComponent.js";


export class LocalGame extends HTMLElement {
    constructor(app) {
        super();
        this.attachShadow({mode: "open"});
        this._app = app;
        this._animator = new Animator();
        this.playerRed = "R";
        this.playerYellow = "Y";
        this.currPlayer = this.playerRed;


        this.gameOver = false;
        this.board;

        this.rows = 6;
        this.columns = 7;
        this.currColumns = [5, 5, 5, 5, 5, 5, 5];


    }

    async connectedCallback(){
        this.shadowRoot.innerHTML = await fetch("./js/components/localGameComponent/localGameComponent.html")
            .then((r) => r.text())
            .then((html) => html);

        this.setGame();


    }

    setGame() {
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
                let yes = r.toString() + "-" + c.toString();
                tile.id = r.toString() + "-" + c.toString();
                tile.classList.add("tile");


                tile.addEventListener("click",  () => {
                    if (this.gameOver) {
                        return;
                    }
                    console.log("clicked: ", yes);
                    //get coords of that tile clicked
                    let coords = yes.split("-");
                    let r = parseInt(coords[0]);
                    let c = parseInt(coords[1]);
                    console.log("r: ",r," c: ",c)
                    // figure out which row the current column should be on
                    console.log("curr col: ",this.currColumns)
                    r = this.currColumns[c];

                    if (r < 0) { // board[r][c] != ' '
                        return;
                    }

                    this.board[r][c] = this.currPlayer; //update JS board
                    let tile = this.shadowRoot.getElementById(r.toString() + "-" + c.toString());
                    this.switchTurn();
                    if (this.currPlayer == this.playerRed) {
                        tile.classList.add("red-piece");
                        this.currPlayer = this.playerYellow;
                    } else {
                        tile.classList.add("yellow-piece");
                        this.currPlayer = this.playerRed;
                    }

                    r -= 1; //update the row height for that column
                    console.log("curr col: ",this.currColumns)
                    this.currColumns[c] = r;


                    this.checkWinner();
                });

                this.shadowRoot.getElementById("board").append(tile);
            }
            this.board.push(row);
        }
    }




    checkWinner() {
        // horizontal
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r][c + 1] && this.board[r][c + 1] == this.board[r][c + 2] && this.board[r][c + 2] == this.board[r][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // vertical
        for (let c = 0; c < this.columns; c++) {
            for (let r = 0; r < this.rows - 3; r++) {
                if (this.board[r][c] !== ' ') {
                    if (this.board[r][c] === this.board[r + 1][c] && this.board[r + 1][c] == this.board[r + 2][c] && this.board[r + 2][c] == this.board[r + 3][c]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // anti diagonal
        for (let r = 0; r < this.rows - 3; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r + 1][c + 1] && this.board[r + 1][c + 1] == this.board[r + 2][c + 2] && this.board[r + 2][c + 2] == this.board[r + 3][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }

        // diagonal
        for (let r = 3; r < this.rows; r++) {
            for (let c = 0; c < this.columns - 3; c++) {
                if (this.board[r][c] != ' ') {
                    if (this.board[r][c] == this.board[r - 1][c + 1] && this.board[r - 1][c + 1] == this.board[r - 2][c + 2] && this.board[r - 2][c + 2] == this.board[r - 3][c + 3]) {
                        this.setWinner(r, c);
                        return;
                    }
                }
            }
        }
    }
    switchTurn() {
        let turn = this.shadowRoot.querySelector(".turn");
        turn.removeChild(turn.childNodes[2]);
        if (this.currPlayer === this.playerYellow) {
            let span = this.shadowRoot.ownerDocument.createElement("span");
            span.classList.add("redCircle");
            turn.appendChild(span);
        }
        if (this.currPlayer === this.playerRed) {
            let span1 = this.shadowRoot.ownerDocument.createElement("span");
            span1.classList.add("yellowCircle");
            turn.appendChild(span1);
        }
    }


    setWinner(r, c) {
        let winner = this.shadowRoot.getElementById("winner");
        let win = "";
        if (this.board[r][c] == this.playerRed) {
            winner.innerText = "Red Wins";
            win = "Red Wins";
        } else {
            winner.innerText = "Yellow Wins";
            win = "Yellow Wins";
        }
        this.gameOver = true;

    }


}

customElements.define("local-component", LocalGame);

