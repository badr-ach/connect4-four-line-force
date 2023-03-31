import {GameModal} from "../models/game.js";

export const history = async (req, res) => {
    try {
        
        const projection = { gameId: 1, playerOne: 1, playerTwo: 1,winner: 1};

        let history = await GameModal.findAll( {$or: [{ playerOne: req.username }, { playerTwo: req.username }]}, projection);

        res.status(200).json({ history: history });

    }catch (err){
        console.log("errrr ",err);
        res.status(500).json({ message: "Something went wrong" });
    }
}
