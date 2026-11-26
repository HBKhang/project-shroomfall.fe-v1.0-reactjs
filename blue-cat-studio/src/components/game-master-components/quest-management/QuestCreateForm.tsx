import React, { useState } from 'react';
import { useCreateQuest } from '../../../api/hooks/useQuest';
import { useDesignAllEntities, useDesignAllItems, useDesignAllLocales } from '../../../api/hooks/useDesign';
import { QuestType } from '../../../contracts/dto/runtime/meta-domain/quest-type';
import type { QuestInstanceDTO } from '../../../contracts/dto/runtime/meta-domain/quest-instance-dto';
import type { LocaleQuestDTO } from '../../../contracts/dto/runtime/meta-domain/locale-quest-dto';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';
import { enumToIndex } from '../../../utils/enum-helper';
import { EntityType } from '../../../contracts/enum/entity-domain/entity-type';

const inputClass =
  'w-full h-8 rounded border border-sky-300 bg-sky-50 px-2 text-sm text-sky-900 outline-none focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-400';
const labelClass = 'text-[11px] font-bold uppercase tracking-wider text-sky-700';
const addButtonClass =
  'rounded-lg border border-sky-200 bg-white px-3 py-1 text-xs font-semibold text-sky-700 hover:bg-sky-50 cursor-pointer';
const removeButtonClass = 'text-sky-400 hover:text-red-600 font-bold cursor-pointer px-1';

interface DefinitionOption { id: string; label: string }

const SearchableDefinitionSelect: React.FC<{
  value: string;
  onChange: (value: string) => void;
  options: DefinitionOption[];
  placeholder: string;
}> = ({ value, onChange, options, placeholder }) => {
  const [search, setSearch] = useState('');
  const filtered = options.filter((option) =>
    `${option.label} ${option.id}`.toLowerCase().includes(search.trim().toLowerCase()),
  );

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-1">
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${placeholder.toLowerCase()}...`}
        aria-label={`Search ${placeholder.toLowerCase()}`}
        className={inputClass}
      />
      <select
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label={placeholder}
        className={inputClass}
      >
        <option value="">{placeholder}</option>
        {value && !filtered.some((option) => option.id === value) && (
          <option value={value}>{value} (selected)</option>
        )}
        {filtered.map((option) => (
          <option key={option.id} value={option.id}>{option.label}</option>
        ))}
      </select>
      {options.length === 0 && <span className="text-[11px] text-sky-500">No definitions available.</span>}
    </div>
  );
};

const emptyLocale = (): LocaleQuestDTO => ({ entries: [] });

const createDraft = (): QuestInstanceDTO => ({
  type: QuestType.Identification,
  createdAt: new Date(),
  expiredAt: new Date(),
  questRewardConfig: { currencyAmount: 0, entries: [] },
  identificationConfig: { description: emptyLocale(), targetMushroomDefinitionId: '', requiredDefeatCount: 1 },
  categorizingConfig: { description: emptyLocale(), categories: [], items: [] },
  shootingConfig: { description: emptyLocale(), mushrooms: [], questions: [] },
});

// Default expiry: one day from now, formatted for <input type="datetime-local">
const defaultExpiry = () => {
  const date = new Date(Date.now() + 24 * 60 * 60 * 1000);
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 16);
};

const getText = (locale: LocaleQuestDTO, code: string) =>
  locale.entries.find((entry) => entry.key === code)?.value ?? '';

const setText = (locale: LocaleQuestDTO, code: string, value: string) => {
  const entry = locale.entries.find((e) => e.key === code);
  if (entry) entry.value = value;
  else locale.entries.push({ key: code, value });
};

interface Props {
  onClose: () => void;
}

export const QuestCreateForm: React.FC<Props> = ({ onClose }) => {
  const [draft, setDraft] = useState<QuestInstanceDTO>(createDraft);
  const [expiredAt, setExpiredAt] = useState(defaultExpiry);
  const [openedAt] = useState(() => Date.now());
  const { data: locales } = useDesignAllLocales();
  const { data: mushrooms, isLoading: mushroomsLoading } = useDesignAllEntities({
    entityType: EntityType.Creature,
    pageNumber: 1,
    pageSize: 100,
  });
  const { data: items, isLoading: itemsLoading } = useDesignAllItems({
    pageNumber: 1,
    pageSize: 100,
  });
  const { mutate: createQuest, isPending } = useCreateQuest();

  const mushroomOptions = (mushrooms?.items ?? []).map((entity) => ({ id: entity.id, label: entity.id }));
  const itemOptions = (items?.items ?? []).map((item) => ({ id: item.id, label: item.id }));

  const localeCodes = (locales ?? []).filter((l) => l.isEnabled).map((l) => l.code);

  // Clone-then-mutate keeps the nested list editors short
  const edit = (fn: (d: QuestInstanceDTO) => void) =>
    setDraft((prev) => {
      const next = structuredClone(prev);
      fn(next);
      return next;
    });

  const ident = draft.identificationConfig!;
  const cat = draft.categorizingConfig!;
  const shoot = draft.shootingConfig!;
  const description =
    draft.type === QuestType.Identification ? ident.description
      : draft.type === QuestType.Categorizing ? cat.description
        : shoot.description;

  const descriptionOf = (d: QuestInstanceDTO) =>
    d.type === QuestType.Identification ? d.identificationConfig!.description
      : d.type === QuestType.Categorizing ? d.categorizingConfig!.description
        : d.shootingConfig!.description;

  const expiryDate = new Date(expiredAt);
  const isExpiryValid = !isNaN(expiryDate.getTime()) && expiryDate.getTime() > openedAt;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isExpiryValid) return;

    // Server binds enums as numbers and only reads the config matching the type
    const payload: QuestInstanceDTO = {
      type: enumToIndex(QuestType, draft.type) as unknown as QuestType,
      createdAt: new Date(),
      expiredAt: expiryDate,
      questRewardConfig: draft.questRewardConfig,
      identificationConfig: draft.type === QuestType.Identification ? ident : undefined,
      categorizingConfig: draft.type === QuestType.Categorizing ? cat : undefined,
      shootingConfig: draft.type === QuestType.Shooting ? shoot : undefined,
    };

    createQuest(payload, { onSuccess: onClose });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 backdrop-blur-xs p-4">
      <form
        onSubmit={handleSubmit}
        className="flex max-h-[90vh] w-full max-w-3xl flex-col gap-4 overflow-y-auto rounded-xl border border-sky-100 bg-white p-6 shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-sky-100 pb-3">
          <h3 className="text-base font-semibold text-sky-950">Post New Quest</h3>
          <button type="button" onClick={onClose} className="text-sky-400 hover:text-sky-700 font-bold text-lg cursor-pointer">
            ✕
          </button>
        </div>

        {/* General */}
        <div className="grid grid-cols-2 gap-4">
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Quest Type</span>
            <CustomSelect
              value={draft.type}
              onChange={(val) => val && edit((d) => { d.type = val as QuestType; })}
              options={Object.values(QuestType)}
              placeholder="Select type"
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className={labelClass}>Expires At</span>
            <input type="datetime-local" value={expiredAt} onChange={(e) => setExpiredAt(e.target.value)} className={inputClass} />
            {!isExpiryValid && <span className="text-[11px] text-red-600">Expiry must be in the future.</span>}
          </label>
        </div>

        {/* Description per locale */}
        <section className="flex flex-col gap-2">
          <span className={labelClass}>Description</span>
          {localeCodes.length === 0 && <span className="text-xs text-sky-400">No enabled locales found.</span>}
          {localeCodes.map((code) => (
            <label key={code} className="flex items-start gap-2">
              <span className="w-12 pt-1.5 font-mono text-xs font-semibold text-sky-600">{code}</span>
              <textarea
                rows={2}
                value={getText(description, code)}
                onChange={(e) => edit((d) => setText(descriptionOf(d), code, e.target.value))}
                className={`${inputClass} h-auto py-1`}
              />
            </label>
          ))}
        </section>

        {/* Type-specific config */}
        {draft.type === QuestType.Identification && (
          <section className="grid grid-cols-2 gap-4">
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Target Mushroom Definition ID</span>
              <SearchableDefinitionSelect
                value={ident.targetMushroomDefinitionId}
                onChange={(value) => edit((d) => { d.identificationConfig!.targetMushroomDefinitionId = value; })}
                options={mushroomOptions}
                placeholder={mushroomsLoading ? 'Loading mushrooms...' : 'Select mushroom'}
              />
            </label>
            <label className="flex flex-col gap-1">
              <span className={labelClass}>Required Defeat Count</span>
              <input
                type="number"
                min={1}
                required
                value={ident.requiredDefeatCount}
                onChange={(e) => edit((d) => { d.identificationConfig!.requiredDefeatCount = Number(e.target.value); })}
                className={inputClass}
              />
            </label>
          </section>
        )}

        {draft.type === QuestType.Categorizing && (
          <>
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Categories</span>
                <button
                  type="button"
                  className={addButtonClass}
                  onClick={() => edit((d) => { d.categorizingConfig!.categories.push({ id: crypto.randomUUID(), categoryName: emptyLocale() }); })}
                >
                  + Category
                </button>
              </div>
              {cat.categories.map((category, i) => (
                <div key={category.id} className="flex items-center gap-2 rounded-lg border border-sky-100 p-2">
                  {localeCodes.map((code) => (
                    <input
                      key={code}
                      placeholder={`Name (${code})`}
                      value={getText(category.categoryName, code)}
                      onChange={(e) => edit((d) => setText(d.categorizingConfig!.categories[i].categoryName, code, e.target.value))}
                      className={inputClass}
                    />
                  ))}
                  <button
                    type="button"
                    className={removeButtonClass}
                    onClick={() => edit((d) => {
                      const c = d.categorizingConfig!;
                      c.categories.splice(i, 1);
                      // Items pointing at a removed category would be unanswerable
                      c.items.forEach((item) => { if (item.correctCategoryId === category.id) item.correctCategoryId = ''; });
                    })}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </section>

            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Items</span>
                <button
                  type="button"
                  className={addButtonClass}
                  onClick={() => edit((d) => { d.categorizingConfig!.items.push({ id: crypto.randomUUID(), mushroomDefinitionId: '', correctCategoryId: '' }); })}
                >
                  + Item
                </button>
              </div>
              {cat.items.map((item, i) => (
                <div key={item.id} className="flex items-center gap-2 rounded-lg border border-sky-100 p-2">
                  <input
                    required
                    placeholder="Mushroom definition ID"
                    value={item.mushroomDefinitionId}
                    onChange={(e) => edit((d) => { d.categorizingConfig!.items[i].mushroomDefinitionId = e.target.value; })}
                    className={inputClass}
                  />
                  <select
                    required
                    value={item.correctCategoryId}
                    onChange={(e) => edit((d) => { d.categorizingConfig!.items[i].correctCategoryId = e.target.value; })}
                    className={inputClass}
                  >
                    <option value="">Correct category…</option>
                    {cat.categories.map((c, ci) => (
                      <option key={c.id} value={c.id}>
                        {getText(c.categoryName, localeCodes[0] ?? '') || `Category ${ci + 1}`}
                      </option>
                    ))}
                  </select>
                  <button type="button" className={removeButtonClass} onClick={() => edit((d) => { d.categorizingConfig!.items.splice(i, 1); })}>
                    ✕
                  </button>
                </div>
              ))}
            </section>
          </>
        )}

        {draft.type === QuestType.Shooting && (
          <>
            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Mushrooms</span>
                <button
                  type="button"
                  className={addButtonClass}
                  onClick={() => edit((d) => { d.shootingConfig!.mushrooms.push({ mushroomDefinitionId: '', spawnCount: 1, movementSpeed: 1 }); })}
                >
                  + Mushroom
                </button>
              </div>
              {shoot.mushrooms.map((mushroom, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg border border-sky-100 p-2">
                  <input
                    required
                    placeholder="Mushroom definition ID"
                    value={mushroom.mushroomDefinitionId}
                    onChange={(e) => edit((d) => { d.shootingConfig!.mushrooms[i].mushroomDefinitionId = e.target.value; })}
                    className={inputClass}
                  />
                  <input
                    type="number"
                    min={1}
                    title="Spawn count"
                    value={mushroom.spawnCount}
                    onChange={(e) => edit((d) => { d.shootingConfig!.mushrooms[i].spawnCount = Number(e.target.value); })}
                    className={`${inputClass} w-24`}
                  />
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    title="Movement speed"
                    value={mushroom.movementSpeed}
                    onChange={(e) => edit((d) => { d.shootingConfig!.mushrooms[i].movementSpeed = Number(e.target.value); })}
                    className={`${inputClass} w-24`}
                  />
                  <button type="button" className={removeButtonClass} onClick={() => edit((d) => { d.shootingConfig!.mushrooms.splice(i, 1); })}>
                    ✕
                  </button>
                </div>
              ))}
            </section>

            <section className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className={labelClass}>Questions</span>
                <button
                  type="button"
                  className={addButtonClass}
                  onClick={() => edit((d) => {
                    d.shootingConfig!.questions.push({ id: crypto.randomUUID(), question: emptyLocale(), correctMushroomDefinitionId: '', timeLimitSeconds: 10 });
                  })}
                >
                  + Question
                </button>
              </div>
              {shoot.questions.map((question, i) => (
                <div key={question.id} className="flex flex-col gap-2 rounded-lg border border-sky-100 p-2">
                  {localeCodes.map((code) => (
                    <input
                      key={code}
                      placeholder={`Question (${code})`}
                      value={getText(question.question, code)}
                      onChange={(e) => edit((d) => setText(d.shootingConfig!.questions[i].question, code, e.target.value))}
                      className={inputClass}
                    />
                  ))}
                  <div className="flex items-center gap-2">
                    <input
                      required
                      placeholder="Correct mushroom definition ID"
                      value={question.correctMushroomDefinitionId}
                      onChange={(e) => edit((d) => { d.shootingConfig!.questions[i].correctMushroomDefinitionId = e.target.value; })}
                      className={inputClass}
                    />
                    <input
                      type="number"
                      min={1}
                      title="Time limit (seconds)"
                      value={question.timeLimitSeconds}
                      onChange={(e) => edit((d) => { d.shootingConfig!.questions[i].timeLimitSeconds = Number(e.target.value); })}
                      className={`${inputClass} w-24`}
                    />
                    <button type="button" className={removeButtonClass} onClick={() => edit((d) => { d.shootingConfig!.questions.splice(i, 1); })}>
                      ✕
                    </button>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* Reward */}
        <section className="flex flex-col gap-2 border-t border-sky-100 pt-3">
          <div className="flex items-center justify-between">
            <span className={labelClass}>Reward</span>
            <button
              type="button"
              className={addButtonClass}
              onClick={() => edit((d) => { d.questRewardConfig.entries.push({ id: crypto.randomUUID(), itemDefinitionId: '', amount: 1, weight: 1 }); })}
            >
              + Gacha Entry
            </button>
          </div>
          <label className="flex items-center gap-2">
            <span className="w-32 text-xs font-semibold text-sky-600">Currency</span>
            <input
              type="number"
              min={0}
              value={draft.questRewardConfig.currencyAmount}
              onChange={(e) => edit((d) => { d.questRewardConfig.currencyAmount = Number(e.target.value); })}
              className={`${inputClass} w-32`}
            />
          </label>
          {draft.questRewardConfig.entries.map((entry, i) => (
            <div key={entry.id} className="rounded-lg border border-sky-100 p-2">
              <div className="flex items-start gap-2">
                <SearchableDefinitionSelect
                  value={entry.itemDefinitionId}
                  onChange={(value) => edit((d) => { d.questRewardConfig.entries[i].itemDefinitionId = value; })}
                  options={itemOptions}
                  placeholder={itemsLoading ? 'Loading items...' : 'Select reward item'}
                />
                <button type="button" aria-label="Remove gacha entry" className={`${removeButtonClass} mt-1`} onClick={() => edit((d) => { d.questRewardConfig.entries.splice(i, 1); })}>
                  Remove
                </button>
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1 text-[11px] font-semibold text-sky-600">
                  Amount
                  <input
                    type="number"
                    min={1}
                    title="Amount"
                    value={entry.amount}
                    onChange={(e) => edit((d) => { d.questRewardConfig.entries[i].amount = Number(e.target.value); })}
                    className={inputClass}
                  />
                </label>
                <label className="flex flex-col gap-1 text-[11px] font-semibold text-sky-600">
                  Weight
                  <input
                    type="number"
                    min={0}
                    step={0.1}
                    title="Weight"
                    value={entry.weight}
                    onChange={(e) => edit((d) => { d.questRewardConfig.entries[i].weight = Number(e.target.value); })}
                    className={inputClass}
                  />
                </label>
              </div>
            </div>
          ))}
        </section>

        <div className="flex justify-end gap-2 border-t border-sky-100 pt-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 transition hover:bg-sky-50 cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending || !isExpiryValid}
            className="rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isPending ? 'Posting...' : 'Post Quest'}
          </button>
        </div>
      </form>
    </div>
  );
};
