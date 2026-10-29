/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectDefinitionDTO } from "../../../definition/meta-domain/effect-definition-dto";
import type { ItemDefinitionDTO } from "../../../definition/meta-domain/item-definition-dto";
import type { EntityDefinitionDTO } from "../../../definition/entity-domain/entity-definition-dto";
import type { RoomDefinitionDTO } from "../../../definition/world-domain/room-definition-dto";
import type { LocaleDTO } from "../../../definition/localization-domain/locale-dto";

export interface DefinitionSnapshotDTO {
  version: number;
  effects: EffectDefinitionDTO[];
  items: ItemDefinitionDTO[];
  entities: EntityDefinitionDTO[];
  rooms: RoomDefinitionDTO[];
  locales: LocaleDTO[];
}
