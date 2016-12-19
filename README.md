# Blackjack in Angular 2.0
#### by Dragos Lascu © December 2016

This blackjack game is my first Angular 2.0 project. Click for [live demo](https://uxal.github.io) on github page.
Please keep in mind that if you don't start the app with the default route and you start with "/game" or "/lobby" because of the github page hosting you'll get a 404 error.
On the local server it works fine!

This game supports up to 4 players but it can be easily extended to an unlimited number of players. At the beginning each player sets his/hers bankroll.
When clicking play the route changes and the main game room component is loaded. Here each player must select a betting value. Clicking multiple times on the chips increases the bet.
If player has less than 20 or 10 in wallet, 10 and 20 chips are disabled. The smallest 5 chip is never disabled but if you have only 3 USD left and click on the 5 chip, obviously you'll bet only 3 USD.
When you're out of money you can't play. You can hit "back to lobby" and add more money.

When a round begins, each player receives 2 cards and the dealer only one. If from the start a player has 21 ("natural blackjack"), that player will not see the action buttons to request a new card or to stand.
The dealer starts the automatic play after all the players have finished their moves either by standing, exceeding 21 or having 21.
The dealer requests a new card until it exceeds the highest valid points of a player.
After the dealer finishes winners and losers are declared. If a player has a natural blackjack the payout is 3:2.

Things to improve:
* The validation for player's bankroll, as you'll see it starts in invalid mode until you type something
* Add unit testing
* Improve the AI of the dealer. Currently it asks for a card until his points are above the highest points of a player.

Credits for the cards images go to [edgeuplink](https://github.com/edgeuplink/blackjackin)


## Automatic information added by angular-cli

This project was generated with [angular-cli](https://github.com/angular/angular-cli) version 1.0.0-beta.22-1.

## Development server
Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive/pipe/service/class`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `-prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).
Before running the tests make sure you are serving the app via `ng serve`.

## Deploying to Github Pages

Run `ng github-pages:deploy` to deploy to Github Pages.

## Further help

To get more help on the `angular-cli` use `ng --help` or go check out the [Angular-CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
