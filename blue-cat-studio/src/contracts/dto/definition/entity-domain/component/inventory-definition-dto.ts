/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentDefinitionDTO } from "../../../abstraction/component-definition-dto";
import type { InventoryEntryDTO } from "./inventory-entry-dto";

export interface InventoryDefinitionDTO extends ComponentDefinitionDTO {
  slotCount: number;
  defaultItems: InventoryEntryDTO[];
}
