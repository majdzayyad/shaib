"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShaibDeck = void 0;
const cards_1 = require("cards");
const standard_1 = require("cards/build/ranks/standard");
const suits_1 = require("cards/build/suits");
const suits = [suits_1.spades, suits_1.hearts, suits_1.diamonds, suits_1.clubs];
const ranks = [
    standard_1.standard.ace,
    standard_1.standard.two,
    standard_1.standard.three,
    standard_1.standard.four,
    standard_1.standard.five,
    standard_1.standard.six,
    standard_1.standard.seven,
    standard_1.standard.eight,
    standard_1.standard.nine,
    standard_1.standard.ten,
    standard_1.standard.jack,
    standard_1.standard.queen,
    standard_1.standard.king
];
class ShaibDeck extends cards_1.decks.Deck {
    constructor() {
        const cards = ShaibDeck.generateCards();
        super({ cards });
    }
    static generateCards() {
        const cards = [];
        ranks.forEach((rank) => {
            if (rank === standard_1.standard.king) {
                cards.push(new cards_1.Card(suits_1.spades, rank));
            }
            else {
                suits.forEach((suit) => {
                    cards.push(new cards_1.Card(suit, rank));
                });
            }
        });
        return cards;
    }
}
exports.ShaibDeck = ShaibDeck;
