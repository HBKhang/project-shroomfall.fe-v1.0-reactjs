/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { CurrencyBundleType } from "../../../enum/meta-domain/currency/currency-bundle-type";

export interface CurrencyBundleDefinitionDTO {
  id: string;
  amount: number;
  price: number;
  type: CurrencyBundleType;
  createdAt: Date;
  expiredAt: Date;
}
