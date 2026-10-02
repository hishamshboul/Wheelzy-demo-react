export function buildCarCaseFilterParams(draftFilters) {
  const dateFrom = draftFilters.dateFrom
    ? new Date(draftFilters.dateFrom)
    : null;

  const dateTo = draftFilters.dateTo
    ? new Date(draftFilters.dateTo)
    : null;

  if (dateFrom && Number.isNaN(dateFrom.getTime())) {
    throw new Error('Enter a valid Date From.');
  }

  if (dateTo && Number.isNaN(dateTo.getTime())) {
    throw new Error('Enter a valid Date To.');
  }

  if (dateFrom && dateTo && dateFrom > dateTo) {
    throw new Error(
      'Date From cannot be later than Date To.'
    );
  }

  const params = {};

  if (dateFrom) {
    params.dateFrom = dateFrom.toISOString();
  }

  if (dateTo) {
    params.dateTo = dateTo.toISOString();
  }

  if (draftFilters.statusIds.length > 0) {
    params.statusIds = [...draftFilters.statusIds];
  }

  if (draftFilters.isActive !== '') {
    if (
      draftFilters.isActive !== 'true' &&
      draftFilters.isActive !== 'false'
    ) {
      throw new Error('Choose a valid Active filter.');
    }

    params.isActive = draftFilters.isActive === 'true';
  }

  return params;
}