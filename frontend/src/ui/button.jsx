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
    primary: "bg-blue-800 text-white hover:bg-blue-700 rounded",
    secondary: "bg-gray-400 text-white hover:bg-gray-500 rounded",
    danger: "bg-red-500 text-white hover:bg-red-600 rounded",
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-3 py-2 text-base",
    large: "px-6 py-3 text-lg",
    width: "px-6 py-2 text-lg w-full",
  };
  const baseClasses =
    "cursor-pointer rounded transition-all duration-150 ease-in-out hover:scale-[1.02] hover:shadow-md";

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
    focus:ring-blue-500
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
