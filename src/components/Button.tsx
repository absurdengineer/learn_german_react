import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost" | "danger" | "success";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  loading = false,
  className = "",
  type = "button",
}) => {
  // Modern, pill-like, subtle style
  const baseClasses =
    "relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 active:scale-97 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100 shadow-sm";

  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-300",
    secondary:
      "bg-gray-100 hover:bg-gray-200 text-blue-900 focus:ring-blue-200",
    ghost: "bg-transparent text-blue-700 hover:bg-blue-50 focus:ring-blue-100",
    danger: "bg-red-500 hover:bg-red-600 text-white focus:ring-red-300",
    success: "bg-green-500 hover:bg-green-600 text-white focus:ring-green-300",
  };

  // Larger, more pill-like sizes
  const sizeClasses = {
    sm: "px-6 py-3 text-base min-h-[48px]",
    md: "px-8 py-4 text-lg min-h-[56px]",
    lg: "px-10 py-5 text-xl min-h-[64px]",
  };

  const widthClass = fullWidth ? "w-full" : "";

  // Ripple effect
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (onClick) onClick();
    const button = e.currentTarget;
    const circle = document.createElement("span");
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${
      e.clientX - button.getBoundingClientRect().left - radius
    }px`;
    circle.style.top = `${
      e.clientY - button.getBoundingClientRect().top - radius
    }px`;
    circle.className = "ripple";
    button.appendChild(circle);
    setTimeout(() => {
      circle.remove();
    }, 600);
  };

  return (
    <button
      type={type}
      onClick={handleClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${widthClass} ${className}`}
    >
      {/* Ripple effect span style */}
      <style>{`
        .ripple {
          position: absolute;
          border-radius: 50%;
          transform: scale(0);
          animation: ripple 0.6s linear;
          background: rgba(255,255,255,0.5);
          pointer-events: none;
          z-index: 1;
        }
        @keyframes ripple {
          to {
            transform: scale(2.5);
            opacity: 0;
          }
        }
      `}</style>
      {loading && (
        <div className="mr-3 animate-spin rounded-full h-6 w-6 border-b-2 border-white/80 z-10" />
      )}
      <span className="z-10 flex items-center">{children}</span>
    </button>
  );
};

export default Button;
