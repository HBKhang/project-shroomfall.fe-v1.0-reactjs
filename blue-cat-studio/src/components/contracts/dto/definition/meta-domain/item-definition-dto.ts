/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemType } from "../../../enum/meta-domain/item/item-type";
import type { ItemCategory } from "../../../enum/meta-domain/item/item-category";
import type { EntityAction } from "../../../enum/entity-domain/entity-action";
import type { ItemPresentationDefinitionDTO } from "./item-presentation-definition-dto";
import type { ConsumableConfigDTO } from "./consumable-config-dto";
import type { EquippableConfigDTO } from "./equippable-config-dto";
import type { PlaceableConfigDTO } from "./placeable-config-dto";
import type { RangedConfigDTO } from "./ranged-config-dto";
import type { MeleeConfigDTO } from "./melee-config-dto";
import type { CostConfigDTO } from "./cost-config-dto";

export interface ItemDefinitionDTO {
  id: string;
  type: ItemType;
  category: ItemCategory;
  maxStack?: number;
  maxDurability?: number;
  triggeredAction?: EntityAction;
  presentation?: ItemPresentationDefinitionDTO;
  consumableConfig?: ConsumableConfigDTO;
  equippableConfig?: EquippableConfigDTO;
  placeableConfig?: PlaceableConfigDTO;
  rangedConfig?: RangedConfigDTO;
  meleeConfig?: MeleeConfigDTO;
  costConfig: CostConfigDTO;
}
