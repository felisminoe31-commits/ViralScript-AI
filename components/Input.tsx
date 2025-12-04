
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium text-tg-hint ml-1">
        {label}
      </label>
      <input
        className={`bg-tg-secondaryBg border border-gray-700 text-tg-text rounded-xl p-4 focus:border-tg-button focus:ring-1 focus:ring-tg-button outline-none transition-all placeholder-gray-500 ${className}`}
        {...props}
      />
    </div>
  );
};

interface SelectOption {
    label: string;
    value: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: SelectOption[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className = '', ...props }) => {
    return (
      <div className="flex flex-col gap-2 mb-4">
        <label className="text-sm font-medium text-tg-hint ml-1">
          {label}
        </label>
        <div className="relative">
            <select
            className={`w-full appearance-none bg-tg-secondaryBg border border-gray-700 text-tg-text rounded-xl p-4 focus:border-tg-button focus:ring-1 focus:ring-tg-button outline-none transition-all ${className}`}
            {...props}
            >
                <option value="" disabled>Selecione uma opção</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-tg-hint">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
        </div>
      </div>
    );
  };
