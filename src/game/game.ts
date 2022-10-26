import { GameData } from './models/GameData';
import { Player } from './models/Player';
import { StateEvent } from './StateEvents';
import { StateMachine } from './StateMachine';
import { GameStart } from './states/GameStart';
import { PreDiceRoll } from './states/PreDiceRoll';
import { PostDiceRoll } from './states/PostDiceRoll';
import { TurnStart } from './states/TurnStart';
import { LandedOnTile } from './states/LandedOnTile';
import { IClientGameData } from './models/IClientGameData';
import { User } from '../engine/models/User';

export class Game {
  stateMachine: StateMachine;

  constructor(players: Player[]) {
    const gameData = new GameData();
    gameData.players = players;

    this.stateMachine = new StateMachine(new TurnStart(), gameData);
    this.stateMachine.addState(new GameStart());
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new PreDiceRoll());
    this.stateMachine.addState(new PostDiceRoll());
    this.stateMachine.addState(new LandedOnTile());
  }

  update() {
    this.stateMachine.update();
  }

  getClientGameData(playerId: string): IClientGameData {
    return <IClientGameData>{
      myId: playerId,
      players: this.stateMachine.gameData.players,
      dice: this.stateMachine.gameData.dice,
      currentPlayer: this.stateMachine.gameData.currentPlayer,
      tiles: this.stateMachine.gameData.tiles.map((t) => t.getClientTile(this.stateMachine.gameData)),
      state: this.stateMachine.currentState.name,
    };
  }

  getPlayers() {
    return this.stateMachine.gameData.players;
  }

  rollDice() {
    this.stateMachine.currentState.event(StateEvent.RollDice, this.stateMachine.gameData);
  }

  endTurn() {
    this.stateMachine.currentState.event(StateEvent.EndTurn, this.stateMachine.gameData);
  }
}
