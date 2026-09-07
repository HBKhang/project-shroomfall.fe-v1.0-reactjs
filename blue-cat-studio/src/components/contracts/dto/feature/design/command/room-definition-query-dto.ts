/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { RoomType } from "../../../../enum/world-domain/room-type";

export interface RoomDefinitionQueryDTO {
  searchTerm?: string;
  type?: RoomType;
  pageNumber: number;
  pageSize: number;
}
