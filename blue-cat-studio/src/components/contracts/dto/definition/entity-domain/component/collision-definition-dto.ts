/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "../../../abstraction/component-definition-dto";
import type { CollisionRole } from "../../../../enum/entity-domain/collision-role";
import type { CollisionShapeType } from "../../../../enum/entity-domain/collision-shape-type";

export interface CollisionDefinitionDTO extends ComponentDefinitionDTO {
  collisionRole: CollisionRole;
  shapeType: CollisionShapeType;
  width: number;
  height: number;
  radius: number;
  isBlocking: boolean;
  offsetX: number;
  offsetY: number;
}
