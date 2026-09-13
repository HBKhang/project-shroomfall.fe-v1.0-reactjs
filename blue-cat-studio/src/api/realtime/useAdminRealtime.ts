import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { adminSignalRClient } from '../clients/adminSignalRClient';
import { ADMIN_QUERY_KEYS } from '../hooks/useAdmin';
import type { RoomStateChangedDTO } from '../../contracts/dto/feature/admin/response/room-state-changed-dto';
import type { RoomSyncChangedDTO } from '../../contracts/dto/feature/admin/response/room-sync-changed-dto';
import type { TelemetryEventDTO } from '../../contracts/dto/feature/admin/response/telemetry-event-dto';
import type { UserSessionChangedDTO } from '../../contracts/dto/feature/admin/response/user-session-changed-dto';
import type { UserConnectionChangedDTO } from '../../contracts/dto/feature/admin/response/user-connection-changed-dto';
import type { RoomSpatialDTO } from '../../contracts/dto/runtime/world-domain/room-spatial-dto';

export type RoomSpatialUI = RoomSpatialDTO & { runtimeState?: string };
export interface UserConnectionUI {
    userID: string;
    connectionID?: string;
}
export interface UserSessionUI {
    userID: string;
    playerInstanceID: string;
}

export type ActivityEvent =
    | { type: 'TELEMETRY'; payload: TelemetryEventDTO }
    | { type: 'CONNECTION'; payload: UserConnectionChangedDTO }
    | { type: 'SESSION'; payload: UserSessionChangedDTO }
    | { type: 'STATE'; payload: RoomStateChangedDTO };

export const useAdminRealtime = (
    onActivity?: (event: ActivityEvent) => void
) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const connection = adminSignalRClient.getConnection();

        const handlers = {
            handleRoomState: (payload: RoomStateChangedDTO) => {
                queryClient.setQueryData<RoomSpatialUI[]>(
                    ADMIN_QUERY_KEYS.ROOM_SPATIAL_LIST,
                    (old) => {
                        console.log("Payload:", payload.roomSpatialID);

                        old?.forEach((r) => {
                            console.log("Room:", r.id);
                        });

                        return (
                            old?.map((r) =>
                                r.id === payload.roomSpatialID
                                    ? {
                                        ...r,
                                        runtimeState: payload.newState,
                                    }
                                    : r
                            ) ?? []
                        );
                    }
                );
            },

            handleRoomSync: (payload: RoomSyncChangedDTO) => {
                queryClient.invalidateQueries({
                    queryKey: ADMIN_QUERY_KEYS.ROOM_INSTANCE_DETAILS(payload.roomSpatial.id),
                });

                queryClient.invalidateQueries({
                    queryKey: ADMIN_QUERY_KEYS.ROOM_SPATIAL_LIST,
                });
            },

            handleTelemetry: (payload: TelemetryEventDTO) => {
                onActivity?.({ type: 'TELEMETRY', payload });
            },

            handleConnection: (payload: UserConnectionChangedDTO) => {
                queryClient.setQueryData<UserConnectionUI[]>(
                    ADMIN_QUERY_KEYS.USER_CONNECTIONS,
                    (old = []) => {
                        const existing = old.find(x => x.userID === payload.userID);

                        if (existing) {
                            return old.map(x =>
                                x.userID === payload.userID
                                    ? {
                                        ...x,
                                        connectionID: payload.connectionID,
                                    }
                                    : x
                            );
                        }

                        return [...old, payload];
                    }
                );

                onActivity?.({
                    type: 'CONNECTION',
                    payload,
                });
            },

            handleSession: (payload: UserSessionChangedDTO) => {
                queryClient.setQueryData<UserSessionUI[]>(
                    ADMIN_QUERY_KEYS.USER_SESSIONS,
                    (old = []) => {
                        const existing = old.find(x => x.userID === payload.userID);

                        if (existing) {
                            return old.map(x =>
                                x.userID === payload.userID
                                    ? {
                                        ...x,
                                        playerInstanceID: payload.playerInstanceID,
                                    }
                                    : x
                            );
                        }

                        return [...old, payload];
                    }
                );

                onActivity?.({
                    type: 'SESSION',
                    payload,
                });
            },
        };

        connection.off('OnRoomStateChanged');
        connection.off('OnRoomSyncChanged');
        connection.off('OnTelemetrySended');
        connection.off('OnUserConnectionChanged');
        connection.off('OnUserSessionChanged');

        connection.on('OnRoomStateChanged', handlers.handleRoomState);
        connection.on('OnRoomSyncChanged', handlers.handleRoomSync);
        connection.on('OnTelemetrySended', handlers.handleTelemetry);
        connection.on('OnUserConnectionChanged', handlers.handleConnection);
        connection.on('OnUserSessionChanged', handlers.handleSession);

        adminSignalRClient.start();

        return () => {
            connection.off('OnRoomStateChanged', handlers.handleRoomState);
            connection.off('OnRoomSyncChanged', handlers.handleRoomSync);
            connection.off('OnTelemetrySended', handlers.handleTelemetry);
            connection.off('OnUserConnectionChanged', handlers.handleConnection);
            connection.off('OnUserSessionChanged', handlers.handleSession);
        };
    }, [queryClient, onActivity]);
};