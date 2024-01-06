import { InputSwitch } from "primereact/inputswitch";
import { classNames } from "primereact/utils";
import React from "react";
import { Controller } from "react-hook-form";

const CSwitchInput = ({
  control,
  name,
  required = false,
  disabled = false,
  focusOptions,
  onChange,
}) => {
  return (
    <>
      <Controller
        name={name}
        control={control}
        rules={{ required: "Accept is required." }}
        render={({ field, fieldState }) => (
          <>
            <label
              htmlFor={field.name}
              className={classNames({ "p-error": errors.checked })}
            ></label>
            <InputSwitch
              inputId={field.name}
              checked={field.value}
              inputRef={field.ref}
              className={classNames({ "p-invalid": fieldState.error })}
              onChange={(e) => field.onChange(e.value)}
            />
          </>
        )}
      />
    </>
  );
};

export default CSwitchInput;
