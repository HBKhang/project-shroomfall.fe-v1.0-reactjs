import React from 'react';
import { useAdminRoomInstance } from '../../api/hooks/useAdmin';

interface RoomDetailProps {
  roomId: string;
  onClose: () => void;
}

export const RoomDetail: React.FC<RoomDetailProps> = ({ roomId, onClose }) => {
  const { data, isLoading } = useAdminRoomInstance(roomId);
    console.log(data);

  if (isLoading) return <div className="p-4 text-sky-600">Loading details...</div>;

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between border-b border-sky-100 p-4">
        <h2 className="font-bold text-sky-900">Entities</h2>
        <button
          onClick={onClose}
          className="text-sky-500 hover:text-sky-700"
        >
          Close
        </button>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden p-4 space-y-2">
        {data?.entities.map((entity) => (
          <div
            key={entity.id}
            className="rounded border border-sky-100 bg-sky-50 p-2 text-xs"
          >
            <div className="font-mono font-bold text-sky-800">
              {entity.definitionID}
            </div>
            <div className="text-sky-600">
              ID: {entity.id}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};