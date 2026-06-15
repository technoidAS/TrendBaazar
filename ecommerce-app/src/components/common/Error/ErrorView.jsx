import React from 'react';
import { AlertOctagon, RefreshCw, Home } from 'lucide-react';
import Button from '../Button/Button';
import './ErrorView.css';

export function ErrorView({ message = 'An unexpected system error has occurred.', onRetry }) {
  return (
    <div className="error-view-container glass-panel">
      <div className="error-icon-wrapper flex justify-center align-center">
        <AlertOctagon size={32} className="text-error" />
      </div>
      <h3 className="error-view-title">System Anomaly Detected</h3>
      <p className="error-view-message text-mut">{message}</p>
      
      <div className="error-view-actions flex gap-md justify-center">
        {onRetry && (
          <Button variant="secondary" iconLeft={<RefreshCw size={16} />} onClick={onRetry}>
            Retry Operation
          </Button>
        )}
        <Button variant="outlined" iconLeft={<Home size={16} />} onClick={() => window.location.href = '/'}>
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default ErrorView;
