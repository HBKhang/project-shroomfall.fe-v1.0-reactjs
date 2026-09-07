/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { EntityInstanceDTO } from "../../../runtime/entity-domain/entity-instance-dto";
import type { RoomInstanceDTO } from "../../../runtime/world-domain/room-instance-dto";

export interface SaveGameDTO {
  playerData: EntityInstanceDTO;
  roomData: RoomInstanceDTO;
}
