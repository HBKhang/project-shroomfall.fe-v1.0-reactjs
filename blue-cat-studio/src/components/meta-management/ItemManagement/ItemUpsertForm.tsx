import React, { useState } from 'react';
import { enumToIndex } from '../../../utils/enum-helper';
import { useUpsertItemDefinition, useDesignAllEffects } from '../../../api/hooks/useDesign';
import { useItemUpsertForm } from '../../../hooks/useItemUpsertForm';
import { ItemType } from '../../../contracts/enum/meta-domain/item/item-type';
import { ItemCategory } from '../../../contracts/enum/meta-domain/item/item-category';
import { ItemConsumptionMethod } from '../../../contracts/enum/meta-domain/item/item-consumption-method';
import { EquipmentSlot } from '../../../contracts/enum/meta-domain/item/equipment-slot';
import { EntityAction } from '../../../contracts/enum/entity-domain/entity-action';
import type { ItemDefinitionDTO } from '../../../contracts/dto/definition/meta-domain/item-definition-dto';
import { ItemCostConfig } from './ItemConfig/ItemCostConfig';
import { ItemConsumableConfig } from './ItemConfig/ItemConsumableConfig';
import { ItemEquippableConfig } from './ItemConfig/ItemEquippableConfig';
import { ItemPlaceableConfig } from './ItemConfig/ItemPlaceableConfig';
import { ItemRangedConfig } from './ItemConfig/ItemRangedConfig';
import { ItemMeleeConfig } from './ItemConfig/ItemMeleeConfig';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';

interface ItemUpsertFormProps {
  item?: ItemDefinitionDTO | null;
  onClose: () => void;
}

export const ItemUpsertForm: React.FC<ItemUpsertFormProps> = ({ item, onClose }) => {
  const {
    mutate: upsertItem,
    isPending
  } = useUpsertItemDefinition();

  const {
    formData,
    setFormData,
  } = useItemUpsertForm(item);

  // Search filter query state for the Effects Matrix component
  const [effectSearch, setEffectSearch] = useState('');

  // Fetching effects dataset exclusively
  const { data: effectsData, isLoading: isLoadingEffects } = useDesignAllEffects({
    searchTerm: effectSearch,
    type: '' as any,
    attributeType: '' as any,
    pageNumber: 1,
    pageSize: 50
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;

    if (type === 'number' && value === '') {
      setFormData(prev => ({
        ...prev,
        [name]: undefined
      }));
      return;
    }

    const isNumeric = type === 'number' || (value.trim() !== '' && !isNaN(Number(value)));

    setFormData(prev => ({
      ...prev,
      [name]: isNumeric ? Number(value) : value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    // Intercept category switches to automatically resolve backend rules
    if (name === 'category') {
      const newCategory = value as ItemCategory;
      setFormData(prev => {
        const next: ItemDefinitionDTO = {
          ...prev,
          category: newCategory,
          maxDurability: undefined,
          presentation: undefined,
          consumableConfig: undefined,
          equippableConfig: undefined,
          placeableConfig: undefined,
          rangedConfig: undefined,
          meleeConfig: undefined,
        };

        // Initialize standard required schema shape per C# DTO structural rules
        if (newCategory === ItemCategory.Consumable) next.consumableConfig = { effectDefinitionIDs: [] };
        if (newCategory === ItemCategory.Equippable) next.equippableConfig = { slot: EquipmentSlot.Chest, effectDefinitionIDs: [] };
        if (newCategory === ItemCategory.Placeable) next.placeableConfig = { entityDefinitionID: '' };
        if (newCategory === ItemCategory.Ranged) next.rangedConfig = { entityDefinitionID: '' };
        if (newCategory === ItemCategory.Melee) next.meleeConfig = { entityDefinitionID: '' };

        return next;
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value || undefined
    }));
  };

  const handleNestedInputChange = (
    configKey: 'consumableConfig' | 'equippableConfig' | 'placeableConfig' | 'rangedConfig' | 'meleeConfig' | 'costConfig',
    field: string,
    value: any
  ) => {
    setFormData(prev => ({
      ...prev,
      [configKey]: {
        ...prev[configKey]!,
        [field]: value
      }
    }));
  };

  const toggleEffectAssociation = (configKey: 'consumableConfig' | 'equippableConfig', effectId: string) => {
    setFormData(prev => {
      const currentIds = prev[configKey]?.effectDefinitionIDs || [];
      const updatedIds = currentIds.includes(effectId)
        ? currentIds.filter(id => id !== effectId)
        : [...currentIds, effectId];

      return {
        ...prev,
        [configKey]: {
          ...prev[configKey]!,
          effectDefinitionIDs: updatedIds
        } as any
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const currentCat = formData.category;

    const payload: ItemDefinitionDTO = {
      id: formData.id,
      type: enumToIndex(ItemType, formData.type) as any,
      category: enumToIndex(ItemCategory, currentCat) as any,

      maxStack: formData.maxStack && formData.maxStack > 0
        ? formData.maxStack
        : undefined,

      maxDurability: formData.maxDurability,

      triggeredAction:
        formData.triggeredAction &&
          formData.triggeredAction !== EntityAction.NONE
          ? enumToIndex(EntityAction, formData.triggeredAction) as any
          : undefined,

      costConfig: {
        method: enumToIndex(ItemConsumptionMethod, formData.costConfig.method) as any,
      },

      consumableConfig: currentCat === ItemCategory.Consumable && formData.consumableConfig
        ? formData.consumableConfig
        : undefined,

      equippableConfig: currentCat === ItemCategory.Equippable && formData.equippableConfig
        ? {
          ...formData.equippableConfig,
          slot: enumToIndex(EquipmentSlot, formData.equippableConfig.slot) as any
        }
        : undefined,

      placeableConfig: currentCat === ItemCategory.Placeable && formData.placeableConfig
        ? formData.placeableConfig
        : undefined,

      rangedConfig: currentCat === ItemCategory.Ranged && formData.rangedConfig
        ? formData.rangedConfig
        : undefined,

      meleeConfig: currentCat === ItemCategory.Melee && formData.meleeConfig
        ? formData.meleeConfig
        : undefined,
    };

    upsertItem(payload as any, {
      onSuccess: () => {
        if (onClose) onClose();
      }
    });
  };

  const isStackDisabled = formData.maxStack === undefined;
  const isDurabilityDisabled = formData.maxDurability === undefined;

  const baseInputClass = "w-full h-10 rounded-lg border border-sky-300 bg-sky-50/50 px-3 text-sm text-sky-900 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-sky-400";
  const labelClass = "block text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5";

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 text-sky-950">
      <div className="flex justify-between items-center border-b border-sky-100 pb-3">
        <h3 className="text-base font-bold text-sky-900">
          {item ? `Modify Blueprint [${formData.id}]` : 'Assemble New Item Blueprint'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-sky-400 hover:text-sky-700 text-sm font-semibold cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* 2-Column Form Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">

        {/* COLUMN 1: Item Meta + Cost Config */}
        <div className="flex flex-col gap-4">
          <div>
            <label className={labelClass}>System ID Signature</label>
            <input
              type="text"
              name="id"
              value={formData.id}
              onChange={handleInputChange}
              disabled={!!item}
              className={`${baseInputClass} font-mono disabled:opacity-50 disabled:bg-slate-100`}
              placeholder="item_potion_healing_t1"
              required
            />
          </div>

          {/* Stack & Durability toggles/inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5 select-none">
                <input
                  type="checkbox"
                  checked={!isStackDisabled}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      maxStack: e.target.checked ? 99 : undefined
                    }));
                  }}
                  className="rounded border-sky-300 text-sky-600 focus:ring-sky-400 cursor-pointer"
                />
                Is Stackable Item?
              </label>
              <input
                type="number"
                name="maxStack"
                value={formData.maxStack ?? ''}
                onChange={handleInputChange}
                disabled={isStackDisabled}
                className={`${baseInputClass} disabled:opacity-50 disabled:bg-slate-100`}
                placeholder="Not Stackable"
                min={1}
              />
            </div>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5 select-none">
                <input
                  type="checkbox"
                  checked={!isDurabilityDisabled}
                  onChange={(e) => {
                    setFormData(prev => ({
                      ...prev,
                      maxDurability: e.target.checked
                        ? (prev.maxDurability ?? 100)
                        : undefined
                    }));
                  }}
                  className="rounded border-sky-300 text-sky-600 focus:ring-sky-400 cursor-pointer"
                />
                Has Durability?
              </label>
              <input
                type="number"
                name="maxDurability"
                value={formData.maxDurability ?? ''}
                onChange={handleInputChange}
                disabled={isDurabilityDisabled}
                className={`${baseInputClass} disabled:opacity-50 disabled:bg-slate-100`}
                placeholder="No Durability"
                min={1}
              />
            </div>
          </div>

          {/* Select definitions */}
          <div className="flex flex-col gap-3">
            <div>
              <label className={labelClass}>Item Type</label>
              <CustomSelect
                value={formData.type}
                onChange={(val) => handleSelectChange('type', val)}
                options={Object.values(ItemType)}
                placeholder="Select Item Type"
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <CustomSelect
                value={formData.category}
                onChange={(val) => handleSelectChange('category', val)}
                options={Object.values(ItemCategory)}
                placeholder="Select Category"
              />
            </div>

            <div>
              <label className={labelClass}>Triggered Action</label>
              <CustomSelect
                value={formData.triggeredAction || ''}
                onChange={(val) => handleSelectChange('triggeredAction', val)}
                options={Object.values(EntityAction)}
                placeholder="NONE"
              />
            </div>
          </div>

          <hr className="border-sky-100 my-1" />

          {/* Cost Matrix Block (Mandatory) */}
          <ItemCostConfig
            costConfig={formData.costConfig}
            onChange={(field, value) => handleNestedInputChange("costConfig", field, value)}
          />
        </div>

        {/* COLUMN 2: Usage / Category Configuration Block */}
        <div className="flex flex-col gap-4 bg-sky-50/30 p-4 rounded-xl border border-sky-100">
          <h4 className="text-xs font-bold text-sky-800 uppercase tracking-wider border-b border-sky-100 pb-2">
            Usage Configuration Modules
          </h4>

          {formData.category === ItemCategory.Consumable && formData.consumableConfig && (
            <ItemConsumableConfig
              config={formData.consumableConfig}
              effectsData={effectsData}
              isLoadingEffects={isLoadingEffects}
              effectSearch={effectSearch}
              setEffectSearch={setEffectSearch}
              onToggleEffect={(id) => toggleEffectAssociation('consumableConfig', id)}
            />
          )}

          {formData.category === ItemCategory.Equippable && formData.equippableConfig && (
            <ItemEquippableConfig
              config={formData.equippableConfig}
              onChange={(field, value) => handleNestedInputChange('equippableConfig', field, value)}
              effectsData={effectsData}
              isLoadingEffects={isLoadingEffects}
              effectSearch={effectSearch}
              setEffectSearch={setEffectSearch}
              onToggleEffect={(id) => toggleEffectAssociation('equippableConfig', id)}
            />
          )}

          {formData.category === ItemCategory.Placeable && formData.placeableConfig && (
            <ItemPlaceableConfig
              config={formData.placeableConfig}
              onChange={(field, value) => handleNestedInputChange('placeableConfig', field, value)}
            />
          )}

          {formData.category === ItemCategory.Ranged && formData.rangedConfig && (
            <ItemRangedConfig
              config={formData.rangedConfig}
              onChange={(field, value) => handleNestedInputChange('rangedConfig', field, value)}
            />
          )}

          {formData.category === ItemCategory.Melee && formData.meleeConfig && (
            <ItemMeleeConfig
              config={formData.meleeConfig}
              onChange={(field, value) => handleNestedInputChange('meleeConfig', field, value)}
            />
          )}

          {formData.category === ItemCategory.Material && (
            <div className="py-6 text-center text-sm text-sky-400 italic">
              Material Settings (no additional configuration required)
            </div>
          )}

          {!formData.category && (
            <div className="py-6 text-center text-sm text-sky-400 italic">
              Select an item category to display configuration options.
            </div>
          )}
        </div>

      </div>

      {/* Actions Footer */}
      <div className="flex justify-end gap-3 pt-4 border-t border-sky-100">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-sky-700 hover:bg-sky-50 transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          {isPending ? 'Saving Blueprint...' : 'Commit Configuration Blueprint'}
        </button>
      </div>
    </form>
  );
};