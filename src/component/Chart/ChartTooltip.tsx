import React, { useContext } from "react";
import { useTheme, Typography } from "@material-ui/core";
import { AppContext } from "../../AppContext";

const ChartTooltip: React.FC<any> = ({ data }) => {
  const theme = useTheme();
  const { label, value } = data;
  const { _thousandSeperater } = useContext(AppContext);
  return (
    <div style={{ display: "flex" }}>
      <Typography
        variant="body1"
        style={{
          color: theme.palette.grey[900],
          fontWeight: 400,
          marginRight: 8
        }}
      >
        {label}
      </Typography>
      <Typography
        variant="body1"
        style={{ color: theme.palette.grey[900], fontWeight: 700 }}
      >
        {_thousandSeperater(value)} ฿
      </Typography>
    </div>
  );
};
export default ChartTooltip;
