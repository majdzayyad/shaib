import { Card } from "cards";
import { ShaibDeck } from "./shaibDeck";

export class Dealer {
    private deck: ShaibDeck;
    private static INITIAL_CARD_DRAW_COUNT = 12;

    constructor() {
        this.deck = new ShaibDeck();
    }

    public drawInitialCards() {
        return this.deck.draw(Dealer.INITIAL_CARD_DRAW_COUNT);
    }

    public addPair(cardPair: [Card, Card]) {
        if (cardPair[0].rank !== cardPair[1].rank) {
            throw new Error("Deposited cards should be equal in rank");
        }

        this.deck.add(cardPair[0]);
        this.deck.add(cardPair[1]);
    }

    public drawCard() {
        return this.deck.draw(1)[0];
    }

    public isDeckEmpty() {
        return this.deck.remainingLength === 0;
    }
}