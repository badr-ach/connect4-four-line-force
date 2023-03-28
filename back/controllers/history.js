import {GameModal} from "../models/game.js";

export const history = async (req, res) => {
    try {
        // define the projection to only include the "winner" and "_id" fields
        const projection = { gameId: 1, playerOne: 1, playerTwo: 1,winner: 1};

        // find all games played by the target user and only include the "winner" and "_id" fields
        let history = await GameModal.findAll( {$or: [{ playerOne: req.username }, { playerTwo: req.username }]}, projection);
            /*.toArray((err, games) => {
                if (err) throw err;

                // collect the game IDs and winners into an array of objects
                const gamesArray = games.map((game) => ({
                    id: game.gameId,
                    winner: game.winner,
                    playerOne: game.playerOne,
                    playerTwo: game.playerTwo
                }));

                return gamesArray;
            });*/
        console.log("history ",history);
        res.status(200).json({ history: history });



        /*console.log("in ");
        let history = [];
        history = await GameModal.findAll( {$or: [{ playerOne: req.username }, { playerTwo: req.username }]});
        console.log("out ");

        for (let i = 0; i < history.length; i++) {
            delete history.board;
            delete history.currColumns;
            delete history.currPlayer;
            delete history.gameOver;
        }

        console.log("history ",history);*/


    }catch (err){
        console.log("errrr ",err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
