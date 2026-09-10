/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EquipmentSlot } from "../../../../enum/meta-domain/item/equipment-slot";
import type { ItemUsageAction } from "../../../../enum/meta-domain/item/item-usage-action";

export interface UseItemDTO {
  itemInstanceID: string;
  targetPositionX: number;
  targetPositionY: number;
  unequippedSlot: EquipmentSlot;
  itemUsageAction: ItemUsageAction;
}
