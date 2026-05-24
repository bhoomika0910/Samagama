const checks = [
  { key: 'length', label: 'At least 8 characters', test: (value) => value.length >= 8 },
  { key: 'upper', label: 'One uppercase letter', test: (value) => /[A-Z]/.test(value) },
  { key: 'number', label: 'One number', test: (value) => /\d/.test(value) },
  { key: 'special', label: 'One special character (!@#$%^&*)', test: (value) => /[!@#$%^&*]/.test(value) }
];

export const getPasswordStrength = (value = '') => {
  const score = checks.reduce((total, item) => total + (item.test(value) ? 1 : 0), 0);

  if (score <= 1) return { label: 'Weak', color: 'bg-red-500', width: 'w-1/4' };
  if (score === 2) return { label: 'Fair', color: 'bg-orange-500', width: 'w-2/4' };
  if (score === 3) return { label: 'Good', color: 'bg-yellow-500', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-green-500', width: 'w-full' };
};

export default function PasswordStrengthPanel({ password }) {
  const strength = getPasswordStrength(password);

  return (
    <div className="mt-3 space-y-3">
      <div>
        <div className="h-1.5 w-full overflow-hidden rounded bg-[#1f1f1f]">
          <div className={`h-full ${strength.width} ${strength.color} transition-all`} />
        </div>
        <p className="mt-1 text-xs text-[#888]">Strength: {strength.label}</p>
      </div>
      <ul className="space-y-1.5 text-xs text-[#777]">
        {checks.map((item) => {
          const matched = item.test(password);
          return (
            <li key={item.key} className={`flex items-center gap-2 ${matched ? 'text-green-400' : 'text-[#777]'}`}>
              <span>{matched ? '✓' : '✗'}</span>
              <span>{item.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
