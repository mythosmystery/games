import { Direction } from './types';

export const SPRITE_SIZE = 32;
export const GRID_SIZE = 16;

export const withGrid = (val: number) => {
   return val * 16;
};

export const asGridCoord = (x: number, y: number): string => {
   return `${x * GRID_SIZE},${y * GRID_SIZE}`;
};

export const nextPosition = (initialX: number, initialY: number, direction: Direction): { x: number; y: number } => {
   let x = initialX;
   let y = initialY;

   const size = GRID_SIZE;

   // switch (direction) {
   //     case "left":
   //         x -= size;
   //     case "right":
   //         x += size;
   //     case "up":
   //         y -= size;
   //     case "down":
   //         y += size;
   // }
   if (direction === 'left') {
      x -= size;
   } else if (direction === 'right') {
      x += size;
   } else if (direction === 'up') {
      y -= size;
   } else if (direction === 'down') {
      y += size;
   }
   return { x, y };
};

export const emitEvent = (name: string, detail: Object) => {
   const event = new CustomEvent(name, { detail });
   document.dispatchEvent(event);
};
