import { Engine } from './Engine';
import { Utils } from './Utils/Utils';

export class EngineTester {
  constructor() {}

  test_5_players_join() {
    const engine1 = new Engine();
    const engine2 = new Engine();
    const engine3 = new Engine();
    const engine4 = new Engine();
    const engine5 = new Engine();
    let lobbyId = '';

    engine1.socket.emit('registerName', 'player1');
    engine2.socket.emit('registerName', 'player2');
    engine3.socket.emit('registerName', 'player3');
    engine4.socket.emit('registerName', 'player4');
    engine5.socket.emit('registerName', 'player5');

    let joinCount = 1;

    engine1.socket.emit('createLobby', async (error: any, result: any) => {
      if (error) {
        console.error(error);
      } else {
        console.log(result);
        lobbyId = result;
        engine2.socket.emit('joinLobby', lobbyId, (error: any, result: any) => joinCount++);
        engine3.socket.emit('joinLobby', lobbyId, (error: any, result: any) => joinCount++);
        engine4.socket.emit('joinLobby', lobbyId, (error: any, result: any) => joinCount++);
        engine5.socket.emit('joinLobby', lobbyId, (error: any, result: any) => joinCount++);
        while (joinCount < 5) {
          await Utils.sleep(100);
        }
        engine1.start();
        await Utils.sleep(2000);
        engine4.socket.disconnect();
      }
    });
  }
}
