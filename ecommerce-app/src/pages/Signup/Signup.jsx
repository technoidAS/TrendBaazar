import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ArrowRight, Image, Mail, Phone, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useToast } from '../../context/ToastContext/ToastContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import FadeIn from '../../components/animations/FadeIn';
import Home from '../Home/Home';
import '../Login/Login.css';

export function Signup() {
  const { signup, requestOtp, verifyOtp, error: authError } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [step, setStep] = useState('signup');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [address, setAddress] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState('');
  const [otpError, setOtpError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const redirectPath = location.state?.from?.pathname || '/profile';

  useEffect(() => {
    const prefilledPhone = location.state?.phone || '';
    if (prefilledPhone) {
      setPhone(prefilledPhone);
    }
  }, [location.state]);

  const handleSignup = async (e) => {
    e.preventDefault();
    setFormError('');
    setSuccessMsg('');

    if (!phone || phone.trim().length < 8) {
      setFormError('Please enter a valid mobile number');
      return;
    }

    if (!name.trim()) {
      setFormError('Please enter your full name');
      return;
    }

    setLoading(true);
    try {
      await signup({ phone, name, email, avatar, address });
      const otpResponse = await requestOtp(phone);
      setSuccessMsg(otpResponse.message || `Account created. OTP sent to ${phone}.`);
      setStep('otp');
      addToast('Account created. Verify the OTP to continue.', 'success');
    } catch (err) {
      setFormError(err.message || 'Failed to create account');
      addToast(err.message || 'Failed to create account', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setOtpError('');

    const trimmedOtp = otp.trim();
    if (!trimmedOtp) {
      setOtpError('Please enter the OTP code');
      return;
    }

    setLoading(true);
    try {
      const loggedUser = await verifyOtp(phone, trimmedOtp);
      addToast(`Welcome to TrendBaazar, ${loggedUser.name}!`, 'success');
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

  return (
    <div className="login-page-container">
      <div className="blurred-homepage-bg">
        <Home />
      </div>

      <div className="login-card-wrapper glass-panel">
        <div className="login-form-pane">
          <FadeIn className="login-form-wrapper">
            <div className="login-form-header">
              <h1 className="auth-title">Create Account</h1>
              <p className="auth-subtitle">
                New users register first, then verify the OTP to activate the account.
              </p>
            </div>

            {(authError || formError) && (
              <div className="auth-error-banner anim-shake">
                <span>{authError || formError}</span>
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

            {step === 'signup' ? (
              <form onSubmit={handleSignup} className="auth-form-tag">
                <Input
                  label="Full Name"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  iconLeft={<User size={18} />}
                  required
                />

                <Input
                  label="Mobile Phone Number"
                  type="tel"
                  placeholder="e.g. +1 (555) 019-2834"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  iconLeft={<Phone size={18} />}
                  required
                />

                <Input
                  label="Email Address (Optional)"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  iconLeft={<Mail size={18} />}
                />

                <Input
                  label="Avatar URL (Optional)"
                  type="url"
                  placeholder="https://..."
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  iconLeft={<Image size={18} />}
                />

                <Input
                  label="Address (Optional)"
                  type="text"
                  placeholder="Your address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />

                <div className="auth-help-links flex justify-between align-center">
                  <span className="demo-credentials-helper">Already have an account?</span>
                  <Link to="/login" style={{ color: 'var(--primary)', fontSize: '11px', fontWeight: 600 }}>
                    Back to login
                  </Link>
                </div>

                <Button type="submit" variant="primary" loading={loading} className="auth-submit-btn" iconRight={<ArrowRight size={18} />}>
                  Create Account
                </Button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="auth-form-tag">
                <Input
                  label="OTP Verification Code"
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  error={otpError}
                  maxLength={6}
                  iconLeft={<ShieldCheck size={18} />}
                  required
                />

                <div className="demo-credentials-helper">
                  Verify the OTP sent to {phone} to finish setting up your account.
                </div>

                <div className="step-actions flex gap-md" style={{ marginTop: 'var(--space-xs)' }}>
                  <Button type="button" variant="outlined" onClick={() => setStep('signup')} style={{ flex: 1 }}>
                    Back
                  </Button>
                  <Button type="submit" variant="secondary" loading={loading} style={{ flex: 1.5 }}>
                    Verify Account
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

export default Signup;