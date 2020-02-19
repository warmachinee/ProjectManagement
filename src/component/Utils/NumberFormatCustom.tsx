import React from "react";
import NumberFormat from "react-number-format";

export interface NumberFormatCustomProps {
  inputRef: (instance: NumberFormat | null) => void;
  onChange: (event: { target: { value: string } }) => void;
}

export default function NumberFormatCustom(props: NumberFormatCustomProps) {
  const { inputRef, onChange, ...other } = props;

  return (
    <NumberFormat
      {...other}
      getInputRef={inputRef}
      onValueChange={values => {
        onChange({
          target: {
            value: values.value
          }
        });
      }}
      thousandSeparator
      isNumericString
    />
  );
}
