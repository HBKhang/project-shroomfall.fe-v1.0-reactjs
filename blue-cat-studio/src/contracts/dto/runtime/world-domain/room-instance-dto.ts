/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { RoomSpatialDTO } from "./room-spatial-dto";
import type { EntityInstanceDTO } from "../entity-domain/entity-instance-dto";

export interface RoomInstanceDTO {
  room: RoomSpatialDTO;
  entities: EntityInstanceDTO[];
}
