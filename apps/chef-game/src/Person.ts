import { GameObject, GOConfig } from "./GameObject";
import { OverworldMap } from "./OverworldMap";
import { AnimationFrameKey, Direction, DirectionMap } from "./types";
import { GRID_SIZE } from "./utils";

interface PersonState {
  arrow: Direction | undefined;
  map: OverworldMap;
}

export interface Behavior {
  type: "walk" | "idle";
  direction: Direction;
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
      up: ["y", -1],
      down: ["y", 1],
      left: ["x", -1],
      right: ["x", 1],
    };
  }

  update(state: PersonState) {
    if (this.movingProgressRemaining > 0) {
      this.updatePosition();
    } else {
      if (state.arrow && this.isPlayerControlled) {
        this.startBehavior(state, {
          type: "walk",
          direction: state.arrow,
        });
      }
      this.updateSprite();
    }
  }

  startBehavior(state: PersonState, behavior: Behavior) {
    this.direction = behavior.direction;
    if (behavior.type === "walk") {
      if (state.map.isSpaceTaken(this.x, this.y, this.direction)) {
        return;
      }
      state.map.moveWall(this.x, this.y, this.direction);
      this.movingProgressRemaining = GRID_SIZE;
    }
  }

  updatePosition() {
    const [property, change] = this.directionUpdate[this.direction];
    this[property] += change;
    this.movingProgressRemaining -= 1;
  }

  updateSprite() {
    if (this.movingProgressRemaining > 0) {
      this.sprite.setAnimation(("walk-" + this.direction) as AnimationFrameKey);
      return;
    }
    this.sprite.setAnimation(("idle-" + this.direction) as AnimationFrameKey);
  }
}
