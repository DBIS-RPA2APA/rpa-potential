import React from "react";

const Button = ({
  children,
  onClick,
  color = "primary",
  size = "medium",
  icon,
  ...props
}) => {
  const colorClasses = {
    primary:
      "bg-[#FF6200]/90 text-white hover:bg-[#FF6200] rounded-full backdrop-blur-md hover:rotate-3",
    secondary:
      "bg-white/5 text-white border-1 border-white hover:bg-white/30 rounded-full backdrop-blur-md hover:-rotate-3",
    thirdary:
      "bg-[#10214D] text-white hover:bg-[#10214D] rounded-full backdrop-blur-md hover:-rotate-1",
    danger:
      "bg-red-500 text-white hover:bg-red-600 rounded-full backdrop-blur-md",
  };

  const sizeClasses = {
    small: "px-8 py-2 text-sm font-bold",
    medium: "px-5 py-3 text-base",
    large: "px-6 py-3 text-lg",
    width: "px-6 py-3 text-lg w-full",
  };
  const baseClasses =
    "cursor-pointer rounded-3xl transition-all duration-150 ease-in-out hover:scale-105 hover:shadow-lg";

  const disabledClasses =
    "disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none";

  const classes = `
    ${baseClasses}
    ${colorClasses[color]}
    ${sizeClasses[size]}
    ${disabledClasses}
    focus:outline-none
    focus:ring-2
    focus:ring-offset-2
    focus:ring-amber-500
  `;
  return (
    <button
      onClick={onClick}
      disabled={props.disabled}
      className={classes}
      {...props}
    >
      <span className="flex items-center justify-center gap-2">
        {icon && <span className="flex items-center">{icon}</span>}
        {children}
      </span>
    </button>
  );
};

export default Button;
