"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Player = void 0;
class Player {
    constructor(name, isTurn, hand) {
        this.name = name;
        this.isTurn = isTurn;
        this.hand = hand;
    }
    hasMatchingPair() {
        for (let i = 0; i < this.hand.length - 1; i++) {
            for (let j = i + 1; i < this.hand.length; j++) {
                if (this.hand[i].rank === this.hand[j].rank) {
                    return true;
                }
            }
        }
        return false;
    }
}
exports.Player = Player;
