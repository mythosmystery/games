
import { Overworld } from './Overworld';
import { OverworldMapConfig } from './OverworldMap';
import './style.css'

declare global {
  interface Window {
    OverworldMaps: {
      [key: string]: OverworldMapConfig
    }
  }
}

const overworld = new Overworld({
  element: document.querySelector(".game-container")!
})
overworld.init()