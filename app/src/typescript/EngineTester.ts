import { Engine } from './Engine';
import type { IClientLobbyData } from './models/shared/IClientLobbyData';
import { StateName } from './models/shared/StateNames';
import { TradeOffer, TradeOfferProperty } from './models/shared/TradeOffer';
import { Utils } from './Utils/Utils';

export class EngineTester {
  vueForceUpdateCallback: () => void;

  constructor(vueForceUpdateCallback = () => {}) {
    this.vueForceUpdateCallback = vueForceUpdateCallback;
  }

  async test_trade() {
    await Utils.sleep(500);

    const emptyCallback = () => {};
    const engine1 = new Engine(this.vueForceUpdateCallback, true);
    const engine2 = new Engine(emptyCallback, false);

    await Utils.emitWithPromise(engine1.socket, 'registerName', 'Austin');
    await Utils.emitWithPromise(engine2.socket, 'registerName', 'Bravo');

    const lobby = await Utils.emitWithPromise<IClientLobbyData>(engine1.socket, 'createLobby');
    engine2.joinLobby(lobby.id);
    await Utils.sleep(500);
    engine1.startGame();
    await Utils.sleep(500);
    engine1.rollDice(1, 5);
    while (engine1.gameData?.state != StateName.LandedOnTile) {
      await Utils.sleep(100);
    }
    engine1.buyProperty();
    await Utils.sleep(500);
    await engine1.endTurn();
    await Utils.sleep(1000);

    engine2.rollDice(5, 3);
    while (engine2.gameData?.state != StateName.LandedOnTile) {
      await Utils.sleep(100);
    }
    await engine2.buyProperty();
    await Utils.sleep(500);
    await engine2.endTurn();
    await Utils.sleep(500);

    await engine1.rollDice(1, 2);
    while (engine1.gameData?.state != StateName.LandedOnTile) {
      await Utils.sleep(100);
    }
    await engine1.buyProperty();
    await Utils.sleep(500);

    const tradeOffer = new TradeOffer(
      engine1.gameData.players[0].id,
      engine1.gameData.players[1].id,
      [],
      120,
      [new TradeOfferProperty('8th Street', 0x3cb44b, engine1.gameData.tiles[8].id)],
      0
    );
    await engine1.createTradeOffer(tradeOffer);
    await Utils.sleep(500);
    await engine2.acceptTradeOffer(tradeOffer.id);
  }

  async test_buy_houses() {
    await Utils.sleep(500);

    const emptyCallback = () => {};
    const engine1 = new Engine(this.vueForceUpdateCallback, true);
    const engine2 = new Engine(emptyCallback, false);

    await Utils.emitWithPromise(engine1.socket, 'registerName', 'Austin');
    await Utils.emitWithPromise(engine2.socket, 'registerName', 'Bravo Charlie');

    const lobby = await Utils.emitWithPromise<IClientLobbyData>(engine1.socket, 'createLobby');
    console.log(lobby.id);

    engine2.joinLobby(lobby.id);
    await Utils.sleep(500);
    engine1.startGame();
    await Utils.sleep(500);
    engine1.rollDice(0, 1);
    await Utils.sleep(1000);
    engine1.buyProperty();
    await Utils.sleep(2000);
    await engine1.buyBuilding(3); // Negative test
    await Utils.sleep(500);
    await engine1.endTurn();
    await Utils.sleep(500);
    engine2.rollDice(1, 3);
    await Utils.sleep(2000);
    await engine2.endTurn();
    await Utils.sleep(500);
    await engine1.rollDice(0, 2);
    while (engine1.gameData?.currentPlayer?.position != 3) {
      await Utils.sleep(100);
    }
    // await Utils.sleep(2000);
    await engine1.buyProperty();
    await Utils.sleep(1000);
    await engine1.buyBuilding(3);
    await Utils.sleep(1000);
    //await engine1.endTurn();
  }

  async test_4_players() {
    await Utils.sleep(500);

    const emptyCallback = () => {};
    const engine1 = new Engine(this.vueForceUpdateCallback, true);
    const engine2 = new Engine(emptyCallback, false);
    const engine3 = new Engine(emptyCallback, false);
    const engine4 = new Engine(emptyCallback, false);
    const engine5 = new Engine(emptyCallback, false);
    let lobbyId = '';

    engine1.socket.emit('registerName', 'player1');
    engine2.socket.emit('registerName', 'player2');
    engine3.socket.emit('registerName', 'player3');
    engine4.socket.emit('registerName', 'player4longname');
    engine5.socket.emit('registerName', 'player5');

    let joinCount = 1;

    engine1.socket.emit('createLobby', async (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        lobbyId = result.id;
        engine2.socket.emit('joinLobby', lobbyId, () => joinCount++);
        engine3.socket.emit('joinLobby', lobbyId, () => joinCount++);
        engine4.socket.emit('joinLobby', lobbyId, () => joinCount++);
        engine5.socket.emit('joinLobby', lobbyId, () => joinCount++);
        while (joinCount < 5) {
          await Utils.sleep(100);
        }
        engine1.startGame();
        await Utils.sleep(1000);
        engine4.socket.disconnect();
        await Utils.sleep(1000);
        engine1.rollDice(0, 3);
        await Utils.sleep(2000);
        engine1.buyProperty();
        await Utils.sleep(500);
        engine1.endTurn();
        await Utils.sleep(500);
        engine2.rollDice(0, 3);
        await Utils.sleep(2000);
        engine2.endTurn();
        await Utils.sleep(500);
        engine3.rollDice(0, 3);
        await Utils.sleep(2000);
        engine3.endTurn();
        await Utils.sleep(500);
        engine5.rollDice(0, 6);
        await Utils.sleep(250 * 6 + 1000);
        engine5.buyProperty();
        await Utils.sleep(500);
        engine5.endTurn();
        await Utils.sleep(500);
        engine1.rollDice(0, 3);
      }
    });
  }
}
