import { useState } from "react";
import QRCode from "qrcode";

const QRGenerator = () => {
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [qr, setQr] = useState("");

  const generateQR = async () => {
    const data = JSON.stringify({ name, studentId });
    const qrUrl = await QRCode.toDataURL(data);
    setQr(qrUrl);
  };

  return (
    <div className="qr-generator">
      <input
        placeholder="Student Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Student ID"
        value={studentId}
        onChange={(e) => setStudentId(e.target.value)}
      />
      <button onClick={generateQR}>Generate QR</button>

      {qr && <img src={qr} alt="QR Code" />}
    </div>
  );
};

export default QRGenerator;
