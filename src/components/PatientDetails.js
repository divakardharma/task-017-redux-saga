import { useSelector } from "react-redux";

function PatientDetails() {
  const patient = useSelector((state) => state.patient.selectedPatient);
  const loading = useSelector((state) => state.patient.loading);

  return (
    <div className="section">
      <h2>Patient Details</h2>

      {loading ? (
        <p className="placeholder">Loading patient details...</p>
      ) : !patient ? (
        <p className="placeholder">Click a patient to view details.</p>
      ) : (
        <div>
          <div className="detail-row"><span>Name</span><span>{patient.name}</span></div>
          <div className="detail-row"><span>Email</span><span>{patient.email}</span></div>
          <div className="detail-row"><span>Phone</span><span>{patient.phone}</span></div>
          <div className="detail-row"><span>Website</span><span>{patient.website}</span></div>
          <div className="detail-row"><span>City</span><span>{patient.address?.city}</span></div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;