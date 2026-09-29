import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { FETCH_PATIENTS,
  FETCH_PATIENT_DETAILS,
} from "../redux/actions";

function PatientList() {
  const dispatch = useDispatch();

  const patients = useSelector(
    (state) => state.patient.patients
  );

 const loading = useSelector(
  (state) => state.patient.patientsLoading
);

  const error = useSelector(
    (state) => state.patient.error
  );

  const [page, setPage] = useState(1);

  useEffect(() => {
    dispatch({
      type: FETCH_PATIENTS,
    });
  }, [dispatch]);

  useEffect(() => {
  if (
    page % 2 === 0 &&
    page < 10 &&
    patients.length === page * 5
  ) {
    dispatch({
      type: FETCH_PATIENTS,
      payload: patients.length,
    });
  }
}, [page, patients.length, dispatch]);

  const patientsPerPage = 5;

  const startIndex =
    (page - 1) * patientsPerPage;

  const displayedPatients = patients.slice(
    startIndex,
    startIndex + patientsPerPage
  );

  const handlePatientClick = (id) => {
    dispatch({
      type: FETCH_PATIENT_DETAILS,
      payload: id,
    });
  };

  return (
    <div className="section">
      <h2>Patient List</h2>

      {loading && patients.length === 0 && (
  <p>Loading patients...</p>
)}

            {error && (
        <div className="error-box">
          <p className="error">{error}</p>
          <button
            className="retry-btn"
            onClick={() => dispatch({ type: FETCH_PATIENTS })}
          >
            Retry
          </button>
        </div>
      )}
      {displayedPatients.map((patient) => (
        <div
          className="patient-row"
          key={patient.id}
          onClick={() => handlePatientClick(patient.id)}
        >
          <strong>{patient.name}</strong>
          <span>{patient.email}</span>
        </div>
      ))}

      <div className="pagination">
        <button
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>

        <span>Page {page}</span>

        <button
          onClick={() => setPage(page + 1)}
          disabled={
            startIndex + patientsPerPage >= patients.length
          }
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default PatientList;