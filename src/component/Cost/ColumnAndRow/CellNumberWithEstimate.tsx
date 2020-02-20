import React, { useContext } from "react";
import { TableCell, InputBase, makeStyles } from "@material-ui/core";
import { AppContext } from "../../../AppContext";
import NumberFormatCustom from "../../Utils/NumberFormatCustom";

const useStyles = makeStyles(theme => ({
  input: { textAlign: "right", fontSize: 14 }
}));

const CellNumberWithEstimate: React.FC<any> = ({
  label,
  objKey,
  values,
  setValues,
  setEstimate,
  onEdit,
  estimateSumWithKey
}) => {
  const classes = useStyles();
  const { _checkIsNaN, _onEnter } = useContext(AppContext);

  const handleChange = (name: any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setEstimate(estimateSumWithKey(name, event.target.value));
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

export default CellNumberWithEstimate;
