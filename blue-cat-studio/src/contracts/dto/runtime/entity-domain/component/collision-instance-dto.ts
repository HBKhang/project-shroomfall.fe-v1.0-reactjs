/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { CollisionShapeType } from "../../../../enum/entity-domain/collision-shape-type";
import type { Vector2 } from "./vector2";
import type { CollisionLayer } from "../../../../enum/entity-domain/collision-layer";

export interface CollisionInstanceDTO extends ComponentInstanceDTO {
  shapeType: CollisionShapeType;
  collisionOffset: Vector2;
  layer: CollisionLayer;
  mask: CollisionLayer;
  width: number;
  height: number;
  radius: number;
  isBlocking: boolean;
}
