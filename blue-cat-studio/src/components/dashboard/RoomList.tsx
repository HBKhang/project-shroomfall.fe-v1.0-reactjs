import React, { useEffect, useState } from 'react';
import { useAdminRoomSpatials } from '../../api/hooks/useAdmin';
import type { RoomSpatialUI } from '../../api/realtime/useAdminRealtime';

interface RoomListProps {
    selectedRoomId: string |null;
    onSelect: (id: string) => void;
}

export const RoomList: React.FC<RoomListProps> = ({
    selectedRoomId,
    onSelect,
}) => {
    const { data, isLoading } = useAdminRoomSpatials();
    const rooms = data as RoomSpatialUI[] | undefined;

    // roomId -> remaining seconds
    const [countdowns, setCountdowns] = useState<Record<string, number>>({});

    // Detect rooms entering/leaving Warm state
    useEffect(() => {
        if (!rooms) return;

        setCountdowns((prev) => {
            const next = { ...prev };

            rooms.forEach((room) => {
                if (room.runtimeState === "Warm") {
                    // Start countdown only once
                    if (next[room.id] === undefined) {
                        next[room.id] = 30;
                    }
                } else {
                    delete next[room.id];
                }
            });

            return next;
        });
    }, [rooms]);

    // Tick every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCountdowns((prev) => {
                const next = { ...prev };

                Object.keys(next).forEach((id) => {
                    next[id] = Math.max(0, next[id] - 1);
                });

                return next;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    if (isLoading)
        return <div className="p-4 text-sky-600">Loading rooms...</div>;

    return (
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden p-2">
            <div
                className={`grid gap-2 ${
                    selectedRoomId
                        ? "grid-cols-1"
                        : "grid-cols-[repeat(auto-fill,minmax(140px,1fr))]"
                }`}
            >
                {rooms?.map((room) => (
                    <button
                        key={room.id}
                        onClick={() => onSelect(room.id)}
                        className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                            selectedRoomId === room.id
                                ? "border-sky-600 bg-sky-600 text-white"
                                : "border-sky-100 text-sky-800 hover:bg-sky-50"
                        }`}
                    >
                        <div className="truncate font-semibold">
                            {room.definitionID}
                        </div>

                        <div
                            className={`mt-1 text-xs ${
                                selectedRoomId === room.id
                                    ? "text-sky-100"
                                    : "text-sky-500"
                            }`}
                        >
                            State: {room.runtimeState}
                        </div>

                        {room.runtimeState === "Warm" && (
                            <div
                                className={`mt-2 text-xs font-semibold ${
                                    selectedRoomId === room.id
                                        ? "text-yellow-200"
                                        : "text-orange-600"
                                }`}
                            >
                                Ends in {countdowns[room.id] ?? 30}s
                            </div>
                        )}
                    </button>
                ))}
            </div>
        </div>
    );
};