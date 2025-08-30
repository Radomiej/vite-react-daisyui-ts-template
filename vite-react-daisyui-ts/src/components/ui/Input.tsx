import type { InputHTMLAttributes } from 'react';

type InputSize = 'xs' | 'sm' | 'md' | 'lg';
type InputVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'bordered';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  size?: InputSize;
  variant?: InputVariant;
  fullWidth?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = ({
  label,
  error,
  size = 'md',
  variant = 'bordered',
  className = '',
  fullWidth = false,
  leftIcon,
  rightIcon,
  id,
  ...props
}: InputProps) => {
  // Generowanie unikalnego ID dla pola input, jeśli nie zostało podane
  const inputId = id || `input-${Math.random().toString(36).substring(2, 11)}`;
  const sizeClasses = {
    xs: 'input-xs',
    sm: 'input-sm',
    md: 'input-md',
    lg: 'input-lg',
  };

  const variantClasses = {
    primary: 'input-primary',
    secondary: 'input-secondary',
    accent: 'input-accent',
    ghost: 'input-ghost',
    bordered: 'input-bordered',
  };

  const inputClasses = [
    'input',
    sizeClasses[size],
    variantClasses[variant],
    error ? 'input-error' : '',
    leftIcon ? 'pl-10' : '',
    rightIcon ? 'pr-10' : '',
    fullWidth ? 'w-full' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className={`form-control ${fullWidth ? 'w-full' : ''}`}>
      {label && (
        <label className="label" htmlFor={inputId}>
          <span className="label-text">{label}</span>
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {leftIcon}
          </div>
        )}
        <input id={inputId} className={inputClasses} {...props} />
        {rightIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
            {rightIcon}
          </div>
        )}
      </div>
      {error && (
        <label className="label">
          <span className="label-text-alt text-error">{error}</span>
        </label>
      )}
    </div>
  );
};
