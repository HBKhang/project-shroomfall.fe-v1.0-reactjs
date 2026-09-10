/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemQuality } from "../../../../enum/meta-domain/item/item-quality";

export interface InventoryEntryDTO {
  iD?: string;
  definitionID: string;
  amount: number;
  quality: ItemQuality;
}
