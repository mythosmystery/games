import { GameObject } from './GameObject';
import { OverworldEvent } from './OverworldEvent';
import { Person } from './Person';
import { Behavior, Direction, WallsMap } from './types';
import { asGridCoord, nextPosition, withGrid } from './utils';

export interface OverworldMapConfig {
   gameObjects: {
      [key: string]: GameObject;
   };
   lowerSrc: string;
   upperSrc: string;
   walls: WallsMap;
}

export class OverworldMap {
   gameObjects: {
      [key: string]: GameObject;
   };

   lowerImg: HTMLImageElement;
   upperImg: HTMLImageElement;

   walls: WallsMap;

   isCutscenePlaying: boolean = false;

   constructor(config: OverworldMapConfig) {
      this.gameObjects = config.gameObjects;
      this.walls = config.walls || {};

      this.lowerImg = new Image();
      this.lowerImg.src = config.lowerSrc;

      this.upperImg = new Image();
      this.upperImg.src = config.upperSrc;
   }

   drawLowerImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
      ctx.drawImage(this.lowerImg, withGrid(10.5) - cameraPerson.x, withGrid(6) - cameraPerson.y);
   }

   drawUpperImage(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
      ctx.drawImage(this.upperImg, withGrid(10.5) - cameraPerson.x, withGrid(6) - cameraPerson.y);
   }

   isSpaceTaken(currentX: number, currentY: number, direction: Direction) {
      const { x, y } = nextPosition(currentX, currentY, direction);
      return this.walls[`${x},${y}`] || false;
   }

   mountObjects() {
      Object.keys(this.gameObjects).forEach(key => {
         let object = this.gameObjects[key];
         object.id = key;
         object.mount(this);
      });
   }

   async startCutscene(events: Behavior[]) {
      this.isCutscenePlaying = true;

      for (let event of events) {
         const eventHandler = new OverworldEvent({
            event,
            map: this
         });
         await eventHandler.init();
      }

      this.isCutscenePlaying = false;
   }

   addWall(x: number, y: number) {
      this.walls[`${x},${y}`] = true;
   }

   removeWall(x: number, y: number) {
      delete this.walls[`${x},${y}`];
   }

   moveWall(oldX: number, oldY: number, direction: Direction) {
      this.removeWall(oldX, oldY);
      const { x, y } = nextPosition(oldX, oldY, direction);
      this.addWall(x, y);
   }
}

window.OverworldMaps = {
   DemoRoom: {
      lowerSrc: '/images/maps/DemoLower.png',
      upperSrc: '/images/maps/DemoUpper.png',
      gameObjects: {
         hero: new Person({
            x: withGrid(5),
            y: withGrid(6),
            isPlayerControlled: true
         }),
         npcA: new Person({
            x: withGrid(9),
            y: withGrid(6),
            src: '/images/characters/people/npc1.png',
            behaviorLoop: [
               { type: 'walk', direction: 'up' },
               { type: 'stand', direction: 'left', time: 800 },
               { type: 'walk', direction: 'right' },
               { type: 'walk', direction: 'down' },
               { type: 'walk', direction: 'left' }
            ]
         })
      },
      walls: {
         [asGridCoord(7, 6)]: true,
         [asGridCoord(8, 6)]: true,
         [asGridCoord(7, 7)]: true,
         [asGridCoord(8, 7)]: true
      }
   },
   Kitchen: {
      lowerSrc: '/images/maps/KitchenLower.png',
      upperSrc: '/images/maps/KitchenUpper.png',
      gameObjects: {
         hero: new Person({
            x: withGrid(3),
            y: withGrid(5),
            isPlayerControlled: true
         }),
         npcA: new Person({
            x: withGrid(9),
            y: withGrid(6),
            src: '/images/characters/people/npc2.png'
         })
      },
      walls: {}
   }
};
