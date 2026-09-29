import {
  SET_PATIENTS,
  QUEUE_PATIENT_FORM,
  SET_PATIENT_DETAILS,  
  SET_PATIENTS_LOADING,
  SET_DETAILS_LOADING,
  RESTORE_OFFLINE_QUEUE,
  SET_ERROR,
  NETWORK_ONLINE,
  NETWORK_OFFLINE,
} from "./actions";

const initialState = {
  patients: [],
  offlineQueue: [],
  selectedPatient: null,
  patientsLoading: false,
  detailsLoading: false,
  error: null,
  isOnline: navigator.onLine,
};

function patientReducer(state = initialState, action) {
  switch (action.type) {
case SET_PATIENTS:
  return {
    ...state,
    patients: [
      ...state.patients,
      ...action.payload,
    ],
    patientsLoading: false,
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
    
    case RESTORE_OFFLINE_QUEUE:
  return {
    ...state,
    offlineQueue: action.payload,
  };

    case SET_PATIENT_DETAILS:
      return {
        ...state,
        selectedPatient: action.payload,
        detailsLoading: false,
        error: null,
      };

    case SET_PATIENTS_LOADING:
      return {
      ...state,
      patientsLoading: action.payload,
     };

    case SET_DETAILS_LOADING:
      return {
      ...state,
      detailsLoading: action.payload,
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