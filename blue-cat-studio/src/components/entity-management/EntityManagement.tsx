import React, { useState } from 'react';
import { useDesignAllEntities, useImportEntityDefinitions } from '../../api/hooks/useDesign';
import { EntityUpsertForm } from './EntityUpsertForm';
import { EntityType } from '../../contracts/enum/entity-domain/entity-type';
import type { EntityDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/entity-definition-query-dto'; 
import { CustomSelect } from '../common/CustomSelect/CustomSelect';
import { enumToString, enumToIndex } from '../../utils/enum-helper';

export const EntityManagement: React.FC = () => {
    // 1. Core query state aligned to EntityDefinitionQueryDTO contract
    const [queryParams, setQueryParams] = useState<EntityDefinitionQueryDTO>({
        searchTerm: '',
        pageNumber: 1,
        pageSize: 12,
        entityType: undefined, // Initialized as undefined so the select placeholder displays correctly
    });
    
    const [activeFormId, setActiveFormId] = useState<string | null>(null);

    // --- Upload Modal State & Mutation ---
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const importEntityMutation = useImportEntityDefinitions();

    // Dynamic hook pipeline driven cleanly by queryParams
    const { data: pagedEntities, isLoading, refetch } = useDesignAllEntities(queryParams);

    const handleCloseForm = () => {
        setActiveFormId(null);
        refetch();
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setQueryParams(prev => ({ ...prev, searchTerm: e.target.value, pageNumber: 1 }));
    };

    // 2. Fixed TS2352: Route the number primitive through 'unknown' before casting to EntityType
    const handleTypeChange = (val: string) => {
        const targetEnumIndex = val !== '' 
            ? (enumToIndex(EntityType, val) as unknown as EntityType) 
            : undefined;
            
        setQueryParams(prev => ({ ...prev, entityType: targetEnumIndex, pageNumber: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setQueryParams(prev => ({ ...prev, pageNumber: newPage }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const handleUploadSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        importEntityMutation.mutate(selectedFile, {
            onSuccess: () => {
                setIsUploadModalOpen(false);
                setSelectedFile(null);
                refetch();
            },
        });
    };

    const closeModal = () => {
        if (importEntityMutation.isPending) return;
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        importEntityMutation.reset();
    };

    const totalPages = pagedEntities?.totalCount 
        ? Math.ceil(pagedEntities.totalCount / queryParams.pageSize) 
        : 1;

    if (activeFormId) {
        return (
            <EntityUpsertForm 
                entityId={activeFormId === 'new' ? '' : activeFormId} 
                onClose={handleCloseForm} 
            />
        );
    }

    // Extracting the keys from the enum to act as safe string options for the CustomSelect component
    const entityTypeOptions = Object.keys(EntityType).filter(key => isNaN(Number(key)));

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            {/* Header Section */}
            <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sky-950">
                        Entity Directory Management
                    </h1>
                    <p className="mt-1.5 text-sm text-sky-600/80">
                        Search blueprints, configure game units, and register structural components.
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

                    {/* New Entity Button */}
                    <button
                        type="button"
                        onClick={() => setActiveFormId('new')}
                        className="inline-flex items-center gap-2 rounded-lg border border-sky-200 bg-white px-4 py-2 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
                    >
                        <span className="text-lg leading-none text-sky-600">+</span>
                        Assemble New Entity
                    </button>
                </div>
            </header>

            {/* Filter / Search Bar */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[280px]">
                    <input 
                        type="text"
                        placeholder="Search Entities (ID, Tags) e.g. ent_..." 
                        value={queryParams.searchTerm || ''} 
                        onChange={handleSearchChange} 
                        className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>
                
                <div className="min-w-[240px]">
                    <CustomSelect
                        value={queryParams.entityType !== undefined ? enumToString(EntityType, queryParams.entityType) : ''}
                        onChange={handleTypeChange}
                        options={entityTypeOptions}
                        placeholder="Show All Schemas"
                    />
                </div>
            </div>

            {/* Grid View */}
            {isLoading ? (
                <div className="py-12 text-center text-sm text-sky-400 italic">Indexing blueprints...</div>
            ) : (
                <>
                    <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
                        {pagedEntities?.items?.map((entity: any) => {
                            const resolvedId = entity.iD ?? entity.id ?? entity.Id;

                            return (
                                <div 
                                    key={resolvedId ?? Math.random().toString()} 
                                    className="bg-white p-4 rounded-xl border border-sky-100 flex flex-col justify-between gap-3 shadow-sm hover:border-sky-300 transition-all"
                                >
                                    <div>
                                        <span className="text-[11px] bg-sky-50 text-sky-700 px-1.5 py-0.5 rounded font-semibold inline-block border border-sky-100">
                                            <span>{enumToString(EntityType, entity.type, "Unknown Type")}</span>
                                        </span>
                                        <h4 className="mt-2 mb-1 text-base text-sky-950 overflow-hidden text-ellipsis whitespace-nowrap font-semibold">
                                            {resolvedId || "Unnamed Blueprint"}
                                        </h4>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            if (resolvedId) {
                                                setActiveFormId(resolvedId);
                                            } else {
                                                alert("Error: This entity card has no valid unique ID property field!");
                                            }
                                        }}
                                        className="px-3.5 py-2 rounded-lg border border-sky-200 bg-sky-50/30 hover:bg-sky-50 text-xs font-semibold text-sky-700 cursor-pointer text-center transition-colors"
                                    >
                                        Inspect Components
                                    </button>
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center pt-6 mt-8 border-t border-sky-100">
                        <button 
                            disabled={queryParams.pageNumber <= 1}
                            onClick={() => handlePageChange(queryParams.pageNumber - 1)}
                            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Previous
                        </button>
                        <span className="text-xs font-medium text-sky-600">
                            Page {queryParams.pageNumber} of {totalPages}
                        </span>
                        <button 
                            disabled={queryParams.pageNumber >= totalPages}
                            onClick={() => handlePageChange(queryParams.pageNumber + 1)}
                            className="px-3 py-1.5 rounded-lg border border-sky-200 bg-white text-xs font-semibold text-sky-700 hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}

            {/* Upload File Pop-up Modal */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-sm p-4">
                    <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-6 shadow-xl transition-all">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                            <h3 className="text-lg font-bold text-sky-950">
                                Import Entity Definitions
                            </h3>
                            <button
                                type="button"
                                onClick={closeModal}
                                disabled={importEntityMutation.isPending}
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
                                    Upload file containing entity blueprint schemas
                                </p>

                                <input
                                    type="file"
                                    id="entity-file-input"
                                    onChange={handleFileChange}
                                    className="hidden"
                                />

                                <label
                                    htmlFor="entity-file-input"
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

                            {importEntityMutation.isError && (
                                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                                    Failed to upload file. Please verify schema format and try again.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    disabled={importEntityMutation.isPending}
                                    className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition disabled:opacity-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedFile || importEntityMutation.isPending}
                                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300 cursor-pointer"
                                >
                                    {importEntityMutation.isPending && (
                                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                        </svg>
                                    )}
                                    {importEntityMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};