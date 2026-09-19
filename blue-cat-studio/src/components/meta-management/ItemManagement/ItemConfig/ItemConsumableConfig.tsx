import { EffectSelectionMatrix } from './EffectSelectionMatrix';

interface Props {
    config: {
        effectDefinitionIDs: string[];
    };
    effectsData: any;
    isLoadingEffects: boolean;
    effectSearch: string;
    setEffectSearch: (query: string) => void;
    onToggleEffect: (effectId: string) => void;
}

export function ItemConsumableConfig({
    config,
    effectsData,
    isLoadingEffects,
    effectSearch,
    setEffectSearch,
    onToggleEffect
}: Props) {
    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-sky-900 tracking-tight">Consumable Settings</h4>
            <EffectSelectionMatrix
                selectedIds={config?.effectDefinitionIDs || []}
                effectsData={effectsData}
                isLoadingEffects={isLoadingEffects}
                effectSearch={effectSearch}
                setEffectSearch={setEffectSearch}
                onToggleEffect={onToggleEffect}
                searchLabel="Search & Bind Effects"
                searchPlaceholder="Filter effects by name or signature..."
                maxHeight="200px"
            />
        </div>
    );
}