import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';
import type { DefinitionSnapshotDTO } from '../../contracts/dto/feature/design/response/definition-snapshot-dto';
import type { UpdateDefinitionDTO } from '../../contracts/dto/feature/design/command/update-definition-dto';
import type { PagedResponseDTO } from '../../contracts/dto/abstraction/paged-response-dto'; 
import type { EntityDefinitionDTO } from '../../contracts/dto/definition/entity-domain/entity-definition-dto';
import type { EntityDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/entity-definition-query-dto';
import type { EffectDefinitionDTO } from '../../contracts/dto/definition/meta-domain/effect-definition-dto';
import type { EffectDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/effect-definition-query-dto';
import type { ItemDefinitionDTO } from '../../contracts/dto/definition/meta-domain/item-definition-dto';
import type { ItemDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/item-definition-query-dto';
import type { RoomDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/room-definition-query-dto';
import type { RoomDefinitionDTO } from '../../contracts/dto/definition/world-domain/room-definition-dto';
import type { LocaleDTO } from '../../contracts/dto/definition/localization-domain/locale-dto';
import type { LocalizationEntryDTO } from '../../contracts/dto/definition/localization-domain/localization-entry-dto';
import type { LocalizationEntryQueryDTO } from '../../contracts/dto/feature/design/command/localization-entry-query-dto';

// --- Query Keys ---
export const DESIGN_QUERY_KEYS = {
  SNAPSHOT: (version: string) => ['design', 'snapshot', version] as const,

  // Effects Cache Roots
  EFFECTS: ['design', 'effects'] as const,
  EFFECTS_LIST: (queries: EffectDefinitionQueryDTO) => ['design', 'effects', 'list', queries] as const,

  // Entities Cache Roots
  ENTITIES: ['design', 'entities'] as const,
  ENTITIES_LIST: (queries: EntityDefinitionQueryDTO) => ['design', 'entities', 'list', queries] as const,
  ENTITY_DETAIL: (id: string) => ['design', 'entities', 'detail', id] as const,

  // Items Cache Roots
  ITEMS: ['design', 'items'] as const,
  ITEMS_LIST: (queries: ItemDefinitionQueryDTO) => ['design', 'items', 'list', queries] as const,

  // Locales & Localization Cache Roots
  LOCALES: ['design', 'locales'] as const,
  LOCALIZATION_ENTRIES: ['design', 'localization-entries'] as const,
  LOCALIZATION_ENTRIES_LIST: (queries: LocalizationEntryQueryDTO) => ['design', 'localization-entries', 'list', queries] as const,

  // Rooms Cache Roots
  ROOMS: ['design', 'rooms'] as const,
  ROOMS_LIST: (queries: RoomDefinitionQueryDTO) => ['design', 'rooms', 'list', queries] as const,
};

// Helper for multipart/form-data upload requests
const createFileUploadFormData = (file: File): FormData => {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
};

// ==========================================
// --- QUERIES (Read Actions) ---
// ==========================================

/**
 * Fetch All Effects (GET /management/design/effects)
 */
export const useDesignAllEffects = (queries: EffectDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.EFFECTS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EffectDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EffectDefinitionDTO>>('/management/design/effects', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Entities (GET /management/design/entities)
 */
export const useDesignAllEntities = (queries: EntityDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITIES_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EntityDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EntityDefinitionDTO>>('/management/design/entities', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch Entity Definition Detail (GET /management/design/entities/{id})
 */
export const useDesignEntityDetail = (id: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITY_DETAIL(id),
    queryFn: async (): Promise<EntityDefinitionDTO> => {
      const { data } = await apiClient.get<EntityDefinitionDTO>(`/management/design/entities/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch All Items (GET /management/design/items)
 */
export const useDesignAllItems = (queries: ItemDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ITEMS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<ItemDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<ItemDefinitionDTO>>('/management/design/items', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Locales (GET /management/design/locales)
 */
export const useDesignAllLocales = () => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.LOCALES,
    queryFn: async (): Promise<LocaleDTO[]> => {
      const { data } = await apiClient.get<LocaleDTO[]>('/management/design/locales');
      return data;
    },
  });
};

/**
 * Fetch Localization Entries (GET /management/design/localization-entries)
 */
export const useDesignLocalizationEntries = (queries: LocalizationEntryQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.LOCALIZATION_ENTRIES_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<LocalizationEntryDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<LocalizationEntryDTO>>('/management/design/localization-entries', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Rooms (GET /management/design/rooms)
 */
export const useDesignAllRooms = (queries: RoomDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ROOMS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<RoomDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<RoomDefinitionDTO>>('/management/design/rooms', {
        params: queries,
      });
      return data;
    },
  });
};

// ==========================================
// --- MUTATIONS: File Imports ---
// ==========================================

/**
 * Import Effect Definitions File (POST /management/design/effect-definition/upload)
 */
export const useImportEffectDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/management/design/effect-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.EFFECTS });
    },
  });
};

/**
 * Import Entity Definitions File (POST /management/design/entity-definition/upload)
 */
export const useImportEntityDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/management/design/entity-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ENTITIES });
    },
  });
};

/**
 * Import Item Definitions File (POST /management/design/item-definition/upload)
 */
export const useImportItemDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/management/design/item-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ITEMS });
    },
  });
};

/**
 * Import Room Definition File (POST /management/design/room-definition/upload)
 */
export const useImportRoomDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/management/design/room-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ROOMS });
    },
  });
};

// ==========================================
// --- MUTATIONS: Data Updates & Upserts ---
// ==========================================

/**
 * Update Definition (POST /management/design/definition)
 */
export const useUpdateDesignDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateDefinitionDTO): Promise<void> => {
      await apiClient.post('/management/design/definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design'] });
    },
  });
};

/**
 * Update Single Localization Entry (POST /management/design/localization-entry)
 */
export const useUpdateLocalizationEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LocalizationEntryDTO): Promise<void> => {
      await apiClient.post('/management/design/localization-entry', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DESIGN_QUERY_KEYS.LOCALIZATION_ENTRIES,
      });
    },
  });
};

/**
 * Upsert Effect Definition (POST /management/design/effect-definition)
 */
export const useUpsertEffectDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: EffectDefinitionDTO): Promise<void> => {
      await apiClient.post('/management/design/effect-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.EFFECTS });
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};

/**
 * Upsert Entity Definition (POST /management/design/entity-definition)
 */
export const useUpsertEntityDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: EntityDefinitionDTO): Promise<void> => {
      await apiClient.post('/management/design/entity-definition', dto);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ENTITIES });

      if (variables.id) {
        queryClient.invalidateQueries({
          queryKey: DESIGN_QUERY_KEYS.ENTITY_DETAIL(variables.id),
        });
      }

      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};

/**
 * Upsert Item Definition (POST /management/design/item-definition)
 */
export const useUpsertItemDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ItemDefinitionDTO): Promise<void> => {
      await apiClient.post('/management/design/item-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ITEMS });
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};

// ==========================================
// --- USER SNAPSHOT / REFRESH ---
// ==========================================

/**
 * User Refresh / Get Snapshot (GET /management/design/{version})
 */
export const useDesignSnapshot = (version: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.SNAPSHOT(version),
    queryFn: async (): Promise<DefinitionSnapshotDTO | null> => {
      const { data } = await apiClient.get<DefinitionSnapshotDTO | null>(`/management/design/${version}`);
      return data;
    },
    enabled: !!version,
  });
};