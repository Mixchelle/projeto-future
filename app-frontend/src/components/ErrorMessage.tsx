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
  return (
    <div data-testid="error-message-container" className={`error-message ${type} ${className}`}>
      <div data-testid="error-message-content" className="flex">
        <div data-testid="error-message-icon-container" className="icon-container">
          <FiAlertTriangle data-testid="error-message-icon" className="icon" aria-hidden="true" />
        </div>
        <div data-testid="error-message-text-container" className="message">
          <p data-testid="error-message-text" className="message-text">{message}</p>
          {onRetry && (
            <div data-testid="error-message-retry-container" className="retry-button">
              <button
                data-testid="error-message-retry-button"
                type="button"
                onClick={onRetry}
                className={`retry-button ${type}`}
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