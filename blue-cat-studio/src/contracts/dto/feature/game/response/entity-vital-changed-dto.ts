/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { AttributeType } from "../../../../enum/meta-domain/effect/attribute-type";
import type { VitalChangeReason } from "../../../../enum/meta-domain/effect/vital-change-reason";

export interface EntityVitalChangedDTO {
  entityInstanceID: string;
  attributeType: AttributeType;
  newValue: number;
  vitalChangeReason: VitalChangeReason;
}
