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
 * Created by dragos on 16/12/2016.
 */
var core_1 = require("@angular/core");
var player_model_1 = require("../../models/player.model");
var blackjack_service_1 = require('../../services/blackjack.service');
var PlayerComponent = (function () {
    //injecting the main game service
    function PlayerComponent(blackjackService) {
        this.blackjackService = blackjackService;
    }
    PlayerComponent.prototype.ngOnInit = function () {
        if (this.gameModeOn) {
            this.player.gameModeOn = true;
        }
    };
    //#region CODE FOR EDIT MODE
    //this function is called when the user changes the template value of bankroll. I need to make sure the typed value is a real number
    PlayerComponent.prototype.restrictBankrollInputToNumber = function (target) {
        var value = target.value;
        if (value) {
            //check if we have multiple commas or dots. If we do this is a wrong number
            if (this.checkIfValueContainsMultipleCharacters(value, ",") || this.checkIfValueContainsMultipleCharacters(value, ".")) {
                target.value = '';
                this.player.bankroll = 0;
                target.valid = false;
                return;
            }
            //replace comma with dot
            if (value.indexOf(",") > -1) {
                value = value.replace(/,/g, ".");
            }
            //and now check if this is a number
            var parsedBankrollValue = Number(value);
            if (isNaN(parsedBankrollValue)) {
                //if parsing fails it means this is not a correct number
                this.player.bankroll = 0;
                target.value = '';
                target.valid = false;
                return;
            }
            this.player.bankroll = parsedBankrollValue;
            target.valid = true;
        }
    };
    //this is used to check if a given string is present multiple times in a source string
    PlayerComponent.prototype.checkIfValueContainsMultipleCharacters = function (value, characterToFind) {
        if (value.indexOf(characterToFind) > -1) {
            if (value.split(characterToFind).length > 2) {
                return true;
            }
        }
    };
    //endregion
    //#region CODE FOR GAME ON MODE
    PlayerComponent.prototype.bet = function (betValue) {
        if (betValue > 0) {
            if (this.player.currentBetValue === undefined) {
                this.player.currentBetValue = 0;
            }
            if (betValue > this.player.bankroll) {
                betValue = this.player.bankroll;
            }
            this.player.currentBetValue += betValue;
            this.player.bankroll -= betValue;
        }
    };
    //this method resets the bet
    PlayerComponent.prototype.resetBet = function () {
        this.player.bankroll += this.player.currentBetValue;
        this.player.currentBetValue = 0;
    };
    //this action method is executed when user clicks on dela card
    PlayerComponent.prototype.dealCard = function () {
        this.blackjackService.dealCard(this.player, false);
    };
    //this method is executed when user decides to stand
    PlayerComponent.prototype.stand = function () {
        this.player.standing = true;
        //and now let the blackjack service know that the dealer can move
        this.blackjackService.playerStands(this.player);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', player_model_1.Player)
    ], PlayerComponent.prototype, "player", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PlayerComponent.prototype, "gameModeOn", void 0);
    PlayerComponent = __decorate([
        core_1.Component({
            selector: 'blackjack-player',
            templateUrl: './app/components/player/player.component.html',
            styleUrls: ['./app/components/player/player.component.css']
        }), 
        __metadata('design:paramtypes', [blackjack_service_1.BlackjackService])
    ], PlayerComponent);
    return PlayerComponent;
}());
exports.PlayerComponent = PlayerComponent;
//# sourceMappingURL=player.component.js.map