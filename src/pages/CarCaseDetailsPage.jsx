import { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { getCarCaseDetails } from '../api/carCasesApi.js';
import {
    getQuotes,
    setQuoteAsCurrent,
} from '../api/quotesApi.js';
import { getStatusHistory } from '../api/statusesApi.js';

import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import SuccessMessage from '../components/SuccessMessage.jsx';
import CarCaseSummary from '../components/CarCaseSummary.jsx';
import CurrentQuoteCard from '../components/CurrentQuoteCard.jsx';
import QuotesTable from '../components/QuotesTable.jsx';
import CurrentStatusCard from '../components/CurrentStatusCard.jsx';
import StatusHistory from '../components/StatusHistory.jsx';
import UpdateStatusForm from '../components/UpdateStatusForm.jsx';
async function fetchCaseData(caseId) {
    const [caseData, quotesData, historyData] = await Promise.all([
        getCarCaseDetails(caseId),
        getQuotes(caseId),
        getStatusHistory(caseId),
    ]);

    return {
        carCase: caseData,
        quotes: quotesData,
        statusHistory: historyData,
    };
}
function CarCaseDetailsPage() {
    const { id } = useParams();
    const pageSessionRef = useRef(null);
    const [carCase, setCarCase] = useState(null);
    const [quotes, setQuotes] = useState([]);
    const [statusHistory, setStatusHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [changingQuoteId, setChangingQuoteId] = useState(null);
    const [quoteError, setQuoteError] = useState('');

    useEffect(() => {
        const session = {
            caseId: id,
            active: true,
            updating: false,
        };

        pageSessionRef.current = session;

        async function loadDetails() {
            setLoading(true);
            setError('');
            setSuccess('');
            setQuoteError('');
            setChangingQuoteId(null);
            setIsUpdating(false);
            setCarCase(null);
            setQuotes([]);
            setStatusHistory([]);

            try {
                const data = await fetchCaseData(id);

                if (session.active) {
                    setCarCase(data.carCase);
                    setQuotes(data.quotes);
                    setStatusHistory(data.statusHistory);
                }
            } catch (err) {
                if (session.active) {
                    console.error('Failed to load car case details:', err);

                    if (err.response?.status === 404) {
                        setError('Car case not found.');
                    } else if (!err.response && err.request) {
                        setError(
                            'Could not receive a response from the API. Please try again.'
                        );
                    } else {
                        setError(
                            'Unable to load car case details. Please try again later.'
                        );
                    }
                }
            } finally {
                if (session.active) {
                    setLoading(false);
                }
            }
        }

        loadDetails();

        return () => {
            session.active = false;
        };
    }, [id]);
    function beginUpdate() {
        const session = pageSessionRef.current;

        if (
            !session?.active ||
            session.caseId !== id ||
            session.updating ||
            !carCase ||
            carCase.id !== Number(id)
        ) {
            return null;
        }

        session.updating = true;
        setIsUpdating(true);

        return function finishUpdate() {
            session.updating = false;

            if (
                session.active &&
                pageSessionRef.current === session
            ) {
                setIsUpdating(false);
            }
        };
    }
    async function handleSetCurrentQuote(quoteId) {

        const session = pageSessionRef.current;
        const finishUpdate = beginUpdate();

        if (!finishUpdate) {
            return;
        }

        setChangingQuoteId(quoteId);
        setQuoteError('');
        setSuccess('');

        let updateSucceeded = false;

        try {
            await setQuoteAsCurrent(id, quoteId);

            updateSucceeded = true;

            if (!session.active) {
                return;
            }

            const data = await fetchCaseData(id);

            if (!session.active) {
                return;
            }

            setCarCase(data.carCase);
            setQuotes(data.quotes);
            setStatusHistory(data.statusHistory);
            setSuccess('Current quote updated successfully.');
        } catch (err) {
            if (!session.active) {
                return;
            }
            if (updateSucceeded) {
                setQuoteError(
                    'The quote was saved, but the updated data could not be loaded. Refresh the page to see the latest data.'
                );
            } else if (err.response?.status === 404) {
                setQuoteError(
                    'The car case or quote was not found. Refresh the page.'
                );
            } else if (err.response?.status === 409) {
                setQuoteError(
                    'The server reported a conflict. Refresh the page before trying again.'
                );
            } else if (!err.response && err.request) {
                setQuoteError(
                    'No response was received. The update may have been saved. Refresh the page to verify before trying again.'
                );
            } else {
                setQuoteError(
                    'Could not confirm the quote update. Refresh the page to verify before trying again.'
                );
            }
        } finally {
            finishUpdate();

            if (session.active) {
                setChangingQuoteId(null);
            }
        }
    }

    async function handleStatusUpdated() {
        const session = pageSessionRef.current;

        if (
            !session?.active ||
            session.caseId !== id ||
            !carCase ||
            carCase.id !== Number(id)
        ) {
            return false;
        }

        const data = await fetchCaseData(id);

        if (!session.active) {
            return false;
        }

        setCarCase(data.carCase);
        setQuotes(data.quotes);
        setStatusHistory(data.statusHistory);

        return true;
    }
    let content;

    if (loading) {
        content = <Loading />;
    } else if (error) {
        content = <ErrorMessage message={error} />;
    } else if (!carCase) {
        content = (
            <ErrorMessage message="No car case data was returned." />
        );
    } else {
        content = (
            <div>

                <CarCaseSummary carCase={carCase} />

                <CurrentQuoteCard quote={carCase.currentQuote} />

                <ErrorMessage message={quoteError} />

                <QuotesTable
                    quotes={quotes}
                    onMakeCurrent={handleSetCurrentQuote}
                    changingQuoteId={changingQuoteId}
                    isUpdating={isUpdating}
                />
                <SuccessMessage message={success} />

                <CurrentStatusCard status={carCase.currentStatus} />
                <UpdateStatusForm
                    key={carCase.id}
                    caseId={carCase.id}
                    onStatusUpdated={handleStatusUpdated}
                    onBeginUpdate={beginUpdate}
                    isUpdating={isUpdating}
                />
                <StatusHistory history={statusHistory} />
            </div>
        );
    }
    return (
        <section>
            <h1 className="mb-3">
                {!loading && !error && carCase
                    ? `${carCase.year} ${carCase.make} ${carCase.model} — Case #${carCase.id}`
                    : 'Car Case Details'}
            </h1>

            <Link
                to="/car-cases"
                className="btn btn-outline-secondary mb-3"
            >
                Back to cases
            </Link>

            {content}
        </section>
    );

}
export default CarCaseDetailsPage;