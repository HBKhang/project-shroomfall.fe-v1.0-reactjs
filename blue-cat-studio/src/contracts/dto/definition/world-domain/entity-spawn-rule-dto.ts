/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { SpawnRuleType } from "../../../enum/world-domain/spawn-rule-type";

export interface EntitySpawnRuleDTO {
  iD: string;
  type: SpawnRuleType;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  minCount: number;
  maxCount: number;
  roomDefinitionID: string;
  entityDefinitionID: string;
}
