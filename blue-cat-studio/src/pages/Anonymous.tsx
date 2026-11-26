import React from 'react';
import { TransactionsResult, type TransactionOutcome } from '../components/player-components/transactions-result/TransactionsResult';

interface AnonymousProps {
  transactionOutcome: TransactionOutcome;
}

/** Public PayOS return page. It is intentionally available without a signed-in session. */
export const Anonymous: React.FC<AnonymousProps> = ({ transactionOutcome }) => (
  <TransactionsResult outcome={transactionOutcome} />
);
