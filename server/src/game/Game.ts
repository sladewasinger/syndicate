import { StateMachine } from './StateMachine';
import { GameStart } from './states/GameStart';
import { PreDiceRoll } from './states/PreDiceRoll';
import { PostDiceRoll } from './states/PostDiceRoll';
import { TurnStart } from './states/TurnStart';
import { LandedOnTile } from './states/LandedOnTile';
import { GameData } from '../models/GameData';
import { StateEvent } from './states/StateEvents';
import { IBuyableTile } from 'src/models/tiles/ITile';
import { IClientGameData } from 'src/models/shared/IClientGameData';
import { Player } from 'src/models/shared/Player';
import { GameOver } from './states/GameOver';
import { RollDice } from './states/RollDice';

export type GameDataCallbacks = {
  onStateChange: (state: string) => void;
};

export class Game {
  stateMachine: StateMachine;
  colors: number[] = [
    0x0000ff, // blue
    0xff0000, // red
    0x00ff00, // green
    0xffff00, // yellow
    0xff00ff, // magenta
    0x00ffff, // cyan
    0xffa500, // orange
    0x800080, // purple
    0x800000, // maroon
    0x000080, // navy
    0x808000, // olive
    0x008080, // teal
  ];

  constructor(players: Player[], callbacks: GameDataCallbacks) {
    const gameData = new GameData(callbacks);
    gameData.players = players;

    this.stateMachine = new StateMachine(new TurnStart(), gameData);
    this.stateMachine.addState(new GameStart());
    this.stateMachine.addState(new TurnStart());
    this.stateMachine.addState(new PreDiceRoll());
    this.stateMachine.addState(new RollDice());
    this.stateMachine.addState(new PostDiceRoll());
    this.stateMachine.addState(new LandedOnTile());
    this.stateMachine.addState(new GameOver());
  }

  tick() {
    const prevGameData = JSON.stringify(this.stateMachine);

    this.stateMachine.update();

    if (prevGameData !== JSON.stringify(this.stateMachine)) {
      this.stateMachine.gameData.callbacks.onStateChange(this.stateMachine.currentState.name);
    }
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

  removePlayer(playerId: string) {
    const player = this.stateMachine.gameData.players.find((p) => p.id === playerId);
    if (player) {
      const ownedProperties = this.stateMachine.gameData.tiles
        .filter((t) => t.buyable)
        .map((t) => t as IBuyableTile)
        .filter((t) => t.owner?.id === playerId);
      for (const property of ownedProperties) {
        property.owner = undefined;
        property.mortgaged = false;
      }
      this.stateMachine.gameData.players = this.stateMachine.gameData.players.filter((p) => p.id !== playerId);
      if (this.stateMachine.gameData.players.length === 1) {
        this.stateMachine.setState('GameOver');
      } else if (player === this.stateMachine.gameData.currentPlayer) {
        this.stateMachine.setState('TurnStart');
      }
    }
  }

  startGame() {
    for (let i = 0; i < this.stateMachine.gameData.players.length; i++) {
      const player = this.stateMachine.gameData.players[i];
      const color = this.colors[i % this.colors.length];
      this.resetPlayer(player, color);
    }
  }

  addPlayer(player: Player) {
    this.resetPlayer(player, this.colors[this.stateMachine.gameData.players.length % this.colors.length]);
    this.stateMachine.gameData.players.push(player);
  }

  private resetPlayer(player: Player, color: number) {
    player.money = 1500;
    player.position = 0;
    player.properties = [];
    player.color = color;
  }

  rollDice(dice1Override: number | undefined = undefined, dice2Override: number | undefined = undefined) {
    console.log('Game - rollDice');
    if (dice1Override !== undefined && dice2Override !== undefined) {
      this.stateMachine.gameData.diceOverride = [dice1Override, dice2Override];
    }
    this.stateMachine.event(StateEvent.RollDice);
  }

  buyProperty() {
    this.stateMachine.event(StateEvent.BuyProperty);
  }

  endTurn() {
    this.stateMachine.event(StateEvent.EndTurn);
  }
}
