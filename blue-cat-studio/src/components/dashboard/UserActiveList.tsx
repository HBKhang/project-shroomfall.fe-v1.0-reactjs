import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { ADMIN_QUERY_KEYS } from '../../api/hooks/useAdmin';
import type { UserConnectionUI, UserSessionUI } from '../../api/realtime/useAdminRealtime';

export const UserActiveList: React.FC = () => {
    const { data: connections = [] } = useQuery<UserConnectionUI[]>({
        queryKey: ADMIN_QUERY_KEYS.USER_CONNECTIONS,
        queryFn: async () => [],
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const { data: sessions = [] } = useQuery<UserSessionUI[]>({
        queryKey: ADMIN_QUERY_KEYS.USER_SESSIONS,
        queryFn: async () => [],
        staleTime: Infinity,
        gcTime: Infinity,
    });

    const users = connections.map((connection) => {
        const session = sessions.find(
            (s) => s.userID === connection.userID
        );

        return {
            userID: connection.userID,
            connectionID: connection.connectionID,
            playerInstanceID: session?.playerInstanceID,
            online: !!connection.connectionID,
        };
    });

    return (
        <div className="flex h-full flex-col">
            <div className="border-b border-sky-100 p-4 font-bold text-sky-900">
                Active Users ({users.length})
            </div>

            <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hidden p-2">
                <div className="space-y-2">
                    {users.length === 0 ? (
                        <div className="p-4 text-center text-sm text-sky-500">
                            No active users.
                        </div>
                    ) : (
                        users.map((user) => (
                            <div
                                key={user.userID}
                                className="rounded-lg border border-sky-100 bg-white p-3"
                            >
                                <div className="flex items-center justify-between">
                                    <span className="truncate font-semibold text-sky-900">
                                        {user.userID}
                                    </span>

                                    <span
                                        className={`h-2.5 w-2.5 rounded-full ${user.online
                                                ? 'bg-green-500'
                                                : 'bg-slate-300'
                                            }`}
                                    />
                                </div>

                                <div className="mt-2 space-y-1 text-xs text-sky-600">
                                    <div className="truncate">
                                        Connection:{" "}
                                        {user.connectionID ?? "-"}
                                    </div>

                                    <div className="truncate">
                                        Player:{" "}
                                        {user.playerInstanceID ?? "-"}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};