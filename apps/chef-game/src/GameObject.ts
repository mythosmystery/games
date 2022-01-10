import { OverworldMap } from './OverworldMap';
import { Sprite } from './Sprite';
import { Direction } from './types';

export interface GOConfig {
    x: number;
    y: number;
    src?: string
    direction?: Direction
}

export class GameObject {
    x: number;
    y: number;
    direction: Direction

    sprite: Sprite

    isMounted: boolean = false

    constructor(config: GOConfig) {
        this.x = config.x;
        this.y = config.y
        this.direction = config.direction || "down"
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src || "/images/characters/people/hero.png"
        })
    }

    mount(map: OverworldMap) {
        this.isMounted = true;
        map.addWall(this.x, this.y)
    }

    update(state: Object) { }
}