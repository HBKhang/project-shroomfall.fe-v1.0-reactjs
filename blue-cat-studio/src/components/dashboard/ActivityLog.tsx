import React, { useMemo, useState } from 'react';
import type { TelemetryEventDTO } from '../../contracts/dto/feature/admin/response/telemetry-event-dto';

interface ActivityLogProps {
    events: TelemetryEventDTO[];
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ events }) => {
    const [search, setSearch] = useState('');

    const filteredEvents = useMemo(() => {
        const keyword = search.trim().toLowerCase();

        if (!keyword) return events;

        return events.filter(
            (e) =>
                e.code.toLowerCase().includes(keyword) ||
                e.message.toLowerCase().includes(keyword)
        );
    }, [events, search]);

    return (
        <div className="flex h-full min-h-0 flex-col p-4">
            <h2 className="mb-3 text-xs font-bold uppercase tracking-wider text-sky-400">
                Activity
            </h2>

            <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="mb-4 rounded-md border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-sky-100 outline-none"
            />

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden space-y-3 font-mono text-[10px]">
                {filteredEvents.map((e, idx) => (
                    <div
                        key={idx}
                        className="border-b border-white/10 pb-2 text-sky-200"
                    >
                        <div className="flex justify-between">
                            <span className="font-bold">{e.code}</span>
                            <span className="opacity-50">
                                {new Date(e.timestamp).toLocaleTimeString()}
                            </span>
                        </div>

                        <div className="mt-1 opacity-80">
                            {e.message}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};