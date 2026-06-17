import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShieldCheck,
  Phone,
  ArrowRight,
  Timer
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useToast } from '../../context/ToastContext/ToastContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import FadeIn from '../../components/animations/FadeIn';
import InteractiveBubbles from '../../components/animations/InteractiveBubbles';
import Home from '../Home/Home';
import './Login.css';

export function Login() {
  const { requestOtp, verifyOtp, error: authError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const isApiMode = import.meta.env.VITE_DATA_SOURCE === 'api';

  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [successMsg, setSuccessMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/profile';

  // Timer countdown for resend OTP
  useEffect(() => {
    let timerInterval;
    if (step === 'otp' && resendTimer > 0) {
      timerInterval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [step, resendTimer]);



  // Submit Mobile Number
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setPhoneError('');
    setSuccessMsg('');

    if (!phone || phone.trim().length < 8) {
      setPhoneError('Please enter a valid mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await requestOtp(phone);
      if (response?.nextStep === 'signup') {
        addToast(response.message || 'No account found. Redirecting to sign up.', 'info');
        navigate('/signup', { replace: true, state: { phone } });
        return;
      }

      if (isApiMode) {
        setSuccessMsg(response.message || `OTP sent to ${phone}. Please check your backend terminal console for the verification code.`);
        addToast('OTP verification code dispatched.', 'info');
      } else {
        setSuccessMsg(response.message || `OTP sent to ${phone}. Use test code: 0000`);
        addToast(`OTP verification code dispatched to ${phone}`, 'info');
      }
      setStep('otp');
      setResendTimer(30);
    } catch (err) {
      setPhoneError(err.message || 'Error requesting OTP');
      addToast(err.message || 'Error requesting OTP', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const trimmedOtp = otp.trim();

    if (!trimmedOtp || (trimmedOtp.length !== 6 && trimmedOtp.length !== 4)) {
      setOtpError(isApiMode ? 'Please enter the 4-digit OTP from your backend console' : 'Please enter OTP code (use 0000 for testing)');
      return;
    }

    // In API mode, 0000 is not a valid OTP — it must come from the backend
    if (isApiMode && trimmedOtp === '0000') {
      setOtpError('OTP "0000" is not accepted in API mode. Please check your backend console/logs for the actual OTP code.');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await verifyOtp(phone, trimmedOtp);
      addToast(`Welcome back, ${loggedUser.name}!`, 'success');
      if (loggedUser.role === 'admin') {
        navigate('/admin', { replace: true });
      } else {
        navigate(redirectPath, { replace: true });
      }
    } catch (err) {
      setOtpError(err.message || 'OTP verification failed');
      addToast(err.message || 'OTP verification failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setOtpError('');
    setSuccessMsg('');
  };

  return (
    <div className="login-page-container">
      {/* Blurred Home Page in the background */}
      <div className="blurred-homepage-bg">
        <Home />
      </div>

      {/* Floating Interactive Background Bubbles */}
      <InteractiveBubbles />

      <div className="login-card-wrapper glass-panel">
        {/* Right pane: Auth Forms */}
        <div className="login-form-pane">
          <FadeIn className="login-form-wrapper">
            <div className="login-form-header">
              <h1 className="auth-title">Login</h1>
              <p className="auth-subtitle">
                Enter your mobile number to get an OTP if you already have an account.
              </p>
            </div>

            {authError && (
              <div className="auth-error-banner anim-shake">
                <span>{authError}</span>
              </div>
            )}

            {successMsg && (
              <div
                className="auth-success-banner"
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  color: 'var(--success)',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: 'var(--font-size-sm)',
                  textAlign: 'left',
                  marginBottom: 'var(--space-sm)'
                }}
              >
                <span>{successMsg}</span>
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="auth-form-tag">
                <Input
                  label="Mobile Phone Number"
                  type="tel"
                  placeholder="e.g. XXXXXXXX34"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  error={phoneError}
                  iconLeft={<Phone size={18} />}
                  required
                />
                
                <div className="auth-help-links flex justify-between align-center">
                  <span className="demo-credentials-helper">Demo phone: +1 (555) 019-2834</span>
                  <Link to="/signup" style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 600 }}>
                    New here? Sign up
                  </Link>
                </div>

                <Button type="submit" variant="primary" loading={loading} className="auth-submit-btn" iconRight={<ArrowRight size={18} />}>
                  Send OTP Code
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="auth-form-tag">
                <Input
                  label="OTP Verification Code"
                  type="text"
                  placeholder={isApiMode ? "Enter OTP" : "Enter OTP (use 0000)"}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  error={otpError}
                  maxLength={6}
                  iconLeft={<ShieldCheck size={18} />}
                  required
                />

                <div className="otp-timer-info flex justify-between align-center" style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  <span>Verifying for: {phone}</span>
                  {resendTimer > 0 ? (
                    <span className="flex align-center gap-xs">
                      <Timer size={12} /> Resend in {resendTimer}s
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      style={{ color: 'var(--primary)', fontWeight: 'bold', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
                    >
                      Resend OTP
                    </button>
                  )}
                </div>

                <div className="step-actions flex gap-md" style={{ marginTop: 'var(--space-xs)' }}>
                  <Button type="button" variant="outlined" onClick={handleBackToPhone} style={{ flex: 1 }}>
                    Back
                  </Button>
                  <Button type="submit" variant="secondary" loading={loading} style={{ flex: 1.5 }}>
                    Verify & Login
                  </Button>
                </div>
              </form>
            )}
          </FadeIn>
        </div>
      </div>
    </div>
  );
}

export default Login;
