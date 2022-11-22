import type { Socket } from 'socket.io-client';

export class Utils {
  static clamp(value: number, min: number, max: number) {
    return Math.min(Math.max(value, min), max);
  }

  static sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  static emitWithPromise<T>(socket: Socket, ev: string, ...args: any[]): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      setTimeout(() => {
        reject(new Error(`socket.emit(${ev}, . . .) timed out after 5 seconds`));
      }, 5000);
      socket.emit(ev, ...args, async (error: any, result: any) => {
        if (error) {
          console.error(error);
          reject(error);
        } else {
          resolve(result);
        }
      });
    });
  }
}
