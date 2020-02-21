import React, { useContext } from "react";
import { DatePicker } from "@material-ui/pickers";
import { TableCell, useTheme } from "@material-ui/core";
import { AppContext } from "../../../AppContext";

const CellDate: React.FC<any> = ({
  label,
  _dateToString,
  keys,
  values,
  setValues
}) => {
  const theme = useTheme();
  const { sess } = useContext(AppContext);
  let color = sess.type === "manager" ? theme.palette.text.primary : undefined;
  return (
    <TableCell>
      <DatePicker
        clearable
        fullWidth
        disabled={sess.type === "manager"}
        style={{ color }}
        inputVariant="outlined"
        label={label}
        value={values[keys] ? new Date(values[keys]) : new Date()}
        onChange={(d: any) =>
          setValues({ ...values, [keys]: d ? new Date(d).toISOString() : d })
        }
        labelFunc={() => {
          return values[keys]
            ? _dateToString(new Date(values[keys]))
            : "Select date";
        }}
      />
    </TableCell>
  );
};

export default CellDate;
