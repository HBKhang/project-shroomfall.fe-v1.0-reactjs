interface Props {
    config: {
        entityDefinitionID: string;
    };
    onChange: (field: string, value: any) => void;
}

export function ItemMeleeConfig({
    config,
    onChange
}: Props) {
    const baseInputClass = "w-full h-10 rounded-lg border border-sky-300 bg-sky-50/50 px-3 text-sm text-sky-900 outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-100 transition-all placeholder:text-sky-400";
    const labelClass = "block text-xs font-semibold text-sky-700 uppercase tracking-wider mb-1.5";

    return (
        <div className="flex flex-col gap-4">
            <h4 className="text-sm font-semibold text-sky-900 tracking-tight">Melee Weapon Settings</h4>
            <div className="w-full">
                <label className={labelClass}>Weapon Strike Bounds Entity ID</label>
                <input
                    type="text"
                    value={config?.entityDefinitionID ?? ''}
                    onChange={(e) => onChange("entityDefinitionID", e.target.value)}
                    className={`${baseInputClass} font-mono`}
                    placeholder="ent_melee_sword_steel"
                    required
                />
            </div>
        </div>
    );
}