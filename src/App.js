import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import PatientList from "./components/PatientList";
import PatientForm from "./components/PatientForm";
import PatientDetails from "./components/PatientDetails";

import { NETWORK_ONLINE, NETWORK_OFFLINE } from "./redux/actions";

import "./App.css";

function App() {
  const dispatch = useDispatch();
  const isOnline = useSelector((state) => state.patient.isOnline);
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
  }, [dispatch]);

  return (
    <div className="app">
      <h1>Healthcare Doctor Dashboard</h1>

      <div className={isOnline ? "network online" : "network offline"}>
        {isOnline ? "🟢 Online" : "🔴 Offline"}
      </div>

      {offlineQueue.length > 0 && (
        <div className="queue-banner">
          <strong>{offlineQueue.length}</strong> patient form
          {offlineQueue.length > 1 ? "s" : ""} waiting to sync once you're back online.
        </div>
      )}

      <div className="dashboard-grid">
        <div>
          <PatientList />
          <PatientForm />
        </div>
        <PatientDetails />
      </div>
    </div>
  );
}

export default App;