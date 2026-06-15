import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import './NotFound.css';

export function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="not-found-page-container container flex flex-col justify-center align-center">
      <div className="glitch-404-wrapper">
        <h1 className="glitch-404" data-text="404">404</h1>
      </div>
      
      <div className="not-found-icon-ring flex justify-center align-center">
        <ShieldAlert size={40} className="text-secondary anim-pulse" />
      </div>

      <h2 className="not-found-title">Lost in Cyberspace?</h2>
      <p className="not-found-desc text-mut">
        The catalog drops you are looking for has been relocated or does not exist. Verify the address coordinates or return home.
      </p>

      <div className="not-found-actions flex gap-md">
        <Button variant="outlined" iconLeft={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
          Go Back
        </Button>
        <Button variant="primary" iconLeft={<Home size={16} />} onClick={() => navigate('/')}>
          Return Home
        </Button>
      </div>
    </div>
  );
}

export default NotFound;
