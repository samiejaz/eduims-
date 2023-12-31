import { Dropdown } from "primereact/dropdown";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller } from "react-hook-form";

const CDropdown = ({
  control,
  name,
  onChange,
  focusOptions,
  options = [],
  placeholder = "",
  optionLabel = "label",
  optionValue = "value",
  required = false,
  showOnFocus = true,
  showClear = false,
  filter = false,
  disabled = false,
  ...moreOptions
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={{ required }}
      render={({ field, fieldState }) => (
        <Dropdown
          id={field.name}
          value={field.value}
          optionLabel={optionLabel}
          optionValue={optionValue}
          placeholder={placeholder}
          options={options}
          focusInputRef={field.ref}
          onChange={(e) => {
            field.onChange(e.value);
            if (onChange) {
              onChange(e);
            }
            if (focusOptions) {
              if (
                e.originalEvent.key === "ArrowDown" ||
                e.originalEvent.key === "ArrowUp"
              ) {
              } else {
                focusOptions();
              }
            }
          }}
          onKeyDown={(e) => {
            if (focusOptions) {
              if (e.key === "Enter") {
                focusOptions();
              }
            }
          }}
          showOnFocus={showOnFocus}
          disabled={disabled}
          showClear={showClear}
          className={classNames({
            "p-invalid": fieldState.error,
          })}
          filter={filter}
          style={{
            width: "100%",
            backgroundColor: disabled === true ? "#dee2e6" : "white",
            color: "black",
          }}
          pt={{
            input: {
              style: {
                padding: "0.25rem 0.4rem",
                fontSize: ".9em",
              },
            },
            item: {
              style: {
                padding: "0.4rem 0.4rem",
              },
            },
          }}
          resetFilterOnHide
          {...moreOptions}
        />
      )}
    />
  );
};

export default CDropdown;
