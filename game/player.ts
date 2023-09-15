import { Card } from "cards";

export class Player {
    public name: string;
    public hand: Card[];
    public isTurn: boolean;

    constructor(name: string, isTurn: boolean, hand: Card[]) {
        this.name = name;
        this.isTurn = isTurn;
        this.hand = hand;
    }

    public hasMatchingPair() {
        for (let i=0; i<this.hand.length-1; i++) {
            for (let j=i+1; i<this.hand.length; j++) {
                if (this.hand[i].rank === this.hand[j].rank) {
                    return true;
                }
            }
        }
        return false;
    }
}