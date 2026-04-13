import { useState } from "react";
import QRScanner from "./components/QRscanner.jsx";
import EntryStatus from "./components/Entrystatus.jsx";
import PasswordModal from "./components/Passwordmodel.jsx";
import QRGenerator from "./components/QRgenerator.jsx";
import { sendAttendance } from "./services/api";

import "./index.css";

function App() {

  const [attendance, setAttendance] = useState({});
  const [lastScan, setLastScan] = useState(null);
  const [lastScanTime, setLastScanTime] = useState({});


  const [showAdmin, setShowAdmin] = useState(false);
  const [adminAllowed, setAdminAllowed] = useState(false);


  const handleScan = (data) => {
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      const { name, studentId } = parsed;
      const currentTime = new Date().getTime();

      const lastTime = lastScanTime[studentId] || 0;
      if (currentTime - lastTime < 3000) return;

      setLastScanTime((prev) => ({ ...prev, [studentId]: currentTime }));

      // entry exit print karege ab
    setAttendance((prev) => {
  const prevStatus = prev[studentId]?.status || "EXIT";
  const newStatus = prevStatus === "EXIT" ? "ENTRY" : "EXIT";

  const displayTime = new Date().toLocaleTimeString(); 

  //  Telegram notification part
  sendAttendance({
    name,
    studentId,
    status: newStatus,
    time: displayTime,
  });

  setLastScan({
    name,
    studentId,
    status: newStatus,
    time: displayTime,
  });

  return {
    ...prev,
    [studentId]: {
      status: newStatus,
      time: displayTime,
    },
  };
});

    } catch (err) {
      console.error("Invalid QR", err);
    }
  };

  return (
    <div className="app">
      {/* HEADER */}
      <header className="header">
        <h1>QR Entry Exit System</h1>

        {!adminAllowed && (
          <button className="admin-btn" onClick={() => setShowAdmin(true)}>
            Admin Panel 🔐
          </button>
        )}
      </header>

      <main className="main">

        <QRScanner onScan={handleScan} />
        {lastScan && (
          <EntryStatus
            name={lastScan.name}
            studentId={lastScan.studentId}
            status={lastScan.status}
            time={lastScan.time}
          />
        )}
        {showAdmin && !adminAllowed && (
          <PasswordModal
            onSuccess={() => {
              setAdminAllowed(true);
              setShowAdmin(false);
            }}
          />
        )}
        {adminAllowed && (
          <div className="admin-panel">
            <div className="admin-header">
              <h2>QR Generator</h2>
              <button
                className="close-btn"
                onClick={() => setAdminAllowed(false)}
              >
                ✖ Close
              </button>
            </div>
            <QRGenerator />
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
