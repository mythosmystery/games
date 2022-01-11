import { GameObject, GOConfig, GOState } from './GameObject';
import { OverworldMap } from './OverworldMap';
import { AnimationFrameKey, Behavior, Direction, DirectionMap } from './types';
import { emitEvent, GRID_SIZE } from './utils';

export interface PersonState extends GOState {
   arrow: Direction | undefined;
}

export interface PersonConfig extends GOConfig {
   isPlayerControlled?: boolean;
}

export class Person extends GameObject {
   movingProgressRemaining: number;
   directionUpdate: DirectionMap;

   isPlayerControlled: boolean;

   constructor(config: PersonConfig) {
      super(config);
      this.isPlayerControlled = config.isPlayerControlled || false;
      this.movingProgressRemaining = 0;
      this.directionUpdate = {
         up: ['y', -1],
         down: ['y', 1],
         left: ['x', -1],
         right: ['x', 1]
      };
   }

   update(state: PersonState) {
      if (this.movingProgressRemaining > 0) {
         this.updatePosition();
      } else {
         if (state.arrow && this.isPlayerControlled && !state.map.isCutscenePlaying) {
            this.startBehavior(state, {
               type: 'walk',
               direction: state.arrow
            });
         }
         this.updateSprite();
      }
   }

   startBehavior(state: PersonState, behavior: Behavior) {
      this.direction = behavior.direction!;
      if (behavior.type === 'walk') {
         if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
            behavior.retry &&
               setTimeout(() => {
                  this.startBehavior(state, behavior);
               }, 10);

            return;
         }
         state.map.moveWall(this.x, this.y, this.direction);
         this.movingProgressRemaining = GRID_SIZE;
         this.updateSprite();
      }

      if (behavior.type === 'stand') {
         this.isStanding = true;
         setTimeout(() => {
            emitEvent('PersonStandComplete', { whoId: this.id });
         }, behavior.time);
         this.isStanding = false;
      }
   }

   updatePosition() {
      const [property, change] = this.directionUpdate[this.direction];
      this[property] += change;
      this.movingProgressRemaining -= 1;

      if (this.movingProgressRemaining === 0) {
         //we finished the walk
         emitEvent('PersonWalkingComplete', {
            whoId: this.id
         });
      }
   }

   updateSprite() {
      if (this.movingProgressRemaining > 0) {
         this.sprite.setAnimation(('walk-' + this.direction) as AnimationFrameKey);
         return;
      }
      this.sprite.setAnimation(('idle-' + this.direction) as AnimationFrameKey);
   }
}
