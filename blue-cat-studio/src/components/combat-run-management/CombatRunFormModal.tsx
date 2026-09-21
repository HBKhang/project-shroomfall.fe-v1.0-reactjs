import React, { useState, useEffect } from 'react';
import type { CombatRunDefinitionDTO } from '../../contracts/dto/definition/world-domain/combat-run-definition-dto';
import { useUpsertCombatRunDefinition, useDesignAllRooms } from '../../api/hooks/useDesign';
import type { FloorDTO } from '../../contracts/dto/definition/world-domain/floor-dto';

interface CombatRunFormModalProps {
  isOpen: boolean;
  initialData: CombatRunDefinitionDTO | null;
  onClose: () => void;
  onSuccess: () => void;
}

export const CombatRunFormModal: React.FC<CombatRunFormModalProps> = ({
  isOpen,
  initialData,
  onClose,
  onSuccess,
}) => {
  const [id, setId] = useState('');
  const [floors, setFloors] = useState<FloorDTO[]>([]);
  const upsertMutation = useUpsertCombatRunDefinition();

  // Fetch rooms for selecting RoomDefinitionID
  const { data: roomsData } = useDesignAllRooms({ pageNumber: 1, pageSize: 100 });

  useEffect(() => {
    if (initialData) {
      setId(initialData.id || '');
      setFloors(initialData.floors ? [...initialData.floors] : []);
    } else {
      setId('');
      setFloors([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAddFloor = () => {
    const nextLevel = floors.length > 0 ? Math.max(...floors.map((f) => f.level)) + 1 : 1;
    setFloors((prev) => [...prev, { level: nextLevel, roomDefinitionID: '' }]);
  };

  const handleRemoveFloor = (index: number) => {
    setFloors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFloorChange = (index: number, field: keyof FloorDTO, value: any) => {
    setFloors((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id.trim()) return;

    const payload: CombatRunDefinitionDTO = {
      id: id.trim(),
      floors,
    };

    upsertMutation.mutate(payload, {
      onSuccess: () => {
        onSuccess();
        onClose();
      },
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-sky-950/40 p-4 backdrop-blur-sm">
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-sky-100 bg-white shadow-xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-sky-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-bold text-sky-950">
              {initialData ? `Edit Run Blueprint: ${initialData.id}` : 'Create Combat Run Blueprint'}
            </h3>
            <p className="text-xs text-sky-600">
              Configure run hierarchy levels and mapped room definitions.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={upsertMutation.isPending}
            className="rounded-lg p-1 text-sky-400 hover:bg-sky-50 hover:text-sky-600 disabled:opacity-50 cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex flex-1 flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* ID Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-sky-800 mb-1.5">
                Combat Run ID
              </label>
              <input
                type="text"
                value={id}
                onChange={(e) => setId(e.target.value)}
                disabled={!!initialData} // Lock ID editing when updating an existing run
                placeholder="e.g., RUN_FOREST_CHAPTER_1"
                required
                className="w-full rounded-lg border border-sky-200 bg-sky-50/20 px-4 py-2 text-sm text-sky-900 placeholder-sky-400 outline-none transition focus:border-sky-400 focus:bg-white focus:ring-4 focus:ring-sky-100 disabled:bg-sky-100 disabled:text-sky-500"
              />
            </div>

            {/* Floors Section */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-sky-800">
                  Floor Configurations ({floors.length})
                </label>
                <button
                  type="button"
                  onClick={handleAddFloor}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-semibold text-sky-800 transition hover:bg-sky-100 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  Add Floor
                </button>
              </div>

              {floors.length === 0 ? (
                <div className="rounded-xl border border-dashed border-sky-200 bg-sky-50/30 py-8 text-center text-xs font-medium text-sky-500">
                  No floors added yet. Click &quot;Add Floor&quot; to build the run structure.
                </div>
              ) : (
                <div className="space-y-3">
                  {floors.map((floor, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 rounded-xl border border-sky-100 bg-sky-50/40 p-3"
                    >
                      {/* Level Input */}
                      <div className="w-28">
                        <label className="block text-[10px] font-semibold text-sky-600 mb-1">
                          Level
                        </label>
                        <input
                          type="number"
                          value={floor.level}
                          onChange={(e) => handleFloorChange(index, 'level', parseInt(e.target.value) || 0)}
                          className="w-full rounded-md border border-sky-200 bg-white px-2.5 py-1 text-sm font-semibold text-sky-900 outline-none focus:border-sky-400"
                          required
                        />
                      </div>

                      {/* Room Selection / Room ID Input */}
                      <div className="flex-1">
                        <label className="block text-[10px] font-semibold text-sky-600 mb-1">
                          Room Definition ID
                        </label>
                        {roomsData?.items?.length ? (
                          <select
                            value={floor.roomDefinitionID}
                            onChange={(e) => handleFloorChange(index, 'roomDefinitionID', e.target.value)}
                            className="w-full rounded-md border border-sky-200 bg-white px-2.5 py-1 text-sm text-sky-900 outline-none focus:border-sky-400"
                            required
                          >
                            <option value="">Select a Room...</option>
                            {roomsData.items.map((room) => (
                              <option key={room.id} value={room.id}>
                                {room.id}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="text"
                            value={floor.roomDefinitionID}
                            onChange={(e) => handleFloorChange(index, 'roomDefinitionID', e.target.value)}
                            placeholder="ROOM_DESERT_01"
                            className="w-full rounded-md border border-sky-200 bg-white px-2.5 py-1 text-sm text-sky-900 outline-none focus:border-sky-400"
                            required
                          />
                        )}
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        onClick={() => handleRemoveFloor(index)}
                        className="mt-4 rounded-lg p-1.5 text-sky-400 hover:bg-red-50 hover:text-red-600 transition cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 border-t border-sky-100 bg-sky-50/30 px-6 py-4">
            <button
              type="button"
              onClick={onClose}
              disabled={upsertMutation.isPending}
              className="rounded-lg border border-sky-200 bg-white px-4 py-2 text-xs font-semibold text-sky-700 hover:bg-sky-50 transition cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={upsertMutation.isPending}
              className="inline-flex items-center gap-2 rounded-lg bg-sky-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 transition cursor-pointer disabled:bg-sky-300"
            >
              {upsertMutation.isPending && (
                <svg className="h-3.5 w-3.5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              )}
              {upsertMutation.isPending ? 'Saving...' : 'Save Blueprint'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};