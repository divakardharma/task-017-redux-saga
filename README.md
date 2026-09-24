# Healthcare Doctor Dashboard — Redux Saga

React + Redux + Redux-Saga app demonstrating pagination optimization,
offline form queueing, and API request cancellation.

## Pagination Optimization
`FETCH_PATIENTS` fetches 10 patients from the API in a single call and
stores all 10 in the Redux store. The `PatientList` component slices
the store array (5 per page) for display — clicking Next/Previous only
changes local page state, with no additional API calls.

## Offline Queue Logic
On form submit, `submitPatientFormSaga` checks `navigator.onLine`.
If online, it calls the API directly. If offline (or the API call
fails), the form data is dispatched to `QUEUE_PATIENT_FORM` and stored
in `offlineQueue`. When the browser's `online` event fires,
`handleNetworkOnline` triggers `sendOfflineQueueSaga`, which replays
each queued submission against the API in order.

## Cancellation Handling
`FETCH_PATIENT_DETAILS` is watched with `takeLatest`, so redux-saga
automatically cancels any in-flight `fetchPatientDetailsSaga` task
when a new patient is selected. The saga's `finally` block checks
`cancelled()` and aborts the underlying `fetch` via `AbortController`,
ensuring only the most recently requested patient's data is applied.