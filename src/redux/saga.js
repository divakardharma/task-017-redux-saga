import {
  call,
  put,
  takeEvery,
  takeLatest,
  select,
  fork,
  cancelled,
  delay,
} from "redux-saga/effects";

import {
  FETCH_PATIENTS,
  SET_PATIENTS,
  SUBMIT_PATIENT_FORM,
  QUEUE_PATIENT_FORM,
  FETCH_PATIENT_DETAILS,
  SET_PATIENT_DETAILS,
  SET_LOADING,
  SET_ERROR,
  NETWORK_ONLINE,
  NETWORK_OFFLINE,
} from "./actions";


// ======================================================
// FEATURE 1 - FETCH 10 PATIENTS
// ======================================================

function* fetchPatientsAPI() {
  const response = yield call(
    fetch,
    "https://jsonplaceholder.typicode.com/users"
  );

  if (!response.ok) {
    throw new Error("Failed to fetch patients");
  }

  const data = yield call([response, response.json]);

  return data.slice(0, 10);
}


function* fetchPatientsSaga() {
  yield put({ type: SET_LOADING, payload: true });

  const maxAttempts = 3;
  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      const patients = yield call(fetchPatientsAPI);
      yield put({ type: SET_PATIENTS, payload: patients });
      return;
    } catch (error) {
      attempt++;

      if (attempt >= maxAttempts) {
        yield put({
          type: SET_ERROR,
          payload: `Failed to load patients after ${maxAttempts} attempts.`,
        });
      } else {
        // wait before retrying: 1s, then 2s
        yield delay(1000 * attempt);
      }
    }
  }
}


// ======================================================
// FEATURE 2 - PATIENT FORM API
// ======================================================

function* savePatientAPI(patientData) {
  const response = yield call(
    fetch,
    "https://jsonplaceholder.typicode.com/posts",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(patientData),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to save patient");
  }

  const data = yield call([response, response.json]);

  return data;
}


function* submitPatientFormSaga(action) {
  try {
    const isOnline = navigator.onLine;

    if (!isOnline) {
      yield put({
        type: QUEUE_PATIENT_FORM,
        payload: action.payload,
      });

      return;
    }

    const savedPatient = yield call(
      savePatientAPI,
      action.payload
    );

    console.log("Patient saved:", savedPatient);
  } catch (error) {
    // If API fails, put the form into offline queue
    yield put({
      type: QUEUE_PATIENT_FORM,
      payload: action.payload,
    });

    console.log(
      "API failed. Patient added to offline queue."
    );
  }
}


// ======================================================
// FEATURE 2 - SEND OFFLINE QUEUE
// ======================================================

const getOfflineQueue = (state) =>
  state.patient.offlineQueue;


function* sendOfflineQueueSaga() {
  const queue = yield select(getOfflineQueue);

  for (let i = 0; i < queue.length; i++) {
    const patientData = queue[i];

    try {
      yield call(savePatientAPI, patientData);

      yield put({
        type: "REMOVE_QUEUED_PATIENT",
        payload: 0,
      });

      console.log(
        "Queued patient sent successfully:",
        patientData
      );
    } catch (error) {
      console.log(
        "Queue sending failed. Will try again later."
      );

      break;
    }
  }
}


// ======================================================
// FEATURE 3 - PATIENT DETAILS API
// ======================================================

function* fetchPatientDetailsSaga(action) {
  const controller = new AbortController();

  try {
    yield put({
      type: SET_LOADING,
      payload: true,
    });

    const response = yield call(
      fetch,
      `https://jsonplaceholder.typicode.com/users/${action.payload}`,
      {
        signal: controller.signal,
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch patient details");
    }

   const data = yield call([response, response.json]); 

    yield put({
      type: SET_PATIENT_DETAILS,
      payload: data,
    });
  } catch (error) {
    if (error.name !== "AbortError") {
      yield put({
        type: SET_ERROR,
        payload: error.message,
      });
    }
  } finally {
    if (yield cancelled()) {
      controller.abort();

      console.log(
        "Previous patient request cancelled"
      );
    }
  }
}


// ======================================================
// NETWORK STATUS
// ======================================================

function* handleNetworkOnline() {
  yield call(sendOfflineQueueSaga);
}

function* handleNetworkOffline() {
  // App.js already dispatches NETWORK_OFFLINE, so nothing to do here
}


// ======================================================
// ROOT SAGA
// ======================================================

function* rootSaga() {
  yield takeEvery(
    FETCH_PATIENTS,
    fetchPatientsSaga
  );

  yield takeEvery(
    SUBMIT_PATIENT_FORM,
    submitPatientFormSaga
  );

  yield takeEvery(
    NETWORK_ONLINE,
    handleNetworkOnline
  );

  yield takeEvery(
    NETWORK_OFFLINE,
    handleNetworkOffline
  );

  // Only latest patient details request continues
  yield takeLatest(
    FETCH_PATIENT_DETAILS,
    fetchPatientDetailsSaga
  );
}

export default rootSaga;