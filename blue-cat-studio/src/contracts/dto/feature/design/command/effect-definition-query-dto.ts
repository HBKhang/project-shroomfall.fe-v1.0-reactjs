/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectType } from "../../../../enum/meta-domain/effect/effect-type";
import type { AttributeType } from "../../../../enum/meta-domain/effect/attribute-type";

export interface EffectDefinitionQueryDTO {
  searchTerm?: string;
  type?: EffectType;
  attributeType: AttributeType;
  pageNumber: number;
  pageSize: number;
}
