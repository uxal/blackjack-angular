/**
 * Created by dragos on 15/12/2016.
 */
import { PlayingCard } from "./playing-card.model";
export class Player {
  //the id property is used just for counting the users
  id?: number;
  //the name of the player
  name: string;
  //how much many the player has
  bankroll: number;
  //next is the amount won during one round
  amountWon?: number;
  //is dealer property
  isDealer?: boolean;
  //next property contains the cards of a user during one hand
  cards?: PlayingCard[];
  //this property keeps track of the total points of the user
  points: number;
  //"standing" property is made true when the user clicks on stand, which means he doesn't want any more cards
  standing?: boolean;

  //next is a helping property which manages the player component view
  gameModeOn?: boolean;

  //special properties used during the game
  currentBetValue?: number;
  //next property is set to true when the player exceeds 21
  bust?: boolean;
  //next variable is set to true when the players has 21 points
  blackjack?: boolean;
  //next variable is set to true when player has 21 points from ONLY 2 cards. In this situation the payout is 3:2
  naturalBlackjack?: boolean;
  //a flag which tells at the end if the player won or not the round
  winnerOfRound: boolean;
}
