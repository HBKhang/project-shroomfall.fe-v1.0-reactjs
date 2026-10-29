/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { QuestProgressStatus } from "./quest-progress-status";
import type { IdentificationProgressDTO } from "./identification-progress-dto";

export interface QuestProgressEntryDTO {
  questInstanceId: string;
  startedAt: Date;
  status: QuestProgressStatus;
  identificationProgress?: IdentificationProgressDTO;
}
