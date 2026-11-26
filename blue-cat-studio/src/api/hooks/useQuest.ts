import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';
import type { PagedResponseDTO } from '../../contracts/dto/abstraction/paged-response-dto';
import type { QuestInstanceDTO } from '../../contracts/dto/runtime/meta-domain/quest-instance-dto';
import type { QuestInstanceQueryDTO } from '../../contracts/dto/feature/design/command/quest-instance-query-dto';

// --- Query Keys ---
export const QUEST_QUERY_KEYS = {
  QUESTS: ['quest', 'quests'] as const,
  QUESTS_LIST: (queries: QuestInstanceQueryDTO) => ['quest', 'quests', 'list', queries] as const,
};

/**
 * Fetch paged quest instances (GET /api/Quest)
 */
export const useQuests = (queries: QuestInstanceQueryDTO) => {
  return useQuery({
    queryKey: QUEST_QUERY_KEYS.QUESTS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<QuestInstanceDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<QuestInstanceDTO>>('/game/quest/', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Create a quest instance, GameMaster only (POST /api/Quest/create)
 */
export const useCreateQuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: QuestInstanceDTO) => {
      await apiClient.post('/game/quest/create', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUEST_QUERY_KEYS.QUESTS });
    },
  });
};