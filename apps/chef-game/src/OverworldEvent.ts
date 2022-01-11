import { OverworldMap } from './OverworldMap';
import { SceneTransition } from './SceneTransition';
import { TextMessage } from './TextMessage';
import { Behavior } from './types';
import { opositeDirection } from './utils';

export interface EventConfig {
   map: OverworldMap;
   event: Behavior;
}

export class OverworldEvent {
   map: OverworldMap;
   event: Behavior;

   constructor(config: EventConfig) {
      this.map = config.map;
      this.event = config.event;
   }
   init() {
      return new Promise(resolve => {
         this[this.event.type](resolve);
      });
   }

   stand(resolve: Function) {
      const who = this.map.gameObjects[this.event.who!];
      who.startBehavior(
         {
            map: this.map
         },
         {
            type: 'stand',
            direction: this.event.direction,
            time: this.event.time
         }
      );

      const completeHandler = (e: any) => {
         if (e.detail.whoId === this.event.who) {
            document.removeEventListener('PersonStandComplete', completeHandler);
            resolve();
         }
      };
      document.addEventListener('PersonStandComplete', completeHandler);
   }

   walk(resolve: Function) {
      const who = this.map.gameObjects[this.event.who!];
      who.startBehavior(
         {
            map: this.map
         },
         {
            type: 'walk',
            direction: this.event.direction,
            retry: true
         }
      );

      const completeHandler = (e: any) => {
         if (e.detail.whoId === this.event.who) {
            document.removeEventListener('PersonWalkingComplete', completeHandler);
            resolve();
         }
      };

      document.addEventListener('PersonWalkingComplete', completeHandler);
   }

   textMessage(resolve: Function) {
      if (this.event.faceHero) {
         const obj = this.map.gameObjects[this.event.faceHero];
         obj.direction = opositeDirection(this.map.gameObjects['hero'].direction);
      }

      const message = new TextMessage({
         text: this.event.text!,
         onComplete: () => resolve()
      });
      message.init(document.querySelector('.game-container')!);
   }

   changeMap(resolve: Function) {
      const sceneTransition = new SceneTransition();
      sceneTransition.init(document.querySelector('.game-container')!, () => {
         this.map.overworld?.startMap(window.OverworldMaps[this.event.map!]);
         resolve();

         sceneTransition.fadeOut();
      });
   }
}
