import React, { useState } from 'react';
import { useDesignLocalizationEntries, useDesignAllLocales, useUpdateLocalizationEntry } from '../../api/hooks/useDesign';
import type { LocalizationEntryQueryDTO } from '../../contracts/dto/feature/design/command/localization-entry-query-dto';
import type { LocalizationEntryDTO } from '../../contracts/dto/definition/localization-domain/localization-entry-dto';
import { CustomSelect } from '../common/CustomSelect/CustomSelect';

export const LocalizationManagement: React.FC = () => {
    const [queryParams, setQueryParams] = useState<Partial<LocalizationEntryQueryDTO>>({
        searchTerm: '',
        localeCode: undefined,
        pageNumber: 1,
        pageSize: 10,
    });

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [activeEntry, setActiveEntry] = useState<LocalizationEntryDTO | null>(null);

    const { data, isLoading, isError, refetch } = useDesignLocalizationEntries(
        queryParams as LocalizationEntryQueryDTO
    );

    const { data: locales = [] } = useDesignAllLocales();
    const { mutate: updateEntry, isPending: isUpdating } = useUpdateLocalizationEntry();

    const updateFilterField = (field: keyof LocalizationEntryQueryDTO, value: any) => {
        setQueryParams((prev) => ({
            ...prev,
            [field]: value !== undefined && value !== '' ? value : undefined,
            pageNumber: 1,
        }));
    };

    const shiftPage = (direction: number) => {
        setQueryParams((prev) => ({
            ...prev,
            pageNumber: Math.max(1, (prev.pageNumber || 1) + direction),
        }));
    };

    const handleEditClick = (entry: LocalizationEntryDTO) => {
        setActiveEntry({ ...entry });
        setIsEditModalOpen(true);
    };

    const handleSaveEntry = (e: React.FormEvent) => {
        e.preventDefault();
        if (!activeEntry) return;

        updateEntry(activeEntry, {
            onSuccess: () => {
                setIsEditModalOpen(false);
                setActiveEntry(null);
                refetch();
            },
            onError: (err: any) => {
                console.error("Failed to commit localization entry update:", err);
            },
        });
    };

    const localeOptions = locales.map((locale) => locale.code || String(locale));

    return (
        <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
            {/* Header Section */}
            <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-sky-950">
                        Localization Translation Matrix
                    </h1>
                    <p className="mt-1.5 text-sm text-sky-600/80">
                        Manage global localization keys, linguistic dictionary entries, and multi-language region support.
                    </p>
                </div>
            </header>

            {/* Control Filters Panel */}
            <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[280px]">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-sky-400">
                        <span className="material-symbols-outlined text-[18px]">search</span>
                    </span>
                    <input
                        type="text"
                        placeholder="Search localization keys or translation values..."
                        value={queryParams.searchTerm || ''}
                        onChange={(e) => updateFilterField('searchTerm', e.target.value)}
                        className="w-full rounded-lg border border-sky-200 bg-sky-50/20 pl-10 pr-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                    />
                </div>

                <div className="min-w-[240px]">
                    <CustomSelect
                        value={queryParams.localeCode || ''}
                        onChange={(val) => updateFilterField('localeCode', val !== '' ? val : undefined)}
                        options={localeOptions}
                        placeholder="Default Locale"
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
                        Loading translation matrix dictionaries...
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center gap-3 py-16 text-center">
                        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-amber-700 bg-amber-50 px-3.5 py-2 rounded-md border border-amber-200">
                            <span className="material-symbols-outlined text-[16px]">error</span>
                            Network sync interrupt: Failed to pull localization tables.
                        </span>
                        <button
                            onClick={() => refetch()}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 cursor-pointer"
                        >
                            <span className="material-symbols-outlined text-[16px]">refresh</span> Force Sync Re-check
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="min-w-full table-fixed border-collapse text-left text-sm">
                                <thead>
                                    <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-bold tracking-wider text-sky-800 uppercase">
                                        <th className="px-6 py-3.5 font-semibold w-1/3">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-sky-400">key</span>
                                                Localization Key
                                            </span>
                                        </th>
                                        <th className="px-6 py-3.5 font-semibold w-1/6">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-sky-400">language</span>
                                                Locale
                                            </span>
                                        </th>
                                        <th className="px-6 py-3.5 font-semibold w-2/5">
                                            <span className="inline-flex items-center gap-1.5">
                                                <span className="material-symbols-outlined text-[16px] text-sky-400">text_snippet</span>
                                                Translation Value
                                            </span>
                                        </th>
                                        <th className="px-6 py-3.5 font-semibold w-24 text-right">
                                            <span className="inline-flex items-center justify-end gap-1.5 w-full">
                                                <span className="material-symbols-outlined text-[16px] text-sky-400">tune</span>
                                                Actions
                                            </span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-sky-50 bg-white">
                                    {data?.items?.length ? (
                                        data.items.map((entry, index) => (
                                            <tr key={index} className="hover:bg-sky-50/40 transition">
                                                <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-900 max-w-0 truncate" title={entry.key || entry.localeCode || ''}>
                                                    {entry.key || entry.localeCode || '—'}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center gap-1 rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                                                        <span className="material-symbols-outlined text-[12px]">public</span>
                                                        {entry.localeCode || 'default'}
                                                    </span>
                                                </td>
                                                {/* Updated Translation Value cell with max-w-0 and truncate */}
                                                <td className="px-6 py-4 text-xs text-sky-700 max-w-0 truncate" title={entry.value || ''}>
                                                    {entry.value || '—'}
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => handleEditClick(entry)}
                                                        className="inline-flex items-center gap-1 rounded-md bg-sky-50 px-3 py-1.5 text-xs font-semibold text-sky-600 transition hover:bg-sky-100 hover:text-sky-900 cursor-pointer"
                                                    >
                                                        <span className="material-symbols-outlined text-[14px]">edit</span> Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={4} className="py-16 text-center text-sm font-medium text-sky-400">
                                                No localization entries match the active criteria filters.
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
                                className="inline-flex items-center gap-1 rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
                            >
                                Previous
                            </button>

                            <span className="text-xs font-medium text-sky-600">
                                Matrix Frame Index: <strong className="font-bold text-sky-900">{queryParams.pageNumber}</strong>
                            </span>

                            <button
                                onClick={() => shiftPage(1)}
                                disabled={!data || data.items.length < (queryParams.pageSize || 10)}
                                className="inline-flex items-center gap-1 rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-200 cursor-pointer"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </div>

            {/* Edit Modal Overlay */}
            {isEditModalOpen && activeEntry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-xs p-4">
                    <div className="w-full max-w-lg rounded-xl border border-sky-100 bg-white p-6 shadow-xl flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-sky-600">translate</span>
                                <h3 className="text-base font-semibold text-sky-950">Edit Localization Entry</h3>
                            </div>
                            <button
                                onClick={() => setIsEditModalOpen(false)}
                                className="text-sky-400 hover:text-sky-700 cursor-pointer p-1"
                            >
                                <span className="material-symbols-outlined text-[18px]">close</span>
                            </button>
                        </div>

                        <form onSubmit={handleSaveEntry} className="flex flex-col gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-sky-800">Localization Key</label>
                                <input
                                    type="text"
                                    disabled
                                    value={activeEntry.key || ''}
                                    className="w-full rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-2 text-xs font-mono text-sky-600 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-sky-800">Locale Code</label>
                                <input
                                    type="text"
                                    disabled
                                    value={activeEntry.localeCode || ''}
                                    className="w-full rounded-lg border border-sky-200 bg-sky-50/50 px-3 py-2 text-xs font-mono text-sky-600 outline-none cursor-not-allowed"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <label className="text-xs font-semibold text-sky-800">Translation Value</label>
                                <textarea
                                    rows={4}
                                    value={activeEntry.value || ''}
                                    onChange={(e) => setActiveEntry({ ...activeEntry, value: e.target.value })}
                                    className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-3 py-2 text-sm text-sky-900 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
                                    placeholder="Enter translation text..."
                                />
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-sky-100">
                                <button
                                    type="button"
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isUpdating}
                                    className="inline-flex items-center gap-1.5 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50 cursor-pointer"
                                >
                                    <span className="material-symbols-outlined text-[14px]">save</span>
                                    {isUpdating ? 'Committing...' : 'Save Translation'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};