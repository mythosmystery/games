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

   stand(resolve: Function) {}

   walk(resolver: Function) {
      const who = this.map.gameObjects[this.event.who!];
      who.startBehavior(
         {
            map: this.map
         },
         {
            type: 'walk',
            direction: this.event.direction
         }
      );
   }
}
