export const BOARD_WIDTH = 1800;
export const BOARD_HEIGHT = 1800;
export const TILE_WIDTH = BOARD_WIDTH / 12;
export const TILE_HEIGHT = (TILE_WIDTH * 3) / 2;

export const boardPositions = [
  {
    i: 0,
    x: BOARD_WIDTH,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 1,
    x: BOARD_WIDTH - TILE_HEIGHT,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 2,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 3,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 2,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 4,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 3,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 5,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 4,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 6,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 5,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 7,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 6,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 8,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 7,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 9,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 8,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 10,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9,
    y: BOARD_HEIGHT,
    rotation: 0,
  },
  {
    i: 11,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4,
    rotation: Math.PI / 2,
  },
  {
    i: 12,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH,
    rotation: Math.PI / 2,
  },
  {
    i: 13,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 2,
    rotation: Math.PI / 2,
  },
  {
    i: 14,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 3,
    rotation: Math.PI / 2,
  },
  {
    i: 15,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 4,
    rotation: Math.PI / 2,
  },
  {
    i: 16,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 5,
    rotation: Math.PI / 2,
  },
  {
    i: 17,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 6,
    rotation: Math.PI / 2,
  },
  {
    i: 18,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 7,
    rotation: Math.PI / 2,
  },
  {
    i: 19,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9 - TILE_WIDTH / 4,
    y: BOARD_HEIGHT - TILE_HEIGHT + TILE_WIDTH / 4 - TILE_WIDTH * 8,
    rotation: Math.PI / 2,
  },
  {
    i: 20,
    x: BOARD_WIDTH - TILE_HEIGHT - TILE_WIDTH * 9,
    y: BOARD_HEIGHT - TILE_HEIGHT - TILE_WIDTH * 9,
    rotation: 0,
  },
  {
    i: 21,
    x: 0 + TILE_HEIGHT + TILE_WIDTH,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 22,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 2,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 23,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 3,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 24,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 4,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 25,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 5,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 26,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 6,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 27,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 7,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 28,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 8,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 29,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 9,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
    flipColorBar: true,
  },
  {
    i: 30,
    x: 0 + TILE_HEIGHT + TILE_WIDTH * 10 + TILE_WIDTH / 2,
    y: 0 + TILE_HEIGHT,
    rotation: 0,
  },
  {
    i: 31,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 32,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 33,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 2,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 34,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 3,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 35,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 4,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 36,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 5,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 37,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 6,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 38,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 7,
    rotation: (Math.PI * 3) / 2,
  },
  {
    i: 39,
    x: BOARD_WIDTH - TILE_WIDTH / 2 + TILE_WIDTH / 4,
    y: 0 + TILE_HEIGHT + +TILE_WIDTH + TILE_WIDTH / 4 + TILE_WIDTH * 8,
    rotation: (Math.PI * 3) / 2,
  },
];