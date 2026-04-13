import { useEffect } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";

const QRScanner = ({ onScan }) => {
  useEffect(() => {
    if (window.hasScannerStarted) return;
    window.hasScannerStarted = true;

    const config = {
      fps: 10,
      qrbox: { width: 200, height: 200 },
      experimentalFeatures: { useBarCodeDetectorIfSupported: true },
    };

    const scanner = new Html5QrcodeScanner("qr-reader", config, false);

    let pauseScan = false;

    scanner.render(
      (decodedText) => {
        if (pauseScan) return;

        onScan(decodedText);

        // har 2min baad rescan hoga
        pauseScan = true;
        setTimeout(() => {
          pauseScan = false;
        }, 2000);
      },
      (errorMessage) => {
      
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, []);

  return (
    <div
      id="qr-reader"
      style={{
        width: "100%",
        maxWidth: "600px",
        margin: "20px auto",
      }}
    />
  );
};

export default QRScanner;
