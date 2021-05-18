
class Turn {
    movementsLeftCounter!: number
    whosTurn!: boolean
    stepsLeft!: Array<number>
    constructor(player: boolean) {
      this.whosTurn = player
    }
  
    InitTurn(dicesRes: Array<number>) {
      this.stepsLeft =  dicesRes
      if(this.IsDouble()) this.stepsLeft = dicesRes.concat(dicesRes)
      this.movementsLeftCounter = this.IsDouble() ? 4 : 2
    }
  
    UpdateTurn(stepPlayed: number) {
      this.movementsLeftCounter--
      this.stepsLeft = this.stepsLeft.filter((n) => n !== stepPlayed)
      //if its a double on the dices and therefore all numbers have been removed
      if (
        (this.stepsLeft === undefined || this.stepsLeft.length === 0) &&
        this.movementsLeftCounter !== 0
      ) {
        for (let i = 0; i < this.movementsLeftCounter; i++) {
          this.stepsLeft.push(stepPlayed)
        }
      }
    }
  
    private IsDouble() {
      return this.stepsLeft[0] === this.stepsLeft[1]
    }
  }

  export default Turn