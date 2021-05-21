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
        //if stepped by dice
        if (this.stepsLeft.includes(stepPlayed)) {
            console.log("played: " + stepPlayed);
            // if is not a double
            if (this.stepsLeft.some(function (n) { return n !== stepPlayed; })) {
                this.stepsLeft = this.stepsLeft.filter(function (n) { return n !== stepPlayed; });
            }
            else {
                this.stepsLeft.pop();
            }
        }
        // if stepped not according dice (approved)
        else {
            // if is not a double
            if (this.stepsLeft.some(function (n) { return n !== stepPlayed; })) {
                //poping the bigger value - this is the "step" that has been made
                var biggerElement_1 = Math.max(this.stepsLeft[0], this.stepsLeft[1]);
                console.log("played: " + biggerElement_1);
                this.stepsLeft = this.stepsLeft.filter(function (n) { return n !== biggerElement_1; });
            }
            else {
                console.log("played: " + this.stepsLeft[0]);
                this.stepsLeft.pop();
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