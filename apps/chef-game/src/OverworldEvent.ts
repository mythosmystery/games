import { OverworldMap } from './OverworldMap';
import { Behavior } from './types';

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
}
