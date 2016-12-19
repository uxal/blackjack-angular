/**
 * Created by dragos on 16/12/2016.
 */
import { Component, OnInit } from "@angular/core";
import { Player } from "../../models/player.model";
import { BlackjackService } from '../../services/blackjack.service';

@Component({
  selector: 'blackjack-lobby',
  templateUrl: './lobby.component.html',
  styleUrls: ['./lobby.component.css']
})
export class LobbyComponent implements  OnInit{
  numberOfPlayersSelected: number;
  availablePlayers: Player [];

  //injecting the main game service
  constructor(private blackjackService: BlackjackService) {
  }

  ngOnInit():void{
    //check if there are some players available
    let playersFromService = this.blackjackService.getPlayers();
    if (playersFromService !== undefined && playersFromService.length)
    {
      this.availablePlayers = playersFromService;
      this.numberOfPlayersSelected = this.availablePlayers.length;
      //change some properties for each available player
      for (let player of this.availablePlayers){
        //put it in edit mode
        player.gameModeOn = false;
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
    }

  }

  onNumberOfPlayersSelected(numberOfPlayers: number): void {
    this.availablePlayers = [];
    this.numberOfPlayersSelected = numberOfPlayers;
    for (let i = 0; i < numberOfPlayers; i++) {
      this.availablePlayers.push({
        id: i,
        name: "",
        bankroll: 0,
        points: 0,
        standing: false,
        isDealer: false,
        gameModeOn: false,
        winnerOfRound:false,
        naturalBlackjack:false
      });
    }

  }

  //this method validates the name and bankroll for each player and then calls the game service to start a new game
  startGame(): void {
    this.blackjackService.startGame(this.availablePlayers);
  }
}
