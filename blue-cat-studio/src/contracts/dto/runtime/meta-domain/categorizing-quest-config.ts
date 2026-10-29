/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { LocaleQuestDTO } from "./locale-quest-dto";
import type { CategorizingCategoryConfigDTO } from "./categorizing-category-config-dto";
import type { CategorizingItemConfigDTO } from "./categorizing-item-config-dto";

export interface CategorizingQuestConfig {
  description: LocaleQuestDTO;
  categories: CategorizingCategoryConfigDTO[];
  items: CategorizingItemConfigDTO[];
}
