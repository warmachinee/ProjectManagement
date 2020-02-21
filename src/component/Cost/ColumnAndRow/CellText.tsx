import React, { useContext } from "react";
import { TableCell, InputBase, makeStyles, useTheme } from "@material-ui/core";
import { AppContext } from "../../../AppContext";

const CellText: React.FC<any> = ({
  label,
  objKey,
  values,
  setValues,
  textAlign = "left"
}) => {
  const { sess } = useContext(AppContext);
  const theme = useTheme();
  const classes = makeStyles(theme => ({
    input: { fontSize: 14, textAlign }
  }))();

  const handleChange = (name: any) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setValues({
      ...values,
      [name]: event.target.value
    });
  };

  let color = sess.type === "manager" ? theme.palette.text.primary : undefined;

  return (
    <TableCell>
      <div style={{ display: "flex" }}>
        <InputBase
          disabled={sess.type === "manager"}
          classes={{ input: classes.input }}
          style={{ color }}
          fullWidth
          multiline
          rowsMax="6"
          value={values[objKey]}
          placeholder={label}
          onChange={handleChange(objKey)}
        />
      </div>
    </TableCell>
  );
};

export default CellText;
