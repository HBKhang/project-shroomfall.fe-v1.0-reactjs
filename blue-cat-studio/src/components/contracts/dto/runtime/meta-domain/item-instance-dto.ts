/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemQuality } from "../../../enum/meta-domain/item/item-quality";
import type { EquipmentSlot } from "../../../enum/meta-domain/item/equipment-slot";

export interface ItemInstanceDTO {
  iD: string;
  definitionID: string;
  amount: number;
  quality: ItemQuality;
  durability: number;
  equippedSlot: EquipmentSlot;
}
