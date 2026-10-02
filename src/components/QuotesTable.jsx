import { formatDate } from '../utils/formatDate.js';

function QuotesTable({ quotes,onMakeCurrent ,changingQuoteId,isUpdating }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">
          All Quotes ({quotes.length})
        </h2>

        {quotes.length === 0 ? (
          <p className="text-muted mb-0">
            No quotes have been added yet.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">ID</th>
                  <th scope="col">Buyer</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Created At</th>
                  <th scope="col">Current</th>
                  <th scope="col">Actions</th>
                </tr>
              </thead>

              <tbody>
                {quotes.map((quote) => (
                  <tr
                    key={quote.id}
                    className={
                      quote.isCurrent ? 'table-success' : undefined
                    }
                  >
                    <th scope="row">{quote.id}</th>
                    <td>{quote.buyerName}</td>

                    <td>
                      {quote.amount.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </td>

                    <td>{formatDate(quote.createdAt)}</td>

                    <td>
                      {quote.isCurrent ? (
                        <span className="badge text-bg-success">
                          Current
                        </span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
                    </td>
                    <td>
  <button
  type="button"
  className="btn btn-outline-primary btn-sm"
  disabled={
  quote.isCurrent ||
  changingQuoteId !== null ||
  isUpdating
}
  onClick={() => onMakeCurrent(quote.id)}
>
  {changingQuoteId === quote.id ? 'Updating...' : 'Make Current'}
</button>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuotesTable;