import { formatDate } from '../utils/formatDate.js';

function StatusHistory({ history }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">
          Status History ({history.length})
        </h2>

        {history.length === 0 ? (
          <p className="text-muted mb-0">
            No status history has been recorded.
          </p>
        ) : (
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead>
                <tr>
                  <th scope="col">Status</th>
                  <th scope="col">Status Date</th>
                  <th scope="col">Changed At</th>
                  <th scope="col">Changed By</th>
                  <th scope="col">Current</th>
                </tr>
              </thead>

              <tbody>
                {history.map((entry) => (
                  <tr
                    key={entry.id}
                    className={
                      entry.isCurrent ? 'table-primary' : undefined
                    }
                  >
                    <td>{entry.statusName}</td>
                    <td>{formatDate(entry.statusDate)}</td>
                    <td>{formatDate(entry.changedAt)}</td>
                    <td>{entry.changedBy}</td>

                    <td>
                      {entry.isCurrent ? (
                        <span className="badge text-bg-primary">
                          Current
                        </span>
                      ) : (
                        <span className="text-muted">No</span>
                      )}
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

export default StatusHistory;