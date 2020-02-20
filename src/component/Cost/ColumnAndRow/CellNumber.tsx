import React, { useContext } from "react";
import { TableCell, InputBase, makeStyles } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import NumberFormatCustom from "../../Utils/NumberFormatCustom";

const useStyles = makeStyles(theme => ({
  input: { textAlign: "right", fontSize: 14 }
}));

const CellNumber: React.FC<any> = ({
  label,
  objKey,
  values,
  setValues,
  onEdit
}) => {
  const classes = useStyles();
  const { _onEnter } = useContext(AppContext);

  const handleChange = (name: any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value
    });
  };

  return (
    <TableCell>
      <InputBase
        fullWidth
        classes={{ input: classes.input }}
        value={values[objKey]}
        placeholder={label}
        onChange={handleChange(objKey)}
        onFocus={e => e.target.select()}
        onKeyPress={_onEnter(onEdit)}
        inputComponent={NumberFormatCustom as any}
      />
    </TableCell>
  );
};

export default CellNumber;
