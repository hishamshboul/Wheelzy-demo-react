import { useEffect, useState } from 'react';
import {
  getMakes,
  getZipCodes,
  getModelsByMake,
  getSubModelsByModel
} from '../api/lookupsApi.js';
import Loading from '../components/Loading.jsx';
import ErrorMessage from '../components/ErrorMessage.jsx';
import { useNavigate } from 'react-router-dom';
import { createCarCase } from '../api/carCasesApi.js';

function CreateCarCasePage() {
const [year, setYear] = useState('');
const [makes, setMakes] = useState([]);
const [zipCodes, setZipCodes] = useState([]);

const [makeId, setMakeId] = useState('');
const [zipCodeId, setZipCodeId] = useState('');

const [models, setModels] = useState([]);
const [modelId, setModelId] = useState('');
const [loadingModels, setLoadingModels] = useState(false);
const [modelError, setModelError] = useState('');

const [loadingLookups, setLoadingLookups] = useState(true);
const [lookupError, setLookupError] = useState('');

const [subModels, setSubModels] = useState([]);
const [subModelId, setSubModelId] = useState('');
const [loadingSubModels, setLoadingSubModels] = useState(false);
const [subModelError, setSubModelError] = useState('');

const [formError, setFormError] = useState('');
const navigate = useNavigate();
const [submitting, setSubmitting] = useState(false);
function handleMakeChange(event) {
  const selectedMakeId = event.target.value;

  setMakeId(selectedMakeId);

  setModelId('');
  setModels([]);
  setModelError('');
  setLoadingModels(selectedMakeId !== '');

  setSubModelId('');
  setSubModels([]);
  setSubModelError('');
  setLoadingSubModels(false);
}
function handleModelChange(event) {
  const selectedModelId = event.target.value;

  setModelId(selectedModelId);
  setSubModelId('');
  setSubModels([]);
  setSubModelError('');
  setLoadingSubModels(selectedModelId !== '');
}

async function handleSubmit(event) {
  event.preventDefault();
if (submitting) {
  return;
}
  setFormError('');

  if (loadingLookups || loadingModels || loadingSubModels) {
    setFormError('Please wait for the options to finish loading.');
    return;
  }

  if (lookupError || modelError || subModelError) {
    setFormError(
      'Some options could not be loaded. Please refresh the page.'
    );
    return;
  }

  if (!year || !makeId || !modelId || !subModelId || !zipCodeId) {
    setFormError('Please complete all fields.');
    return;
  }

  const request = {
    year: Number(year),
    subModelId: Number(subModelId),
    zipCodeId: Number(zipCodeId),
  };

  const maximumYear = new Date().getUTCFullYear() + 1;

  if (
    !Number.isInteger(request.year) ||
    request.year < 1900 ||
    request.year > maximumYear
  ) {
    setFormError(
      `Year must be a whole number between 1900 and ${maximumYear}.`
    );
    return;
  }

  if (
    !Number.isInteger(request.subModelId) ||
    request.subModelId <= 0 ||
    !Number.isInteger(request.zipCodeId) ||
    request.zipCodeId <= 0
  ) {
    setFormError('Please select a valid submodel and ZIP code.');
    return;
  }

  setSubmitting(true);

try {
  const createdCase = await createCarCase(request);

  navigate(`/car-cases/${createdCase.id}`);
} catch (caughtError) {
  console.error('Creating car case failed:', caughtError);

  const response = caughtError.response;

  if (response?.status === 400) {
    const errors = response.data?.errors;

    const message = errors
      ? Object.values(errors).flat().join(' ')
      : '';

    setFormError(
      message || 'Please check the entered values and try again.'
    );
  } else if (!response && caughtError.request) {
    setFormError(
      'Could not confirm the save result. Check your connection and the car cases list before retrying.'
    );
  } else {
    setFormError('Could not complete the request. Please try again later.');
  }
} finally {
  setSubmitting(false);
}
}
function handelCancel() {
    navigate('/car-cases');
}
useEffect(() => {
  let ignore = false;

  async function loadLookups() {
    setLoadingLookups(true);
    setLookupError('');

    try {
      const makesData = await getMakes();

      if (ignore) {
        return;
      }

      const zipCodesData = await getZipCodes();

      if (!ignore) {
        setMakes(makesData);
        setZipCodes(zipCodesData);
      }
    } catch (caughtError) {
      if (!ignore) {
        console.error('Loading lookups failed:', caughtError);
        setLookupError('Could not load form options. Please try again.');
      }
    } finally {
      if (!ignore) {
        setLoadingLookups(false);
      }
    }
  }

  loadLookups();

  return () => {
    ignore = true;
  };
}, []);
useEffect(() => {
  if (!makeId) {
    return;
  }

  let ignore = false;

  async function loadModels() {
    setLoadingModels(true);
    setModelError('');

    try {
      const data = await getModelsByMake(makeId);

      if (!ignore) {
        setModels(data);
      }
    } catch (caughtError) {
      if (!ignore) {
        console.error('Loading models failed:', caughtError);
        setModelError('Could not load models. Please try again.');
      }
    } finally {
      if (!ignore) {
        setLoadingModels(false);
      }
    }
  }

  loadModels();

  return () => {
    ignore = true;
  };
}, [makeId]);

useEffect(()=>{
    if(!modelId){
        return;
    }
    let ignore=false;
    async function loadSubModel() {
        setLoadingSubModels(true);
        setSubModelError('');
        try {
            const data=await getSubModelsByModel(modelId);
            if(!ignore){
                setSubModels(data);
            }
        } catch (error) {
            if(!ignore){
              console.error('Loading submodels failed:', error);
setSubModelError('Could not load submodels. Please try again.');
            }
        } finally{
              if(!ignore){
           setLoadingSubModels(false);
              }
              
        }
 
    }
           loadSubModel();
          return () => {
    ignore = true;
  };
},[modelId]);


  return (
<form onSubmit={handleSubmit} noValidate>
    <fieldset disabled={submitting}>
      <h1 className="mb-3">Create Car Case</h1>

      <p className="text-muted">
        Create a new car selling case.
      </p>

      <div className="mb-3">
        <label htmlFor="year" className="form-label">
          Year
        </label>

        <input
          id="year"
          type="number"
          className="form-control"
          value={year}
          onChange={(event) => setYear(event.target.value)}
        />
      </div>
{loadingLookups && <Loading />}

<ErrorMessage message={lookupError} />

{!loadingLookups && !lookupError && (
  <div>
    <div className="mb-3">
      <label htmlFor="makeId" className="form-label">
        Make
      </label>

      <select
        id="makeId"
        className="form-select"
        value={makeId}
        onChange={handleMakeChange}
        disabled={makes.length === 0}
      >
        <option value="">
          {makes.length === 0 ? 'No makes available' : 'Select make'}
        </option>

        {makes.map((make) => (
          <option key={make.id} value={make.id}>
            {make.name}
          </option>
        ))}
      </select>
    </div>
    
<div className="mb-3">
  <label htmlFor="modelId" className="form-label">
    Model
  </label>

  <select
    id="modelId"
    className="form-select"
    value={modelId}
    onChange={handleModelChange}
    disabled={!makeId || loadingModels || models.length === 0}
  >
    <option value="">
      {!makeId ? 'Select make first' : 'Select model'}
    </option>

    {models.map((model) => (
      <option key={model.id} value={model.id}>
        {model.name}
      </option>
    ))}
  </select>

  {loadingModels && <Loading />}

  <ErrorMessage message={modelError} />

  {makeId && !loadingModels && !modelError && models.length === 0 && (
    <p className="text-muted mt-2">
      No models available for this make.
    </p>
  )}

  <p className="text-muted mt-2">
    Model ID: {modelId || 'None'}
  </p>
</div>
<div className="mb-3">
  <label htmlFor="subModelId" className="form-label">
    SubModel
  </label>

  <select
    id="subModelId"
    className="form-select"
    value={subModelId}
    onChange={(event) => setSubModelId(event.target.value)}
    disabled={!modelId || loadingSubModels || subModels.length === 0}
  >
    <option value="">
      {!modelId ? 'Select model first' : 'Select submodel'}
    </option>

    {subModels.map((subModel) => (
      <option key={subModel.id} value={subModel.id}>
        {subModel.name}
      </option>
    ))}
  </select>

  {loadingSubModels && <Loading />}

  <ErrorMessage message={subModelError} />

  {modelId &&
    !loadingSubModels &&
    !subModelError &&
    subModels.length === 0 && (
      <p className="text-muted mt-2">
        No submodels available for this model.
      </p>
    )}

  <p className="text-muted mt-2">
    SubModel ID: {subModelId || 'None'}
  </p>
</div>
    <div className="mb-3">
      <label htmlFor="zipCodeId" className="form-label">
        ZIP Code
      </label>

      <select
        id="zipCodeId"
        className="form-select"
        value={zipCodeId}
        onChange={(event) => setZipCodeId(event.target.value)}
        disabled={zipCodes.length === 0}
      >
        <option value="">
          {zipCodes.length === 0
            ? 'No ZIP codes available'
            : 'Select ZIP code'}
        </option>

        {zipCodes.map((zipCode) => (
          <option key={zipCode.id} value={zipCode.id}>
            {zipCode.code}
          </option>
        ))}
      </select>
    </div>

    <p className="text-muted">
      Make ID: {makeId || 'None'} | ZIP ID: {zipCodeId || 'None'}
    </p>
  </div>
)}
      <p className="text-muted">
        Selected year: {year || 'Not entered'}
      </p>
      <ErrorMessage message={formError} />

<button
  type="submit"
  className="btn btn-primary"
  disabled={
    submitting ||
    loadingLookups ||
    loadingModels ||
    loadingSubModels
  }
>
  {submitting ? 'Creating...' : 'Create case'}
</button>
<button
  type="button"
  className="btn btn-secondary mx-3"
  onClick={handelCancel}
  
>
    cancel
</button>
</fieldset>
    </form>
  );
}

export default CreateCarCasePage;