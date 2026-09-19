import React, { useState, useEffect, useRef } from 'react';
import { useUpsertEffectDefinition } from '../../../api/hooks/useDesign';
import { AttributeType } from '../../../contracts/enum/meta-domain/effect/attribute-type';
import { EffectType } from '../../../contracts/enum/meta-domain/effect/effect-type';
import type { EffectDefinitionDTO } from '../../../contracts/dto/definition/meta-domain/effect-definition-dto';
import { enumToIndex, enumToString } from '../../../utils/enum-helper';
import { CustomSelect } from '../../common/CustomSelect/CustomSelect';

interface EffectRowFormProps {
  effect?: EffectDefinitionDTO | null;
  isInitialCreateRow?: boolean;
  onSuccessCallback?: () => void;
  onCancelCallback?: () => void;
}

interface FormState extends Omit<EffectDefinitionDTO, 'duration' | 'interval'> {
  duration: number | '';
  interval: number | '';
}

type EditableField = 'type' | 'attributeType' | 'sourceType' | 'value' | 'duration' | 'interval' | null;

export const EffectRowForm: React.FC<EffectRowFormProps> = ({
  effect,
  isInitialCreateRow = false,
  onSuccessCallback,
  onCancelCallback
}) => {
  const { mutate: upsertEffect } = useUpsertEffectDefinition();

  const [activeField, setActiveField] = useState<EditableField>(isInitialCreateRow ? 'type' : null);
  const cellRef = useRef<HTMLTableCellElement>(null);

  const [formData, setFormData] = useState<FormState>({
    id: '',
    type: EffectType.Flat,
    attributeType: AttributeType.PhysicalDamage,
    value: 0,
    duration: '',
    interval: '',
  });

  const resetFormState = () => {
    if (effect) {
      setFormData({
        id: effect.id,
        type: enumToString(EffectType, effect.type) as EffectType,
        attributeType: enumToString(AttributeType, effect.attributeType) as AttributeType,
        value: effect.value ?? 0,
        duration: effect.duration ?? '',
        interval: effect.interval ?? '',
      });
    } else {
      setFormData({
        id: '',
        type: EffectType.Flat,
        attributeType: AttributeType.PhysicalDamage,
        value: 0,
        duration: '',
        interval: '',
      });
    }
  };

  useEffect(() => {
    resetFormState();
  }, [effect]);

  useEffect(() => {
    if (activeField && cellRef.current) {
      const input = cellRef.current.querySelector('input, select, button') as HTMLElement;
      if (input) input.focus();
    }
  }, [activeField]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? (value === '' ? '' : Number(value)) : value
    }));
  };

  const executeSave = () => {
    const safeID = formData.id.trim();

    if (!safeID) {
      handleCancel();
      return;
    }

    const payload = {
      id: safeID,
      type: enumToIndex(EffectType, formData.type),
      attributeType: enumToIndex(AttributeType, formData.attributeType),
      value: formData.value,
      duration: formData.duration === '' ? null : formData.duration,
      interval: formData.interval === '' ? null : formData.interval,
    };

    upsertEffect(payload as any, {
      onSuccess: () => {
        if (isInitialCreateRow) {
          setFormData({ id: '', type: EffectType.Flat, attributeType: AttributeType.PhysicalDamage, value: 0, duration: '', interval: '' });
        }
        setActiveField(null);
        if (onSuccessCallback) onSuccessCallback();
      },
      onError: () => {
        handleCancel();
      }
    });
  };

  const handleCancel = () => {
    resetFormState();
    if (isInitialCreateRow) {
      if (onCancelCallback) onCancelCallback();
    } else {
      setActiveField(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  const startEdit = (field: EditableField) => {
    if (isInitialCreateRow) return;
    setActiveField(field);
  };

  const effectTypeOptions = Object.values(EffectType).map((v) => String(v));
  const attributeTypeOptions = Object.values(AttributeType).map((v) => String(v));

  const inputBaseClass = "w-full h-8 rounded border border-sky-300 bg-sky-50 px-2 text-sm text-sky-900 outline-none focus:border-sky-500 focus:bg-white focus:ring-1 focus:ring-sky-400 box-border";
  const editableTdClass = "px-6 h-12 transition-colors duration-150 group-hover:bg-sky-50/40 cursor-pointer align-middle text-sky-700 font-medium box-border whitespace-nowrap relative";

  return (
    <tr className={`group border-b border-sky-50 transition-colors ${isInitialCreateRow ? 'bg-sky-50/50' : 'hover:bg-sky-50/20'}`}>

      {/* --- ID Cell --- */}
      <td className={`px-6 py-3.5 align-middle ${isInitialCreateRow ? 'bg-sky-100/40' : ''}`}>
        {isInitialCreateRow ? (
          <input
            type="text"
            name="id"
            value={formData.id}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Key"
            className="w-full rounded border border-sky-400 bg-white px-2 py-1 text-sm font-semibold tracking-wider text-sky-950 placeholder-sky-400 outline-none shadow-inner focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
          />
        ) : (
          <span className="font-mono text-xs font-bold tracking-wider text-sky-900">{effect?.id}</span>
        )}
      </td>

      {/* --- Calculation Type Cell --- */}
      <td
        ref={activeField === 'type' ? cellRef : null}
        onClick={() => startEdit('type')}
        className={editableTdClass}
      >
        {activeField === 'type' || isInitialCreateRow ? (
          <CustomSelect
            value={formData.type}
            onChange={(val) => setFormData(prev => ({ ...prev, type: val as EffectType }))}
            options={effectTypeOptions}
            placeholder="Select Type"
            onEnter={executeSave}
          />
        ) : (
          <span className="inline-flex items-center rounded-md bg-sky-50 px-2 py-1 text-xs font-semibold text-sky-700 ring-1 ring-inset ring-sky-700/10">
            {effect && (enumToString(EffectType, effect.type) as EffectType)}
          </span>
        )}
      </td>

      {/* --- Target Attribute Cell --- */}
      <td
        ref={activeField === 'attributeType' ? cellRef : null}
        onClick={() => startEdit('attributeType')}
        className={editableTdClass}
      >
        {activeField === 'attributeType' || isInitialCreateRow ? (
          <CustomSelect
            value={formData.attributeType}
            onChange={(val) => setFormData(prev => ({ ...prev, attributeType: val as AttributeType }))}
            options={attributeTypeOptions}
            placeholder="Select Attribute"
            onEnter={executeSave}
          />
        ) : (
          <span className="text-sky-900 text-sm">
            {effect && (enumToString(AttributeType, effect.attributeType) as AttributeType)}
          </span>
        )}
      </td>

      {/* --- Value Cell --- */}
      <td
        ref={activeField === 'value' ? cellRef : null}
        onClick={() => startEdit('value')}
        className={editableTdClass}
      >
        {activeField === 'value' || isInitialCreateRow ? (
          <input
            type="number"
            name="value"
            step="any"
            value={formData.value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={inputBaseClass}
          />
        ) : (
          <span className="font-mono text-sky-950 font-semibold">{effect?.value}</span>
        )}
      </td>

      {/* --- Duration Cell --- */}
      <td
        ref={activeField === 'duration' ? cellRef : null}
        onClick={() => startEdit('duration')}
        className={editableTdClass}
      >
        {activeField === 'duration' || isInitialCreateRow ? (
          <input
            type="number"
            name="duration"
            placeholder="Infinite runtime"
            value={formData.duration}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={inputBaseClass}
          />
        ) : (
          <span className="text-xs">
            {effect?.duration == null ? (
              <span className="text-emerald-600 font-semibold uppercase tracking-wider text-[10px] bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                Permanent
              </span>
            ) : effect.duration === 0 ? (
              <span className="text-amber-600 font-semibold uppercase tracking-wider text-[10px] bg-amber-50 px-1.5 py-0.5 rounded border border-amber-100">
                Immediate
              </span>
            ) : (
              <span className="font-mono text-sky-900 bg-sky-100/50 px-1.5 py-0.5 rounded">
                {effect.duration}s
              </span>
            )}
          </span>
        )}
      </td>

      {/* --- Interval Cell --- */}
      <td
        ref={activeField === 'interval' ? cellRef : null}
        onClick={() => startEdit('interval')}
        className={editableTdClass}
      >
        {activeField === 'interval' || isInitialCreateRow ? (
          <input
            type="number"
            name="interval"
            placeholder="Instant evaluation"
            value={formData.interval}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onBlur={isInitialCreateRow ? undefined : handleCancel}
            className={inputBaseClass}
          />
        ) : (
          <span className="text-xs">
            {effect?.interval ? (
              <span className="font-mono text-sky-800">{effect.interval}s ticks</span>
            ) : (
              <em className="text-sky-300 italic text-xs font-normal">No Tick</em>
            )}
          </span>
        )}
      </td>
    </tr>
  );
};