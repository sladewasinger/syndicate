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
import { BuyProperty } from './states/BuyProperty';
import { TurnEnd } from './states/TurnEnd';
import { IClientPlayer } from 'src/models/shared/IClientPlayer';

export type GameDataCallbacks = {
  onStateChange: (state: string) => void;
};

export class Game {
  stateMachine: StateMachine;
  // colors: number[] = [
  //   0x0000ff, // blue
  //   0xff0000, // red
  //   0x00ff00, // green
  //   0xffff00, // yellow
  //   0xff00ff, // magenta
  //   0x00ffff, // cyan
  //   0xffa500, // orange
  //   0x800080, // purple
  //   0x800000, // maroon
  //   0x000080, // navy
  //   0x808000, // olive
  //   0x008080, // teal
  // ];
  colors: number[] = [
    0xe6194b, // red
    0x3cb44b, // green
    0xffe119, // yellow
    0x4363d8, // blue
    0xf58231, // orange
    0x911eb4, // purple
    0x42d4f4, // cyan
    0xf032e6, // magenta
    0xbfef45, // lime
    0xfabeb4, // pink
    0x469990, // teal
    0xdcbeff, // lavender
    0x9a6324, // brown
    0x800000, // maroon
    0xaaffc3, // mint
    0x808000, // olive
    0xffd8b1, // beige
    0x000075, // navy
    0xa9a9a9, // grey
    0xfffac8, // cream
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
    this.stateMachine.addState(new BuyProperty());
    this.stateMachine.addState(new TurnEnd());
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
      players: this.stateMachine.gameData.players.map((p) => p.clientPlayer),
      dice: this.stateMachine.gameData.dice,
      currentPlayer: this.stateMachine.gameData.currentPlayer?.clientPlayer,
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
      player.turnOrder = i;
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
