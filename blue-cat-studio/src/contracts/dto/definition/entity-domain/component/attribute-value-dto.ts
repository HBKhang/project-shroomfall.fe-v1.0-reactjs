/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { AttributeType } from "../../../../enum/meta-domain/effect/attribute-type";
import type { AttributeGrowthValueDTO } from "./attribute-growth-value-dto";

export interface AttributeValueDTO {
  iD?: string;
  type: AttributeType;
  baseValue: number;
  min: number;
  max: number;
  attributeGrowthValues: AttributeGrowthValueDTO[];
}
