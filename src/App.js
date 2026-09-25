import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";

import { NETWORK_ONLINE, NETWORK_OFFLINE } from "./redux/actions";

import "./App.css";

function App() {
  const dispatch = useDispatch();

  const isOnline = useSelector((state) => state.patient.isOnline );

  const offlineQueue = useSelector((state) => state.patient.offlineQueue);

  useEffect(() => {
    const handleOnline = () => dispatch({ type: NETWORK_ONLINE });
    const handleOffline = () => dispatch({ type: NETWORK_OFFLINE });

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="app-shell">
      <header className="topbar">
        <div className="brand">
          <div className="brand-mark">+</div>

          <div>
            <h1>CareFlow</h1>
            <p>Doctor Workspace</p>
          </div>
        </div>

        <div className="header-right">
          {offlineQueue.length > 0 && (
            <div className="sync-status">
              <span className="sync-count">
                {offlineQueue.length}
              </span>
              waiting to sync
            </div>
          )}

          <div
            className={ isOnline
                ? "network-status online"
                : "network-status offline"
            }
          >
            <span className="status-dot"></span>
            {isOnline ? "Online" : "Offline"}
          </div>

          <div className="doctor-profile">
            <div className="avatar">DR</div>

            <div>
              <strong>Doctor</strong>
              <span>Dashboard</span>
            </div>
          </div>
        </div>
      </header>

      <main className="dashboard">
        <section className="patients-panel">
          <PatientList />
        </section>

        <section className="details-panel">
          <PatientDetails />
        </section>

        <section className="form-panel">
          <PatientForm />
        </section>
      </main>
    </div>
  );
}

export default App;