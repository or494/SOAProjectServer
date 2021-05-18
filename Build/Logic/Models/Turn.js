"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Turn = /** @class */ (function () {
    function Turn(player) {
        this.whosTurn = player;
    }
    Turn.prototype.InitTurn = function (dicesRes) {
        this.stepsLeft = dicesRes;
        if (this.IsDouble())
            this.stepsLeft = dicesRes.concat(dicesRes);
        this.movementsLeftCounter = this.IsDouble() ? 4 : 2;
    };
    Turn.prototype.UpdateTurn = function (stepPlayed) {
        this.movementsLeftCounter--;
        this.stepsLeft = this.stepsLeft.filter(function (n) { return n !== stepPlayed; });
        //if its a double on the dices and therefore all numbers have been removed
        if ((this.stepsLeft === undefined || this.stepsLeft.length === 0) &&
            this.movementsLeftCounter !== 0) {
            for (var i = 0; i < this.movementsLeftCounter; i++) {
                this.stepsLeft.push(stepPlayed);
            }
        }
    };
    Turn.prototype.IsDouble = function () {
        return this.stepsLeft[0] === this.stepsLeft[1];
    };
    return Turn;
}());
exports.default = Turn;
//# sourceMappingURL=Turn.js.map