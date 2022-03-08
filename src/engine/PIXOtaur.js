import * as PIXI from "pixi.js";

import { PIXOentity } from "./PIXOentity";
import { PIXOcollidorSpace } from "./PIXOcollidorSpace";
import { PIXOinput } from "./PIXOinput";
import { PIXOtiledMap } from "./PIXOtiledMap";
import { PIXOtileSet } from "./PIXOtileSet";
import { PIXOspriteSheetSet } from "./PIXOspriteSheetSet";

export class PIXOtaur {
  #elapsed = 0;
  #entities = [];
  #map;
  #spritesContainer;

  app;

  constructor({width=400, height=400, spriteScale={x: 1, y: 1}, collidor}) {
    this.app = new PIXI.Application({ width, height });
    this.app.stage.sortableChildren = true;
    this.app.stage.scale.x = spriteScale.x;
    this.app.stage.scale.y = spriteScale.y;
    this.collidor = collidor;

    this.#spritesContainer = new PIXI.Container();
    this.#spritesContainer.zIndex = 0;
    this.app.stage.addChild(this.#spritesContainer);

    document.body.appendChild(this.app.view);
  }

  addEntity(entity) {
    this.#entities.push(entity);
    if(entity.components.sprite) {
      this.#spritesContainer.addChild(entity.components.sprite);
    }
  }

  update(dt, elapsed) {
    this.#entities.forEach(entity => entity.update(dt, elapsed));
    if(this.collidor) {
      this.collidor.update();
    }
  }

  setMap(map) {
    this.#map = map;
    this.app.stage.addChild(...map.layers);
    this.app.stage.sortChildren();
  }

  update(dt, elapsed) {
    this.#entities.forEach(entity => entity.update(dt, elapsed));
  }

  render(dt, elapsed) {
    this.#entities.forEach(entity => entity.render(dt, elapsed));
  }

  start() {
    this.app.ticker.add(delta => {
      this.#elapsed += delta;
      this.update(delta, this.#elapsed);
      this.render(delta, this.#elapsed);
    });
  }
}

export { PIXOentity, PIXOcollidorSpace, PIXOinput, PIXOtiledMap, PIXOtileSet, PIXOspriteSheetSet };