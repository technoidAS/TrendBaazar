import React, { useEffect, useRef } from 'react';
import {
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
} from 'lucide-react';

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

export function InteractiveBubbles() {
  const containerRef = useRef(null);
  const bubblesRef = useRef([]);
  const physicsRef = useRef([]);
  const mousePosRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Get initial dimensions
    const rect = container.getBoundingClientRect();
    const width = rect.width || window.innerWidth;
    const height = rect.height || window.innerHeight;

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
      const currentContainer = containerRef.current;
      if (!currentContainer) return;
      const rect = currentContainer.getBoundingClientRect();
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

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 1
      }}
    >
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
    </div>
  );
}

export default InteractiveBubbles;
