export default function FlashMessage({ message, type = 'error' }) {
  if (!message) return null;
  return (
    <div className={`alert ${type === 'success' ? 'alert-success' : 'alert-error'}`} role="alert">
      {message}
    </div>
  );
}
