import { avatarColor } from '../constants.js';

export default function Avatar({ name, size = 36 }) {
  return (
    <span className="avatar" style={{ width: size, height: size, background: avatarColor(name), fontSize: size * 0.42 }}>
      {(name || '?')[0].toUpperCase()}
    </span>
  );
}
