// src/components/ErrorMessage.tsx
import { FC } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';

interface ErrorMessageProps {
  message: string;
  type?: 'error' | 'warning' | 'info';
  className?: string;
  onRetry?: () => void;
}

const ErrorMessage: FC<ErrorMessageProps> = ({ 
  message, 
  type = 'error', 
  className = '',
  onRetry 
}) => {
  const typeClasses = {
    error: 'bg-red-50 text-red-700',
    warning: 'bg-yellow-50 text-yellow-700',
    info: 'bg-blue-50 text-blue-700'
  };

  const iconClasses = {
    error: 'text-red-400',
    warning: 'text-yellow-400',
    info: 'text-blue-400'
  };

  return (
    <div className={`rounded-md p-4 ${typeClasses[type]} ${className}`}>
      <div className="flex">
        <div className="flex-shrink-0">
          <FiAlertTriangle className={`h-5 w-5 ${iconClasses[type]}`} aria-hidden="true" />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-medium">{message}</p>
          {onRetry && (
            <div className="mt-2">
              <button
                type="button"
                onClick={onRetry}
                className={`rounded-md px-2 py-1 text-sm font-medium ${
                  type === 'error' ? 'text-red-800 hover:bg-red-100' :
                  type === 'warning' ? 'text-yellow-800 hover:bg-yellow-100' :
                  'text-blue-800 hover:bg-blue-100'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  type === 'error' ? 'focus:ring-red-500' :
                  type === 'warning' ? 'focus:ring-yellow-500' :
                  'focus:ring-blue-500'
                }`}
              >
                Tentar novamente
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;