/**
 * Created by dragos on 18/12/2016.
 */
import { Component, OnInit } from "@angular/core";
import { Player } from "../../models/player.model";
import { Router } from "@angular/router";
import { BlackjackService } from '../../services/blackjack.service';

@Component({
  selector: 'blackjack-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  players: Player[];
  dealer: Player;
  notAllPlayersAddedBet: boolean = false;
  //next variable is used to alternate the display of the button "deal cards" with "new round"
  gameStarted: boolean = false;

  //injecting the main game service
  constructor(private blackjackService: BlackjackService,
              private router: Router) {
  }

  ngOnInit(): void {
    //initialize the dealer player
    this.resetDealer();

    //get the heroes from the service
    this.players = this.blackjackService.getPlayers();

    if (!this.players) {
      //move the router to the lobby
      this.goToLobby();
    }
  }

  //this method checks if all the players have a bet and if this is true it starts the actual game
  dealHand(): void {
    //step 2 check if all users have a bet
    let allPlayersBet = true;
    for (let player of this.players) {
      if (player.bankroll > 0 && (player.currentBetValue === undefined || player.currentBetValue === 0)) {
        allPlayersBet = false;
        break;
      }
    }
    if (!allPlayersBet) {
      this.notAllPlayersAddedBet = true;
      setTimeout(() => {
        this.notAllPlayersAddedBet = false;
      }, 3000);
      return;
    }
    else {
      //everything is OK, we can move forward and deal the cards
      this.gameStarted = true;
      this.blackjackService.dealHand(this.dealer);
    }
  }

  //this starts a new round
  newRound(): void {
    for (let player of this.players) {
      player.cards = [];
      player.currentBetValue = 0;
      player.winnerOfRound = false;
      player.bust = false;
      player.blackjack = false;
      player.naturalBlackjack = false;
      player.amountWon = 0;
      player.points = 0;
      player.standing = false;
    }
    this.resetDealer();
    this.gameStarted = false;
  }

  //this method returns the app to the lobby
  goToLobby(): void {
    this.router.navigate(['/lobby']);
  }

  //next function initializes the dealer
  private resetDealer(): void {
    this.dealer = {
      isDealer: true,
      name: "Dealer",
      bankroll: 0,
      points: 0,
      cards: [],
      winnerOfRound: false,
      naturalBlackjack: false,
      gameModeOn: true
    };
  }

}
