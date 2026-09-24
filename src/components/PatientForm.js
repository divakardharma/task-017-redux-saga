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
    <div className="section">
      <h2>Patient Registration</h2>

      <form onSubmit={handleSubmit}>
        <label>Patient Name</label>

        <input
          type="text"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />

        <label>Age</label>

        <input
          type="number"
          value={age}
          onChange={(e) =>
            setAge(e.target.value)
          }
          required
        />

        <label>Disease</label>

        <input
          type="text"
          value={disease}
          onChange={(e) =>
            setDisease(e.target.value)
          }
          required
        />

        <label>Doctor Assigned</label>

        <input
          type="text"
          value={doctor}
          onChange={(e) =>
            setDoctor(e.target.value)
          }
          required
        />

        <button type="submit">
          Register Patient
        </button>
      </form>
    </div>
  );
}

export default PatientForm;