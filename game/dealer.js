"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Dealer = void 0;
const shaibDeck_1 = require("./shaibDeck");
class Dealer {
    constructor() {
        this.deck = new shaibDeck_1.ShaibDeck();
    }
    drawInitialCards() {
        return this.deck.draw(Dealer.INITIAL_CARD_DRAW_COUNT);
    }
    addPair(cardPair) {
        if (cardPair[0].rank !== cardPair[1].rank) {
            throw new Error("Deposited cards should be equal in rank");
        }
        this.deck.add(cardPair[0]);
        this.deck.add(cardPair[1]);
    }
    drawCard() {
        return this.deck.draw(1)[0];
    }
    isDeckEmpty() {
        return this.deck.remainingLength === 0;
    }
}
exports.Dealer = Dealer;
Dealer.INITIAL_CARD_DRAW_COUNT = 12;
