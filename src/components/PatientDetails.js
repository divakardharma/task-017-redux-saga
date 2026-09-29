import { useSelector } from "react-redux";

function PatientDetails() {
  const patient = useSelector(
    (state) => state.patient.selectedPatient
  );

 const loading = useSelector(
  (state) => state.patient.detailsLoading
);

  return (
    <div className="panel-content details-content">
      <div className="panel-header">
        <div>
          <span className="eyebrow">PATIENT OVERVIEW</span>
          <h2>Patient Details</h2>
        </div>

        <div className="record-icon">✚</div>
      </div>

      {loading && (
        <div className="details-empty">
          <div className="spinner"></div>
          <h3>Loading patient...</h3>
          <p>Retrieving the latest patient information.</p>
        </div>
      )}

      {!loading && !patient && (
        <div className="details-empty">
          <div className="empty-patient-icon">⌁</div>
          <h3>No patient selected</h3>
          <p>
            Select a patient from the directory to view
            their information.
          </p>
        </div>
      )}

      {!loading && patient && (
        <div className="patient-details">
          <div className="profile-summary">
            <div className="large-avatar">
          {patient.firstName?.[0]}
           {patient.lastName?.[0]}
            </div>

            <div>
              <span className="patient-id">
                PATIENT #{patient.id}
              </span>
              <h3>
              {patient.firstName} {patient.lastName}
                 </h3>
              <p>{patient.email}</p>
            </div>
          </div>

          <div className="detail-grid">
            <div className="detail-item">
              <span>Phone</span>
              <strong>{patient.phone}</strong>
            </div>

            <div className="detail-item">
              <span>City</span>
              <strong>
                {patient.address?.city || "—"}
              </strong>
            </div>

           <div className="detail-item">
           <span>Age</span>
          <strong>
             {patient.age || "—"}
             </strong>
            </div>

            <div className="detail-item">
              <span>Company</span>
              <strong>
                {patient.company?.name || "—"}
              </strong>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PatientDetails;