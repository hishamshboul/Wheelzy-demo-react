import { formatDate } from '../utils/formatDate.js';

function CurrentQuoteCard({ quote }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">Current Quote</h2>

        {quote ? (
          <dl className="row mb-0">
            <dt className="col-sm-4">Quote ID</dt>
            <dd className="col-sm-8">{quote.quoteId}</dd>

            <dt className="col-sm-4">Buyer</dt>
            <dd className="col-sm-8">{quote.buyerName}</dd>

            <dt className="col-sm-4">Amount</dt>
            <dd className="col-sm-8">
              {quote.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </dd>

            <dt className="col-sm-4">Created At</dt>
            <dd className="col-sm-8">
              {formatDate(quote.createdAt)}
            </dd>
          </dl>
        ) : (
          <p className="text-muted mb-0">
            No current quote has been selected.
          </p>
        )}
      </div>
    </div>
  );
}

export default CurrentQuoteCard;