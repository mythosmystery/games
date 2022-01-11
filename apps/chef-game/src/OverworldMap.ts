import { GameObject } from './GameObject';
import { Overworld } from './Overworld';
import { OverworldEvent } from './OverworldEvent';
import { Person } from './Person';
import { Behavior, Direction, EventQueue, WallsMap } from './types';
import { asGridCoord, nextPosition, withGrid } from './utils';

export interface OverworldMapConfig {
   gameObjects: {
      [key: string]: GameObject;
   };
   lowerSrc: string;
   upperSrc: string;
   walls: WallsMap;
   cutsceneSpaces?: {
      [key: string]: EventQueue;
   };
}

export class OverworldMap {
   gameObjects: {
      [key: string]: GameObject;
   };

   lowerImg: HTMLImageElement;
   upperImg: HTMLImageElement;

   walls: WallsMap;

   isCutscenePlaying: boolean = false;

   cutsceneSpaces: {
      [key: string]: EventQueue;
   };

   overworld: Overworld | null = null;

   constructor(config: OverworldMapConfig) {
      this.gameObjects = config.gameObjects;
      this.walls = config.walls || {};
      this.cutsceneSpaces = config.cutsceneSpaces || {};

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

      Object.values(this.gameObjects).forEach(object => {
         object.doBehaviorEvent(this);
      });
   }

   checkForActionCutscene() {
      const hero = this.gameObjects['hero'];
      const nextCoords = nextPosition(hero.x, hero.y, hero.direction);
      const match = Object.values(this.gameObjects).find(
         object => `${object.x},${object.y}` === `${nextCoords.x},${nextCoords.y}`
      );
      if (match && match.talking.length && !this.isCutscenePlaying) {
         this.startCutscene(match.talking[0].events);
      }
   }

   checkForFootstepCutscene() {
      const hero = this.gameObjects['hero'];
      const match = this.cutsceneSpaces[`${hero.x},${hero.y}`];
      if (!this.isCutscenePlaying && match) {
         this.startCutscene(match[0].events);
      }
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
            ],
            talking: [
               {
                  events: [
                     { type: 'textMessage', text: 'Hello there!', faceHero: 'npcA' },
                     { type: 'textMessage', text: 'General Kenobi' }
                  ]
               }
            ]
         }),
         npcB: new Person({
            x: withGrid(8),
            y: withGrid(5),
            src: '/images/characters/people/npc2.png'
         })
      },
      walls: {
         [asGridCoord(7, 6)]: true,
         [asGridCoord(8, 6)]: true,
         [asGridCoord(7, 7)]: true,
         [asGridCoord(8, 7)]: true
      },
      cutsceneSpaces: {
         [asGridCoord(7, 4)]: [
            {
               events: [
                  { who: 'npcB', type: 'walk', direction: 'left' },
                  { who: 'npcB', type: 'stand', direction: 'up', time: 300 },
                  { type: 'textMessage', text: 'GET OUT!' },
                  { who: 'npcB', type: 'walk', direction: 'right' },
                  { who: 'hero', type: 'walk', direction: 'down' },
                  { who: 'hero', type: 'walk', direction: 'left' }
               ]
            }
         ],
         [asGridCoord(5, 10)]: [
            {
               events: [{ type: 'changeMap', map: 'Kitchen' }]
            }
         ]
      }
   },
   Kitchen: {
      lowerSrc: '/images/maps/KitchenLower.png',
      upperSrc: '/images/maps/KitchenUpper.png',
      gameObjects: {
         hero: new Person({
            x: withGrid(5),
            y: withGrid(5),
            isPlayerControlled: true
         }),
         npcA: new Person({
            x: withGrid(9),
            y: withGrid(6),
            src: '/images/characters/people/npc2.png',
            talking: [
               {
                  events: [{ type: 'textMessage', text: 'Hell', faceHero: 'npcA' }]
               }
            ]
         })
      },
      walls: {},
      cutsceneSpaces: {
         [asGridCoord(5, 10)]: [
            {
               events: [{ type: 'changeMap', map: 'DemoRoom' }]
            }
         ]
      }
   }
};
