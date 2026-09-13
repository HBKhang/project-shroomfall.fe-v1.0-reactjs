import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '../clients/apiClient';
import type { DefinitionSnapshotDTO } from '../../contracts/dto/feature/design/response/definition-snapshot-dto';
import type { UpdateDefinitionDTO } from '../../contracts/dto/feature/design/command/update-definition-dto';
import type { PagedResponseDTO } from '../../contracts/dto/common/paged-response-dto';
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
import type { CombatRunDefinitionDTO } from '../../contracts/dto/definition/world-domain/combat-run-definition-dto';
import type { CombatRunDefinitionQueryDTO } from '../../contracts/dto/feature/design/command/combat-run-definition-query-dto';

// --- Query Keys ---
export const DESIGN_QUERY_KEYS = {
  SNAPSHOT: (version: string) => ['design', 'snapshot', version] as const,

  // Combat Runs Cache Roots
  COMBAT_RUNS: ['design', 'combat-runs'] as const,
  COMBAT_RUNS_LIST: (queries: CombatRunDefinitionQueryDTO) => ['design', 'combat-runs', 'list', queries] as const,

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
 * Fetch All Combat Runs (GET /api/design/combat-run)
 */
export const useDesignAllCombatRuns = (queries: CombatRunDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.COMBAT_RUNS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<CombatRunDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<CombatRunDefinitionDTO>>('/design/combat-run', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Effects (GET /api/design/effects)
 */
export const useDesignAllEffects = (queries: EffectDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.EFFECTS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EffectDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EffectDefinitionDTO>>('/design/effects', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Entities (GET /api/design/entities)
 */
export const useDesignAllEntities = (queries: EntityDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITIES_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<EntityDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<EntityDefinitionDTO>>('/design/entities', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch Entity Definition Detail (GET /api/design/entities/{id})
 */
export const useDesignEntityDetail = (id: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ENTITY_DETAIL(id),
    queryFn: async (): Promise<EntityDefinitionDTO> => {
      const { data } = await apiClient.get<EntityDefinitionDTO>(`/design/entities/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

/**
 * Fetch All Items (GET /api/design/items)
 */
export const useDesignAllItems = (queries: ItemDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ITEMS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<ItemDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<ItemDefinitionDTO>>('/design/items', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Locales (GET /api/design/locales)
 */
export const useDesignAllLocales = () => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.LOCALES,
    queryFn: async (): Promise<LocaleDTO[]> => {
      const { data } = await apiClient.get<LocaleDTO[]>('/design/locales');
      return data;
    },
  });
};

/**
 * Fetch Localization Entries (GET /api/design/localization-entries)
 */
export const useDesignLocalizationEntries = (queries: LocalizationEntryQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.LOCALIZATION_ENTRIES_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<LocalizationEntryDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<LocalizationEntryDTO>>('/design/localization-entries', {
        params: queries,
      });
      return data;
    },
  });
};

/**
 * Fetch All Rooms (GET /api/design/rooms)
 */
export const useDesignAllRooms = (queries: RoomDefinitionQueryDTO) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.ROOMS_LIST(queries),
    queryFn: async (): Promise<PagedResponseDTO<RoomDefinitionDTO>> => {
      const { data } = await apiClient.get<PagedResponseDTO<RoomDefinitionDTO>>('/design/rooms', {
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
 * Import Combat Run Definitions File (POST /api/design/combat-run-definition/upload)
 */
export const useImportCombatRunDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/design/combat-run-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.COMBAT_RUNS });
    },
  });
};

/**
 * Import Effect Definitions File (POST /api/design/effect-definition/upload)
 */
export const useImportEffectDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/design/effect-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.EFFECTS });
    },
  });
};

/**
 * Import Entity Definitions File (POST /api/design/entity-definition/upload)
 */
export const useImportEntityDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/design/entity-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ENTITIES });
    },
  });
};

/**
 * Import Item Definitions File (POST /api/design/item-definition/upload)
 */
export const useImportItemDefinitions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/design/item-definition/upload', createFileUploadFormData(file), {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.ITEMS });
    },
  });
};

/**
 * Import Room Definition File (POST /api/design/room-definition/upload)
 */
export const useImportRoomDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File): Promise<void> => {
      await apiClient.post('/design/room-definition/upload', createFileUploadFormData(file), {
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
 * Update Definition (POST /api/design/definition)
 */
export const useUpdateDesignDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: UpdateDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['design'] });
    },
  });
};

/**
 * Update Single Localization Entry (POST /api/design/localization-entry)
 */
export const useUpdateLocalizationEntry = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: LocalizationEntryDTO): Promise<void> => {
      await apiClient.post('/design/localization-entry', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: DESIGN_QUERY_KEYS.LOCALIZATION_ENTRIES,
      });
    },
  });
};

/**
 * Upsert Combat Run Definition (POST /api/design/combat-run-definition)
 */
export const useUpsertCombatRunDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: CombatRunDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/combat-run-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.COMBAT_RUNS });
    },
  });
};

/**
 * Upsert Effect Definition (POST /api/design/effect-definition)
 */
export const useUpsertEffectDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: EffectDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/effect-definition', dto);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.EFFECTS });
      queryClient.invalidateQueries({ queryKey: DESIGN_QUERY_KEYS.LOCALES });
    },
  });
};

/**
 * Upsert Entity Definition (POST /api/design/entity-definition)
 */
export const useUpsertEntityDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: EntityDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/entity-definition', dto);
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
 * Upsert Item Definition (POST /api/design/item-definition)
 */
export const useUpsertItemDefinition = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (dto: ItemDefinitionDTO): Promise<void> => {
      await apiClient.post('/design/item-definition', dto);
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
 * User Refresh / Get Snapshot (GET /api/design/{version})
 */
export const useDesignSnapshot = (version: string) => {
  return useQuery({
    queryKey: DESIGN_QUERY_KEYS.SNAPSHOT(version),
    queryFn: async (): Promise<DefinitionSnapshotDTO | null> => {
      const { data } = await apiClient.get<DefinitionSnapshotDTO | null>(`/design/${version}`);
      return data;
    },
    enabled: !!version,
  });
};