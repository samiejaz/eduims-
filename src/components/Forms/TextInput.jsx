import { InputText } from "primereact/inputtext";
import { Controller } from "react-hook-form";

function TextInput({
  Label = "",
  ID,
  control,
  required,
  isEnable = true,
  floatLabel = false,
  ...options
}) {
  return (
    <Controller
      name={ID}
      control={control}
      rules={{ required }}
      render={({ field }) => (
        <>
          <label htmlFor={field.name}>{Label}</label>
          <span className={floatLabel ? "p-float-label" : ""}>
            <InputText
              disabled={!isEnable}
              id={field.name}
              value={field.value}
              onChange={(e) => field.onChange(e.target.value)}
              style={{
                width: "100%",
                backgroundColor: isEnable === false ? "#dee2e6" : "white",
                color: "black",
              }}
              pt={{
                root: { style: { padding: "0.3rem 0.4rem", fontSize: ".9em" } },
              }}
              {...options}
            />
          </span>
        </>
      )}
    />
  );
}

export default TextInput;
