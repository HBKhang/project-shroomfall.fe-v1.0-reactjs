/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "../../../abstraction/component-definition-dto";

export interface AIDefinitionDTO extends ComponentDefinitionDTO {
  leashDistance: number;
  aggroRadius: number;
  thinkInterval: number;
  isAIControlled: boolean;
  equippedItemDefinitionID: string;
  attackRange: number;
}
