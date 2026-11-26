/**
 * This is a TypeGen auto-generated file.
 * Any changes made to this file can be lost when this file is regenerated.
 */

import type { UserTransactionStatus } from "../../../enum/identity-domain/user-transaction-status";

export interface UserTransactionDTO {
  iD: number;
  orderCode: number;
  paymentLinkID?: string;
  status: UserTransactionStatus;
  userID: string;
  currencyBundleDefinitionID: string;
  amount: number;
  price: number;
  createdAt: Date;
}
