import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  children: ReactNode;
  image?: string;
  imageAlt?: string;
  actions?: ReactNode;
  className?: string;
  bordered?: boolean;
  imageFull?: boolean;
  variant?: 'default' | 'bordered' | 'ghost';
}

export const Card = ({
  title,
  children,
  image,
  imageAlt = '',
  actions,
  className = '',
  bordered = true,
  imageFull = false,
  variant = 'default',
}: CardProps) => {
  const variantClasses: Record<string, string> = {
    default: 'bg-base-100 shadow-xl',
    bordered: 'border border-base-300 bg-base-100',
    ghost: 'bg-base-100/50 backdrop-blur-sm',
  };

  // Determine the appropriate class based on variant
  const variantClass = variantClasses[variant] || variantClasses.default;
  const borderClass = bordered ? 'border border-base-300' : '';

  return (
    <div 
      className={`card ${variantClass} ${borderClass} ${className}`}
      data-testid="card"
    >
      {image && (
        <figure className={imageFull ? '!m-0' : 'px-4 pt-4'}>
          <img 
            src={image} 
            alt={imageAlt} 
            className={`rounded-xl ${imageFull ? 'rounded-t-xl rounded-b-none' : ''}`} 
          />
        </figure>
      )}
      <div className="card-body">
        {title && <h2 className="card-title">{title}</h2>}
        <div className="prose">{children}</div>
        {actions && <div className="card-actions justify-end mt-4">{actions}</div>}
      </div>
    </div>
  );
};
