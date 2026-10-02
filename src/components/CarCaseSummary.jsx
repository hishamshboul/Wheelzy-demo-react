import { formatDate } from '../utils/formatDate.js';

function CarCaseSummary({ carCase }) {
  return (
    <div className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">Vehicle Summary</h2>

        <dl className="row mb-0">
          <dt className="col-sm-4">Case ID</dt>
          <dd className="col-sm-8">{carCase.id}</dd>

          <dt className="col-sm-4">Year</dt>
          <dd className="col-sm-8">{carCase.year}</dd>

          <dt className="col-sm-4">Make</dt>
          <dd className="col-sm-8">{carCase.make}</dd>

          <dt className="col-sm-4">Model</dt>
          <dd className="col-sm-8">{carCase.model}</dd>

          <dt className="col-sm-4">Submodel</dt>
          <dd className="col-sm-8">{carCase.subModel}</dd>

          <dt className="col-sm-4">ZIP Code</dt>
          <dd className="col-sm-8">{carCase.zipCode}</dd>

          <dt className="col-sm-4">Active</dt>
          <dd className="col-sm-8">
            {carCase.isActive ? 'Yes' : 'No'}
          </dd>

          <dt className="col-sm-4">Created At</dt>
          <dd className="col-sm-8">
            {formatDate(carCase.createdAt)}
          </dd>
        </dl>
      </div>
    </div>
  );
}

export default CarCaseSummary;