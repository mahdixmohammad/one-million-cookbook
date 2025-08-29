"use client";

import Select, {
  CSSObjectWithLabel,
  GroupBase,
  StylesConfig,
} from "react-select";
import React from "react";

export type Option = {
  value: string;
  label: string;
};

type CustomSelectProps = {
  size?: "small" | "medium";
  options: Option[];
  value?: Option | null;
  onChange: (option: Option | null) => void;
  placeholder?: string;
  isRtl?: boolean;
  isClearable?: boolean;
};

export default function CustomSelect({
  size = "medium",
  options,
  value,
  onChange,
  placeholder = "Select...",
  isRtl = false,
  isClearable = true,
}: CustomSelectProps) {
  let height: string;
  if (size === "small") {
    height = "32px";
  } else if (size === "medium") {
    height = "42px";
  }

  const customStyles: StylesConfig<Option, false, GroupBase<Option>> = {
    control: (provided: CSSObjectWithLabel) => ({
      ...provided,
      minHeight: height,
      height,
      borderColor: "black",
      boxShadow: "none",
      "&:hover": {
        borderColor: "black",
      },
    }),
    valueContainer: (provided: CSSObjectWithLabel) => ({
      ...provided,
      padding: "0 3px",
    }),
    indicatorsContainer: (provided: CSSObjectWithLabel) => ({
      ...provided,
      height,
    }),
    menu: (provided: CSSObjectWithLabel) => ({
      ...provided,
      marginTop: 4,
      overflow: "hidden",
      borderRadius: 8,
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

  return (
    <Select
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      isRtl={isRtl}
      isClearable={isClearable}
      styles={customStyles}
      noOptionsMessage={() => "لا يوجد خيارات"}
    />
  );
}
