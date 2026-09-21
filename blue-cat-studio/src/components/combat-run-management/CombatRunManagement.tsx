import React, { useState } from 'react';
import { useImportCombatRunDefinitions, useDesignAllCombatRuns } from '../../api/hooks/useDesign';
import type { CombatRunDefinitionDTO } from '../../contracts/dto/definition/world-domain/combat-run-definition-dto';
import type { CombatRunDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/combat-run-definition-query-dto';
import { CombatRunFormModal } from './CombatRunFormModal';

export const CombatRunManagement: React.FC = () => {
  const [queryParams, setQueryParams] = useState<Partial<CombatRunDefinitionQueryDTO>>({
    searchTerm: '',
    pageNumber: 1,
    pageSize: 9,
  });

  const { data, isLoading, isError, refetch } = useDesignAllCombatRuns(
    queryParams as CombatRunDefinitionQueryDTO
  );

  // --- Modal & Upsert States ---
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedRun, setSelectedRun] = useState<CombatRunDefinitionDTO | null>(null);

  // --- Upload Modal State & Mutation ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const importCombatRunMutation = useImportCombatRunDefinitions();

  const updateFilterField = (
    field: keyof CombatRunDefinitionQueryDTO,
    value: any
  ) => {
    setQueryParams((prev) => ({
      ...prev,
      [field]: value || undefined,
      pageNumber: 1,
    }));
  };

  const shiftPage = (direction: number) => {
    setQueryParams((prev) => ({
      ...prev,
      pageNumber: Math.max(1, (prev.pageNumber || 1) + direction),
    }));
  };

  const handleRowClick = (run: CombatRunDefinitionDTO) => {
    setSelectedRun(run);
    setIsFormModalOpen(true);
  };

  const handleOpenCreateModal = () => {
    setSelectedRun(null);
    setIsFormModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    importCombatRunMutation.mutate(selectedFile, {
      onSuccess: () => {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        refetch();
      },
    });
  };

  const closeUploadModal = () => {
    if (importCombatRunMutation.isPending) return;
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    importCombatRunMutation.reset();
  };

  return (
    <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased">
      {/* Header Section */}
      <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950">
            Combat Run Matrix
          </h1>
          <p className="mt-1.5 text-sm text-sky-600/80">
            Configure level sequences and room allocations for active run instances.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <span className="material-symbols-outlined text-[18px] text-sky-600">
              upload_file
            </span>
            Import Data
          </button>

          {/* New Definition Button */}
          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
          >
            <span className="material-symbols-outlined text-[18px] text-sky-600">
              add
            </span>
            New Definition
          </button>
        </div>
      </header>

      {/* Control Filters Panel */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="relative min-w-[280px] flex-1">
          <input
            type="text"
            placeholder="Search combat run blueprints..."
            value={queryParams.searchTerm || ''}
            onChange={(e) => updateFilterField('searchTerm', e.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-sm font-medium text-sky-500">
            <svg
              className="-ml-1 mb-2 mr-3 h-6 w-6 animate-spin text-sky-500"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Polling combat run matrices...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
              Network sync interrupt: Failed to pull combat run definitions.
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
                  <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-bold uppercase tracking-wider text-sky-800">
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          fingerprint
                        </span>
                        Combat Run ID
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          layers
                        </span>
                        Total Floors
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          map
                        </span>
                        Floor Level Sequence
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold text-right">Action</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-sky-50 bg-white">
                  {data?.items?.length ? (
                    data.items.map((run) => (
                      <tr
                        key={run.id}
                        onClick={() => handleRowClick(run)}
                        className="group cursor-pointer transition hover:bg-sky-50/60"
                      >
                        <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-900">
                          {run.id}
                        </td>
                        <td className="px-6 py-4 text-xs font-medium text-sky-700">
                          <span className="rounded-md bg-sky-100 px-2 py-0.5 text-xs font-bold text-sky-800">
                            {run.floors?.length || 0} Floors
                          </span>
                        </td>
                        <td className="px-6 py-4 text-xs text-sky-600">
                          {run.floors?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {run.floors.map((f, idx) => (
                                <span
                                  key={idx}
                                  className="rounded border border-sky-200 bg-white px-1.5 py-0.5 text-[11px] font-medium text-sky-700"
                                >
                                  Lvl {f.level}: {f.roomDefinitionID}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <span className="italic text-sky-400">No floors defined</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="material-symbols-outlined text-[20px] text-sky-400 transition group-hover:text-sky-600">
                            edit
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-16 text-center text-sm font-medium text-sky-400"
                      >
                        No active combat run definitions match the current criteria parameters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
                disabled={!data || data.items.length < (queryParams.pageSize || 9)}
                className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-200 cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Upsert/Edit Floor Modal */}
      <CombatRunFormModal
        isOpen={isFormModalOpen}
        initialData={selectedRun}
        onClose={() => setIsFormModalOpen(false)}
        onSuccess={() => refetch()}
      />

      {/* Upload File Pop-up Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="text-lg font-bold text-sky-950">
                Import Combat Run Definitions
              </h3>
              <button
                type="button"
                onClick={closeUploadModal}
                disabled={importCombatRunMutation.isPending}
                className="rounded-lg p-1 text-sky-400 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="mt-4 space-y-4">
              <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-sky-200 bg-sky-50/50 p-6 transition hover:bg-sky-50">
                <span className="material-symbols-outlined mb-2 text-[36px] text-sky-500">
                  cloud_upload
                </span>
                <p className="mb-3 text-center text-xs font-medium text-sky-600">
                  Upload file containing blueprint data schemas
                </p>

                <input
                  type="file"
                  id="combat-run-file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="combat-run-file-input"
                  className="cursor-pointer rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50"
                >
                  Choose File
                </label>

                {selectedFile && (
                  <span className="mt-3 max-w-full truncate rounded-md bg-sky-100 px-2.5 py-1 text-xs font-semibold text-sky-800">
                    {selectedFile.name}
                  </span>
                )}
              </div>

              {importCombatRunMutation.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  Failed to upload file. Please verify schema format and try again.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeUploadModal}
                  disabled={importCombatRunMutation.isPending}
                  className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 disabled:opacity-50 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || importCombatRunMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300 cursor-pointer"
                >
                  {importCombatRunMutation.isPending && (
                    <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {importCombatRunMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};