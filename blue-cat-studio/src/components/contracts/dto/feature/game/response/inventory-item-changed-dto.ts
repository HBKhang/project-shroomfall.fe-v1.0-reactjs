/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemInstanceDTO } from "../../../runtime/meta-domain/item-instance-dto";
import type { ItemInventorySyncEvent } from "../../../../enum/meta-domain/item/item-inventory-sync-event";

export interface InventoryItemChangedDTO {
  item: ItemInstanceDTO;
  eventType: ItemInventorySyncEvent;
}
