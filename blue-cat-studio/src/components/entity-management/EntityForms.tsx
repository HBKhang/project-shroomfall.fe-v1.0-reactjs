import { useState } from 'react';
import { FormRow, FormField, Input } from './EntityFormHelpers';
import { enumToString, enumToIndex } from '../../utils/enum-helper';
import { AttributeType } from '../../contracts/enum/meta-domain/effect/attribute-type';
import { CollisionLayer } from '../../contracts/enum/entity-domain/collision-layer';
import { CollisionShapeType } from '../../contracts/enum/entity-domain/collision-shape-type';
import { ItemQuality } from '../../contracts/enum/meta-domain/item/item-quality';
import { useDesignAllItems } from '../../api/hooks/useDesign';
import { useRef } from 'react';
import { CustomSelect } from '../common/CustomSelect/CustomSelect';
import { CollisionRole } from '../../contracts/enum/entity-domain/collision-role';
import { CollisionPresets } from '../../utils/collision-helper';

// ==========================================
// REUSABLE FIND & SELECT COMPONENTS
// ==========================================

export const EffectSelector = ({
    value,
    onChange,
    placeholder = "Effect ID GUID Reference",
    className
}: {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}) => {
    return (
        <Input
            className={className}
            value={value}
            placeholder={placeholder}
            onChange={e => onChange(e.target.value)}
        />
    );
};

// ==========================================
// FORM COMPONENTS
// ==========================================

export const CollisionForm = ({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) => {
    const updateField = (fields: Record<string, any>) => {
        onChange({
            ...data,
            ...fields,
        });
    };

    const handleEnumChange = (
        field: "shapeType" | "collisionRole",
        value: string
    ) => {
        updateField({ [field]: value });
    };

    const shapeOptions = Object.values(CollisionShapeType).map(String);
    const roleOptions = Object.values(CollisionRole).map(String);

    const checkboxClass =
        "flex items-center gap-2 cursor-pointer text-sm font-medium text-slate-700 select-none mt-5";

    // FIX: Convert the backend value (which might be a number) to the string enum first
    // so it correctly matches the keys in your CollisionPresets dictionary.
    const currentRoleString = enumToString(CollisionRole, data.collisionRole);

    // Safely fallback to the first preset if collisionRole is missing or invalid
    const activePreset =
        (currentRoleString && CollisionPresets[currentRoleString as keyof typeof CollisionPresets])
            ? CollisionPresets[currentRoleString as keyof typeof CollisionPresets]
            : Object.values(CollisionPresets)[0];

    return (
        <>
            <FormRow>
                <FormField label="Shape Type">
                    <CustomSelect
                        value={enumToString(CollisionShapeType, data.shapeType)}
                        onChange={(val) =>
                            handleEnumChange("shapeType", val)
                        }
                        options={shapeOptions}
                        placeholder="Select shape type..."
                    />
                </FormField>

                <FormField label="Collision Role">
                    <CustomSelect
                        value={currentRoleString} // Use the parsed string here too
                        onChange={(val) =>
                            handleEnumChange("collisionRole", val)
                        }
                        options={roleOptions}
                        placeholder="Select collision role..."
                    />
                </FormField>

                <FormField label="Layer">
                    <Input
                        value={enumToString(CollisionLayer, activePreset?.layer)}
                        readOnly
                        className="bg-slate-50 text-slate-500 cursor-not-allowed"
                    />
                </FormField>
            </FormRow>

            {/* Dynamic Collision Mask Preview */}
            <div className="flex flex-col gap-1.5 px-1">
                <span className="text-xs font-semibold text-sky-900/70">Active Collision Mask Layers:</span>
                <div className="flex flex-wrap gap-2">
                    {activePreset?.mask?.map((layer: any) => (
                        <span
                            key={layer}
                            className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700 shadow-2xs"
                        >
                            {enumToString(CollisionLayer, layer)}
                        </span>
                    ))}
                </div>
            </div>

            <FormRow>
                <FormField label="Width">
                    <Input
                        type="number"
                        step="any"
                        value={data.width ?? 0}
                        onChange={(e) =>
                            updateField({
                                width: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </FormField>

                <FormField label="Height">
                    <Input
                        type="number"
                        step="any"
                        value={data.height ?? 0}
                        onChange={(e) =>
                            updateField({
                                height: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </FormField>

                <FormField label="Radius">
                    <Input
                        type="number"
                        step="any"
                        value={data.radius ?? 0}
                        onChange={(e) =>
                            updateField({
                                radius: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </FormField>
            </FormRow>

            <FormRow>
                <FormField label="Offset X">
                    <Input
                        type="number"
                        step="any"
                        value={data.offsetX ?? 0}
                        onChange={(e) =>
                            updateField({
                                offsetX: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </FormField>

                <FormField label="Offset Y">
                    <Input
                        type="number"
                        step="any"
                        value={data.offsetY ?? 0}
                        onChange={(e) =>
                            updateField({
                                offsetY: parseFloat(e.target.value) || 0,
                            })
                        }
                    />
                </FormField>

                <label className={checkboxClass}>
                    <input
                        type="checkbox"
                        checked={!!data.isBlocking}
                        onChange={(e) =>
                            updateField({
                                isBlocking: e.target.checked,
                            })
                        }
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 w-4 h-4"
                    />
                    Is Blocking Physical Movement
                </label>
            </FormRow>
        </>
    );
};

export const AIForm = ({
    data,
    onChange,
}: {
    data: any;
    onChange: (d: any) => void;
}) => (
    <FormRow>
        <FormField label="Aggro Radius">
            <Input
                type="number"
                step="any"
                value={data.aggroRadius ?? 0}
                onChange={(e) =>
                    onChange({
                        ...data,
                        aggroRadius: parseFloat(e.target.value) || 0,
                    })
                }
            />
        </FormField>

        <FormField label="Leash Distance">
            <Input
                type="number"
                step="any"
                value={data.leashDistance ?? 0}
                onChange={(e) =>
                    onChange({
                        ...data,
                        leashDistance: parseFloat(e.target.value) || 0,
                    })
                }
            />
        </FormField>

        <FormField label="Think Interval (sec)">
            <Input
                type="number"
                step="any"
                value={data.thinkInterval ?? 0}
                onChange={(e) =>
                    onChange({
                        ...data,
                        thinkInterval: parseFloat(e.target.value) || 0,
                    })
                }
            />
        </FormField>

        <FormField label="Attack Range">
            <Input
                type="number"
                step="any"
                value={data.attackRange ?? 0}
                onChange={(e) =>
                    onChange({
                        ...data,
                        attackRange: parseFloat(e.target.value) || 0,
                    })
                }
            />
        </FormField>

        {/* Manual Text Input occupying 2 columns */}
        <div className="col-span-2">
            <FormField label="Equipped Item Definition ID">
                <Input
                    type="text"
                    value={data.equippedItemDefinitionID ?? ""}
                    onChange={(e) =>
                        onChange({
                            ...data,
                            equippedItemDefinitionID: e.target.value,
                        })
                    }
                    placeholder="item.weapon.sword"
                    className="font-mono"
                />
            </FormField>
        </div>

        <label className="mt-5 flex cursor-pointer select-none items-center gap-2 text-sm font-medium text-slate-700">
            <input
                type="checkbox"
                checked={!!data.isAIControlled}
                onChange={(e) =>
                    onChange({
                        ...data,
                        isAIControlled: e.target.checked,
                    })
                }
                className="h-4 w-4 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
            />
            Is AI Controlled
        </label>
    </FormRow>
);

export const LifetimeForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormField label="Lifetime Duration (sec)">
        <Input type="number" step="any" value={data.duration ?? 0} onChange={e => onChange({ ...data, duration: parseFloat(e.target.value) || 0 })} />
    </FormField>
);

export const ProjectileForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => (
    <FormRow>
        <FormField label="Velocity Vector Speed"><Input type="number" step="any" value={data.velocity ?? 0} onChange={e => onChange({ ...data, velocity: parseFloat(e.target.value) || 0 })} /></FormField>
        <FormField label="On Impact Spawn Entity ID"><Input value={data.onImpactSpawnEntityDefinitionID || ''} onChange={e => onChange({ ...data, onImpactSpawnEntityDefinitionID: e.target.value || null })} /></FormField>
    </FormRow>
);

export const AppearanceForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const updateSkinHsv = (hsvField: 'h' | 's' | 'v', val: number) => {
        const currentHsv = data.skinColor || { h: 0, s: 0, v: 0 };
        onChange({
            ...data,
            skinColor: { ...currentHsv, [hsvField]: val }
        });
    };

    const effectiveSkinId = data.skinID || 'UNKNOWN';

    return (
        <>
            <FormRow>
                <FormField label="Skin Atlas ID">
                    <Input
                        disabled
                        value={effectiveSkinId}
                        className={`bg-slate-300 text-slate-600 cursor-not-allowed ${effectiveSkinId === 'UNKNOWN' ? 'font-bold' : 'font-normal'}`}
                    />
                </FormField>
            </FormRow>

            <div className="flex flex-col gap-2.5 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <strong className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Skin Color (HSV)</strong>
                <FormRow>
                    <FormField label="Skin H">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.h ?? 0}
                            onChange={e => updateSkinHsv('h', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                    <FormField label="Skin S">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.s ?? 0}
                            onChange={e => updateSkinHsv('s', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                    <FormField label="Skin V">
                        <Input
                            type="number"
                            step="0.01"
                            value={data.skinColor?.v ?? 0}
                            onChange={e => updateSkinHsv('v', parseFloat(e.target.value) || 0)}
                        />
                    </FormField>
                </FormRow>
            </div>
        </>
    );
};

export const TriggeredEffectForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const effectIDs = data.effectDefinitionIDs || [];
    const addEffect = () => onChange({ ...data, effectDefinitionIDs: [...effectIDs, ''] });
    const removeEffect = (index: number) => onChange({ ...data, effectDefinitionIDs: effectIDs.filter((_: any, i: number) => i !== index) });
    const updateEffect = (index: number, val: string) => {
        const updated = [...effectIDs];
        updated[index] = val;
        onChange({ ...data, effectDefinitionIDs: updated });
    };

    return (
        <div className="flex flex-col gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
            <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Triggered Effect Definition Pipelines</span>
            {effectIDs.map((id: string, index: number) => (
                <div key={index} className="flex gap-2 items-center">
                    <EffectSelector
                        className="grow"
                        value={id}
                        onChange={val => updateEffect(index, val)}
                    />
                    <button type="button" onClick={() => removeEffect(index)} className="px-2.5 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer">Delete</button>
                </div>
            ))}
            <button type="button" onClick={addEffect} className="self-start px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer">
                + Add Effect Link Hook
            </button>
        </div>
    );
};

export const InventoryForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const defaultItems = data.defaultItems || [];
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch items dynamically based on the search query for the picker
    const { data: itemsData } = useDesignAllItems({
        searchTerm: searchTerm,
        type: undefined as any,
        category: undefined as any,
        pageNumber: 1,
        pageSize: 15,
    });

    const searchResults = itemsData?.items || [];

    // Fetch all items to accurately rehydrate names for already saved definition IDs
    const { data: allItemsData } = useDesignAllItems({
        searchTerm: '',
        type: undefined as any,
        category: undefined as any,
        pageNumber: 1,
        pageSize: 100,
    });

    const allItemsList = allItemsData?.items || [];
    const itemMap = new Map<string, string>();
    allItemsList.forEach((itemDef: any) => {
        const label = itemDef.presentation?.localizedText?.nameKey || itemDef.presentation?.name || itemDef.id;
        itemMap.set(itemDef.id, label);
    });

    const addItem = (definitionID: string) => {
        if (!definitionID) return;
        onChange({
            ...data,
            defaultItems: [
                ...defaultItems,
                {
                    definitionID,
                    amount: 1,
                    quality: ItemQuality.Medium
                }
            ]
        });
        setSearchTerm(''); // Clear search after selection
    };

    const removeItem = (index: number) => {
        onChange({
            ...data,
            defaultItems: defaultItems.filter((_: any, i: number) => i !== index)
        });
    };

    const updateItem = (index: number, fields: any) => {
        const updatedItems = defaultItems.map((item: any, i: number) => i === index ? { ...item, ...fields } : item);
        onChange({ ...data, defaultItems: updatedItems });
    };

    const handleQualityChange = (index: number, value: string) => {
        updateItem(index, {
            quality: enumToIndex(ItemQuality, value) as any
        });
    };

    const qualityOptions = Object.values(ItemQuality).map(String);

    return (
        <div className="flex flex-col gap-4">
            {/* Part 1: Base Inventory Slot Count Capacity */}
            <FormField label="Base Inventory Slot Count Capacity">
                <Input
                    type="number"
                    className="w-30"
                    value={data.slotCount ?? 0}
                    onChange={e => onChange({ ...data, slotCount: parseInt(e.target.value, 10) || 0 })}
                />
            </FormField>

            {/* Part 2: Search Bar & Item Picker Section */}
            <div className="flex flex-col gap-2 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Search & Add Item</span>
                <FormField label="Catalogue Search">
                    <Input
                        type="text"
                        placeholder="Type to search items..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                </FormField>

                {searchTerm && searchResults.length > 0 && (
                    <div className="flex flex-col bg-white border border-slate-200 rounded-md shadow-sm max-h-48 overflow-y-auto">
                        {searchResults.map((itemDef: any) => {
                            const name = itemDef.presentation?.localizedText?.nameKey || itemDef.presentation?.name || itemDef.id;
                            return (
                                <div
                                    key={itemDef.id}
                                    onClick={() => addItem(itemDef.id)}
                                    className="px-3 py-2 text-xs text-slate-700 hover:bg-sky-50 hover:text-sky-700 cursor-pointer border-b border-slate-100 last:border-b-0 flex justify-between items-center"
                                >
                                    <span className="font-medium">{name}</span>
                                    <span className="text-sky-600 font-semibold">+ Add</span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Part 3: Rehydrated Default Items List (2 Rows per Item) */}
            <div className="flex flex-col gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-lg">
                <span className="text-xs font-semibold text-slate-700 uppercase tracking-wider">Starting Loot Drops / Default Items</span>

                {defaultItems.map((item: any, index: number) => {
                    const resolvedName = itemMap.get(item.definitionID) || item.definitionID;
                    return (
                        <div key={index} className="flex flex-col gap-2.5 p-3 bg-white border border-slate-200 rounded-md">
                            {/* Row 1: Item Name, Quantity, and Remove Button */}
                            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_auto] gap-2.5 items-end">
                                <FormField label="Item Name">
                                    <Input
                                        type="text"
                                        value={resolvedName}
                                        readOnly
                                        className="bg-slate-50 text-slate-600"
                                    />
                                </FormField>

                                <FormField label="Quantity">
                                    <Input
                                        type="number"
                                        placeholder="Qty"
                                        value={item.amount ?? 1}
                                        onChange={e => updateItem(index, { amount: parseInt(e.target.value, 10) || 1 })}
                                    />
                                </FormField>

                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="px-2.5 py-1.5 bg-red-50 text-red-700 border border-red-200 rounded-md text-xs font-medium hover:bg-red-100 transition-colors cursor-pointer h-[38px]"
                                >
                                    Remove
                                </button>
                            </div>

                            {/* Row 2: Quality */}
                            <FormField label="Quality">
                                <CustomSelect
                                    value={enumToString(ItemQuality, item.quality)}
                                    onChange={val => handleQualityChange(index, val)}
                                    options={qualityOptions}
                                    placeholder="Select quality..."
                                />
                            </FormField>
                        </div>
                    );
                })}

                {defaultItems.length === 0 && (
                    <div className="text-xs text-slate-400 italic py-2 text-center">
                        No default items added yet. Use the search bar above to find and append items.
                    </div>
                )}
            </div>
        </div>
    );
};

export const CharacteristicForm = ({ data, onChange }: { data: any; onChange: (d: any) => void }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Track open/close collapsible growth values by attribute ID or index
    const [openGrowths, setOpenGrowths] = useState<Record<string | number, boolean>>({});

    const attributeValues = data.attributeValues || [];

    const toggleGrowth = (key: string | number) => {
        setOpenGrowths((prev) => ({ ...prev, [key]: !prev[key] }));
    };

    // --- State Handlers ---
    const addAttribute = () =>
        onChange({
            ...data,
            attributeValues: [
                ...attributeValues,
                {
                    iD: crypto.randomUUID(),
                    type: enumToIndex(AttributeType, AttributeType.Health) as any,
                    baseValue: 0,
                    min: 0,
                    max: 100,
                    attributeGrowthValues: []
                }
            ]
        });

    const removeAttribute = (index: number) =>
        onChange({
            ...data,
            attributeValues: attributeValues.filter((_: any, i: number) => i !== index)
        });

    const updateAttribute = (index: number, fields: any) => {
        onChange({
            ...data,
            attributeValues: attributeValues.map((attr: any, i: number) => (i === index ? { ...attr, ...fields } : attr))
        });
    };

    const addGrowth = (index: number, growths: any[]) => {
        updateAttribute(index, {
            attributeGrowthValues: [
                ...growths,
                {
                    iD: crypto.randomUUID(),
                    level: growths.length + 1,
                    growthValue: 0
                }
            ]
        });
    };

    const handleAttributeTypeChange = (index: number, stringValue: string) => {
        updateAttribute(index, {
            type: enumToIndex(AttributeType, stringValue) as any
        });
    };

    const sanitizeImportedData = (items: any[]) => {
        return items.map((attr) => {
            const { level, ...restOfAttr } = attr;
            return {
                ...restOfAttr,
                iD: attr.iD || attr.id || crypto.randomUUID(),
                type: typeof attr.type === 'string' ? enumToIndex(AttributeType, attr.type) : attr.type,
                attributeGrowthValues: (attr.attributeGrowthValues || []).map((growth: any) => ({
                    iD: growth.iD || growth.id || crypto.randomUUID(),
                    level: growth.level,
                    growthValue: growth.growthValue ?? 0
                }))
            };
        });
    };

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importedData = JSON.parse(e.target?.result as string);
                const rawAttributes = Array.isArray(importedData)
                    ? importedData
                    : importedData.attributeValues || [importedData];

                const sanitizedAttributes = sanitizeImportedData(rawAttributes);

                onChange({
                    ...data,
                    attributeValues: [...attributeValues, ...sanitizedAttributes]
                });
            } catch (err) {
                alert('Failed to parse JSON file. Please provide a valid attribute JSON structure.');
            }
            if (fileInputRef.current) fileInputRef.current.value = '';
        };
        reader.readAsText(file);
    };

    const handleDownloadJson = () => {
        const stripIds = (items: any[]) => {
            return items.map(({ iD, id, level, ...rest }) => ({
                ...rest,
                attributeGrowthValues:
                    rest.attributeGrowthValues?.map(({ iD: gId, id: gLegacyId, ...gRest }: any) => ({ ...gRest })) || []
            }));
        };

        const cleanAttributes = stripIds(attributeValues);
        const jsonString = JSON.stringify({ attributeValues: cleanAttributes }, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `attributes_template_${Date.now()}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const attributeTypeOptions = Object.values(AttributeType).map(String);

    return (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-lg">
            {/* ROW 1: Status Indicator & Count Badge */}
            <div className="flex items-center">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60 shadow-2xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {attributeValues.length} {attributeValues.length === 1 ? 'Configured Attribute' : 'Configured Attributes'}
                </span>
            </div>

            {/* ROW 2: JSON Import / Export Actions */}
            <div className="flex items-center gap-2">
                <input
                    type="file"
                    ref={fileInputRef}
                    accept="application/json"
                    onChange={handleFileUpload}
                    className="hidden"
                />

                {/* Upload Button */}
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
                >
                    <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    Upload JSON
                </button>

                {/* Export Button */}
                {attributeValues.length > 0 && (
                    <button
                        type="button"
                        onClick={handleDownloadJson}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-md shadow-2xs hover:bg-slate-50 hover:text-slate-900 transition-all cursor-pointer active:scale-95"
                    >
                        <svg className="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Export JSON
                    </button>
                )}
            </div>

            {/* ROW 3: Modal Trigger Button */}
            <div>
                <button
                    type="button"
                    onClick={() => setIsModalOpen(true)}
                    className="w-full py-2.5 rounded-md text-xs font-semibold bg-sky-600 text-white hover:bg-sky-700 transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-1.5 active:scale-[0.99]"
                >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                    View & Manage Attributes Grid
                </button>
            </div>

            {/* POPUP MODAL: 4-Column Grid View */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
                    <div className="flex flex-col w-full max-w-6xl max-h-[90vh] bg-white rounded-lg shadow-2xl border border-slate-200 overflow-hidden">

                        {/* Modal Header */}
                        <div className="flex justify-between items-center px-6 py-4 border-b border-slate-200 bg-slate-50">
                            <div>
                                <h3 className="text-sm font-bold text-slate-800">Attributes Grid Manager</h3>
                                <p className="text-[11px] text-slate-500">Configure stats and expand growth curves</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="text-slate-400 hover:text-slate-600 text-lg font-bold px-2 py-0.5 rounded cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Body: 4-Column Grid */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-4">
                            {attributeValues.length === 0 ? (
                                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
                                    <p className="text-xs text-slate-500 mb-3">No attributes created yet.</p>
                                    <button
                                        type="button"
                                        onClick={addAttribute}
                                        className="px-3 py-1.5 bg-sky-600 text-white rounded-md text-xs font-semibold hover:bg-sky-700 transition-colors cursor-pointer"
                                    >
                                        + Add New Attribute
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {attributeValues.map((attr: any, index: number) => {
                                        const key = attr.iD || attr.id || index;
                                        const isOpen = !!openGrowths[key];
                                        const growths = attr.attributeGrowthValues || [];

                                        return (
                                            <div
                                                key={key}
                                                className="flex flex-col gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-md shadow-xs"
                                            >
                                                {/* Card Header & Delete Button */}
                                                <div className="flex justify-between items-center border-b border-slate-200 pb-2">
                                                    <span className="text-[11px] font-mono text-slate-400">#{index + 1}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => removeAttribute(index)}
                                                        className="px-2 py-1 bg-red-50 text-red-700 border border-red-200 rounded text-[11px] font-medium hover:bg-red-100 transition-colors cursor-pointer"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>

                                                {/* Attribute Type Field */}
                                                <FormField label="Type">
                                                    <CustomSelect
                                                        value={enumToString(AttributeType, attr.type)}
                                                        onChange={(val: string) => handleAttributeTypeChange(index, val)}
                                                        options={attributeTypeOptions}
                                                        placeholder="Select type..."
                                                    />
                                                </FormField>

                                                {/* Base, Min, Max inputs */}
                                                <div className="grid grid-cols-3 gap-1.5">
                                                    <FormField label="Base">
                                                        <Input
                                                            type="number"
                                                            value={attr.baseValue ?? 0}
                                                            onChange={(e: any) =>
                                                                updateAttribute(index, { baseValue: parseFloat(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </FormField>
                                                    <FormField label="Min">
                                                        <Input
                                                            type="number"
                                                            value={attr.min ?? 0}
                                                            onChange={(e: any) =>
                                                                updateAttribute(index, { min: parseFloat(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </FormField>
                                                    <FormField label="Max">
                                                        <Input
                                                            type="number"
                                                            value={attr.max ?? 100}
                                                            onChange={(e: any) =>
                                                                updateAttribute(index, { max: parseFloat(e.target.value) || 0 })
                                                            }
                                                        />
                                                    </FormField>
                                                </div>

                                                {/* Open/Close Growth Section */}
                                                <div className="mt-1 border-t border-slate-200 pt-2">
                                                    <button
                                                        type="button"
                                                        onClick={() => toggleGrowth(key)}
                                                        className="w-full flex justify-between items-center text-[11px] font-semibold text-slate-600 hover:text-slate-900 cursor-pointer"
                                                    >
                                                        <span>Growth Values ({growths.length})</span>
                                                        <span className="text-slate-400 text-[10px]">{isOpen ? '▲ Hide' : '▼ View'}</span>
                                                    </button>

                                                    {isOpen && (
                                                        <div className="flex flex-col gap-2 mt-2 pt-2 border-t border-slate-200/60">
                                                            <div className="grid grid-cols-2 gap-1.5 max-h-40 overflow-y-auto pr-1">
                                                                {growths.map((growth: any) => (
                                                                    <div
                                                                        key={growth.iD || `level-${growth.level}`}
                                                                        className="flex flex-col gap-0.5 p-1 bg-white border border-slate-200 rounded-sm"
                                                                    >
                                                                        <span className="text-[10px] text-slate-500 font-medium">
                                                                            Lvl {growth.level}:
                                                                        </span>
                                                                        <Input
                                                                            type="number"
                                                                            className="py-0.5 px-1 text-xs"
                                                                            value={growth.growthValue}
                                                                            onChange={(e: any) => {
                                                                                const nextGrowths = growths.map((g: any) => ({
                                                                                    ...g,
                                                                                    growthValue:
                                                                                        g.level === growth.level
                                                                                            ? parseFloat(e.target.value) || 0
                                                                                            : g.growthValue
                                                                                }));
                                                                                updateAttribute(index, { attributeGrowthValues: nextGrowths });
                                                                            }}
                                                                        />
                                                                    </div>
                                                                ))}
                                                            </div>

                                                            <button
                                                                type="button"
                                                                onClick={() => addGrowth(index, growths)}
                                                                className="self-start px-2 py-0.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-[10px] font-semibold transition-colors cursor-pointer"
                                                            >
                                                                + Add Level
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="flex justify-between items-center px-6 py-3.5 border-t border-slate-200 bg-slate-50">
                            <button
                                type="button"
                                onClick={addAttribute}
                                className="px-3 py-1.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-md text-xs font-semibold hover:bg-sky-100 transition-colors cursor-pointer"
                            >
                                + Add New Attribute
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-4 py-1.5 bg-slate-800 text-white rounded-md text-xs font-semibold hover:bg-slate-700 transition-colors cursor-pointer"
                            >
                                Save & Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};