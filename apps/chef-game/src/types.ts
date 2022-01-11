export type Direction = 'up' | 'down' | 'left' | 'right';
export type AnimationFrameKey =
   | 'idle-down'
   | 'idle-up'
   | 'idle-right'
   | 'idle-left'
   | 'walk-down'
   | 'walk-up'
   | 'walk-left'
   | 'walk-right';
export type AnimationsType = { [key: string]: Array<[number, number]> };
export type DirectionMap = { [key: string]: ['x' | 'y', number] };
export type WallsMap = { [key: string]: boolean };
export interface Behavior {
   type: 'walk' | 'stand' | 'textMessage' | 'changeMap';
   direction?: Direction;
   time?: number;
   who?: string;
   retry?: boolean;
   text?: string;
   faceHero?: string;
   map?: string;
}
export type EventQueue = Array<{
   events: Array<Behavior>;
}>;
