/**
 * Created by dragos on 15/12/2016.
 */
import { Injectable } from '@angular/core';
import { Router } from "@angular/router";

import { PlayingCard } from '../models/playing-card.model'
import { Player } from "../models/player.model";

@Injectable()
export class BlackjackService {
  //the current playing card deck
  cardDeck: PlayingCard[];
  //all the connected players
  players: Player[];
  dealer: Player;
  //I use the next private variable to create the correct IDs for the 52 cards rom our pack
  private cardsIdIndex: number = 0;
  private playerHighestPoints: number = 0;

  //inject the location service
  constructor(private router: Router) {
  }

  //This method is used to generate a card deck
  private generateCardDeck(): void {
    //generate the spdes
    this.cardDeck = [];
    this.cardsIdIndex = 0;

    //create the card deck now, call 4 times the generateSuitCards
    this.cardDeck.push(...this.generateSuitCards("club"));
    this.cardDeck.push(...this.generateSuitCards("spade"));
    this.cardDeck.push(...this.generateSuitCards("heart"));
    this.cardDeck.push(...this.generateSuitCards("diamond"));

    //at this point we have the card deck generated
  }

  private generateSuitCards(suit: string): PlayingCard[] {
    let suitCards: PlayingCard[] = [];

    for (let i = 2; i < 15; i++) {
      //increase the global cards index id
      this.cardsIdIndex++;

      suitCards.push({
        id: this.cardsIdIndex,
        suit: suit,
        classicValue: i,
        blackjackValue: i < 12 ? i : 10,
        isAce: i === 11 ? true : false
      });
    }
    return suitCards;
  }

  //this is the main method which will begin a new game. As a parameter I sent the list of players from the lobby component
  startGame(players: Player[]): void {
    //step 1, set the received players
    this.players = players;

    //now change the URl and move it to the game route
    this.router.navigate(['/game']);
  }

  //this method is called from the game component
  getPlayers(): Player[] {
    return this.players;
  }

  //this method is executed at the beginning of each game, where each player get's 2 cards and the dealer only one
  dealHand(dealer: Player): void {
    //First step at each hand, generate the card deck
    this.generateCardDeck();

    this.playerHighestPoints = 0;

    this.dealer = dealer;
    this.dealer.cards = [];
    this.dealer.bust = false;
    this.dealer.blackjack = false;
    this.dealer.naturalBlackjack = false;
    this.dealer.winnerOfRound = false;

    for (let player of this.players) {
      player.cards = [];
      player.bust = false;
      player.blackjack = false;
      player.naturalBlackjack = false;
      player.winnerOfRound = false;
      player.points = 0;

      //deal 2 cards for each player
      if (player.bankroll > 0 || player.currentBetValue > 0) {
        this.dealCard(player, false);
        this.dealCard(player, false);
      }
    }
    //at the end, deal 1 card for the dealer
    this.dealCard(this.dealer, true);
  }

  //this method is called also from the player componenet when the player clicks on deal card
  dealCard(player: Player, isForDealer: boolean): void {
    player.cards.push(this.extractCardFromPack());
    this.computePoints(player, isForDealer);
  }

  //this is executed when the player stands
  playerStands(player: Player): void {
    player.standing = true;
    this.dealerAutomaticPlay();
  }

  //this function is called after each player clicks on stand or after a player is bust, it's the begining of the end game
  dealerAutomaticPlay(): void {
    //step 1 check if there are players who still have to play. If all players were bust they all loose so we deal a new hand
    let dealerHasToPlay: boolean = false;
    //save in a variable the player's highest points

    for (let player of this.players) {
      if (!player.bust && player.points < 22) {
        if (player.points > this.playerHighestPoints) {
          this.playerHighestPoints = player.points;
        }
      }
      //if this player can still play, then the dealer has to wait
      if (!player.bust && !player.standing && !player.blackjack && (player.bankroll > 0 || player.currentBetValue > 0)) {
        dealerHasToPlay = false;
        break;
      }
      dealerHasToPlay = true;
    }
    if (dealerHasToPlay) {
      //deal the mandatory second card for the dealer
      this.dealCard(this.dealer, true);
      //and now call the AI which plays for the dealer
      this.dealerAutomaticPlayAI();
      //after the dealer plays check who won
      this.findWinners();
    }
  }

  //next function is the "brain" of the dealer.
  private dealerAutomaticPlayAI(): void {
    if (this.dealer.bust || this.dealer.blackjack) {
      //don't do anything here
      return;
    }
    if (this.dealer.points > this.playerHighestPoints) {
      //at this point the dealer won
      this.dealer.winnerOfRound = true;
    }
    else {
      this.dealCard(this.dealer, true);
      ///and now call again this function
      this.dealerAutomaticPlayAI();
    }
  }

  //next function is executed after the automatic pay of the dealer ends. I'm checking all the players and update their bankroll
  private findWinners(): void {
    for (let player of this.players) {
      if (player.bankroll == 0 && player.currentBetValue == 0)
      {
        //nothing, this player is not in the game
        continue;
      }
      if (player.bust) {
        //lost
        continue;
      }
      else if (player.naturalBlackjack && !this.dealer.naturalBlackjack) {
        //player wins 3:2
        player.winnerOfRound = true;
        player.amountWon = (player.currentBetValue * 2) + (player.currentBetValue / 2)
        player.bankroll += player.amountWon;
      }
      else if (player.blackjack && this.dealer.blackjack) {
        //the bet returns to the player since he's equal to the deler
        player.bankroll += player.currentBetValue;
        player.amountWon = player.currentBetValue;
        player.winnerOfRound = true;
      }
      else if (player.points < this.playerHighestPoints) {
        //player lost to another player
        player.bust = true;
      }
      else if (player.points > this.dealer.points) {
        //player won, more points than the dealer, EVEN IF THIS CAN"T HAPPEN BECAUSE THE dealer automatic AI
        player.winnerOfRound = true
        player.amountWon = player.currentBetValue * 2;
        player.bankroll += player.amountWon;

      }
      else if (this.dealer.bust) {
        //player won because the dealer went too far
        player.winnerOfRound = true;
        player.amountWon = player.currentBetValue * 2;
        player.bankroll += player.amountWon;
      }
      else if (player.points < this.dealer.points) {
        //lost
        player.bust = true;
      }
      else if (player.points === this.dealer.points) {
        //equal to the dealer
        player.bankroll += player.currentBetValue;
        player.amountWon = player.currentBetValue;
        player.winnerOfRound = true;
      }
      else if (player.points == this.playerHighestPoints) {
        //this player also won
        player.winnerOfRound = true;
        player.amountWon = player.currentBetValue * 2;
        player.bankroll += player.amountWon;
      }
    }
  }

  //this method randomly selects a card from the pack and returns it
  private extractCardFromPack(): PlayingCard {
    //step 1, extract a random card from the remaining ones in the pack
    let randomCardIndex = Math.floor(Math.random() * (this.cardDeck.length + 1)) + 0;
    let cardToReturn = this.cardDeck[randomCardIndex];
    if (cardToReturn === undefined)
    {
      cardToReturn = this.extractCardFromPack();
    }
    //remove the card from deck
    this.cardDeck.splice(randomCardIndex, 1);
    return cardToReturn;
  }

  //this is a function which does the calculation of points
  private computePoints(player: Player, isForDealer: boolean): void {
    let tempAces: PlayingCard[] = [];
    player.points = 0;
    for (let card of player.cards) {
      if (card.isAce) {
        tempAces.push(card);
      }
      else if (card.blackjackValue) {
        player.points += card.blackjackValue;
      }
      else {
        player.points += card.classicValue;
      }
    }
    if (tempAces.length && player.points < 21) {
      for (let aceCard of tempAces) {
        //try first with value 11
        player.points += 11;
        if (player.points > 21) {
          //make the ace = 1;
          player.points -= 10;
        }
        if (player.points > 21) {
          break;
        }
      }
    }
    if (player.points > 21) {
      player.bust = true;
      if (!isForDealer) {
        this.dealerAutomaticPlay();
      }
    }
    else if (player.points === 21) {
      if (player.cards.length == 2) {
        player.naturalBlackjack = true;
      }
      player.blackjack = true;
      if (!isForDealer) {
        this.dealerAutomaticPlay();
      }
    }
  }

}
