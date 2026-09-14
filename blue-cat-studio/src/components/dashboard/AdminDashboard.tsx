import React, { useState } from 'react';
import { useAdminRealtime } from '../../api/realtime/useAdminRealtime';
import { RoomList } from './RoomList';
import { RoomDetail } from './RoomDetail';
import { ActivityLog } from './ActivityLog';
import { UserActiveList } from './UserActiveList';
import type { TelemetryEventDTO } from '../../contracts/dto/feature/admin/response/telemetry-event-dto';

export const AdminDashboard: React.FC = () => {
    const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
    const [telemetryLogs, setTelemetryLogs] = useState<TelemetryEventDTO[]>([]);
    const panelHeight = "h-[700px]";

    useAdminRealtime((event) => {
        if (event.type === 'TELEMETRY') {
            setTelemetryLogs((prev) => [event.payload, ...prev].slice(0, 50));
        }
    });

    return (
        <div
            className={`grid w-full gap-4 ${selectedRoomId
                    ? "grid-cols-[300px_minmax(0,1fr)_500px]"
                    : "grid-cols-[minmax(0,1fr)_500px]"
                }`}
        >
            {/* Room List */}
            <div className={`flex flex-col ${panelHeight} overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm`}>
                <RoomList
                    selectedRoomId={selectedRoomId}
                    onSelect={setSelectedRoomId}
                />
            </div>

            {/* Room Detail */}
            {selectedRoomId && (
                <div className={`flex flex-col ${panelHeight} overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm`}>
                    <RoomDetail
                        roomId={selectedRoomId}
                        onClose={() => setSelectedRoomId(null)}
                    />
                </div>
            )}

            {/* Right Column */}
            <div className={`flex flex-col ${panelHeight} gap-4`}>
                {/* Active Users */}
                <div className="h-64 overflow-hidden rounded-xl border border-sky-100 bg-white shadow-sm">
                    <UserActiveList />
                </div>

                {/* Activity */}
                <div className="flex-1 overflow-hidden rounded-xl border border-sky-100 bg-slate-900 shadow-sm">
                    <ActivityLog events={telemetryLogs} />
                </div>
            </div>
        </div>
    );
};