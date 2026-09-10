/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { LocalizationEntryDTO } from "./localization-entry-dto";

export interface LocaleDTO {
  code: string;
  name: string;
  isDefault: boolean;
  isEnabled: boolean;
  localizationEntries: LocalizationEntryDTO[];
}
