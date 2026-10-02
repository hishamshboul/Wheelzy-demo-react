import CarCaseFilters from '../components/CarCaseFilters.jsx';
import { getStatuses } from '../api/lookupsApi.js';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { getCarCases } from '../api/carCasesApi.js';
import ErrorMessage from '../components/ErrorMessage.jsx';
import Loading from '../components/Loading.jsx';
import CarCaseTable from '../components/CarCaseTable.jsx';
import {
  buildCarCaseFilterParams,
} from '../utils/buildCarCaseFilterParams.js';
function CarCasesPage() {
  const [carCases, setCarCases] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState('');
const [draftFilters, setDraftFilters] = useState({
  dateFrom: '',
  dateTo: '',
  statusIds: [],
  isActive: '',
});
const [statuses, setStatuses] = useState([]);
const [loadingStatuses, setLoadingStatuses] = useState(true);
const [statusesError, setStatusesError] = useState('');
const [appliedFilters, setAppliedFilters] = useState({});
const [filterError, setFilterError] = useState('');
const latestRequestId = useRef(0);
function handleFilterChange(name, value) {
  setDraftFilters((previous) => ({
    ...previous,
    [name]: value,
  }));
}
function handleStatusToggle(statusId, checked) {
  setDraftFilters((previous) => {
    if (checked && previous.statusIds.includes(statusId)) {
      return previous;
    }

    return {
      ...previous,
      statusIds: checked
        ? [...previous.statusIds, statusId]
        : previous.statusIds.filter((id) => id !== statusId),
    };
  });
}
// async function loadCarCases(filters = {}) {
//   setLoading(true);
//   setError('');

//   try {
//     const data = await getCarCases(filters);

//     setCarCases(data);
//     setAppliedFilters(filters);
//   } catch (caughtError) {
//     console.error('Loading car cases failed:', caughtError);

//     setError(
//       'Could not load car cases. Please try again.'
//     );
//   } finally {
//     setLoading(false);
//   }
// }
async function handleApplyFilters(event) {
  event.preventDefault();

  if (loading || loadingStatuses) {
    return;
  }

  setFilterError('');

  let params;

  try {
    params = buildCarCaseFilterParams(draftFilters);
  } catch (err) {
    setFilterError(err.message);
    return;
  }

  await loadCarCases(params);
}
async function handleClearFilters() {
  if (loading) {
    return;
  }

  setDraftFilters({
    dateFrom: '',
    dateTo: '',
    statusIds: [],
    isActive: '',
  });

  setFilterError('');

  await loadCarCases({});
}
const loadCarCases = useCallback(async (filters = {}) => {
  const requestId = ++latestRequestId.current;

  setLoading(true);
  setError('');

  try {
    const data = await getCarCases(filters);

    if (requestId !== latestRequestId.current) {
      return;
    }

    setCarCases(data);
    setAppliedFilters(filters);
  } catch (caughtError) {
    if (requestId !== latestRequestId.current) {
      return;
    }

    console.error('Loading car cases failed:', caughtError);
    setError('Could not load car cases. Please try again.');
  } finally {
    if (requestId === latestRequestId.current) {
      setLoading(false);
    }
  }
}, []);
useEffect(() => {
  let ignore = false;

  async function loadStatuses() {
    try {
      const data = await getStatuses();

      if (!ignore) {
        setStatuses(data);
      }
    } catch (err) {
      if (!ignore) {
        console.error('Loading statuses failed:', err);
        setStatusesError(
          'Unable to load statuses. Refresh the page.'
        );
      }
    } finally {
      if (!ignore) {
        setLoadingStatuses(false);
      }
    }
  }

  loadStatuses();

  return () => {
    ignore = true;
  };
}, []);
useEffect(() => {
  loadCarCases();

  return () => {
    latestRequestId.current += 1;
  };
}, [loadCarCases]);
  return (
    <section>
<CarCaseFilters
  filters={draftFilters}
  onFilterChange={handleFilterChange}
  statuses={statuses}
  loadingStatuses={loadingStatuses}
  statusesError={statusesError}
  onStatusToggle={handleStatusToggle}
  onApply={handleApplyFilters}
  loading={loading}
  onClear={handleClearFilters}
  filterError={filterError}
/>
     <div className="mb-3">
  <button
    type="button"
    className="btn btn-primary"
  onClick={() => loadCarCases(appliedFilters)}
    disabled={loading}
  >
    {loading ? 'Loading...' : 'Refresh'}
  </button>
</div>

{loading && <Loading />}

{!loading && <ErrorMessage message={error} />}

{!loading && !error && carCases.length === 0 && (
  <div className="alert alert-info" role="status">
    No car cases found.
  </div>
)}

{!loading && !error && carCases.length > 0 && (
  <CarCaseTable carCases={carCases}  />
)}
    </section>
  );
}

export default CarCasesPage;