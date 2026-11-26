import React, { useState } from 'react';
import { useQuests } from '../../../api/hooks/useQuest';
import { QuestType } from '../../../contracts/dto/runtime/meta-domain/quest-type';
import type { QuestInstanceDTO } from '../../../contracts/dto/runtime/meta-domain/quest-instance-dto';
import type { QuestInstanceQueryDTO } from '../../../contracts/dto/feature/design/command/quest-instance-query-dto';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';
import { enumToString } from '../../../utils/enum-helper';
import { QuestCreateForm } from './QuestCreateForm';

const getDescription = (quest: QuestInstanceDTO) => {
  const config = quest.identificationConfig ?? quest.categorizingConfig ?? quest.shootingConfig;
  return config?.description?.entries?.[0]?.value || '—';
};

const formatDate = (value: Date | string) => new Date(value).toLocaleString();

export const QuestManagement: React.FC = () => {
  const [queryParams, setQueryParams] = useState<QuestInstanceQueryDTO>({
    searchTerm: '',
    type: undefined,
    pageNumber: 1,
    pageSize: 10,
  });
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data, isLoading, isError, refetch, dataUpdatedAt } = useQuests(queryParams);

  const updateFilterField = (field: keyof QuestInstanceQueryDTO, value: unknown) => {
    setQueryParams((prev) => ({ ...prev, [field]: value, pageNumber: 1 }));
  };

  const shiftPage = (direction: number) => {
    setQueryParams((prev) => ({ ...prev, pageNumber: Math.max(1, prev.pageNumber + direction) }));
  };

  const totalPages = data ? Math.max(1, Math.ceil(data.totalCount / queryParams.pageSize)) : 1;

  return (
    <div className="min-h-screen bg-sky-50/50 p-8 font-sans antialiased text-sky-950">
      <header className="mb-8 flex items-end justify-between border-b border-sky-100 pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-sky-950">Quest Board</h1>
          <p className="mt-1.5 text-sm text-sky-600/80">
            Post quests for players and review the ones currently on the board.
          </p>
        </div>

        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-500 cursor-pointer"
        >
          <span className="text-lg leading-none">+</span> Post Quest
        </button>
      </header>

      {/* Filters */}
      <div className="mb-6 flex flex-wrap items-center gap-4 rounded-xl border border-sky-100 bg-white p-4 shadow-sm">
        <div className="relative flex-1 min-w-[280px]">
          <input
            type="text"
            placeholder="Search by quest ID..."
            value={queryParams.searchTerm || ''}
            onChange={(e) => updateFilterField('searchTerm', e.target.value)}
            className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100"
          />
        </div>

        <div className="min-w-[240px]">
          <CustomSelect
            value={queryParams.type ?? ''}
            onChange={(val) => updateFilterField('type', val ? (val as QuestType) : undefined)}
            options={Object.values(QuestType)}
            placeholder="All Quest Types"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
        {isLoading ? (
          <div className="py-20 text-center text-sm font-medium text-sky-500">Loading quests...</div>
        ) : isError ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <span className="text-sm font-medium text-amber-700 bg-amber-50 px-3 py-1.5 rounded-md border border-amber-200">
              Failed to load quests.
            </span>
            <button
              onClick={() => refetch()}
              className="rounded-lg bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700 transition hover:bg-sky-200 cursor-pointer"
            >
              Retry
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full table-fixed border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b border-sky-100 bg-sky-50/70 text-xs font-bold tracking-wider text-sky-800 uppercase">
                    <th className="px-6 py-3.5 font-semibold w-1/5">Quest ID</th>
                    <th className="px-6 py-3.5 font-semibold w-32">Type</th>
                    <th className="px-6 py-3.5 font-semibold">Description</th>
                    <th className="px-6 py-3.5 font-semibold w-32">Reward</th>
                    <th className="px-6 py-3.5 font-semibold w-48">Expires</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sky-50 bg-white">
                  {data?.items?.length ? (
                    data.items.map((quest) => {
                      const isExpired = new Date(quest.expiredAt).getTime() <= dataUpdatedAt;
                      return (
                        <tr key={quest.id} className="hover:bg-sky-50/40 transition">
                          <td className="px-6 py-4 font-mono text-xs font-semibold text-sky-900 truncate" title={quest.id}>
                            {quest.id}
                          </td>
                          <td className="px-6 py-4">
                            <span className="inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-700">
                              {enumToString(QuestType, quest.type)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-xs text-sky-700 truncate" title={getDescription(quest)}>
                            {getDescription(quest)}
                          </td>
                          <td className="px-6 py-4 text-xs text-sky-700">
                            {quest.questRewardConfig?.currencyAmount ?? 0} coins
                            {quest.questRewardConfig?.entries?.length ? ` + ${quest.questRewardConfig.entries.length} gacha` : ''}
                          </td>
                          <td className="px-6 py-4 text-xs">
                            <div className={isExpired ? 'text-red-600 font-semibold' : 'text-sky-700'}>
                              {formatDate(quest.expiredAt)}
                            </div>
                            {isExpired && <div className="text-[11px] text-red-500">Expired</div>}
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-16 text-center text-sm font-medium text-sky-400">
                        No quests match the current filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t border-sky-100 bg-sky-50/30 px-6 py-4">
              <button
                onClick={() => shiftPage(-1)}
                disabled={queryParams.pageNumber <= 1}
                className="rounded-lg border border-sky-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-sky-700 shadow-sm transition hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40 cursor-pointer"
              >
                Previous
              </button>

              <span className="text-xs font-medium text-sky-600">
                Page <strong className="font-bold text-sky-900">{queryParams.pageNumber}</strong> of {totalPages}
                {data ? ` · ${data.totalCount} quests` : ''}
              </span>

              <button
                onClick={() => shiftPage(1)}
                disabled={queryParams.pageNumber >= totalPages}
                className="rounded-lg bg-sky-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:cursor-not-allowed disabled:bg-sky-200 cursor-pointer"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      {isCreateOpen && <QuestCreateForm onClose={() => setIsCreateOpen(false)} />}
    </div>
  );
};