import React, { useRef } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  createTextField: { display: "flex" },
  textField: { marginRight: 8, flexGrow: 1 },
  costTextField: { marginBottom: 12 }
}));

const SelectCostType: React.FC<any> = props => {
  const classes = useStyles();
  const { type, setType } = props;
  const inputLabel = useRef<HTMLLabelElement>(null);
  const [labelWidth, setLabelWidth] = React.useState(0);
  React.useEffect(() => {
    setLabelWidth(inputLabel.current!.offsetWidth);
  }, []);

  return (
    <FormControl fullWidth variant="outlined" className={classes.costTextField}>
      <InputLabel ref={inputLabel}>Type</InputLabel>
      <Select
        value={type}
        onChange={(e: React.ChangeEvent<{ value: unknown }>) =>
          setType(e.target.value)
        }
        labelWidth={labelWidth}
      >
        <MenuItem value={"entertain"}>Entertain</MenuItem>
        <MenuItem value={"travel"}>Travel</MenuItem>
      </Select>
    </FormControl>
  );
};

export default SelectCostType;
