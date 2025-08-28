"use client";

import Select, {
  CSSObjectWithLabel,
  GroupBase,
  StylesConfig,
} from "react-select";
import React from "react";

// Type for each option
export type Option = {
  value: string;
  label: string;
};

// Custom styles for all selects
const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
  control: (provided: CSSObjectWithLabel, state) => ({
    ...provided,
    minHeight: "32px",
    height: "32px",
    borderColor: state.isFocused ? "black" : "rgb(120,120,120)",
    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "black" : "black",
    },
  }),
  valueContainer: (provided: CSSObjectWithLabel) => ({
    ...provided,
    padding: "0 3px",
  }),
  indicatorsContainer: (provided: CSSObjectWithLabel) => ({
    ...provided,
    height: "32px",
  }),
  menu: (provided: CSSObjectWithLabel) => ({
    ...provided,
    marginTop: 4,
    overflow: "hidden",
    borderRadius: 8, // rounded menu
  }),
  menuList: (provided: CSSObjectWithLabel) => ({
    ...provided,
    padding: 0,
    borderRadius: 8,
  }),
  option: (provided: CSSObjectWithLabel, state) => ({
    ...provided,
    margin: 0,
    fontSize: "0.9rem",
    padding: "6px 6px",
    backgroundColor: state.isFocused ? "rgb(240,240,240)" : "white",
    color: "black",
    cursor: "pointer",
  }),
};

// Props for our wrapper
type CustomSelectProps = {
  options: Option[];
  value?: Option | null;
  onChange: (option: Option | null) => void;
  placeholder?: string;
  isRtl?: boolean;
  isClearable?: boolean;
};

// Wrapper component
export default function CustomSelect({
  options,
  value,
  onChange,
  placeholder = "Select...",
  isRtl = false,
  isClearable = true,
}: CustomSelectProps) {
  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isRtl={isRtl}
      isClearable={isClearable}
      styles={customStyles}
    />
  );
}
