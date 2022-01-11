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

export const opositeDirection = (direction: Direction): Direction => {
   if (direction === 'left') {
      return 'right';
   }
   if (direction === 'right') {
      return 'left';
   }
   if (direction === 'up') {
      return 'down';
   }
   return 'up';
};

export const emitEvent = (name: string, detail: Object) => {
   const event = new CustomEvent(name, { detail });
   document.dispatchEvent(event);
};

export class KeyPressListener {
   keydownFunction: (event: KeyboardEvent) => void;
   keyupFunction: (event: KeyboardEvent) => void;

   constructor(keyCode: string, callback: Function) {
      let keySafe = true;
      this.keydownFunction = function (event) {
         if (event.code === keyCode) {
            if (keySafe) {
               keySafe = false;
               callback();
            }
         }
      };
      this.keyupFunction = function (event) {
         if (event.code === keyCode) {
            keySafe = true;
         }
      };
      document.addEventListener('keydown', this.keydownFunction);
      document.addEventListener('keyup', this.keyupFunction);
   }

   unbind() {
      document.removeEventListener('keydown', this.keydownFunction);
      document.removeEventListener('keyup', this.keyupFunction);
   }
}
