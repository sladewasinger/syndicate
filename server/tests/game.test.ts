import { Game } from '../src/game/Game';
import { StateEvent } from '../src/game/states/StateEvents';
import { StateName } from '../src/game/states/StateNames';
import { TurnStart } from '../src/game/states/TurnStart';
import { Player } from '../src/models/Player';

describe('Game', () => {
  it('should create a new game', () => {
    const game = new Game([]);
    expect(game).toBeDefined();
  });

  it('should start in the TurnStart state', () => {
    const game = new Game([]);
    expect(game.stateMachine.currentState.name).toBe('TurnStart');
  });
});

describe('TurnStart', () => {
  it('should immediately transition to PreDiceRoll', () => {
    const game = new Game([]);
    game.update();
    expect(game.stateMachine.currentState.name).toBe(StateName.PreDiceRoll);
  });
});

describe('PreDiceRoll', () => {
  it('should transition to PostDiceRoll after rolling dice', () => {
    const player1 = new Player('1', 'player1');
    const game = new Game([player1]);
    game.update();
    game.stateMachine.setState(StateName.PreDiceRoll);
    expect(game.stateMachine.currentState.name).toBe(StateName.PreDiceRoll);

    game.stateMachine.event(StateEvent.RollDice);
    expect(game.stateMachine.currentState.name).toBe(StateName.PostDiceRoll);
  });

  it('should transition to LandedOnTile after landing on targetPos', () => {
    const player1 = new Player('1', 'player1');
    const game = new Game([player1]);
    game.stateMachine.gameData.diceOverride = [1, 2];
    game.update();
    game.stateMachine.setState(StateName.PreDiceRoll);
    expect(game.stateMachine.currentState.name).toBe(StateName.PreDiceRoll);

    game.stateMachine.event(StateEvent.RollDice);
    expect(game.stateMachine.currentState.name).toBe(StateName.PostDiceRoll);

    for (let i = 0; i < 3; i++) {
      game.update();
    }
    expect(game.stateMachine.currentState.name).toBe(StateName.LandedOnTile);
  });
});
