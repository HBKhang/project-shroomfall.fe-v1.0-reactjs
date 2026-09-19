import type { EffectDefinitionDTO } from '../../../../contracts/dto/definition/meta-domain/effect-definition-dto';

interface EffectSelectionMatrixProps {
    selectedIds: string[];
    effectsData: any;
    isLoadingEffects: boolean;
    effectSearch: string;
    setEffectSearch: (query: string) => void;
    onToggleEffect: (effectId: string) => void;
    searchLabel?: string;
    searchPlaceholder?: string;
    maxHeight?: string;
}

export function EffectSelectionMatrix({
    selectedIds,
    effectsData,
    isLoadingEffects,
    effectSearch,
    setEffectSearch,
    onToggleEffect,
    searchLabel = "Search & Bind Effects",
    searchPlaceholder = "Filter effects by name or signature...",
    maxHeight = "200px"
}: EffectSelectionMatrixProps) {
    const baseInputClass = "w-full h-10 rounded-lg border border-sky-300 bg-sky-50/50 px-3 text-sm text-sky-900 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-sky-400";
    const labelClass = "block text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5";

    return (
        <>
            <div>
                <label className={labelClass}>{searchLabel}</label>
                <input
                    type="text"
                    className={baseInputClass}
                    placeholder={searchPlaceholder}
                    value={effectSearch}
                    onChange={(e) => setEffectSearch(e.target.value)}
                />
            </div>

            <div 
                className="mt-3 overflow-y-auto rounded-lg border border-slate-200 p-2 bg-white shadow-2xs"
                style={{ maxHeight: maxHeight }}
            >
                {isLoadingEffects ? (
                    <div className="py-6 text-center text-xs text-sky-400 italic">Querying system matrix...</div>
                ) : (
                    effectsData?.items?.map((effect: EffectDefinitionDTO) => {
                        const isLinked = selectedIds.includes(effect.id);

                        const hasDuration = effect.duration !== null && effect.duration !== undefined && effect.duration > 0;
                        const durationText = hasDuration ? ` over ${effect.duration}s` : ' (Instant)';
                        const intervalText = effect.interval ? ` every ${effect.interval}s` : '';

                        return (
                            <label
                                key={effect.id}
                                className={`flex items-center justify-between gap-3 px-3 py-2 cursor-pointer border-b border-slate-100 last:border-b-0 transition-colors ${isLinked ? 'bg-sky-50' : 'hover:bg-slate-50'}`}
                            >
                                {/* Left Section: Selector & Identifiers */}
                                <div className="flex items-center gap-2.5">
                                    <input
                                        type="checkbox"
                                        checked={isLinked}
                                        onChange={() => onToggleEffect(effect.id)}
                                        className="rounded border-sky-300 text-sky-600 focus:ring-sky-400 cursor-pointer"
                                    />
                                    <div className="flex flex-col">
                                        <span className={`font-mono text-xs ${isLinked ? 'font-semibold text-blue-700' : 'text-slate-800'}`}>
                                            {effect.id}
                                        </span>
                                        {effect.presentation?.localizedText?.nameKey && (
                                            <span className="text-[11px] text-slate-500">
                                                Key: {effect.presentation.localizedText.nameKey}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Right Section: Specs Matrix badges */}
                                <div className="flex items-center gap-1.5 text-xs">
                                    <span className="px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                                        {effect.type}
                                    </span>
                                    <span className="text-slate-400">➔</span>
                                    <span className={`font-semibold ${effect.value >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {effect.value >= 0 ? `+${effect.value}` : effect.value} {effect.attributeType}
                                    </span>
                                    <span className="text-[11px] text-slate-500 italic">
                                        {durationText}{intervalText}
                                    </span>
                                </div>
                            </label>
                        );
                    })
                )}
            </div>
        </>
    );
}