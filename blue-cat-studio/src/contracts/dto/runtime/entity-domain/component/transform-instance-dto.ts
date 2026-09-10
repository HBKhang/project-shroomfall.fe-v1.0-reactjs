/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { Vector2DTO } from "../../../common/vector2dto";
import type { EntityDirection } from "../../../../enum/entity-domain/entity-direction";
import type { EntityAction } from "../../../../enum/entity-domain/entity-action";

export interface TransformInstanceDTO extends ComponentInstanceDTO {
  layerZ: number;
  position: Vector2DTO;
  facingDirection: EntityDirection;
  currentAction: EntityAction;
}
