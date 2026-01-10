import React from "react";

const Button = ({
  children,
  onClick,
  color = "primary",
  size = "medium",
  ...props
}) => {
  const colorClasses = {
    primary: "bg-blue-800 text-white hover:bg-blue-600 rounded",
    secondary: "bg-gray-500 text-white hover:bg-gray-600 rounded",
    danger: "bg-red-500 text-white hover:bg-red-600 rounded",
  };

  const sizeClasses = {
    small: "px-3 py-1 text-sm",
    medium: "px-4 py-2 text-base",
    large: "px-6 py-3 text-lg",
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
      {children}
    </button>
  );
};

export default Button;
