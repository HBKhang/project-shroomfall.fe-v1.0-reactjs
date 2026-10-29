/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { QuestType } from "./quest-type";
import type { QuestRewardConfig } from "./quest-reward-config";
import type { IdentificationQuestConfig } from "./identification-quest-config";
import type { CategorizingQuestConfig } from "./categorizing-quest-config";
import type { ShootingQuestConfig } from "./shooting-quest-config";

export interface QuestInstanceDTO {
  id?: string;
  type: QuestType;
  createdAt: Date;
  expiredAt: Date;
  questRewardConfig: QuestRewardConfig;
  identificationConfig?: IdentificationQuestConfig;
  categorizingConfig?: CategorizingQuestConfig;
  shootingConfig?: ShootingQuestConfig;
}
