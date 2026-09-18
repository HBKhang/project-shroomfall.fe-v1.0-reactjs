import React, { useState } from 'react';
import { useDesignAllRooms } from '../../api/hooks/useDesign';
import { useImportRoomDefinition } from '../../api/hooks/useDesign';
import { RoomType } from '../../contracts/enum/world-domain/room-type';
import type { RoomDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/room-definition-query-dto';
import { CustomSelect } from '../common/CustomSelect/CustomSelect';
import { enumToString, enumToIndex } from '../../utils/enum-helper';

export const RoomManagement: React.FC = () => {
    const [queryParams, setQueryParams] = useState<Partial<RoomDefinitionQueryDTO>>({
        searchTerm: '',
        type: undefined,
        pageNumber: 1,
        pageSize: 10,
    });

    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const { data, isLoading, isError, refetch } = useDesignAllRooms(
        queryParams as RoomDefinitionQueryDTO
    );

    const { mutate: uploadRoom, isPending: isUploading } = useImportRoomDefinition();

    const updateFilterField = (field: keyof RoomDefinitionQueryDTO, value: any) => {
        setQueryParams((prev) => ({
            ...prev,
            [field]: value !== undefined ? value : undefined,
            pageNumber: 1,
        }));
    };

    const shiftPage = (direction: number) => {
        setQueryParams((prev) => ({
            ...prev,
            pageNumber: Math.max(1, (prev.pageNumber || 1) + direction),
        }));
    };

    const handleUploadSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedFile) return;

        uploadRoom(selectedFile, {
            onSuccess: () => {
                setSelectedFile(null);
                setIsUploadModalOpen(false);
                refetch();
            },
            onError: (err: any) => {
                console.error("Failed to upload room definition:", err);
            },
        });
    };

    // Filter out TypeScript numeric enum reverse mappings to isolate pure string options
    const roomTypeOptions = Object.keys(RoomType).filter((key) => isNaN(Number(key)));

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            {/* Header Section */}
            <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sky-950">
                        Room Blueprint Matrix
                    </h1>
                    <p className="mt-1.5 text-sm text-sky-600/80">
                        Inspect active world rooms, geographic layout constraints, and spatial configurations.
                    </p>
                </div>

                <button
                    onClick={() => setIsUploadModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 cursor-pointer"
                >
                    <span className="text-lg leading-none">+</span> Upload Room Definition
                </button>
            </header>

            {/* Control Filters Panel */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[280px]">
                    <input
                        type="text"
                        placeholder="Search matching room IDs..."
                        value={queryParams.searchTerm || ''}
                        onChange={(e) => updateFilterField('searchTerm', e.target.value)}
                        className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <div className="min-w-[240px]">
                    <CustomSelect
                        value={queryParams.type !== undefined ? enumToString(RoomType, queryParams.type) : ''}
                        onChange={(val) => {
                            const targetEnumIndex = val !== '' ? (enumToIndex(RoomType, val) as unknown as RoomType) : undefined;
                            updateFilterField('type', targetEnumIndex);
                        }}
                        options={roomTypeOptions}
                        placeholder="All Room Types"
                    />
                </div>
            </div>

            {/* Main Specification Matrix Table */}
            <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
                {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 text-sm font-medium text-sky-500">
                        <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Polling room layouts...
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
                            Network sync interrupt: Failed to pull room definition schemas.
                        </span>
                        <button
                            onClick={() => refetch()}
                            className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 cursor-pointer"
                        >
                            Force Sync Re-check
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-bold tracking-wider text-sky-800 uppercase">
                                        <th className="px-6 py-3.5 font-semibold w-1/3">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                                </svg>
                                                Room ID / Guid
                                            </div>
                                        </th>
                                        <th className="px-6 py-3.5 font-semibold w-1/4">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                                </svg>
                                                Room Type
                                            </div>
                                        </th>
                                        <th className="px-6 py-3.5 font-semibold w-1/6">
                                            <div className="flex items-center gap-2">
                                                <svg className="w-4 h-4 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                </svg>
                                                Primary Localized Text
                                            </div>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-50 bg-white">
                                    {data?.items?.length ? (
                                        data.items.map((room) => (
                                            <tr key={room.id} className="hover:bg-sky-50/40 transition">
                                                <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-900 truncate">
                                                    {room.id}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                                        {enumToString(RoomType, room.type) || 'Unknown'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-sky-700 truncate">
                                                    {room.presentation?.localizedText?.nameKey || '—'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={3} className="py-16 text-center text-sm font-medium text-sky-400">
                                                No active room definitions match the current criteria parameters.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination System */}
                        <div className="flex items-center justify-between border-t border-sky-100 bg-sky-50/30 px-6 py-4">
                            <button
                                onClick={() => shiftPage(-1)}
                                disabled={(queryParams.pageNumber || 1) <= 1}
                                className="rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                Previous
                            </button>

                            <span className="text-xs font-medium text-sky-600">
                                Matrix Frame Index: <strong className="font-bold text-sky-900">{queryParams.pageNumber}</strong>
                            </span>

                            <button
                                onClick={() => shiftPage(1)}
                                disabled={!data || data.items.length < (queryParams.pageSize || 10)}
                                className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-200 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Upload Modal Overlay */}
            {isUploadModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-xl border border-sky-100 bg-white p-6 shadow-xl flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                            <h3 className="text-base font-semibold text-sky-950">Upload Room Definition Package</h3>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="text-sky-400 hover:text-sky-700 font-bold text-lg cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        <p className="text-xs text-sky-600/80">
                            Select a valid package file (JSON, ZIP, or YAML format) to import or update room definitions.
                        </p>

                        <form onSubmit={handleUploadSubmit} className="flex flex-col gap-4">
                            <input
                                type="file"
                                onChange={(e) => e.target.files && setSelectedFile(e.target.files[0])}
                                className="block w-full text-sm text-sky-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-sky-50 file:text-sky-700 hover:file:bg-sky-100 cursor-pointer"
                            />

                            <div className="flex justify-end gap-2 pt-3 border-t border-sky-100">
                                <button
                                    type="button"
                                    onClick={() => setIsUploadModalOpen(false)}
                                    className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={!selectedFile || isUploading}
                                    className={`rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition ${
                                        selectedFile && !isUploading ? 'hover:bg-sky-500 cursor-pointer' : 'opacity-50 cursor-not-allowed'
                                    }`}
                                >
                                    {isUploading ? 'Uploading Matrix...' : 'Commit Upload Package'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};