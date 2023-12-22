import React from "react";
import { Controller } from "react-hook-form";
import { InputNumber } from "primereact/inputnumber";

const NumberInput = ({
  label = "",
  id,
  control,
  disabled = false,
  required = false,
  ...options
}) => {
  return (
    <Controller
      name={id}
      control={control}
      rules={{
        required: true,
      }}
      render={({ field }) => (
        <>
          <label htmlFor={field.name}>{label}</label>
          <InputNumber
            id={field.name}
            disabled={disabled}
            inputRef={field.ref}
            value={field.value}
            onBlur={field.onBlur}
            onValueChange={(e) => {
              field.onChange(e);
            }}
            {...options}
          />
        </>
      )}
    />
  );
};

export default NumberInput;
