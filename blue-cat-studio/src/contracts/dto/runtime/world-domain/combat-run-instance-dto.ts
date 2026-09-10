/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { CombatRunStatus } from "../../../enum/world-domain/combat-run-status";

export interface CombatRunInstanceDTO {
  id: string;
  combatRunDefinitionID: string;
  currentLevel: number;
  currentRoomSpatialID: string;
  leaderEntityInstanceID: string;
  playerEntityInstanceIDs: string[];
  status: CombatRunStatus;
}
