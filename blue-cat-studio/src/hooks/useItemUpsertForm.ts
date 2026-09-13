import { useState, useEffect } from "react";
import { ItemType } from "../contracts/enum/meta-domain/item/item-type";
import { ItemCategory } from "../contracts/enum/meta-domain/item/item-category";
import { EntityAction } from "../contracts/enum/entity-domain/entity-action";
import { ItemConsumptionMethod } from "../contracts/enum/meta-domain/item/item-consumption-method";
import { EquipmentSlot } from "../contracts/enum/meta-domain/item/equipment-slot";
import { enumToString } from "../utils/enum-helper";
import type { ItemDefinitionDTO } from "../contracts/dto/definition/meta-domain/item-definition-dto";

export const useItemUpsertForm = (item?: ItemDefinitionDTO | null) => {
  // Track layout active configs based on categories
  const [activeConfigs, setActiveConfigs] = useState({
    consumable: false,
    equippable: false,
    placeable: false,
    ranged: false,
    melee: false,
  });

  // Local Form Payload State Management matching exact C# DTO schema layouts
  const [formData, setFormData] = useState<ItemDefinitionDTO>({
    id: '',
    type: ItemType.Material,
    category: ItemCategory.Material,
    maxStack: undefined,
    maxDurability: undefined,
    triggeredAction: EntityAction.NONE,
    presentation: undefined,
    costConfig: {
      method: ItemConsumptionMethod.None,
    },
    consumableConfig: undefined,
    equippableConfig: undefined,
    placeableConfig: undefined,
    rangedConfig: undefined,
    meleeConfig: undefined
  });

  // Sync state whenever the backend model data properties change
  useEffect(() => {
    if (item) {
      const itemCategory = enumToString(ItemCategory, item.category) as ItemCategory;

      setFormData({
        id: item.id,
        type: enumToString(ItemType, item.type) as ItemType,
        category: itemCategory,
        maxStack: item.maxStack ?? undefined,
        maxDurability: item.maxDurability ?? undefined,
        triggeredAction:
          item.triggeredAction == null
            ? EntityAction.NONE
            : enumToString(EntityAction, item.triggeredAction) as EntityAction,
        costConfig: {
          method: enumToString(
            ItemConsumptionMethod,
            item.costConfig?.method
          ) as ItemConsumptionMethod,
        },
        
        // Map category DTO blocks with inline enum string safety transforms
        consumableConfig: item.consumableConfig 
          ? {
              effectDefinitionIDs: item.consumableConfig.effectDefinitionIDs ?? []
            }
          : undefined,
        equippableConfig: item.equippableConfig
          ? {
              slot: enumToString(EquipmentSlot, item.equippableConfig.slot) as EquipmentSlot,
              effectDefinitionIDs: item.equippableConfig.effectDefinitionIDs ?? []
            }
          : undefined,
        placeableConfig: item.placeableConfig 
          ? { 
              entityDefinitionID: item.placeableConfig.entityDefinitionID ?? '' 
            } 
          : undefined,
        rangedConfig: item.rangedConfig 
          ? { 
              entityDefinitionID: item.rangedConfig.entityDefinitionID ?? '' 
            } 
          : undefined,
        meleeConfig: item.meleeConfig 
          ? { 
              entityDefinitionID: item.meleeConfig.entityDefinitionID ?? '' 
            } 
          : undefined
      });

      setActiveConfigs({
        consumable: !!item.consumableConfig,
        equippable: !!item.equippableConfig,
        placeable: !!item.placeableConfig,
        ranged: !!item.rangedConfig,
        melee: !!item.meleeConfig,
      });
    } else {
      // Default schema setup for a brand new instance matrix
      setFormData({
        id: '',
        type: ItemType.Material,
        category: ItemCategory.Material,
        maxStack: undefined,
        maxDurability: undefined,
        triggeredAction: EntityAction.NONE,
        costConfig: { method: ItemConsumptionMethod.None },
        consumableConfig: undefined,
        equippableConfig: undefined,
        placeableConfig: undefined,
        rangedConfig: undefined,
        meleeConfig: undefined
      });
      
      setActiveConfigs({
        consumable: false,
        equippable: false,
        placeable: false,
        ranged: false,
        melee: false,
      });
    }
  }, [item]);

  return {
    formData,
    setFormData,
    activeConfigs,
    setActiveConfigs
  };
};