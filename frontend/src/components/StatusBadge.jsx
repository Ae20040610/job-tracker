import { statusMeta } from '../constants.js';

export default function StatusBadge({ status }) {
  const m = statusMeta(status);
  return (
    <span className="badge" style={{ color: m.color, background: m.bg }}>
      <i style={{ background: m.color }} /> {m.label}
    </span>
  );
}
