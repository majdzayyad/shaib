import { Card, decks } from "cards";
import { standard } from "cards/build/ranks/standard";
import { clubs, diamonds, hearts, spades } from "cards/build/suits";

const suits = [ spades, hearts, diamonds, clubs ];
const ranks = [
	standard.ace,
	standard.two,
	standard.three,
	standard.four,
	standard.five,
	standard.six,
	standard.seven,
	standard.eight,
	standard.nine,
	standard.ten,
	standard.jack,
	standard.queen,
	standard.king
];

export class ShaibDeck extends decks.Deck {
    constructor() {
		const cards = ShaibDeck.generateCards();
		super({ cards });
	}

	private static generateCards() {
		const cards: Card[] = [ ];
	
		ranks.forEach((rank) => {
            if (rank === standard.king) {
                cards.push(new Card(spades, rank));
            } else {
                suits.forEach((suit) => {
                    cards.push(new Card(suit, rank));
                })
            }
        })
	
		return cards;
	}
}