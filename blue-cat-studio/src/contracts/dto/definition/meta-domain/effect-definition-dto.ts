/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectType } from "../../../enum/meta-domain/effect/effect-type";
import type { AttributeType } from "../../../enum/meta-domain/effect/attribute-type";
import type { EffectPresentationDefinitionDTO } from "./effect-presentation-definition-dto";

export interface EffectDefinitionDTO {
  id: string;
  type: EffectType;
  attributeType: AttributeType;
  value: number;
  duration?: number;
  interval?: number;
  presentation?: EffectPresentationDefinitionDTO;
}
