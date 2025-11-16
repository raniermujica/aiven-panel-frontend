import { cn } from '/utils.js';

export function Button({
  children,
  variant = 'primary',
  size = 'default',
  className,
  disabled,
  type = 'button',
  ...props
}) {
  const baseStyles = "inline-flex items-center justify-center rounded-button font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-accent text-white hover:bg-accent/90 active:scale-95",
    secondary: "bg-gray-100 text-text-primary hover:bg-gray-200 active:scale-95",
    outline: "border-2 border-accent text-accent hover:bg-accent-light active:scale-95",
    ghost: "text-text-secondary hover:bg-gray-100 active:scale-95",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    default: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button
      type={type}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};