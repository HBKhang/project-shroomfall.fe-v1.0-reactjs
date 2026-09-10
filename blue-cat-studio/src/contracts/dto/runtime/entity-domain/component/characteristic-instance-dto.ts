/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { AttributeValueInstanceDTO } from "./attribute-value-instance-dto";

export interface CharacteristicInstanceDTO extends ComponentInstanceDTO {
  cores: AttributeValueInstanceDTO[];
  vitals: AttributeValueInstanceDTO[];
  currentLevel: number;
}
