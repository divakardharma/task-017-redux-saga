import { useState } from "react";
import { useDispatch } from "react-redux";

import {
  SUBMIT_PATIENT_FORM,
} from "../redux/actions";

function PatientForm() {
  const dispatch = useDispatch();

  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [disease, setDisease] = useState("");
  const [doctor, setDoctor] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    const patientData = {
      name,
      age,
      disease,
      doctor,
    };

    dispatch({
      type: SUBMIT_PATIENT_FORM,
      payload: patientData,
    });

    setName("");
    setAge("");
    setDisease("");
    setDoctor("");
  };

  return (
    <div className="panel-content form-content">
      <div className="panel-header">
        <div>
          <span className="eyebrow">QUICK ACTION</span>
          <h2>Register Patient</h2>
        </div>

        <div className="add-icon">+</div>
      </div>

      <p className="form-description">
        Add a new patient to today's care workflow.
      </p>

      <form
        className="patient-form"
        onSubmit={handleSubmit}
      >
        <div className="form-group full-field">
          <label>Patient Name</label>

          <input
            type="text"
            placeholder="Enter full name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Age</label>

            <input
              type="number"
              placeholder="Age"
              value={age}
              onChange={(e) =>
                setAge(e.target.value)
              }
              required
            />
          </div>

          <div className="form-group">
            <label>Disease</label>

            <input
              type="text"
              placeholder="Condition"
              value={disease}
              onChange={(e) =>
                setDisease(e.target.value)
              }
              required
            />
          </div>
        </div>

        <div className="form-group full-field">
          <label>Doctor Assigned</label>

          <input
            type="text"
            placeholder="Doctor name"
            value={doctor}
            onChange={(e) =>
              setDoctor(e.target.value)
            }
            required
          />
        </div>

        <button
          className="register-btn"
          type="submit"
        >
          <span>+</span>
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default PatientForm;