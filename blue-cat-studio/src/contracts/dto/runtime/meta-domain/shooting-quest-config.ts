/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { LocaleQuestDTO } from "./locale-quest-dto";
import type { ShootingMushroomConfigDTO } from "./shooting-mushroom-config-dto";
import type { ShootingQuestionConfigDTO } from "./shooting-question-config-dto";

export interface ShootingQuestConfig {
  description: LocaleQuestDTO;
  mushrooms: ShootingMushroomConfigDTO[];
  questions: ShootingQuestionConfigDTO[];
}
