import { SPRITE_SIZE, withGrid } from './utils';
import { GameObject } from './GameObject';
import { AnimationFrameKey, AnimationsType } from './types';

export interface SpriteConfig {
   animations?: AnimationsType;
   animationFrameLimit?: number;
   currentAnimation?: string;
   src: string;
   gameObject: GameObject;
}

export class Sprite {
   animations: AnimationsType;
   currentAnimation: string;
   currentAnimationFrame: number;
   animationFrameLimit: number;
   animationFrameProgress: number;

   image: HTMLImageElement;
   isLoaded: boolean = false;

   shadow: HTMLImageElement;
   isShadowLoaded: boolean = false;
   useShadow: boolean = true;

   gameObject: GameObject;

   constructor(config: SpriteConfig) {
      this.image = new Image();
      this.image.src = config.src;
      this.image.onload = () => {
         this.isLoaded = true;
      };

      this.shadow = new Image();
      if (this.useShadow) {
         this.shadow.src = '/images/characters/shadow.png';
      }
      this.shadow.onload = () => {
         this.isShadowLoaded = true;
      };

      this.animations = config.animations || {
         'idle-down': [[0, 0]],
         'idle-right': [[0, 1]],
         'idle-up': [[0, 2]],
         'idle-left': [[0, 3]],
         'walk-down': [
            [1, 0],
            [0, 0],
            [3, 0],
            [0, 0]
         ],
         'walk-right': [
            [1, 1],
            [0, 1],
            [3, 1],
            [0, 1]
         ],
         'walk-up': [
            [1, 2],
            [0, 2],
            [3, 2],
            [0, 2]
         ],
         'walk-left': [
            [1, 3],
            [0, 3],
            [3, 3],
            [0, 3]
         ]
      };

      this.currentAnimation = config.currentAnimation || 'idle-down';
      this.currentAnimationFrame = 0;

      this.animationFrameLimit = config.animationFrameLimit || 4;
      this.animationFrameProgress = this.animationFrameLimit;

      this.gameObject = config.gameObject;
   }

   get frame() {
      return this.animations[this.currentAnimation][this.currentAnimationFrame];
   }

   setAnimation(key: AnimationFrameKey) {
      if (this.currentAnimation !== key) {
         this.currentAnimation = key;
         this.currentAnimationFrame = 0;
         this.animationFrameProgress = this.animationFrameLimit;
      }
   }

   updateAnimationProgress() {
      if (this.animationFrameProgress > 0) {
         this.animationFrameProgress -= 1;
         return;
      }

      this.animationFrameProgress = this.animationFrameLimit;
      this.currentAnimationFrame += 1;

      if (this.frame === undefined) {
         this.currentAnimationFrame = 0;
      }
   }

   draw(ctx: CanvasRenderingContext2D, cameraPerson: GameObject) {
      const x = this.gameObject.x - 8 + withGrid(10.5) - cameraPerson.x;
      const y = this.gameObject.y - 18 + withGrid(6) - cameraPerson.y;

      this.isShadowLoaded && ctx.drawImage(this.shadow, x, y);

      const [frameX, frameY] = this.frame;

      this.isLoaded &&
         ctx.drawImage(
            this.image,
            frameX * SPRITE_SIZE,
            frameY * 32,
            SPRITE_SIZE,
            SPRITE_SIZE,
            x,
            y,
            SPRITE_SIZE,
            SPRITE_SIZE
         );

      this.updateAnimationProgress();
   }
}
