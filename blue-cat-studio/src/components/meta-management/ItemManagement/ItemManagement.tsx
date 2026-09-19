import React, { useState } from 'react';
import { useDesignAllItems, useImportItemDefinitions } from '../../../api/hooks/useDesign';
import { ItemUpsertForm } from './ItemUpsertForm';
import { ItemType } from '../../../contracts/enum/meta-domain/item/item-type';
import { ItemCategory } from '../../../contracts/enum/meta-domain/item/item-category';
import type { ItemDefinitionDTO } from '../../../contracts/dto/definition/meta-domain/item-definition-dto';
import type { ItemDefinitionQueryDTO } from '../../../contracts/dto/feature/design/command/item-definition-query-dto';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';
import { enumToString } from '../../../utils/enum-helper';

export const ItemManagement: React.FC = () => {
    // Pipeline query filters binding
    const [queryParams, setQueryParams] = useState<Partial<ItemDefinitionQueryDTO>>({
        searchTerm: '',
        type: undefined,
        category: undefined,
        pageNumber: 1,
        pageSize: 10
    });

    // Dynamic core engine asset query fetching
    const { data: itemsData, isLoading: itemsLoading, refetch } = useDesignAllItems(queryParams as ItemDefinitionQueryDTO);

    // Form canvas layouts states
    const [selectedItem, setSelectedItem] = useState<ItemDefinitionDTO | null>(null);
    const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

    // --- Upload Modal State & Mutation ---
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const importItemMutation = useImportItemDefinitions();

    const handleOpenCreateMode = () => {
        setSelectedItem(null);
        setIsFormOpen(true);
    };

    const handleOpenEditMode = (blueprint: ItemDefinitionDTO) => {
        setSelectedItem(blueprint);
        setIsFormOpen(true);
    };

    const handleCloseFormWorkspace = () => {
        setIsFormOpen(false);
        setSelectedItem(null);
    };

    const updateFilterField = (field: keyof ItemDefinitionQueryDTO, value: any) => {
        setQueryParams(prev => ({
            ...prev,
            [field]: value || undefined,
            pageNumber: 1
        }));
    };

    const shiftPage = (direction: number) => {
        setQueryParams(prev => {
            const nextPage = Math.max(1, (prev.pageNumber || 1) + direction);
            return {
                ...prev,
                pageNumber: nextPage
            };
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        importItemMutation.mutate(selectedFile, {
            onSuccess: () => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
                refetch();
            },
        });
    };

    const closeModal = () => {
        if (importItemMutation.isPending) return;
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        importItemMutation.reset();
    };

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            {/* Header Section */}
            <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sky-950">
                        System Item Blueprints
                    </h1>
                    <p className="mt-1.5 text-sm text-sky-600/80">
                        Configure system item definitions, stacks, and configuration modules for the runtime core.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    {/* Upload Button */}
                    <button
                        type="button"
                        onClick={() => setIsUploadModalOpen(true)}
                        className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
                    >
                        <span className="material-symbols-outlined text-[18px] text-sky-600">
                            upload_file
                        </span>
                        Import Data
                    </button>

                    {/* New Item Button */}
                    {!isFormOpen && (
                        <button
                            type="button"
                            onClick={handleOpenCreateMode}
                            className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[18px] text-sky-600">
                                add
                            </span>
                            New Item
                        </button>
                    )}
                </div>
            </header>

            {/* Control Filters Panel */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[280px]">
                    <input
                        type="text"
                        placeholder="Filter blueprints by keyword..."
                        value={queryParams.searchTerm || ''}
                        onChange={(e) => updateFilterField('searchTerm', e.target.value)}
                        className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <CustomSelect
                    value={queryParams.type || ''}
                    onChange={(val) => updateFilterField('type', val)}
                    options={Object.values(ItemType)}
                    placeholder="All Item Types"
                />

                <CustomSelect
                    value={queryParams.category || ''}
                    onChange={(val) => updateFilterField('category', val)}
                    options={Object.values(ItemCategory)}
                    placeholder="All Categories"
                />
            </div>

            {/* Configured splitscreen grid layout setup */}
            <main className={`grid gap-6 transition-all duration-300 ${isFormOpen ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>

                {/* LEFT PANEL: Data Matrix Pipelines */}
                <section className={`bg-white rounded-xl border border-sky-100 shadow-sm p-5 flex flex-col justify-between ${isFormOpen ? 'lg:col-span-4' : 'lg:col-span-12'}`}>
                    <div>
                        <h2 className="text-base font-semibold text-sky-900 mb-4 border-b border-sky-50 pb-2">Item Definition Pipelines</h2>

                        {itemsLoading ? (
                            <div className="py-12 text-center text-sm text-sky-400 italic">Syncing active asset pipelines...</div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="w-full table-fixed border-collapse text-left text-sm">
                                    <thead>
                                        <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-bold tracking-wider text-sky-800 uppercase">
                                            <th className="py-3 px-4 font-semibold">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                        fingerprint
                                                    </span>
                                                    ID
                                                </span>
                                            </th>
                                            {!isFormOpen && (
                                                <th className="py-3 px-4 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                            settings_input_component
                                                        </span>
                                                        Type
                                                    </span>
                                                </th>
                                            )}
                                            <th className="py-3 px-4 font-semibold">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                        category
                                                    </span>
                                                    Category
                                                </span>
                                            </th>
                                            {!isFormOpen && (
                                                <th className="py-3 px-4 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                            stacked_line_chart
                                                        </span>
                                                        Max Stack
                                                    </span>
                                                </th>
                                            )}
                                            {!isFormOpen && (
                                                <th className="py-3 px-4 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                            shield
                                                        </span>
                                                        Max Durability
                                                    </span>
                                                </th>
                                            )}
                                            {!isFormOpen && (
                                                <th className="py-3 px-4 font-semibold">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                                                            extension
                                                        </span>
                                                        Config Modules
                                                    </span>
                                                </th>
                                            )}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-sky-50">
                                        {itemsData?.items.map((item) => {
                                            const isCurrentlySelected = selectedItem?.id === item.id;

                                            return (
                                                <tr
                                                    key={item.id}
                                                    onClick={() => handleOpenEditMode(item)}
                                                    className={`transition-colors cursor-pointer group hover:bg-sky-50/40 ${isCurrentlySelected ? 'bg-sky-100/50' : ''}`}
                                                >
                                                    {/* Identifier Column: Always Visible */}
                                                    <td className="py-3 px-4 font-mono text-xs font-bold text-sky-900 truncate">{item.id}</td>

                                                    {/* Type Column: Hides when form layout is engaged */}
                                                    {!isFormOpen && <td className="py-3 px-4 text-sky-800">{enumToString(ItemType, item.type)}</td>}

                                                    {/* Category Column: Always Visible */}
                                                    <td className="py-3 px-4 text-sky-800">{enumToString(ItemCategory, item.category)}</td>

                                                    {/* Capacity Column: Hides when form layout is engaged */}
                                                    {!isFormOpen && (
                                                        <td className="py-3 px-4 text-sky-800">
                                                            {(item.maxStack === null || item.maxStack === undefined)
                                                                ? <span className="text-rose-500 text-xs font-medium">❌ Unstackable</span>
                                                                : <span className="text-sky-900 text-xs font-medium">📦 {item.maxStack}</span>
                                                            }
                                                        </td>
                                                    )}

                                                    {/* Durability Column: Hides when form layout is engaged */}
                                                    {!isFormOpen && (
                                                        <td className="py-3 px-4 text-sky-800">
                                                            {(item.maxDurability === null || item.maxDurability === undefined)
                                                                ? <span className="text-rose-500 text-xs font-medium">❌ Unbreakable</span>
                                                                : <span className="text-sky-900 text-xs font-medium">📦 {item.maxDurability}</span>
                                                            }
                                                        </td>
                                                    )}

                                                    {/* Full Config Modules: Hides when form layout is engaged */}
                                                    {!isFormOpen && (
                                                        <td className="py-3 px-4">
                                                            <div className="flex gap-1 flex-wrap">
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.costConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Cost</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.consumableConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Consumable</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.equippableConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Equip</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.placeableConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Placeable</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.rangedConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Ranged</span>
                                                                <span className={`px-1.5 py-0.5 rounded text-[10px] font-semibold border ${item.meleeConfig ? 'bg-sky-100 text-sky-800 border-sky-300' : 'bg-gray-50 text-gray-400 border-gray-200'}`}>Melee</span>
                                                            </div>
                                                        </td>
                                                    )}
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                                {(!itemsData?.items || itemsData.items.length === 0) && (
                                    <div className="py-12 text-center text-sm text-sky-400 italic">No system definitions exist matching parameters.</div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* --- Matrix Navigation Footer --- */}
                    <div className="flex justify-between items-center pt-4 mt-4 border-t border-sky-50">
                        <button
                            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            disabled={(queryParams.pageNumber || 1) <= 1}
                            onClick={() => shiftPage(-1)}
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-sky-600">Page {queryParams.pageNumber}</span>
                        <button
                            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            disabled={!itemsData || itemsData.items.length < (queryParams.pageSize || 15)}
                            onClick={() => shiftPage(1)}
                        >
                            Next
                        </button>
                    </div>
                </section>

                {/* RIGHT PANEL: Focused Form Display Canvas */}
                {isFormOpen && (
                    <section className="bg-white rounded-xl border border-sky-100 shadow-sm p-5 lg:col-span-8">
                        <ItemUpsertForm
                            item={selectedItem}
                            onClose={handleCloseFormWorkspace}
                        />
                    </section>
                )}
            </main>

            {/* Upload File Pop-up Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-6 shadow-xl transition-all">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                            <h3 className="text-lg font-bold text-sky-950">
                                Import Item Definitions
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={importItemMutation.isPending}
                                className="rounded-lg p-1 text-sky-400 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50 cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
                            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-6 transition hover:bg-sky-50">
                                <span className="material-symbols-outlined text-[36px] text-sky-500 mb-2">
                                    cloud_upload
                                </span>
                                <p className="text-xs text-sky-600 font-medium text-center mb-3">
                                    Upload file containing item blueprint schemas
                                </p>

                                <input
                                    type="file"
                                    id="item-file-input"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="item-file-input"
                                    className="cursor-pointer rounded-lg bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm border border-sky-200 hover:bg-sky-50 transition"
                                >
                                    Choose File
                                </label>

                                {selectedFile && (
                                    <span className="mt-3 text-xs font-semibold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-md max-w-full truncate">
                                        {selectedFile.name}
                                    </span>
                                )}
                            </div>

                            {importItemMutation.isError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                    Failed to upload file. Please verify schema format and try again.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={importItemMutation.isPending}
                                    className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedFile || importItemMutation.isPending}
                                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300 cursor-pointer"
                                >
                                    {importItemMutation.isPending && (
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {importItemMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};