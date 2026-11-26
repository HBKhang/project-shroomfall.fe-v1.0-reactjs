import React from 'react';

export type TransactionOutcome = 'success' | 'failed';

interface TransactionsResultProps {
  outcome: TransactionOutcome;
}

export const TransactionsResult: React.FC<TransactionsResultProps> = ({ outcome }) => {
  const isSuccess = outcome === 'success';

  const handleReturn = () => {
    if (window.history.length > 1) window.history.back();
  };

  const heading = isSuccess ? 'Payment successful' : 'Payment unsuccessful';
  const message = isSuccess
    ? 'Your payment was completed. You can return to the game now.'
    : 'Your payment was cancelled or could not be completed. You can return to the game and try again.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-sky-50 via-white to-indigo-50 px-4 py-10 font-sans text-slate-900">
      <section className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white px-6 py-10 text-center shadow-xl shadow-sky-950/5 sm:px-10">
        <div className="mb-5 flex justify-center gap-2 text-sm font-bold tracking-[0.18em] text-sky-800">
          <span className="material-symbols-outlined text-[22px]">pets</span>
          SHROOMFALL
        </div>

        <div className={`mx-auto flex h-20 w-20 items-center justify-center rounded-full ${isSuccess ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
          <span className="material-symbols-outlined text-5xl">
            {isSuccess ? 'check_circle' : 'cancel'}
          </span>
        </div>

        <span className={`mx-auto mt-6 inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
          {isSuccess ? 'Success' : 'Failed'}
        </span>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">{heading}</h1>
        <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600">{message}</p>

        <button
          type="button"
          onClick={handleReturn}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl bg-sky-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800"
        >
          Return to game <span className="material-symbols-outlined text-lg">arrow_forward</span>
        </button>
      </section>
    </main>
  );
};
