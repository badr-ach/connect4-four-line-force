function getRatingDelta(myRating, opponentRating, myGameResult) {

    if ([0, 0.5, 1].indexOf(myGameResult) === -1) {
      return null;
    }

    let myChanceToWin = 1 / ( 1 + Math.pow(10, (opponentRating - myRating) / 400));

    return Math.round(25 * (myGameResult - myChanceToWin));
  }

export function getNewRating(myRating, opponentRating, myGameResult) {
    let res = myRating + getRatingDelta(myRating, opponentRating, myGameResult);
    return res >= 0 ? res : 0;
}