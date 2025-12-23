/**
 * Reusable Button Component
 * Redesigned for a premium, high-end SaaS feel with rounded corners and sophisticated shadows.
 */
const Button = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  isLoading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  children,
  className = '',
  ...props
}) => {
  const isButtonLoading = loading || isLoading;

  // High-end base classes
  const baseClasses = 'relative inline-flex items-center justify-center font-accent font-black uppercase tracking-widest transition-all duration-300 ease-out focus:outline-none focus:ring-4 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98] overflow-hidden group';

  const variantClasses = {
    primary: 'bg-primary dark:bg-primary-light text-white hover:shadow-[0_15px_30px_rgba(11,28,45,0.2)] dark:hover:shadow-[0_15px_30px_rgba(255,255,255,0.05)] focus:ring-primary/20',
    secondary: 'bg-secondary text-white hover:bg-secondary-dark hover:shadow-[0_15px_30px_rgba(37,99,235,0.3)] focus:ring-secondary/20',
    outline: 'bg-transparent text-primary dark:text-white border-2 border-primary/10 dark:border-white/10 hover:border-primary dark:hover:border-white hover:bg-gray-50 dark:hover:bg-white/5 focus:ring-gray-200',
    ghost: 'bg-transparent text-gray-500 dark:text-gray-400 hover:text-primary dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5 focus:ring-transparent shadow-none',
    danger: 'bg-rose-500 text-white hover:bg-rose-600 hover:shadow-[0_15px_30px_rgba(244,63,94,0.3)] focus:ring-rose-500/20',
    success: 'bg-emerald-500 text-white hover:bg-emerald-600 hover:shadow-[0_15px_30px_rgba(16,185,129,0.3)] focus:ring-emerald-500/20',
    accent: 'bg-amber-500 text-white hover:bg-amber-600 hover:shadow-[0_15px_30px_rgba(245,158,11,0.3)] focus:ring-amber-500/20',
  };

  const sizeClasses = {
    sm: 'px-6 py-2.5 text-[10px] rounded-xl',
    md: 'px-8 py-4 text-xs rounded-2xl',
    lg: 'px-12 py-6 text-sm rounded-[2rem]',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || isButtonLoading}
      onClick={onClick}
      {...props}
    >
      {/* Glossy Overlay Effect */}
      <span className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></span>

      {isButtonLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing...
        </span>
      ) : (
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
      )}
    </button>
  );
};
export default Button;
