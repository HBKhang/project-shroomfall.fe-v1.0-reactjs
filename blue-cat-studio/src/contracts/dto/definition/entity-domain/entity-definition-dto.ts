/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityType } from "../../../enum/entity-domain/entity-type";
import type { ComponentDefinitionDTO } from "../../abstraction/component-definition-dto";
import type { EntityPresentationDefinitionDTO } from "./entity-presentation-definition-dto";

export interface EntityDefinitionDTO {
  id: string;
  type: EntityType;
  components: ComponentDefinitionDTO[];
  presentation?: EntityPresentationDefinitionDTO;
}
