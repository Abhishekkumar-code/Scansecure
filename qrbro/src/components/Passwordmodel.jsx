import { useState } from "react";

const PasswordModal = ({ onSuccess }) => {
  const [password, setPassword] = useState("");

  const checkPassword = () => {
    if (password === "palak@3129") {
      onSuccess();
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div className="modal">
      <h3>Admin Access</h3>
      <input
        type="password"
        placeholder="Enter password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={checkPassword}>Enter</button>
    </div>
  );
};

export default PasswordModal;
