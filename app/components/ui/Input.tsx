import { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ label, className = '', ...props }, ref) => {
        return (
            <div className="w-full">
                {label && (
                    <label className="block text-sm font-medium text-foreground/80 mb-2">
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    className={`
            w-full px-4 py-3 bg-club-gray border border-club-yellow/20 rounded-lg 
            text-foreground focus:outline-none focus:border-club-yellow/60 transition-colors
            placeholder:text-foreground/40
            ${className}
          `}
                    {...props}
                />
            </div>
        );
    }
);

Input.displayName = 'Input';
