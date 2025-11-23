import { Minus, Plus } from "lucide-react";
import {
  InputGroup,
  InputGroupButton,
  InputGroupInput,
} from "./ui/input-group";
import { useState } from "react";

export interface CounterProps {
  initValue?: number;
  maxValue?: number;
  minValue?: number;
  onMinus?: () => {};
  onPlus?: () => {};
}

const Counter = ({
  initValue = 1,
  maxValue = 999,
  minValue = 1,
}: CounterProps) => {
  const [value, setValue] = useState<number>(initValue);
  const handleMinus = () => {
    if (value - minValue) {
      setValue((prev) => prev - 1);
    }
  };
  const handlePlus = () => {
    if (maxValue - value) {
      setValue((prev) => prev + 1);
    }
  };
  return (
    <InputGroup className="w-[130px] rounded-sm">
      <InputGroupButton
        className="mx-1 hover:bg-primary/30"
        onClick={handleMinus}
        disabled={value <= minValue}
      >
        <Minus />
      </InputGroupButton>
      <InputGroupInput type="text" className="text-center" value={value} />
      <InputGroupButton
        className="mx-1 hover:bg-primary/30 "
        onClick={handlePlus}
        disabled={value >= maxValue}
      >
        <Plus />
      </InputGroupButton>
    </InputGroup>
  );
};

export default Counter;
