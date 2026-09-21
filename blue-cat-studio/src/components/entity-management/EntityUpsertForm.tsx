import React, { useState, useEffect } from 'react';
import { EntityType } from '../../contracts/enum/entity-domain/entity-type';
import { ItemQuality } from '../../contracts/enum/meta-domain/item/item-quality';
import { FormField, Input, ComponentCard } from './EntityFormHelpers';
import { ComponentRegistry, EntitySchemaRules } from './EntityRegistry';
import { useUpsertEntityDefinition, useDesignEntityDetail } from '../../api/hooks/useDesign';
import { enumToIndex, enumToString } from '../../utils/enum-helper';
import { CollisionRole } from '../../contracts/enum/entity-domain/collision-role';
import { CollisionShapeType } from '../../contracts/enum/entity-domain/collision-shape-type';
import { CustomSelect } from '../common/CustomSelect/CustomSelect';

interface EntityUpsertFormProps {
    entityId?: string;
    onClose: () => void;
}

export const EntityUpsertForm: React.FC<EntityUpsertFormProps> = ({ entityId, onClose }) => {
    const isEditing = !!entityId;

    // Fetch detailed pre-fill schema if an existing ID is passed
    const { data: detailData } = useDesignEntityDetail(entityId || '');
    const { mutate: upsertEntity, isPending } = useUpsertEntityDefinition();

    const [selectedType, setSelectedType] = useState<EntityType | ''>('');
    const [entityIdVal, setEntityIdVal] = useState('');
    const [componentsData, setComponentsData] = useState<Record<string, any>>({});
    const [componentOrder, setComponentOrder] = useState<string[]>([]);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    // Synchronize explicit layout arrays when server data details pack changes
    useEffect(() => {
        const keys = Object.keys(componentsData);
        setComponentOrder(prev => {
            const existingValid = prev.filter(k => keys.includes(k));
            const newKeys = keys.filter(k => !prev.includes(k));
            return [...existingValid, ...newKeys];
        });
    }, [componentsData]);

    // Populate form if in edit mode
    useEffect(() => {
        if (isEditing && detailData) {
            setEntityIdVal(entityId);
            setSelectedType(detailData.type);

            const loadedComponents: Record<string, any> = {};
            detailData.components?.forEach(c => {
                loadedComponents[c.componentType] = c;
            });

            setComponentsData(loadedComponents);
        } else if (!isEditing) {
            setEntityIdVal('');
            setSelectedType('');
            setComponentsData({});
        }
    }, [isEditing, detailData, entityId]);

    // Initialize mandatory components if selecting template during creation (Strict Registry Rule)
    useEffect(() => {
        if (isEditing) return; // Skip resets during edits
        if (selectedType === '') {
            setComponentsData({});
            return;
        }
        const requiredComponents = EntitySchemaRules[selectedType as EntityType] || [];
        const initialPayload: Record<string, any> = {};

        requiredComponents.forEach(comp => {
            initialPayload[comp] = { ComponentType: comp };
        });

        setComponentsData(initialPayload);
    }, [selectedType, isEditing]);

    const handleDragStart = (index: number) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDrop = (targetIndex: number) => {
        if (draggedIndex === null || draggedIndex === targetIndex) return;

        const updatedOrder = [...componentOrder];
        const [movedItem] = updatedOrder.splice(draggedIndex, 1);
        updatedOrder.splice(targetIndex, 0, movedItem);

        setComponentOrder(updatedOrder);
        setDraggedIndex(null);
    };

    const handleComponentChange = (componentType: string, updatedData: any) => {
        setComponentsData(prev => ({
            ...prev,
            [componentType]: { ...updatedData, ComponentType: componentType }
        }));
    };

    const removeComponent = (componentType: string) => {
        setComponentsData(prev => {
            const next = { ...prev };
            delete next[componentType];
            return next;
        });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedType === '') return;

        const targetEntityTypeIndex = typeof selectedType === 'number'
            ? selectedType
            : enumToIndex(EntityType, selectedType);

        const processedComponents = Object.values(componentsData).map((comp: any) => {
            const clonedComp = { ...comp };

            // 1. DTO FIX: Ensure ALL components get their required discriminator field
            if (clonedComp.ComponentType) {
                clonedComp.dto = `${clonedComp.ComponentType}DefinitionDTO`;
            }

            // 2. ENUM NULL FIX: Remove these fields so they don't break C# deserialization
            delete clonedComp.layer;
            delete clonedComp.mask;

            // If it's a Collision component, enforce backend enum parsing
            if (clonedComp.ComponentType === 'Collision' || 'collisionRole' in clonedComp) {
                if (typeof clonedComp.collisionRole === 'string') {
                    clonedComp.collisionRole = enumToIndex(CollisionRole, clonedComp.collisionRole);
                }
                if (typeof clonedComp.shapeType === 'string') {
                    clonedComp.shapeType = enumToIndex(CollisionShapeType, clonedComp.shapeType);
                }
            }

            // Convert inventory item qualities if present
            if (clonedComp.defaultItems && Array.isArray(clonedComp.defaultItems)) {
                clonedComp.defaultItems = clonedComp.defaultItems.map((item: any) => ({
                    ...item,
                    quality: typeof item.quality === 'string' ? enumToIndex(ItemQuality, item.quality) : item.quality
                }));
            }

            return clonedComp;
        });

        const payload = {
            iD: entityIdVal,
            type: targetEntityTypeIndex,
            components: processedComponents
        };

        upsertEntity(payload as any, {
            onSuccess: () => {
                if (onClose) onClose();
            },
            onError: (err: any) => {
                console.error("Failed to upsert entity:", {
                    status: err.response?.status,
                    message: err.message,
                    serverError: err.response?.data,
                });
            }
        });
    };

    const entityTypeOptions = Object.values(EntityType).map(String);
    const displayEntityTypeValue = isEditing 
        ? enumToString(EntityType, selectedType as any) 
        : (selectedType !== '' ? enumToString(EntityType, selectedType as any) : '');

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            <form onSubmit={handleSave} className="mx-auto max-w-[1600px] flex flex-col gap-6">

                {/* Header Section */}
                <header className="flex items-end justify-between border-b border-sky-100 pb-5">
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-sky-950">
                            {isEditing ? `Modify Entity [${entityIdVal}]` : 'Polymorphic Entity Definition Studio'}
                        </h1>
                        <p className="mt-1.5 text-sm text-sky-600/80">
                            Configure schema architecture, modify parameters, and arrange functional component nodes.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 cursor-pointer"
                    >
                        ← Back to Catalog
                    </button>
                </header>

                {/* Top Parameters Grid */}
                <div className="grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-4 rounded-xl border border-sky-100 bg-white p-5 shadow-sm">
                    <FormField label="Entity Unique Guid Identifier">
                        <Input
                            required
                            disabled={isEditing}
                            value={entityIdVal}
                            onChange={e => setEntityIdVal(e.target.value)}
                            placeholder="e.g., ent_skeleton_boss"
                        />
                    </FormField>

                    <FormField label="Base Entity Template Type">
                        {isEditing ? (
                            <Input
                                disabled
                                value={displayEntityTypeValue}
                                className="bg-sky-100/50 text-sky-500 cursor-not-allowed"
                            />
                        ) : (
                            <CustomSelect
                                value={displayEntityTypeValue}
                                onChange={(val) => {
                                    const matchedKey = Object.entries(EntityType).find(
                                        ([_, v]) => v === val || _ === val
                                    );
                                    if (matchedKey) {
                                        setSelectedType(matchedKey[1] as EntityType);
                                    } else {
                                        setSelectedType(val as EntityType);
                                    }
                                }}
                                options={entityTypeOptions}
                                placeholder="-- Choose Template Entity Blueprint --"
                            />
                        )}
                    </FormField>
                </div>

                {selectedType !== '' && (
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-2 pt-2">
                            <h3 className="text-base font-semibold text-sky-950">Entity Schema Architecture Configuration</h3>
                            <span className="text-xs font-medium text-sky-500">Drag cards to reorder components</span>
                        </div>

                        {/* Container layout wrapper */}
                        <div className="w-full [column-width:460px] [column-gap:20px]">
                            {componentOrder.map((compKey, index) => {
                                const config = ComponentRegistry[compKey];
                                if (!config) return null;
                                const FormComponent = config.component;

                                return (
                                    <ComponentCard
                                        key={compKey}
                                        title={config.title}
                                        data={componentsData[compKey] || {}}
                                        entityType={selectedType}
                                        componentType={compKey}
                                        rules={EntitySchemaRules}
                                        onRemove={() => removeComponent(compKey)}

                                        /* Drag and drop hook integrations */
                                        draggable
                                        isDragging={draggedIndex === index}
                                        onDragStart={() => handleDragStart(index)}
                                        onDragOver={(e) => handleDragOver(e)}
                                        onDrop={() => handleDrop(index)}
                                        onDragEnd={() => setDraggedIndex(null)}
                                    >
                                        <FormComponent
                                            data={componentsData[compKey] || {}}
                                            onChange={(d: any) => handleComponentChange(compKey, d)}
                                        />
                                    </ComponentCard>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Footer Submit Button Wrapper */}
                <div className="flex justify-end pt-4 border-t border-sky-100">
                    <button
                        type="submit"
                        disabled={isPending || selectedType === ''}
                        className={`inline-flex items-center gap-2 rounded-lg bg-sky-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition ${selectedType !== '' ? 'hover:bg-sky-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                            }`}
                    >
                        {isPending ? 'Committing Blueprint...' : 'Save Dynamic Entity Blueprint Configuration'}
                    </button>
                </div>
            </form>
        </div>
    );
};