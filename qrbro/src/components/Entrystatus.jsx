const EntryStatus = ({ name, studentId, status, time }) => {
  if (!name) return null;

  return (
    <div className="status-card">
      <p><b>Name:</b> {name}</p>
      <p><b>ID:</b> {studentId}</p>
      <p><b>Status:</b> {status}</p>
      <p><b>Time:</b> {time}</p>
    </div>
  );
};

export default EntryStatus;
