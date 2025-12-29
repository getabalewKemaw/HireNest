import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

/**
 * Reusable Input Component with validation
 * @param {Object} props - Component props
 */
const Input = ({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  icon: Icon, // Optional leading icon
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState(false);

  const isPasswordType = type === 'password';
  const inputType = isPasswordType && showPassword ? 'text' : type;

  // Dynamic border color based on state
  let borderColor = 'border-gray-500';
  if (error) borderColor = 'border-red-500';
  else if (focused) borderColor = 'border-primary';

  const baseClasses = `
    w-full px-4 py-3 border rounded-none 
    bg-gray-50/50 dark:bg-gray-800/50 text-text-primary dark:text-white placeholder-gray-400
    focus:outline-none focus:bg-white dark:focus:bg-gray-800 transition-all duration-300 ease-out
    ${borderColor}
    ${focused ? 'ring-0' : ''}
    ${disabled ? 'bg-gray-100 dark:bg-gray-900 text-gray-400 cursor-not-allowed' : ''}
    ${Icon ? 'pl-11' : ''}
    ${className}
  `;

  return (
    <div className="w-full mb-4 group">
      {label && (
        <label
          htmlFor={name}
          className={`block text-sm font-semibold mb-2 transition-colors duration-200 ${error ? 'text-red-500' : 'text-primary dark:text-gray-300'}`}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Leading Icon */}
        {Icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none group-focus-within:text-primary transition-colors duration-200">
            <Icon size={20} />
          </div>
        )}

        <input
          id={name}
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          onBlur={(e) => {
            setFocused(false);
            onBlur && onBlur(e);
          }}
          onFocus={() => setFocused(true)}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          className={baseClasses}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${name}-error` : undefined}
          {...props}
        />

        {/* Password Toggle */}
        {isPasswordType && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors p-1 rounded-md hover:bg-gray-50 focus:outline-none"
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff size={20} />
            ) : (
              <Eye size={20} />
            )}
          </button>
        )}
      </div>

      {/* Error Message with Animation */}
      <div className={`overflow-hidden transition-all duration-300 ease-in-out ${error ? 'max-h-10 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <p id={`${name}-error`} className="text-sm text-red-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-red-500 inline-block"></span>
          {error}
        </p>
      </div>
    </div>
  );
};

export default Input;

