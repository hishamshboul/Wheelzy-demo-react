import { useEffect, useRef, useState } from 'react';
import { getStatuses } from '../api/lookupsApi.js';
import Loading from './Loading.jsx';
import ErrorMessage from './ErrorMessage.jsx';
import { updateCarCaseStatus } from '../api/statusesApi.js';
import SuccessMessage from './SuccessMessage.jsx';
function UpdateStatusForm({
  caseId,
  onStatusUpdated,
  onBeginUpdate,
  isUpdating,
}) {
    const [statuses, setStatuses] = useState([]);
    const [statusId, setStatusId] = useState('');
    const [changedBy, setChangedBy] = useState('');

    const [loadingStatuses, setLoadingStatuses] = useState(true);
    const [statusesError, setStatusesError] = useState('');

    const [statusDate, setStatusDate] = useState('');
    const selectedStatus = statuses.find(
        (status) => status.id === Number(statusId)
    );
    const [submitting, setSubmitting] = useState(false);
    const [statusSuccess, setStatusSuccess] = useState('');
    const formSessionRef = useRef(null);

    const isPickedUp = selectedStatus?.name === 'Picked Up';

    const [formError, setFormError] = useState('');
    useEffect(() => {
        const session = {
            active: true,
            submitting: false,
        };

        formSessionRef.current = session;

        return () => {
            session.active = false;
        };
    }, []);
    useEffect(() => {
        let ignore = false;

        async function loadStatuses() {
            try {
                const data = await getStatuses();

                if (!ignore) {
                    setStatuses(data);

                    if (data.length === 0) {
                        setStatusesError('No statuses available.');
                    }
                }
            } catch (err) {
                if (!ignore) {
                    console.error('Failed to load statuses:', err);
                    setStatusesError('Unable to load statuses. Refresh the page.');
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
    function handelClearForm() {
          setFormError('');
        setStatusSuccess('');
         setStatusId('');
            setStatusDate('');
            setChangedBy('');
    }
    async function handleSubmit(event) {
        event.preventDefault();
        const session = formSessionRef.current;

        if (
            !session?.active ||
            session.submitting ||
            isUpdating ||
            loadingStatuses ||
            statusesError
        ) {
            return;
        }

        setFormError('');
        setStatusSuccess('');

        if (loadingStatuses || statusesError) {
            return;
        }

        if (!selectedStatus) {
            setFormError('Please select a status.');
            return;
        }

        const trimmedChangedBy = changedBy.trim();

        if (!trimmedChangedBy || trimmedChangedBy.length > 200) {
            setFormError('Enter a name between 1 and 200 characters.');
            return;
        }

        let statusDateUtc = null;

        if (isPickedUp) {
            if (!statusDate) {
                setFormError('Pickup date and time are required.');
                return;
            }

            const parsedDate = new Date(statusDate);

            if (Number.isNaN(parsedDate.getTime())) {
                setFormError('Enter a valid pickup date and time.');
                return;
            }

            statusDateUtc = parsedDate.toISOString();
        }

        const request = {
            statusId: selectedStatus.id,
            statusDate: statusDateUtc,
            changedBy: trimmedChangedBy,
        };
        const finishUpdate = onBeginUpdate();

        if (!finishUpdate) {
            return;
        }
        session.submitting = true;
        setSubmitting(true);

        let statusSaved = false;

        try {
            await updateCarCaseStatus(caseId, request);
            statusSaved = true;

            if (!session.active) {
                return;
            }

            const refreshed = await onStatusUpdated();

            if (!session.active) {
                return;
            }

            if (!refreshed) {
                setFormError(
                    'The status was saved. Refresh the page to see the latest data.'
                );
                return;
            }

            setStatusId('');
            setStatusDate('');
            setStatusSuccess('Status updated successfully.');
        } catch (err) {
            if (!session.active) {
                return;
            }

            console.error('Status update failed:', err);

            if (statusSaved) {
                setFormError(
                    'The status was saved, but the updated data could not be loaded. Refresh the page.'
                );
            } else if (err.response?.status === 400) {
                const messages = Object.values(
                    err.response.data?.errors ?? {}
                )
                    .flat()
                    .join(' ');

                setFormError(
                    messages || 'Check the entered values and try again.'
                );
            } else if (err.response?.status === 404) {
                setFormError(
                    'The car case or selected status was not found. Refresh the page.'
                );
            } else if (!err.response && err.request) {
                setFormError(
                    'No response was received. The status may have been saved. Refresh the page before trying again.'
                );
            } else {
                setFormError(
                    'Could not confirm the status update. Refresh the page before trying again.'
                );
            }

        } finally {
            session.submitting = false;
            finishUpdate();

            if (session.active) {
                setSubmitting(false);
            }
        }
    }

    return (
        <section className="card mb-3">
            <div className="card-body">
                <h2 className="h5 card-title">Update Status</h2>

                <p className="text-muted">
                    Update status for case #{caseId}.
                </p>

                <form onSubmit={handleSubmit} noValidate>
                    <fieldset disabled={submitting || isUpdating}>
                        {loadingStatuses && <Loading />}

                        <ErrorMessage message={statusesError} />
                        <ErrorMessage message={formError} />
                        <SuccessMessage message={statusSuccess} />
                        <div className="mb-3">
                            <label
                                htmlFor={`status-${caseId}`}
                                className="form-label"
                            >
                                Status
                            </label>

                            <select
                                id={`status-${caseId}`}
                                className="form-select"
                                value={statusId}
                                onChange={(event) => {
                                    setStatusId(event.target.value);
                                    setStatusDate('');
                                }}
                                disabled={loadingStatuses || Boolean(statusesError)}
                            >
                                <option value="">Select a status</option>

                                {statuses.map((status) => (
                                    <option key={status.id} value={status.id}>
                                        {status.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {isPickedUp && (
                            <div className="mb-3">
                                <label
                                    htmlFor={`status-date-${caseId}`}
                                    className="form-label"
                                >
                                    Pickup Date and Time
                                </label>

                                <input
                                    id={`status-date-${caseId}`}
                                    type="datetime-local"
                                    className="form-control"
                                    value={statusDate}
                                    onChange={(event) => setStatusDate(event.target.value)}
                                    required
                                />
                            </div>
                        )}

                        <div className="mb-3">
                            <label
                                htmlFor={`changed-by-${caseId}`}
                                className="form-label"
                            >
                                Changed By
                            </label>

                            <input
                                id={`changed-by-${caseId}`}
                                type="text"
                                className="form-control"
                                value={changedBy}
                                onChange={(event) => setChangedBy(event.target.value)}
                                maxLength={200}
                            />
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={
                                isUpdating ||
                                submitting ||
                                loadingStatuses ||
                                Boolean(statusesError)
                            }
                        >
                            {submitting ? 'Saving...' : 'Update Status'}
                        </button>
                          <button
                            type="button"
                            className="btn btn-socendary mx-3"
                            disabled={
                                isUpdating ||
                                submitting                                 
                            }
                            onClick={handelClearForm}
                        >
                            Clear form
                        </button>
                    </fieldset>
                </form>
            </div>
        </section>
    );
}

export default UpdateStatusForm;