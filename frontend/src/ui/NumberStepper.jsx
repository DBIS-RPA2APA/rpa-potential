import React from "react";
import { LuPlus , LuMinus} from "react-icons/lu";

const NumberStepper = ({
    value,
    onChange,
    min = "0",
    max = "1",
    step = "0.1",
    disabled = false, 
    className = "",
    inputClassName = "", 
}) => {
    const clamp = (v) => Math.min(max, Math.max(min, v));
    const roundToStep = (v) => {
        const decimals = (step.toString().split(".")[1] || "").length;
        return Number(v.toFixed(decimals));
    };
    const handleDecrease = () => {
      const current = value === "" ? min : Number(value);
      const next = clamp(roundToStep(current - step));
      onChange(next);
  };

  const handleIncrease = () => {
    const current = value === "" ? min : Number(value);
    const next = clamp(roundToStep(current + step));
    onChange(next);
  };


  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange("");
      return;
    }
    const parsed = Number(raw);
    if (Number.isNaN(parsed)) return;
    onChange(parsed);
  };

  const handleBlur = () => {
    const current = value === "" ? min : Number(value);
    onChange(clamp(roundToStep(current)));
  };

    return (
       <div
      className={`inline-flex items-center rounded-full bg-slate-200/80 p-1 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled}
        className="flex h-6 w-6 shrink-0 items-center justify-center m-1 p-1 rounded-full text-2xl leading-none text-slate-500 transition hover:bg-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Decrease value"
      >
        <LuMinus />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`h-8 w-16 shrink-0 appearance-none rounded-full bg-slate-0 text-center text-md font-semibold text-slate-900 outline-none [appearance:number] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName}`}
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled}
        className="flex h-6 w-6 shrink-0 items-center justify-center m-1 p-1 rounded-full text-2xl leading-none text-slate-500 transition hover:bg-slate-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
        aria-label="Increase value"
      >
        <LuPlus />
      </button>
    </div>

    );
};

export default NumberStepper;