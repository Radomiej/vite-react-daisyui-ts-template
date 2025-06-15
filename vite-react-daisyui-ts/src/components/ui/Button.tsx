import type { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'ghost' | 'link' | 'outline';
type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export const Button: FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  fullWidth = false,
  disabled = false,
  leftIcon,
  rightIcon,
  ...props
}) => {
  const baseClasses = 'btn';
  const variantClasses = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    accent: 'btn-accent',
    ghost: 'btn-ghost',
    link: 'btn-link',
    outline: 'btn-outline',
  };

  const sizeClasses = {
    xs: 'btn-xs',
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg', 
  };

  const classes = [
    baseClasses,
    variantClasses[variant],
    sizeClasses[size],
    loading ? 'loading' : '',
    fullWidth ? 'w-full' : '',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
      type={props.type || 'button'}
    >
      {loading && (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      )}
      {leftIcon && !loading && (
        <span className="mr-2 flex items-center">{leftIcon}</span>
      )}
      {children}
      {rightIcon && !loading && (
        <span className="ml-2 flex items-center">{rightIcon}</span>
      )}
    </button>
  );
};
