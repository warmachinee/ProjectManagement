import React from "react";
import { TableCell, InputBase, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  input: { fontSize: 14 }
}));

const CellText: React.FC<any> = ({ label, objKey, values, setValues }) => {
  const classes = useStyles();

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
      <div style={{ display: "flex" }}>
        <InputBase
          classes={{ input: classes.input }}
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
