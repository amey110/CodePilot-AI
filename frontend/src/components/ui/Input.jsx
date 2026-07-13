import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  error,
  placeholder,
  className = '',
  icon: Icon,
  ...props
}, ref) => {
  return (
    <div className={`flex flex-col space-y-1.5 w-full ${className}`}>
      {label && (
        <label htmlFor={name} className="text-xs font-semibold text-gray-400 tracking-wide">
          {label}
        </label>
      )}
      
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className={`w-full py-2.5 rounded-xl text-sm glass-input text-gray-200 placeholder-gray-500 transition focus:outline-none ${
            Icon ? 'pl-11 pr-4' : 'px-4'
          } ${
            error 
              ? 'border-rose-500/50 focus:border-rose-500/80 focus:ring-rose-500/20' 
              : 'border-gray-800 focus:border-violet-500/50 focus:ring-violet-500/20'
          }`}
          {...props}
        />
      </div>

      {error && (
        <span className="text-xs font-medium text-rose-400 animate-in fade-in slide-in-from-top-1 duration-150">
          {error.message}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
