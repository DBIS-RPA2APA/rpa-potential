import { LuPlus, LuMinus } from "react-icons/lu";

const NumberStepper = ({
  value,
  onChange,
  min,
  max,
  step,
  disabled = false,
  className = "",
  inputClassName = "",
}) => {
  //  .toFixed(1);

  const handleDecrease = () => {
    const current = value === "" ? min : value;

    if (current <= min) return;
    const next = Number((current - step).toFixed(1));
    onChange(next);
  };

  const handleIncrease = () => {
    const current = value === "" ? min : value;
    if (current >= max) return;
    const next = Number((current + step).toFixed(1));
    onChange(next);
  };

  const handleInputChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      onChange("");
      return;
    }
    const parsed = Number(raw);
    if (parsed > max) return onChange(max);
    if (parsed < min) return onChange(min);
    if (Number.isNaN(parsed)) return;
    onChange(parsed);
  };

  return (
    <div
      className={`inline-flex items-center rounded-full bg-slate-200 p-1 shadow-inner ${className}`}
    >
      <button
        type="button"
        onClick={handleDecrease}
        disabled={disabled}
        className="flex h-6 w-6 shrink-0 items-center justify-center m-1 p-1 rounded-full text-2xl leading-none text-slate-500 transition hover:bg-slate-500 hover:text-white "
      >
        <LuMinus />
      </button>

      <input
        type="number"
        value={value}
        onChange={handleInputChange}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={`h-8 w-16 shrink-0 rounded-full bg-slate-0 text-center text-md font-semibold text-slate-900 outline-none [appearance:number] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none ${inputClassName}`}
      />

      <button
        type="button"
        onClick={handleIncrease}
        disabled={disabled}
        className="flex h-6 w-6 shrink-0 items-center justify-center m-1 p-1 rounded-full text-2xl leading-none text-slate-500 transition hover:bg-slate-500 hover:text-white"
      >
        <LuPlus />
      </button>
    </div>
  );
};

export default NumberStepper;
