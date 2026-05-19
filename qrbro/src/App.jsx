import { useState, useRef, useEffect } from "react";
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

  const streamRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    const warmUp = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 640, height: 480 },
        });
        streamRef.current = stream;
        const video = document.createElement("video");
        video.srcObject = stream;
        video.setAttribute("playsinline", true);
        video.style.display = "none";
        document.body.appendChild(video);
        await video.play();
        videoRef.current = video;
      } catch (err) {
        console.error("Camera warmup error:", err.message);
      }
    };
    warmUp();

    return () => {
      if (streamRef.current) streamRef.current.getTracks().forEach((t) => t.stop());
      if (videoRef.current && document.body.contains(videoRef.current))
        document.body.removeChild(videoRef.current);
    };
  }, []);

  const capturePhoto = async () => {
    const video = videoRef.current;
    if (!video) return null;
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    canvas.getContext("2d").drawImage(video, 0, 0, canvas.width, canvas.height);
    return new Promise((r) => canvas.toBlob(r, "image/jpeg", 0.75));
  };

  const handleScan = (data) => {
    if (!data) return;

    try {
      const parsed = JSON.parse(data);
      const { name, studentId } = parsed;
      const currentTime = new Date().getTime();

      const lastTime = lastScanTime[studentId] || 0;
      if (currentTime - lastTime < 5000) return;

      setLastScanTime((prev) => ({ ...prev, [studentId]: currentTime }));

      setAttendance((prev) => {
        const prevStatus = prev[studentId]?.status || "EXIT";
        const newStatus = prevStatus === "EXIT" ? "ENTRY" : "EXIT";
        const displayTime = new Date().toLocaleTimeString();

        setTimeout(async () => {
          const photo = await capturePhoto();
          await sendAttendance({ name, studentId, status: newStatus, time: displayTime }, photo);
        }, 2000);

        setLastScan({ name, studentId, status: newStatus, time: displayTime });

        return {
          ...prev,
          [studentId]: { status: newStatus, time: displayTime },
        };
      });

    } catch (err) {
      console.error("Invalid QR", err);
    }
  };

  return (
    <div className="app">
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
              <button className="close-btn" onClick={() => setAdminAllowed(false)}>
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