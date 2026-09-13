import { useQuery } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';
// Ensure these types match your actual generated contracts
import type { RoomSpatialDTO } from '../../contracts/dto/runtime/world-domain/room-spatial-dto';
import type { RoomInstanceDTO } from '../../contracts/dto/runtime/world-domain/room-instance-dto';

// --- Query Keys ---
export const ADMIN_QUERY_KEYS = {
    ROOM_SPATIAL_LIST: ['admin', 'room-spatials'] as const,
    ROOM_INSTANCE_DETAILS: (id: string) =>
        ['admin', 'room-instance', id] as const,

    USER_CONNECTIONS: ['admin', 'user-connections'] as const,
    USER_SESSIONS: ['admin', 'user-sessions'] as const,
};

// ==========================================
// --- QUERIES (Read Actions) ---
// ==========================================

/**
 * Fetch all tracked room spatials (GET /api/Admin/room-spatials)
 */
export const useAdminRoomSpatials = () => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.ROOM_SPATIAL_LIST,
        queryFn: async (): Promise<RoomSpatialDTO[]> => {
            const { data } = await apiClient.get<RoomSpatialDTO[]>('/Admin/room-spatials');
            return data;
        },
    });
};

/**
 * Fetch detailed state for an active room execution node (GET /api/Admin/room-instance/{roomSpatailId})
 */
export const useAdminRoomInstance = (roomSpatialId: string) => {
    return useQuery({
        queryKey: ADMIN_QUERY_KEYS.ROOM_INSTANCE_DETAILS(roomSpatialId),
        queryFn: async (): Promise<RoomInstanceDTO> => {
            // Note: The route parameter in your controller is 'roomSpatailId' (with typo)
            const { data } = await apiClient.get<RoomInstanceDTO>(`/Admin/room-instance/${roomSpatialId}`);
            return data;
        },
        enabled: !!roomSpatialId,
    });
};