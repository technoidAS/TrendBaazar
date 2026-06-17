import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  ShoppingBag,
  ShieldCheck,
  Phone,
  ArrowRight,
  Timer,
  ShoppingCart,
  Tag,
  Gift,
  Sparkles,
  Percent,
  Truck,
  Heart,
  CreditCard,
  Package,
  Gamepad2,
  Headphones,
  Watch,
  Smartphone,
  Shirt,
  Smile,
  Compass,
  Flame
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext/AuthContext';
import { useToast } from '../../context/ToastContext/ToastContext';
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import FadeIn from '../../components/animations/FadeIn';
import Home from '../Home/Home';
import './Login.css';

const BUBBLE_ICONS = [
  ShoppingBag,
  ShoppingCart,
  Tag,
  Gift,
  Sparkles,
  Percent,
  Truck,
  Heart,
  CreditCard,
  Package,
  Gamepad2,
  Headphones,
  Watch,
  Smartphone,
  Shirt,
  Smile,
  Compass,
  Flame
];
const BUBBLE_COUNT = 18;
const BUBBLE_COLORS = [
  '#f97316', '#f59e0b', '#ea580c', '#eab308', '#d97706', '#b45309', '#ca8a04', '#854d0e', '#7c2d12', '#78350f',
  '#fafaf9', '#c7c2be', '#fef08a', '#ffedd5', '#fed7aa', '#fde047', '#ea580c', '#f97316'
];

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

  // Refs for physics bubbles
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  const physicsRef = useRef([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

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

  // Physics loop inside useEffect
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get initial dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    // Initialize bubble physics parameters
    const physics = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
      const size = Math.floor(Math.random() * 25 + 45); // size 45px to 70px
      physics.push({
        x: Math.random() * (width - size),
        y: Math.random() * (height - size),
        vx: (Math.random() - 0.5) * 0.8, // subtle horizontal drift
        vy: (Math.random() - 0.5) * 0.8, // subtle vertical drift
        size,
        scale: 1,
        targetScale: 1
      });
    }
    physicsRef.current = physics;

    let animationFrameId;

    const updatePhysics = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const mouse = mousePosRef.current;

      physicsRef.current.forEach((b, idx) => {
        // Move
        b.x += b.vx;
        b.y += b.vy;

        // Collision with walls
        if (b.x < 0) {
          b.x = 0;
          b.vx = Math.abs(b.vx);
        } else if (b.x > width - b.size) {
          b.x = width - b.size;
          b.vx = -Math.abs(b.vx);
        }

        if (b.y < 0) {
          b.y = 0;
          b.vy = Math.abs(b.vy);
        } else if (b.y > height - b.size) {
          b.y = height - b.size;
          b.vy = -Math.abs(b.vy);
        }

        // Repulsion physics from mouse pointer
        const bubbleCenterX = b.x + b.size / 2;
        const bubbleCenterY = b.y + b.size / 2;
        const dx = bubbleCenterX - mouse.x;
        const dy = bubbleCenterY - mouse.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        const repulseRadius = 180;
        if (distance < repulseRadius && distance > 0) {
          b.targetScale = 1.35;
          const strength = (repulseRadius - distance) / repulseRadius;
          const forceX = (dx / distance) * strength * 2.5;
          const forceY = (dy / distance) * strength * 2.5;

          b.vx += forceX * 0.1;
          b.vy += forceY * 0.1;

          // Cap speed
          const maxSpeed = 3.5;
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed > maxSpeed) {
            b.vx = (b.vx / speed) * maxSpeed;
            b.vy = (b.vy / speed) * maxSpeed;
          }
        } else {
          b.targetScale = 1.0;
          // Apply friction
          b.vx *= 0.995;
          b.vy *= 0.995;

          // Re-energize if speed is too slow
          const speed = Math.sqrt(b.vx * b.vx + b.vy * b.vy);
          if (speed < 0.25) {
            const angle = Math.random() * Math.PI * 2;
            b.vx = Math.cos(angle) * 0.45;
            b.vy = Math.sin(angle) * 0.45;
          }
        }

        // Interpolate scale
        b.scale += (b.targetScale - b.scale) * 0.1;

        // Apply styles directly to DOM
        const el = bubblesRef.current[idx];
        if (el) {
          el.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) scale(${b.scale})`;
        }
      });

      animationFrameId = requestAnimationFrame(updatePhysics);
    };

    animationFrameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mousePosRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handleMouseLeave = () => {
    mousePosRef.current = { x: -1000, y: -1000 };
  };

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
    <div
      className="login-page-container"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* Blurred Home Page in the background */}
      <div className="blurred-homepage-bg">
        <Home />
      </div>

      {/* Floating Interactive Background Bubbles */}
      <div className="login-page-bubbles">
        {Array.from({ length: BUBBLE_COUNT }).map((_, i) => {
          const outlineColor = BUBBLE_COLORS[i % BUBBLE_COLORS.length];
          return (
            <div
              key={i}
              className="bubble-item"
              ref={(el) => (bubblesRef.current[i] = el)}
              style={{
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.01)',
                border: `1px solid ${outlineColor}4d`,
                boxShadow: `0 8px 32px 0 ${outlineColor}1a`,
                color: outlineColor,
                backdropFilter: 'blur(3px)',
                cursor: 'pointer',
                userSelect: 'none',
                pointerEvents: 'auto',
                width: '50px',
                height: '50px',
                left: '0px',
                top: '0px',
              }}
            >
              {React.createElement(BUBBLE_ICONS[i % BUBBLE_ICONS.length], { size: 20 })}
            </div>
          );
        })}
      </div>

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
                  placeholder="e.g. +1 (555) 019-2834"
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
