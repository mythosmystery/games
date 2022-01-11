import { DirectionInput } from './DirectionInput';
import { GameObject } from './GameObject';
import { OverworldMap } from './OverworldMap';

export interface OverworldConfig {
   element: HTMLElement;
}

export class Overworld {
   element: HTMLElement;
   canvas: HTMLCanvasElement;
   ctx: CanvasRenderingContext2D;
   map: OverworldMap;
   directionInput: DirectionInput;
   cameraPerson: GameObject;

   constructor(config: OverworldConfig) {
      this.element = config.element;
      this.canvas = this.element.querySelector('.game-canvas')!;
      this.ctx = this.canvas.getContext('2d')!;

      this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
      this.directionInput = new DirectionInput();
      this.cameraPerson = this.map.gameObjects.hero;
   }

   startGameLoop() {
      const step = () => {
         this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

         this.cameraPerson = this.map.gameObjects.hero;

         Object.values(this.map.gameObjects).forEach(object => {
            object.update({
               arrow: this.directionInput.direction,
               map: this.map
            });
         });

         this.map.drawLowerImage(this.ctx, this.cameraPerson);

         Object.values(this.map.gameObjects)
            .sort((a, b) => a.y - b.y)
            .forEach(object => {
               object.sprite.draw(this.ctx, this.cameraPerson);
            });

         this.map.drawUpperImage(this.ctx, this.cameraPerson);

         requestAnimationFrame(() => {
            step();
         });
      };
      step();
   }

   init() {
      this.map = new OverworldMap(window.OverworldMaps.DemoRoom);
      this.map.mountObjects();

      this.directionInput.init();

      this.startGameLoop();

      this.map.startCutscene([
         { type: 'walk', direction: 'right', who: 'hero' },
         { type: 'walk', direction: 'up', who: 'hero' },
         { type: 'stand', direction: 'right', who: 'hero' },
         { type: 'walk', direction: 'up', who: 'npcA' },
         { type: 'walk', direction: 'left', who: 'npcA' },
         { type: 'walk', direction: 'left', who: 'npcA' }
      ]);
   }
}
