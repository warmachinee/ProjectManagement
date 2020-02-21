import React, { useContext } from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import { Link as RouterLink } from "react-router-dom";
import { TableRow, TableCell, Link } from "@material-ui/core";
import { AppContext } from "../../../AppContext";

export interface UnderlingBodyRowProps {
  itemIndex: number;
  data: any;
}

const UnderlingBodyRow: React.FC<UnderlingBodyRowProps> = props => {
  const { itemIndex, data } = props;
  const { _thousandSeperater } = useContext(AppContext);

  return (
    <TableRow>
      <TableCell align="right">{itemIndex + 1}</TableCell>
      <TableCell>
        <Link component={RouterLink} to={`/${data.userid}`}>
          {data.fullname}
        </Link>
      </TableCell>
      <TableCell>
        <Link component={RouterLink} to={`/${data.userid}`}>
          {data.lastname}
        </Link>
      </TableCell>
      <TableCell align="right">{_thousandSeperater(data.sumpj)}</TableCell>
    </TableRow>
  );
};
export default UnderlingBodyRow;
