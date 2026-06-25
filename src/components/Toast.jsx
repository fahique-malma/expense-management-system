export default function Toast({ message, show }) {
  return <div id="toast" className={show ? "show" : ""}>{message}</div>;
}
