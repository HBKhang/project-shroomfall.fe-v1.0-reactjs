import { EquipmentSlot } from '../../../../contracts/enum/meta-domain/item/equipment-slot';
import { EffectSelectionMatrix } from './EffectSelectionMatrix';
import { CustomSelect } from '../../../common/CustomSelect/CustomSelect';

interface Props {
    config: {
        slot: EquipmentSlot;
        effectDefinitionIDs: string[];
    };
    onChange: (field: string, value: any) => void;
    effectsData: any;
    isLoadingEffects: boolean;
    effectSearch: string;
    setEffectSearch: (query: string) => void;
    onToggleEffect: (effectId: string) => void;
}

export function ItemEquippableConfig({
    config,
    onChange,
    effectsData,
    isLoadingEffects,
    effectSearch,
    setEffectSearch,
    onToggleEffect
}: Props) {
    const labelClass = "block text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5";

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-sky-900 tracking-tight">Equippable Equipment Settings</h4>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className={labelClass}>Target Equipment Slot</label>
                    <CustomSelect
                        value={config?.slot ?? EquipmentSlot.Chest}
                        onChange={(val) => onChange("slot", val)}
                        options={Object.values(EquipmentSlot)}
                        placeholder="Select Equipment Slot"
                    />
                </div>
            </div>

            <div className="mt-2">
                <EffectSelectionMatrix
                    selectedIds={config?.effectDefinitionIDs || []}
                    effectsData={effectsData}
                    isLoadingEffects={isLoadingEffects}
                    effectSearch={effectSearch}
                    setEffectSearch={setEffectSearch}
                    onToggleEffect={onToggleEffect}
                    searchLabel="Stat Modifiers / Persistent Passive Effects"
                    searchPlaceholder="Filter passive modifiers..."
                    maxHeight="268px"
                />
            </div>
        </div>
    );
}