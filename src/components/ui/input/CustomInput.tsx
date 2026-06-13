import { ChangeEventHandler, HTMLInputTypeAttribute } from "react";
import { Input } from "@nextui-org/react";

interface types {
  type?: HTMLInputTypeAttribute;
  onChange?: ChangeEventHandler<any> | undefined;
  readOnly?: boolean;
  validate?: boolean;
  onKeyDown?: any;
  placeholder: string,
  label?: string,
  value?: string | (readonly string[] & string) | undefined,
  min?: number;
  max?: number;
  textAlign?: any;
  direction?: any;
  errorMessage?: string
}

function CustomInput(props: types) {
  return (
    <Input
      classNames={{
        input: "border-none bg-none text-[#fff]",
        inputWrapper: "!bg-[#1b1b1b] group-data-[disabled=true]:bg-[#ECE7E7] border border-[#C0C0C0] rounded-[10px] group-data-[invalid=true]:!bg-transparent",
        mainWrapper: "rounded-[10px]",
        label: "text-[#A8A8A8] text-sm",
        errorMessage: "text-start text-xs",
      }}
      style={{
        color:"#fff"
      }}
      className={"text-[#fff] text-sm"}
      label={props.placeholder}
      min={props.min}
      max={props.max}
      isDisabled={props.readOnly}
      autoComplete="new-password"
      readOnly={props.readOnly}
      type={props.type}
      onChange={props.onChange}
      onKeyDown={props.onKeyDown}
      errorMessage={props.errorMessage}
      value={props.value}
      isInvalid={props.errorMessage !== undefined}
    />
  );
}

export default CustomInput;