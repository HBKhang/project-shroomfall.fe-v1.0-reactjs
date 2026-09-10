/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityType } from "../../../../enum/entity-domain/entity-type";

export interface EntityDefinitionQueryDTO {
  searchTerm?: string;
  entityType?: EntityType;
  pageNumber: number;
  pageSize: number;
}
