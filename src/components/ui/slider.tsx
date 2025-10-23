import * as React from "react";
import { cn } from "@/lib/utils";

export type SliderProps = {
  value?: number[];
  defaultValue?: number[];
  onValueChange?: (val: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
} & React.ComponentPropsWithoutRef<"input">;

const Slider = React.forwardRef<HTMLInputElement, SliderProps>(
  (
    {
      value,
      defaultValue,
      onValueChange,
      min = 0,
      max = 100,
      step = 1,
      className,
      ...rest
    },
    ref
  ) => {
    const isControlled = Array.isArray(value) && typeof value[0] === "number";
    const initial = isControlled
      ? (value as number[])[0]
      : (Array.isArray(defaultValue) && typeof defaultValue[0] === "number"
          ? (defaultValue as number[])[0]
          : min);

    const [internal, setInternal] = React.useState<number>(initial);

    React.useEffect(() => {
      if (isControlled) {
        setInternal((value as number[])[0] as number);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isControlled ? (value as number[])[0] : null]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const v = Number(e.target.value);
      if (!isControlled) setInternal(v);
      onValueChange?.([v]);
    };

    const current = isControlled ? (value as number[])[0] : internal;

    return (
      <div className={cn("relative flex w-full items-center", className)}>
        <input
          ref={ref}
          type="range"
          min={min}
          max={max}
          step={step}
          value={current}
          onChange={handleChange}
          className={cn(
            "w-full h-2 rounded-full appearance-none outline-none",
            "bg-secondary [&::-webkit-slider-thumb]:appearance-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
            "[&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full",
            "[&::-webkit-slider-thumb]:bg-background [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-primary",
            "[&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-primary [&::-moz-range-thumb]:bg-background"
          )}
          {...rest}
        />
      </div>
    );
  }
);
Slider.displayName = "Slider";

export { Slider };
