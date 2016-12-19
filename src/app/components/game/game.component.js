"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
/**
 * Created by dragos on 18/12/2016.
 */
var core_1 = require("@angular/core");
var router_1 = require("@angular/router");
var blackjack_service_1 = require('../../services/blackjack.service');
var GameComponent = (function () {
    //injecting the main game service
    function GameComponent(blackjackService, router) {
        this.blackjackService = blackjackService;
        this.router = router;
        this.notAllPlayersAddedBet = false;
        //next variable is used to alternate the display of the button "deal cards" with "new round"
        this.gameStarted = false;
    }
    GameComponent.prototype.ngOnInit = function () {
        //initialize the dealer player
        this.resetDealer();
        //get the heroes from the service
        this.players = this.blackjackService.getPlayers();
        if (!this.players) {
            //move the router to the lobby
            this.goToLobby();
        }
    };
    //this method checks if all the players have a bet and if this is true it starts the actual game
    GameComponent.prototype.dealHand = function () {
        var _this = this;
        //step 2 check if all users have a bet
        var allPlayersBet = true;
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
            if (player.currentBetValue === undefined || player.currentBetValue === 0) {
                allPlayersBet = false;
                break;
            }
        }
        if (!allPlayersBet) {
            this.notAllPlayersAddedBet = true;
            setTimeout(function () {
                _this.notAllPlayersAddedBet = false;
            }, 3000);
            return;
        }
        else {
            //everything is OK, we can move forward and deal the cards
            this.gameStarted = true;
            this.blackjackService.dealHand(this.dealer);
        }
    };
    //this starts a new round
    GameComponent.prototype.newRound = function () {
        for (var _i = 0, _a = this.players; _i < _a.length; _i++) {
            var player = _a[_i];
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
    };
    //this method returns the app to the lobby
    GameComponent.prototype.goToLobby = function () {
        this.router.navigate(['/lobby']);
    };
    //next function initializes the dealer
    GameComponent.prototype.resetDealer = function () {
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
    };
    GameComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'blackjack-game',
            templateUrl: 'game.component.html',
            styleUrls: ['game.component.css']
        }), 
        __metadata('design:paramtypes', [blackjack_service_1.BlackjackService, router_1.Router])
    ], GameComponent);
    return GameComponent;
}());
exports.GameComponent = GameComponent;
//# sourceMappingURL=game.component.js.map