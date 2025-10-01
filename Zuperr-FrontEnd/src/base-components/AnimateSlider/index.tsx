// AnimatedSlider.tsx
import * as SliderPrimitive from "@radix-ui/react-slider";
import { motion } from "framer-motion";
import React from "react";

interface AnimatedSliderProps {
  value: number;
  onValueChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
}

const AnimatedSlider: React.FC<AnimatedSliderProps> = ({
  value,
  onValueChange,
  min,
  max,
  step,
}) => {
  const handleChange = (values: number[]) => {
    onValueChange(values[0]);
  };

  // Calculate the width percentage of the filled range.
  const rangeWidth = ((value - min) / (max - min)) * 100;

  return (
    <SliderPrimitive.Root
      value={[value]}
      onValueChange={handleChange}
      min={min}
      max={max}
      step={step}
      className="relative flex items-center select-none touch-none w-full h-5"
    >
      <SliderPrimitive.Track className="bg-gray-200 relative flex-1 rounded h-2">
        <SliderPrimitive.Range asChild>
          <motion.div
            className="absolute h-full bg-blue-600 rounded"
            initial={{ width: 0 }}
            animate={{ width: `${rangeWidth}%` }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </SliderPrimitive.Range>
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb asChild>
        <motion.div
          className="block w-5 h-5 bg-white rounded-full shadow"
          whileHover={{ scale: 1.2 }}
          whileTap={{ scale: 0.9 }}
        />
      </SliderPrimitive.Thumb>
    </SliderPrimitive.Root>
  );
};

export default AnimatedSlider;
