/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityDirection } from "../../../../enum/entity-domain/entity-direction";
import type { EntityAction } from "../../../../enum/entity-domain/entity-action";

export interface EntityActedDTO {
  entityInstanceID: string;
  x: number;
  y: number;
  direction: EntityDirection;
  action: EntityAction;
  usedItemDefinitionID: string;
}
