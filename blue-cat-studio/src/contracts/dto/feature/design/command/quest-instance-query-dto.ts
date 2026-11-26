/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { QuestType } from "../../../runtime/meta-domain/quest-type";

export interface QuestInstanceQueryDTO {
  searchTerm?: string;
  type?: QuestType;
  pageNumber: number;
  pageSize: number;
}
