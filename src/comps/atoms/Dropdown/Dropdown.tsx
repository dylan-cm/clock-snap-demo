import React, { FC, ChangeEvent, useState } from "react";
import "./Dropdown.css";
import { calculateContrast } from "../../../utils/helper";

interface DropdownProps {
  options: any[];
  label: string;
  selectedOption: string;
  onChange: (selectedOption: string) => void;
}

const Dropdown: FC<DropdownProps> = ({
  selectedOption,
  options,
  onChange,
  label,
}) => {
  const [index, setIndex] = useState(-1);
  const handleDropdownChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setIndex(
      options.findIndex((option) => option.name === e.target.value.toString())
    );
    onChange(e.target.value);
  };

  return (
    <select
      className="Dropdown"
      onChange={handleDropdownChange}
      value={selectedOption}
      style={{
        backgroundColor:
          index >= 0 && !!options[index].color ? options[index].color : "white",
        color:
          index >= 0 && options[index].color
            ? calculateContrast(options[index].color || "white")
            : "black",
      }}
    >
      <option value="">{label}</option>
      {options.map((option, index) => (
        <option key={index} value={option.name}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
