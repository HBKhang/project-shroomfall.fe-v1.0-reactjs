/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { EffectInstanceDTO } from "../../meta-domain/effect-instance-dto";

export interface EffectContainerInstanceDTO extends ComponentInstanceDTO {
  trackingEffects: EffectInstanceDTO[];
}
