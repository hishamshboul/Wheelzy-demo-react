import { formatDate } from '../utils/formatDate.js';

function CurrentStatusCard({ status }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">Current Status</h2>

        {status ? (
          <dl className="row mb-0">
            <dt className="col-sm-4">Status</dt>
            <dd className="col-sm-8">
              {status.statusName}
            </dd>

            <dt className="col-sm-4">Status Date</dt>
            <dd className="col-sm-8">
              {formatDate(status.statusDate)}
            </dd>

            <dt className="col-sm-4">Changed At</dt>
            <dd className="col-sm-8">
              {formatDate(status.changedAt)}
            </dd>

            <dt className="col-sm-4">Changed By</dt>
            <dd className="col-sm-8">
              {status.changedBy}
            </dd>
          </dl>
        ) : (
          <p className="text-muted mb-0">
            No status has been recorded.
          </p>
        )}
      </div>
    </div>
  );
}

export default CurrentStatusCard;