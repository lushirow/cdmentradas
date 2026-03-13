import { ButtonHTMLAttributes, forwardRef } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...props }, ref) => {
    // Adding flex constraints to stop cut-off text + active physics (spring)
    const baseStyles = 'inline-flex items-center justify-center gap-2 font-bold tracking-wide rounded-sm transition-all duration-300 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';
    
    const variants = {
      // cinematic intense glow on hover
      primary: 'bg-club-yellow text-black hover:bg-white hover:text-black hover:-translate-y-1 shadow-[0_4px_14px_0_rgba(255,215,0,0.2)] hover:shadow-[0_6px_20px_rgba(255,255,255,0.4)]',
      
      // subtle frosted glass look
      secondary: 'bg-white/10 text-white hover:bg-white/20 hover:-translate-y-1 backdrop-blur-md border border-white/10',
      
      // sharp high-contrast outline
      outline: 'bg-transparent border border-white/30 text-white hover:bg-white hover:text-black hover:-translate-y-1 hover:border-transparent tracking-widest uppercase text-sm'
    };
    
    // Adjusted sizes so they don't break flex layouts
    const sizes = {
      sm: 'px-4 h-10 text-sm',
      md: 'px-6 h-12 text-base',
      lg: 'px-8 h-14 text-lg'
    };
    
    return (
      <button
        ref={ref}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
