import { PIXOentity } from "./engine/PIXOentity";

export class PlayerCharacter extends PIXOentity {
  turnTaken = false;
  #unhandledCollisions = [];

  constructor({PIXISprite, x=0, y=0, input, rlHandler}) {
    super({PIXISprite, x, y, input});
    this.components.collidor.hitboxes = [{hitbox: {x: 0, y: 0, height: 16, width: 16}, name: "player"}];
    this.components.collidor.handler = this.collisionHandler;
  }

  collisionHandler = (collidorName, entity) => {
    this.#unhandledCollisions.push({collidorName, entity});
  }

  update(dt) {
    if(!this.turnTaken) {
      const lastPosition = {x: this.x, y: this.y};
      if(this.components.input.keysDown["w"]) {
        this.y -= 16;
        this.turnTaken = true;
      }

      if(this.components.input.keysDown["a"]) {
        this.x -= 16;
        this.turnTaken = true;
      }

      if(this.components.input.keysDown["s"]) {
        this.y += 16;
        this.turnTaken = true;
      }

      if(this.components.input.keysDown["d"]) {
        this.x += 16;
        this.turnTaken = true;
      }

      const movementCollisions = this.components.collidor.areaCollisions({
        x: this.x,
        y: this.y,
        width: this.components.collidor.hitboxes[0].hitbox.width,
        height: this.components.collidor.hitboxes[0].hitbox.height
      }, this);

      if(movementCollisions.length > 0) {
        for(const collision of movementCollisions) {
          this.components.rlController.encounterHandler(collision);
        }
      }

      const collisions = this.components.collidor.getCollisions();
      if(collisions.length > 0) {
        this.x = lastPosition.x;
        this.y = lastPosition.y;
        this.turnTaken = false;
      }
    }

    // if(this.#unhandledCollisions.length > 0) {
    //   for(const collision of this.#unhandledCollisions) {
    //   }

    //   this.#unhandledCollisions = [];
    // }
  }

  render(dt) {
    this.components.sprite.x = this.x;
    this.components.sprite.y = this.y;
  }
}
