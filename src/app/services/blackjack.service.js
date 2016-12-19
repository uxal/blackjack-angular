/**
 * Created by dragos on 15/12/2016.
 */
var core_1 = require('@angular/core');
var router_1 = require("@angular/router");
var BlackjackService = (function () {
  //inject the location service
  function BlackjackService(router) {
    this.router = router;
    //I use the next private variable to create the correct IDs for the 52 cards rom our pack
    this.cardsIdIndex = 0;
    this.playerHighestPoints = 0;
  }

  //This method is used to generate a card deck
  BlackjackService.prototype.generateCardDeck = function () {
    //generate the cards
    this.cardDeck = [];
    this.cardsIdIndex = 0;
    //create the card deck now, call 4 times the generateSuitCards
    (_a = this.cardDeck).push.apply(_a, this.generateSuitCards("club"));
    (_b = this.cardDeck).push.apply(_b, this.generateSuitCards("spade"));
    (_c = this.cardDeck).push.apply(_c, this.generateSuitCards("heart"));
    (_d = this.cardDeck).push.apply(_d, this.generateSuitCards("diamond"));
    var _a, _b, _c, _d;
    //at this point we have the card deck generated
  };
  BlackjackService.prototype.generateSuitCards = function (suit) {
    var suitCards = [];
    for (var i = 2; i < 15; i++) {
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
  };
  //this is the main method which will begin a new game. As a parameter I sent the list of players from the lobby component
  BlackjackService.prototype.startGame = function (players) {
    //step 1, set the received players
    this.players = players;
    //now change the URl and move it to the game route
    this.router.navigate(['/game']);
  };
  //this method is called from the game component
  BlackjackService.prototype.getPlayers = function () {
    return this.players;
  };
  //this method is executed at the beginning of each game, where each player get's 2 cards and the dealer only one
  BlackjackService.prototype.dealHand = function (dealer) {
    //First step at each hand, generate the card deck
    this.generateCardDeck();
    this.playerHighestPoints = 0;
    this.dealer = dealer;
    this.dealer.cards = [];
    this.dealer.bust = false;
    this.dealer.blackjack = false;
    this.dealer.naturalBlackjack = false;
    this.dealer.winnerOfRound = false;
    for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
      var player = _a[_i];
      player.cards = [];
      player.bust = false;
      player.blackjack = false;
      player.naturalBlackjack = false;
      player.winnerOfRound = false;
      //deal 2 cards for each player
      this.dealCard(player, false);
      this.dealCard(player, false);
    }
    //at the end, deal 1 card for the dealer
    this.dealCard(this.dealer, true);
  };
  //this method is called also from the player component when the player clicks on deal card
  BlackjackService.prototype.dealCard = function (player, isForDealer) {
    player.cards.push(this.extractCardFromPack());
    this.computePoints(player, isForDealer);
  };
  //this is executed when the player stands
  BlackjackService.prototype.playerStands = function (player) {
    player.standing = true;
    this.dealerAutomaticPlay();
  };
  //this function is called after each player clicks on stand or after a player is bust, it's the begining of the end game
  BlackjackService.prototype.dealerAutomaticPlay = function () {
    //step 1 check if there are players who still have to play. If all players were bust they all loose so we deal a new hand
    var dealerHasToPlay = false;
    //save in a variable the player's highest points
    for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
      var player = _a[_i];
      if (!player.bust && player.points < 22) {
        if (player.points > this.playerHighestPoints) {
          this.playerHighestPoints = player.points;
        }
      }
      //if this player can still play, then the dealer has to wait
      if (!player.bust && !player.standing && !player.blackjack) {
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
  };
  //next function is the "brain" of the dealer.
  BlackjackService.prototype.dealerAutomaticPlayAI = function () {
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
  };
  //next function is executed after the automatic pay of the dealer ends. I'm checking all the players and update their bankroll
  BlackjackService.prototype.findWinners = function () {
    for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
      var player = _a[_i];
      if (player.bust) {
        //lost
        return;
      }
      else if (player.naturalBlackjack && !this.dealer.naturalBlackjack) {
        //player wins 3:2
        player.winnerOfRound = true;
        player.amountWon = (player.currentBetValue * 2) + (player.currentBetValue / 2);
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
        player.winnerOfRound = true;
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
    }
  };
  //this method randomly selects a cardfrom the pack and returns it
  BlackjackService.prototype.extractCardFromPack = function () {
    //step 1, extract a random card from the remaining ones in the pack
    var randomCardIndex = Math.floor(Math.random() * (this.cardDeck.length + 1)) + 0;
    var cardToReturn = this.cardDeck[randomCardIndex];
    //remove the card from deck
    this.cardDeck.splice(randomCardIndex, 1);
    return cardToReturn;
  };
  //this is a function which does the calculation of points
  BlackjackService.prototype.computePoints = function (player, isForDealer) {
    var tempAces = [];
    player.points = 0;
    for (var _i = 0, _a = player.cards; _i < _a.length; _i++) {
      var card = _a[_i];
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
      for (var _b = 0, tempAces_1 = tempAces; _b < tempAces_1.length; _b++) {
        var aceCard = tempAces_1[_b];
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
  };
  BlackjackService = __decorate([
    core_1.Injectable(),
    __metadata('design:paramtypes', [router_1.Router])
  ], BlackjackService);
  return BlackjackService;
}());
exports.BlackjackService = BlackjackService;
//# sourceMappingURL=blackjack.service.js.map
