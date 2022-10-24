import { Game } from '../src/game/Game';

describe('Game', () => {
    it('should create a new game', () => {
        const game = new Game();
        expect(game).toBeDefined();
    });
});
