/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ComponentInstanceDTO } from "../../../abstraction/component-instance-dto";
import type { AIState } from "../../../../enum/entity-domain/ai-state";

export interface AIInstanceDTO extends ComponentInstanceDTO {
  aIState: AIState;
  targetEntityId: string;
  isAIControlled: boolean;
  thinkCooldownRemaining: number;
  attackTimer: number;
  leashDistance: number;
  aggroRadius: number;
}
