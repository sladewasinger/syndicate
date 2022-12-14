export interface IClientPlayer {
  targetPosition: number;
  name: string;
  id: string;
  money: number;
  position: number;
  properties: string[];
  color: number;
  turnOrder: number;
  bidAmount: number | undefined;
  jailTurns: number;
  isInJail: boolean;
}
