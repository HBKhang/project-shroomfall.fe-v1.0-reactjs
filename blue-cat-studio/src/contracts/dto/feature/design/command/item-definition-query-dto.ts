/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { ItemType } from "../../../../enum/meta-domain/item/item-type";
import type { ItemCategory } from "../../../../enum/meta-domain/item/item-category";

export interface ItemDefinitionQueryDTO {
  searchTerm?: string;
  type?: ItemType;
  category?: ItemCategory;
  pageNumber: number;
  pageSize: number;
}
