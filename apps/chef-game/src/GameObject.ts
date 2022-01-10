import { OverworldEvent } from './OverworldEvent';
import { OverworldMap } from './OverworldMap';
import { PersonState } from './Person';
import { Sprite } from './Sprite';
import { Behavior, Direction } from './types';

export interface GOConfig {
   x: number;
   y: number;
   src?: string;
   direction?: Direction;
   behaviorLoop?: Array<Behavior>;
}

export interface GOState {
   map: OverworldMap;
}

export class GameObject {
   x: number;
   y: number;
   id: string | null = null;
   direction: Direction;

   sprite: Sprite;

   isMounted: boolean = false;

   behaviorLoop: Array<Behavior>;
   behaviorLoopIndex: number;

   constructor(config: GOConfig) {
      this.x = config.x;
      this.y = config.y;
      this.direction = config.direction || 'down';
      this.sprite = new Sprite({
         gameObject: this,
         src: config.src || '/images/characters/people/hero.png'
      });
      this.behaviorLoop = config.behaviorLoop || [];
      this.behaviorLoopIndex = 0;
   }

   mount(map: OverworldMap) {
      this.isMounted = true;
      map.addWall(this.x, this.y);

      setTimeout(() => {
         this.doBehaviorEvent(map);
      }, 10);
   }

   async doBehaviorEvent(map: OverworldMap) {
      if (map.isCutscenePlaying || this.behaviorLoop.length === 0) {
         return;
      }

      let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
      eventConfig.who = this.id || 'unknown';

      const eventHandler = new OverworldEvent({ map, event: eventConfig });

      await eventHandler.init();

      this.behaviorLoopIndex++;

      if (this.behaviorLoopIndex === this.behaviorLoop.length) {
         this.behaviorLoopIndex = 0;
      }

      this.doBehaviorEvent(map);
   }

   update(state: Object) {}
   startBehavior(state: GOState, behavior: Behavior) {}
}
