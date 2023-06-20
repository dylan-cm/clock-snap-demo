import React, { FC, ChangeEvent, useState } from "react";
import "./Dropdown.css";

interface DropdownProps {
  options: { value: string | number; color?: string }[];
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
      options.findIndex(
        (option) => option.value.toString() === e.target.value.toString()
      )
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
      }}
    >
      <option value="" disabled>
        {label}
      </option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.value}
        </option>
      ))}
    </select>
  );
};

export default Dropdown;
