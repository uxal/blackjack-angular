/**
 * Created by dragos on 16/12/2016.
 */
import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LobbyComponent }   from './components/lobby/lobby.component';
import { GameComponent }   from './components/game/game.component';

const routes: Routes = [
  {path: '', redirectTo: '/lobby', pathMatch: 'full'},
  {path: 'lobby', component: LobbyComponent},
  {path: 'game', component: GameComponent}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
