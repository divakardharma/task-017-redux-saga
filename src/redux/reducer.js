import {
  SET_PATIENTS,
  QUEUE_PATIENT_FORM,
  SET_PATIENT_DETAILS,
  SET_LOADING,
  SET_ERROR,
  NETWORK_ONLINE,
  NETWORK_OFFLINE,
} from "./actions";

const initialState = {
  patients: [],
  offlineQueue: [],
  selectedPatient: null,
  loading: false,
  error: null,
  isOnline: navigator.onLine,
};

function patientReducer(state = initialState, action) {
  switch (action.type) {
    case SET_PATIENTS:
      return {
        ...state,
        patients: action.payload,
        loading: false,
        error: null,
      };

    case QUEUE_PATIENT_FORM:
      return {
        ...state,
        offlineQueue: [
          ...state.offlineQueue,
          action.payload,
        ],
      };

    case "REMOVE_QUEUED_PATIENT":
      return {
        ...state,
        offlineQueue: state.offlineQueue.filter(
          (_, index) => index !== action.payload
        ),
      };

    case SET_PATIENT_DETAILS:
      return {
        ...state,
        selectedPatient: action.payload,
        loading: false,
        error: null,
      };

    case SET_LOADING:
      return {
        ...state,
        loading: action.payload,
      };

    case SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false,
      };

    case NETWORK_ONLINE:
      return {
        ...state,
        isOnline: true,
      };

    case NETWORK_OFFLINE:
      return {
        ...state,
        isOnline: false,
      };

    default:
      return state;
  }
}

export default patientReducer;