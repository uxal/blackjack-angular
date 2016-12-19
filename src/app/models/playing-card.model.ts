/**
 * Created by dragos on 15/12/2016.
 */


//Here I define the Playing card model. I'll use the ID when shuffling and dealing the cards, the color comes from a heping clobal constant and value is the value f the card from 2 to 14
export class PlayingCard {
  id: number;
  suit: string;
  //classicValue = used for the UI to render cards from 2 to 10, J,Q,K,A
  classicValue: number;
  //blackjackValue = for J,Q,K in blackjack the value is 10
  blackjackValue?:number;
  //special for ace which can have values 1 or 11
  isAce:boolean;
}
