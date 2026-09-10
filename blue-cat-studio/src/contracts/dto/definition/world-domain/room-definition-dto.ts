/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { RoomType } from "../../../enum/world-domain/room-type";
import type { RoomPresentationDefinitionDTO } from "./room-presentation-definition-dto";

export interface RoomDefinitionDTO {
  id: string;
  type: RoomType;
  presentation: RoomPresentationDefinitionDTO;
}
