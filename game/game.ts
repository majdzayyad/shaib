import { Card } from "cards";
import { Dealer } from "./dealer";
import { Player } from "./player";

export class Game {
    private players: Record<string, Player>;
    private dealer: Dealer;
    private stage: "Stage-1" | "Stage-2" | "Stage-3";

    constructor(playerNames: string[]) {
        this.players = {};
        this.dealer = new Dealer();
        this.stage = "Stage-1";

        for (let i = 0; i < playerNames.length; i++) {
            const cards = this.dealer.drawInitialCards();
            this.players[playerNames[i]] = new Player(playerNames[i], i === 0, cards);
        }
    }

    public playTurn(playerName: string, cards?: [Card, Card], opponentName?: string, chosedCard?: Card) {
        if (!this.players[playerName].isTurn) {
            throw new Error("Not your turn");
        }

        if (this.stage === "Stage-1") {
            this.playStage1(playerName, cards as [Card, Card]);
        }
        if (this.stage === "Stage-2") {
            this.playStage2(playerName);
        }
        if (this.stage === "Stage-3") {
            this.playStage3(playerName, opponentName as string, chosedCard as Card);
        }
        if (this.stage === "Stage-1" && this.checkStage2()) {
            this.dealer.shuffle();
            this.stage = "Stage-2";
        } 
        if (this.stage === "Stage-2" && this.checkStage3()) {
            this.stage = "Stage-3"
        }
        this.switchTurns(playerName);
    }

    public getPlayerStates() {
        return Object.values(this.players).map((player) => {
            return {
                cards: player.hand.map((card) => {
                    return {
                        rank: card.rank.toString(),
                        suit: card.suit.toString()
                    }
                }),
                playerName: player.name
            };
        });
    }

    public isGameOver() {
        let res = false;
        Object.values(this.players).forEach((player) => {
            if (player.hand.length === 0) {
                res = true;
            }
        })
        return res;
    }

    private checkStage2() {
        for (const player of Object.values(this.players)) {
            if (player.hasMatchingPair()) {
                return false;
            }
        }
        return true;
    }

    private checkStage3() {
        return this.dealer.isDeckEmpty();
    }

    private playStage1(playerName: string, cards: [Card, Card]) {
        if (cards && cards.length !== 2) {
            throw new Error("You must add 2 cards");
        }

        this.dealer.addPair(cards);
        this.players[playerName].hand = this.players[playerName].hand.filter((card) => {
            const matchingCardInPair = cards.find((c) => {
                return c.rank === card.rank && c.suit === card.suit;
            })
            return matchingCardInPair === undefined;
        });
    }

    private playStage2(playerName: string) {
        const card = this.dealer.drawCard();
        this.playPairIfExists(playerName, card);
    }

    private playStage3(playerName: string, opponentName: string, chosedCard: Card) {
        this.players[opponentName].hand = this.players[opponentName].hand.filter((card) => {
            return card.rank === chosedCard.rank && card.suit === chosedCard.suit;
        });
        this.players[opponentName].hand.push(chosedCard);
        this.playPairIfExists(playerName, chosedCard);
    }

    private playPairIfExists(playerName: string, card: Card) {
        const matchingCardInHand = this.players[playerName].hand.find((c) => {
            return c.rank === card.rank;
        });

        if (matchingCardInHand !== undefined) {
            this.playStage1(playerName, [card, matchingCardInHand]);
        } else {
            this.players[playerName].hand.push(card);
        }
    }

    private switchTurns(playerName: string) {
        this.players[playerName].isTurn = false;
        let flag = false;
        Object.keys(this.players).forEach((key) => {
            if (flag) {
                this.players[key].isTurn = true;
            }
            if (key === playerName) {
                flag = true;
            }
        })
    }
}