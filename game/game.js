"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const dealer_1 = require("./dealer");
const player_1 = require("./player");
class Game {
    constructor(playerNames) {
        this.players = {};
        this.dealer = new dealer_1.Dealer();
        this.stage = "Stage-1";
        for (let i = 0; i < playerNames.length; i++) {
            const cards = this.dealer.drawInitialCards();
            this.players[playerNames[i]] = new player_1.Player(playerNames[i], i === 0, cards);
        }
    }
    playTurn(playerName, cards, opponentName, chosedCard) {
        if (!this.players[playerName].isTurn) {
            throw new Error("Not your turn");
        }
        if (this.stage === "Stage-1") {
            this.playStage1(playerName, cards);
        }
        if (this.stage === "Stage-2") {
            this.playStage2(playerName);
        }
        if (this.stage === "Stage-3") {
            this.playStage3(playerName, opponentName, chosedCard);
        }
        if (this.stage === "Stage-1" && this.checkStage2()) {
            this.stage = "Stage-2";
        }
        if (this.stage === "Stage-2" && this.checkStage3()) {
            this.stage = "Stage-3";
        }
        this.switchTurns(playerName);
    }
    isGameOver() {
        let res = false;
        Object.values(this.players).forEach((player) => {
            if (player.hand.length === 0) {
                res = true;
            }
        });
        return res;
    }
    checkStage2() {
        for (const player of Object.values(this.players)) {
            if (player.hasMatchingPair()) {
                return false;
            }
        }
        return true;
    }
    checkStage3() {
        return this.dealer.isDeckEmpty();
    }
    playStage1(playerName, cards) {
        if (cards && cards.length !== 2) {
            throw new Error("You must add 2 cards");
        }
        this.dealer.addPair(cards);
        this.players[playerName].hand = this.players[playerName].hand.filter((card) => {
            const matchingCardInPair = cards.find((c) => {
                return c.rank === card.rank && c.suit === card.suit;
            });
            return matchingCardInPair === undefined;
        });
    }
    playStage2(playerName) {
        const card = this.dealer.drawCard();
        this.playPairIfExists(playerName, card);
    }
    playStage3(playerName, opponentName, chosedCard) {
        this.players[opponentName].hand = this.players[opponentName].hand.filter((card) => {
            return card.rank === chosedCard.rank && card.suit === chosedCard.suit;
        });
        this.players[opponentName].hand.push(chosedCard);
        this.playPairIfExists(playerName, chosedCard);
    }
    playPairIfExists(playerName, card) {
        const matchingCardInHand = this.players[playerName].hand.find((c) => {
            return c.rank === card.rank;
        });
        if (matchingCardInHand !== undefined) {
            this.playStage1(playerName, [card, matchingCardInHand]);
        }
        else {
            this.players[playerName].hand.push(card);
        }
    }
    switchTurns(playerName) {
        this.players[playerName].isTurn = false;
        let flag = false;
        Object.keys(this.players).forEach((key) => {
            if (flag) {
                this.players[key].isTurn = true;
            }
            if (key === playerName) {
                flag = true;
            }
        });
    }
}
exports.Game = Game;
