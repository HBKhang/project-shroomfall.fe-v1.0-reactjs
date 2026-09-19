import React, { useState } from 'react';
import { useDesignAllEffects, useImportEffectDefinitions } from '../../../api/hooks/useDesign';
import { EffectRowForm } from './EffectRowForm';
import { EffectType } from '../../../contracts/enum/meta-domain/effect/effect-type';
import { AttributeType } from '../../../contracts/enum/meta-domain/effect/attribute-type';
import type { EffectDefinitionQueryDTO } from '../../../contracts/dto/feature/design/command/effect-definition-query-dto';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';

export const EffectManagement: React.FC = () => {
  const [queryParams, setQueryParams] = useState<Partial<EffectDefinitionQueryDTO>>({
    searchTerm: '',
    type: undefined,
    attributeType: undefined,
    pageNumber: 1,
    pageSize: 9,
  });

  const { data, isLoading, isError, refetch } = useDesignAllEffects(
    queryParams as EffectDefinitionQueryDTO
  );

  const [isCreatingInline, setIsCreatingInline] = useState(false);

  // --- Upload Modal State & Mutation ---
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const importEffectMutation = useImportEffectDefinitions();

  const updateFilterField = (
    field: keyof EffectDefinitionQueryDTO,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    importEffectMutation.mutate(selectedFile, {
      onSuccess: () => {
        setIsUploadModalOpen(false);
        setSelectedFile(null);
        refetch();
      },
    });
  };

  const closeModal = () => {
    if (importEffectMutation.isPending) return;
    setIsUploadModalOpen(false);
    setSelectedFile(null);
    importEffectMutation.reset();
  };

  return (
    <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased">
      {/* Header Section */}
      <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950">
            Effect Blueprint Matrix
          </h1>
          <p className="mt-1.5 text-sm text-sky-600/80">
            Configure system rules and live parameter scaling metrics for the runtime core.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Upload Button */}
          <button
            type="button"
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px] text-sky-600">
              upload_file
            </span>
            Import Data
          </button>

          {/* New Definition Button (Styled matching the upload button) */}
          {!isCreatingInline && (
            <button
              type="button"
              onClick={() => setIsCreatingInline(true)}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-sky-200 bg-white px-4 text-sm font-semibold text-sky-800 shadow-sm transition hover:bg-sky-50 hover:text-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600 cursor-pointer"
            >
              <span className="material-symbols-outlined text-[18px] text-sky-600">
                add
              </span>
              New Definition
            </button>
          )}
        </div>
      </header>

      {/* Control Filters Panel */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search matching blueprints..."
            value={queryParams.searchTerm || ''}
            onChange={(e) => updateFilterField('searchTerm', e.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <CustomSelect
          value={queryParams.type || ''}
          onChange={(val) => updateFilterField('type', val)}
          options={Object.values(EffectType)}
          placeholder="All Math Types"
        />

        <CustomSelect
          value={queryParams.attributeType || ''}
          onChange={(val) => updateFilterField('attributeType', val)}
          options={Object.values(AttributeType)}
          placeholder="All Attributes"
        />
      </div>

      {/* Main Specification Matrix Table */}
      <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-sm font-medium text-sky-500">
            <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-sky-500 mb-2" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Polling engineering matrices...
          </div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
              Network sync interrupt: Failed to pull blueprint schema definitions.
            </span>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200"
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
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          fingerprint
                        </span>
                        ID / Key Descriptor
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          settings_input_component
                        </span>
                        Type Mapping
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          my_location
                        </span>
                        Target Nodes
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          database
                        </span>
                        Base Float Value
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          schedule
                        </span>
                        Duration Window
                      </span>
                    </th>
                    <th className="px-6 py-3.5 font-semibold">
                      <span className="inline-flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-[16px] text-sky-400">
                          hourglass_empty
                        </span>
                        Clock Step Pulse
                      </span>
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-sky-50 bg-white">
                  {isCreatingInline && (
                    <EffectRowForm
                      isInitialCreateRow
                      onSuccessCallback={() => {
                        refetch();
                        setIsCreatingInline(false);
                      }}
                      onCancelCallback={() => setIsCreatingInline(false)}
                    />
                  )}

                  {data?.items?.length ? (
                    data.items.map((effect) => (
                      <EffectRowForm
                        key={effect.id}
                        effect={effect}
                        onSuccessCallback={() => refetch()}
                      />
                    ))
                  ) : (
                    !isCreatingInline && (
                      <tr>
                        <td
                          colSpan={7}
                          className="py-16 text-center text-sm font-medium text-sky-400"
                        >
                          No active system nodes match the current criteria parameters.
                        </td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination System */}
            <div className="flex items-center justify-between border-t border-sky-100 bg-sky-50/30 px-6 py-4">
              <button
                onClick={() => shiftPage(-1)}
                disabled={(queryParams.pageNumber || 1) <= 1}
                className="rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-sky-600">
                Matrix Frame Index: <strong className="font-bold text-sky-900">{queryParams.pageNumber}</strong>
              </span>

              <button
                onClick={() => shiftPage(1)}
                disabled={
                  !data || data.items.length < (queryParams.pageSize || 9)
                }
                className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-200"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {/* Upload File Pop-up Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-sm p-4">
          <div className="w-full max-w-md rounded-2xl border border-sky-100 bg-white p-6 shadow-xl transition-all">
            <div className="flex items-center justify-between border-b border-sky-100 pb-3">
              <h3 className="text-lg font-bold text-sky-950">
                Import Effect Definitions
              </h3>
              <button
                type="button"
                onClick={closeModal}
                disabled={importEffectMutation.isPending}
                className="rounded-lg p-1 text-sky-400 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50"
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
                  Upload file containing blueprint data schemas
                </p>

                <input
                  type="file"
                  id="effect-file-input"
                  onChange={handleFileChange}
                  className="hidden"
                />

                <label
                  htmlFor="effect-file-input"
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

              {importEffectMutation.isError && (
                <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-700">
                  Failed to upload file. Please verify schema format and try again.
                </div>
              )}

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={importEffectMutation.isPending}
                  className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!selectedFile || importEffectMutation.isPending}
                  className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-300"
                >
                  {importEffectMutation.isPending && (
                    <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                  )}
                  {importEffectMutation.isPending ? 'Uploading...' : 'Confirm Upload'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};