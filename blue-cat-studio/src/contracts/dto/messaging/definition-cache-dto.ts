/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EffectDefinitionDTO } from "../definition/meta-domain/effect-definition-dto";
import type { ItemDefinitionDTO } from "../definition/meta-domain/item-definition-dto";
import type { AIDefinitionDTO } from "../definition/entity-domain/component/ai-definition-dto";
import type { AppearanceDefinitionDTO } from "../definition/entity-domain/component/appearance-definition-dto";
import type { CollisionDefinitionDTO } from "../definition/entity-domain/component/collision-definition-dto";
import type { CharacteristicDefinitionDTO } from "../definition/entity-domain/component/characteristic-definition-dto";
import type { InventoryDefinitionDTO } from "../definition/entity-domain/component/inventory-definition-dto";
import type { LifetimeDefinitionDTO } from "../definition/entity-domain/component/lifetime-definition-dto";
import type { ProjectileDefinitionDTO } from "../definition/entity-domain/component/projectile-definition-dto";
import type { TriggeredEffectDefinitionDTO } from "../definition/entity-domain/component/triggered-effect-definition-dto";
import type { EntityDefinitionDTO } from "../definition/entity-domain/entity-definition-dto";
import type { RoomDefinitionDTO } from "../definition/world-domain/room-definition-dto";
import type { EntitySpawnRuleDTO } from "../definition/world-domain/entity-spawn-rule-dto";
import type { CellDTO } from "../definition/world-domain/cell-dto";
import type { LocaleDTO } from "../definition/localization-domain/locale-dto";

export interface DefinitionCacheDTO {
  version: number;
  effects: EffectDefinitionDTO[];
  items: ItemDefinitionDTO[];
  aIs: AIDefinitionDTO[];
  appearances: AppearanceDefinitionDTO[];
  collisions: CollisionDefinitionDTO[];
  characteristics: CharacteristicDefinitionDTO[];
  inventories: InventoryDefinitionDTO[];
  lifetimes: LifetimeDefinitionDTO[];
  projectiles: ProjectileDefinitionDTO[];
  triggeredEffects: TriggeredEffectDefinitionDTO[];
  entities: EntityDefinitionDTO[];
  rooms: RoomDefinitionDTO[];
  entitySpawnRules: EntitySpawnRuleDTO[];
  cells: CellDTO[];
  locales: LocaleDTO[];
}
