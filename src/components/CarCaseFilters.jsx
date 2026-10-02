import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';

function CarCaseFilters({
  filters,
  onFilterChange,
  statuses,
  loadingStatuses,
  statusesError,
  onStatusToggle,
  onApply,
  loading,
 onClear,
  filterError,
})  {
  return (
    <form
      className="card mb-3"
     onSubmit={onApply}
      noValidate
    >
      <div className="card-body">
        <h2 className="h5 mb-3">Filter Car Cases</h2>
<ErrorMessage message={filterError} />
        <div className="row g-3">
          <div className="col-md-4">
            <label
              htmlFor="filter-date-from"
              className="form-label"
            >
              Date From
            </label>

            <input
              id="filter-date-from"
              type="datetime-local"
              className="form-control"
              value={filters.dateFrom}
              onChange={(event) =>
                onFilterChange('dateFrom', event.target.value)
              }
            />
          </div>

          <div className="col-md-4">
            <label
              htmlFor="filter-date-to"
              className="form-label"
            >
              Date To
            </label>

            <input
              id="filter-date-to"
              type="datetime-local"
              className="form-control"
              value={filters.dateTo}
              onChange={(event) =>
                onFilterChange('dateTo', event.target.value)
              }
            />
          </div>
          <fieldset
  className="mt-3"
  disabled={loadingStatuses || Boolean(statusesError)}
>
  <legend className="fs-6">Statuses</legend>

  <p className="text-muted small">
    Leave all unchecked to include all statuses.
  </p>

  {loadingStatuses && <Loading />}

  <ErrorMessage message={statusesError} />

  {!loadingStatuses &&
    !statusesError &&
    statuses.length === 0 && (
      <p className="text-muted mb-0">
        No statuses available.
      </p>
    )}

  <div className="d-flex flex-wrap gap-3">
    {statuses.map((status) => (
      <div className="form-check" key={status.id}>
        <input
          id={`filter-status-${status.id}`}
          type="checkbox"
          className="form-check-input"
          checked={filters.statusIds.includes(status.id)}
          onChange={(event) =>
            onStatusToggle(
              status.id,
              event.target.checked
            )
          }
        />

        <label
          className="form-check-label"
          htmlFor={`filter-status-${status.id}`}
        >
          {status.name}
        </label>
      </div>
    ))}
  </div>
</fieldset>

          <div className="col-md-4">
            <label
              htmlFor="filter-active"
              className="form-label"
            >
              Active
            </label>

            <select
              id="filter-active"
              className="form-select"
              value={filters.isActive}
              onChange={(event) =>
                onFilterChange('isActive', event.target.value)
              }
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
<div className="mt-3 d-flex gap-2 flex-wrap">
  <button
    type="submit"
    className="btn btn-primary"
    disabled={loading || loadingStatuses}
  >
    {loading ? 'Loading...' : 'Apply Filters'}
  </button>

  <button
    type="button"
    className="btn btn-outline-secondary"
    onClick={onClear}
    disabled={loading}
  >
    Clear Filters
  </button>
</div>
        </div>
      </div>
    </form>
  );
}

export default CarCaseFilters;