/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { Vector2DTO } from "../../../common/vector2dto";

export interface ProjectileInstanceDTO extends ComponentInstanceDTO {
  velocity: number;
  direction: Vector2DTO;
}
